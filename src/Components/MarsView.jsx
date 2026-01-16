// MarsView.jsx
import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

import sunTexture from "../textures/sun.jpg";
import MarsTexture from "../textures/mars.jpg";
// import venusAtmTexture from "../textures/venusatm.jpg";
import starsTexture from "../textures/stars.jpg";

// 🌌 Star background sphere
function StarBackground() {
  const texture = useLoader(THREE.TextureLoader, starsTexture);
  texture.encoding = THREE.sRGBEncoding;

  return (
    <mesh>
      <sphereGeometry args={[1000, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// ☀️ Sun lighting and glow — positioned far away
function SunLighting() {
  const texture = useLoader(THREE.TextureLoader, sunTexture);
  const sunDistance = 200;

  return (
    <>
      {/* Visible Sun */}
      <mesh position={[-sunDistance, 0, 0]}>
        <sphereGeometry args={[15, 64, 64]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Physical Sunlight */}
      <directionalLight
        position={[-sunDistance, 0, 0]}
        intensity={4.4}
        color="#fff2cc"
        castShadow
      />
      <pointLight
        position={[-sunDistance, 0, 0]}
        intensity={6.5}
        distance={500}
        color="#ffd7a1"
      />
    </>
  );
}

function Mars() {
  const marsRef = useRef();
  const texture = useLoader(THREE.TextureLoader, MarsTexture);

  useFrame(() => {
    marsRef.current.rotation.y += 0.0008; // slow natural rotation
  });

  return (
    <group ref={marsRef}>
      {/* Realistic Mars Surface */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2.2, 128, 128]} />
        <meshStandardMaterial
          map={texture}
          roughness={105} // Mars is dusty, not reflective
          metalness={0.0} // No metallic surface
          normalScale={[0.6, 0.6]}
        />
      </mesh>

      {/* Thin Atmospheric Haze */}
      <mesh scale={1.03}>
        <sphereGeometry args={[2.2, 128, 128]} />
        <meshStandardMaterial
          color="#ff6b3d"
          transparent
          opacity={0.12}
          emissive="#ff4e1a"
          emissiveIntensity={0.08}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Glow Layer (very subtle) */}
      <mesh scale={1.1}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial
          color="#ff5a1a"
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
function Moons() {
  const phobosRef = useRef();
  const deimosRef = useRef();

  // PHOBOS ORBIT SPEED (fast)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Phobos (closer & fast)
    phobosRef.current.position.x = Math.cos(t * 1.3) * 5.5;
    phobosRef.current.position.z = Math.sin(t * 1.3) * 5.5;

    // Deimos (farther & slower)
    deimosRef.current.position.x = Math.cos(t * 0.6) * 8.5;
    deimosRef.current.position.z = Math.sin(t * 0.6) * 8.5;
  });

  return (
    <group>
      {/* PHOBOS */}
      <mesh ref={phobosRef} castShadow receiveShadow rotation={[0.4, 0, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} /> {/* tiny & bumpy */}
        <meshStandardMaterial color="#d3d3d3" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* DEIMOS */}
      <mesh ref={deimosRef} castShadow receiveShadow rotation={[0.6, 0.3, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} /> {/* smaller */}
        <meshStandardMaterial
          color="#bfbfbf"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}
// 🎬 Main Mars View Scene
export default function MarsView() {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      {/* UI overlay */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "rgba(0,0,0,0.6)",
          padding: "10px 20px",
          borderRadius: "10px",
          color: "white",
          fontFamily: "sans-serif",
          zIndex: 10,
        }}
      >
        <h3>🟠 Mars View</h3>
        <div
          style={{ cursor: "pointer", color: "#ff4c4c", marginTop: "5px" }}
          onClick={() => navigate("/")}
        >
          ⬅ Back to Menu
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 15], fov: 35 }}
        style={{ background: "transparent" }}
      >
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.4}
          rotateSpeed={0.5}
          minDistance={5}
          maxDistance={100}
        />

        <StarBackground />
        <SunLighting />
        <Mars />
        <Moons />

        <EffectComposer>
          <Bloom
            intensity={1.8}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.1}
            height={300}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
