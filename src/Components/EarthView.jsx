import React, { useRef, useEffect } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Planet from "./Planet";
import earthTexture from "../textures/earth.jpg";
import moonTexture from "../textures/moon.jpg";
import starsTexture from "../textures/stars.jpg";
import earthClouds from "../textures/clouds.jpg";
import sunTexture from "../textures/sun.jpg";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

/* Starfield background */
function StarBackground() {
  const tex = useLoader(THREE.TextureLoader, starsTexture);
  return (
    <mesh>
      <sphereGeometry args={[1000, 64, 64]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} />
    </mesh>
  );
}

/* Sun with lighting setup */
function SunBehind({ position = new THREE.Vector3(0, 0, -200) }) {
  const texture = useLoader(THREE.TextureLoader, sunTexture);
  return (
    <>
      <mesh position={[position.x, position.y, position.z]}>
        <sphereGeometry args={[20, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive="#FFD980"
          emissiveIntensity={4}
        />
      </mesh>

      <directionalLight
        position={[position.x, position.y, position.z]}
        intensity={3.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      />
      <spotLight
        position={[position.x, position.y, position.z]}
        angle={Math.PI / 12}
        penumbra={0.2}
        intensity={0.8}
        target-position={[0, 0, 0]}
      />
      <hemisphereLight
        skyColor="#8899ff"
        groundColor="#220022"
        intensity={0.18}
      />
      <pointLight
        position={[-position.x * 0.2, -position.y * 0.2, -position.z * 0.2]}
        intensity={0.06}
        color="#334455"
      />
    </>
  );
}

/* 🌙 Moon orbiting Earth */
function Moon({ earthSize = 2.5, orbitRadius = 10, speed = 0.3 }) {
  const moonRef = useRef();
  const moonTex = useLoader(THREE.TextureLoader, moonTexture);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (moonRef.current) {
      // Orbit around Earth
      moonRef.current.position.x = Math.cos(t) * orbitRadius;
      moonRef.current.position.z = Math.sin(t) * orbitRadius;
      // Rotate on its own axis
      moonRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={moonRef} castShadow receiveShadow>
      <sphereGeometry args={[earthSize * 0.27, 64, 64]} />
      <meshStandardMaterial map={moonTex} roughness={1} metalness={0} />
    </mesh>
  );
}

/* 🌍 Main Earth Scene */
export default function EarthView() {
  const earthRef = useRef();
  const controlsRef = useRef();
  const initialCamPos = [0, 8, 40];

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas shadows camera={{ position: initialCamPos, fov: 60 }}>
        <ambientLight intensity={0.12} />
        <StarBackground />
        <SunBehind position={new THREE.Vector3(0, 0, -200)} />

        {/* Earth */}
        <Planet
          ref={earthRef}
          name="Earth"
          textureUrl={earthTexture}
          size={3}
          cloudsUrl={earthClouds}
          cloudsOpacity={0.3}
          cloudsSpeed={0.004}
          distance={0}
          speed={0.1}
        />

        {/* 🌙 Moon orbiting Earth */}
        <Moon earthSize={2.5} orbitRadius={10} speed={0.2} />

        <OrbitControls ref={controlsRef} enablePan enableZoom enableRotate />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            intensity={1.1}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
