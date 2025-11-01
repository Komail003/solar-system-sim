import React, { forwardRef, useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Planet = forwardRef(
  (
    {
      textureUrl,
      cloudsUrl,
      cloudsOpacity = 0.85,
      cloudsSpeed = 0.008,
      size,
      distance,
      speed,
      name,
    },
    ref
  ) => {
    const texture = useLoader(THREE.TextureLoader, textureUrl);
    const cloudsTexture = cloudsUrl
      ? useLoader(THREE.TextureLoader, cloudsUrl)
      : null;

    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: "white",
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
    });

    // separate ref for cloud mesh so we can spin it independently
    const cloudRef = useRef();

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime() * speed;

      // orbit + planet rotation (group ref)
      if (ref && ref.current) {
        ref.current.position.x = Math.cos(t) * distance;
        ref.current.position.z = Math.sin(t) * distance;
        ref.current.rotation.y += 0.01;
      }

      // rotate clouds (use cloudsSpeed prop)
      if (cloudRef.current) {
        cloudRef.current.rotation.y += cloudsSpeed;
      }
    });

    return (
      <group ref={ref} castShadow receiveShadow>
        {/* Main planet */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[size, 64, 64]} />
          <meshPhongMaterial
            map={texture}
            shininess={15}
            specular={new THREE.Color(0x333333)}
            emissive={new THREE.Color(0x000000)}
            emissiveIntensity={0.05}
          />
        </mesh>

        {/* Clouds layer (optional) */}
        {cloudsTexture && (
          <mesh ref={cloudRef} scale={[1.02, 1.02, 1.02]}>
            <sphereGeometry args={[size, 64, 64]} />
            <meshPhongMaterial
              map={cloudsTexture}
              transparent={true}
              opacity={cloudsOpacity} // <- configurable opacity
              depthWrite={false} // prevents z-fighting and dark edges
              side={THREE.DoubleSide}
              shininess={5}
              specular={new THREE.Color(0x888888)}
            />
          </mesh>
        )}

        {/* Soft atmosphere */}
        <mesh scale={[1.06, 1.06, 1.06]}>
          <sphereGeometry args={[size, 64, 64]} />
          <primitive object={atmosphereMaterial} />
        </mesh>
      </group>
    );
  }
);

export default Planet;
