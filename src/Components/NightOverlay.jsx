// Place this inside the same file (or import it) and render <NightOverlay earthRef={earthRef} sunPosition={sunPos} />
import React, { useRef, useMemo } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import earthNightTexture from "../textures/earthnight.jpg"; // adjust import path if needed

function NightOverlay({ earthRef, sunPosition, radius = 3.01 }) {
  const darkRef = useRef();
  const cityRef = useRef();
  const nightTex = useLoader(THREE.TextureLoader, earthNightTexture);

  // Black (darkening) shader - outputs alpha = darkness
  const darkMat = useMemo(() => {
    const uniforms = {
      lightPos: { value: sunPosition.clone() },
    };
    const vs = `
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      void main() {
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const fs = `
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      uniform vec3 lightPos;
      void main() {
        vec3 L = normalize(lightPos - vWorldPos);
        float d = dot(normalize(vWorldNormal), L);
        // darkness: 0 lit, 1 fully dark — tweak thresholds to taste
        float darkness = smoothstep(0.05, -0.35, d);
        // darkening strength (0..1)
        float darkStrength = 0.05;
        gl_FragColor = vec4(vec3(0.0), darkness * darkStrength);
      }
    `;
    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sunPosition]);

  // City lights shader - additive, alpha = darkness * cityFactor
  const cityMat = useMemo(() => {
    const uniforms = {
      nightTexture: { value: nightTex || null },
      lightPos: { value: sunPosition.clone() },
      cityBoost: { value: 3 },
      cityOpacity: { value: 0.9 },
    };
    const vs = `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      void main() {
        vUv = uv;
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const fs = `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      uniform sampler2D nightTexture;
      uniform vec3 lightPos;
      uniform float cityBoost;
      uniform float cityOpacity;
      void main() {
        vec3 L = normalize(lightPos - vWorldPos);
        float d = dot(normalize(vWorldNormal), L);
        // darkness mask
        float darkness = smoothstep(0.05, -0.35, d);

        vec3 n = texture2D(nightTexture, vUv).rgb;
        // optionally mask by intensity so only bright pixels become lights
        float lum = dot(n, vec3(0.299, 0.587, 0.114));
        float mask = smoothstep(0.15, 0.45, lum); // tweak so only bright city areas show
        vec3 city = n * cityBoost * mask;

        // Use additive blending when material is created; we still output alpha = darkness*cityOpacity
        gl_FragColor = vec4(city, darkness * cityOpacity);
      }
    `;
    const m = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return m;
  }, [nightTex, sunPosition]);

  useFrame(() => {
    if (!earthRef?.current) return;
    const p = earthRef.current;
    if (darkRef.current) {
      darkRef.current.position.copy(p.position);
      darkRef.current.quaternion.copy(p.quaternion);
      darkRef.current.scale.copy(p.scale).multiplyScalar(1.005);
    }
    if (cityRef.current) {
      cityRef.current.position.copy(p.position);
      cityRef.current.quaternion.copy(p.quaternion);
      cityRef.current.scale.copy(p.scale).multiplyScalar(1.006);
    }
    // update uniform lightPos
    if (darkMat && darkMat.uniforms && darkMat.uniforms.lightPos) {
      darkMat.uniforms.lightPos.value.copy(sunPosition);
    }
    if (cityMat && cityMat.uniforms && cityMat.uniforms.lightPos) {
      cityMat.uniforms.lightPos.value.copy(sunPosition);
    }
  });

  return (
    <>
      <mesh ref={darkRef} renderOrder={1}>
        <sphereGeometry args={[radius, 64, 64]} />
        <primitive object={darkMat} attach="material" />
      </mesh>

      {/* City lights (additive on top) */}
      <mesh ref={cityRef} renderOrder={2}>
        <sphereGeometry args={[radius * 1.0005, 64, 64]} />
        <primitive object={cityMat} attach="material" />
      </mesh>
    </>
  );
}

export default NightOverlay;
