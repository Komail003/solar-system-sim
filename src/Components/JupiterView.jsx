import React, { useRef, useEffect } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import Planet from "./Planet";
import jupiterTexture from "../textures/jupiter.jpg";
import starsTexture from "../textures/stars.jpg";
import sunTexture from "../textures/sun.jpg";
import titanTexture from "../textures/titan.jpg";
import caliTexture from "../textures/callisto.jpg";
import europaTexture from "../textures/europa.jpg";
import ganymedeTexture from "../textures/ganymede.jpg";
/* 🌌 Background stars */
function StarBackground() {
  const tex = useLoader(THREE.TextureLoader, starsTexture);
  return (
    <mesh>
      <sphereGeometry args={[1000, 64, 64]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} />
    </mesh>
  );
}

/* ☀️ Sun behind Jupiter for realistic lighting */
function SunBehind({ position = new THREE.Vector3(0, 0, -400) }) {
  const texture = useLoader(THREE.TextureLoader, sunTexture);
  return (
    <>
      <mesh position={[position.x, position.y, position.z]}>
        <sphereGeometry args={[40, 64, 64]} />
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
      />
      <hemisphereLight
        skyColor="#8899ff"
        groundColor="#220022"
        intensity={0.18}
      />
    </>
  );
}

/* 🪐 Jupiter’s moons orbiting around */
function Moon({
  textureUrl,
  orbitRadius = 15,
  size = 0.5,
  speed = 0.4,
  phase = 0,
}) {
  const moonRef = useRef();
  const tex = useLoader(THREE.TextureLoader, textureUrl);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    if (moonRef.current) {
      moonRef.current.position.x = Math.cos(t) * orbitRadius;
      moonRef.current.position.z = Math.sin(t) * orbitRadius;
      moonRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={moonRef} castShadow receiveShadow>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial map={tex} roughness={1} metalness={0} />
    </mesh>
  );
}

export default function JupiterView() {
  const jupiterRef = useRef();
  const controlsRef = useRef();

  const jupiter = { size: 13.97, texture: jupiterTexture }; // ~11x Earth's diameter
  const initialCamPos = [0, jupiter.size * 2, jupiter.size * 10];

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas shadows camera={{ position: initialCamPos, fov: 60 }}>
        <ambientLight intensity={0.15} />
        <StarBackground />
        <SunBehind position={new THREE.Vector3(0, 0, -400)} />

        {/* 🪐 Jupiter rotating */}
        <Planet
          ref={jupiterRef}
          name="Jupiter"
          textureUrl={jupiter.texture}
          size={jupiter.size}
          distance={0}
          speed={0.05}
        />

        {/* 🌕 Galilean Moons */}
        <Moon
          orbitRadius={jupiter.size * 2.2}
          size={1.1}
          speed={0.8}
          phase={0}
          textureUrl={titanTexture}
        />
        <Moon
          orbitRadius={jupiter.size * 3}
          size={1}
          speed={0.5}
          phase={1.2}
          textureUrl={caliTexture}
        />
        <Moon
          orbitRadius={jupiter.size * 4}
          size={1.2}
          speed={0.3}
          phase={2.5}
          textureUrl={europaTexture}
        />
        <Moon
          orbitRadius={jupiter.size * 5.5}
          size={1.5}
          speed={0.2}
          phase={3.6}
          textureUrl={ganymedeTexture}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          enableRotate
          maxDistance={1500}
        />

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
