// VenusView.jsx
import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

import sunTexture from "../textures/sun.jpg";
import venusTexture from "../textures/venus.jpg";
import venusAtmTexture from "../textures/venusatm.jpg";
import starsTexture from "../textures/stars.jpg";

// 🌌 Star background sphere
function StarBackground() {
  const texture = useLoader(THREE.TextureLoader, starsTexture);
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
  const sunDistance = 80; // move sun far away

  return (
    <>
      {/* The visible Sun */}
      <mesh position={[-sunDistance, 0, 0]}>
        <sphereGeometry args={[15, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive="#FFD980"
          emissiveIntensity={4.5}
        />
      </mesh>

      {/* Actual light affecting Venus */}
      <directionalLight
        position={[-sunDistance, 0, 0]}
        intensity={8}
        color="#fff6d5"
        castShadow
      />
      <pointLight
        position={[-sunDistance, 0, 0]}
        intensity={6}
        distance={300}
        color="#ffddaa"
      />
      <hemisphereLight
        skyColor="#ffeecc"
        groundColor="#332244"
        intensity={0.6}
      />
    </>
  );
}

function Venus() {
  const venusRef = useRef();
  const texture = useLoader(THREE.TextureLoader, venusTexture);
  const atmTexture = useLoader(THREE.TextureLoader, venusAtmTexture);

  useFrame(() => {
    venusRef.current.rotation.y += 0.002;
  });

  return (
    <group ref={venusRef}>
      {/* Core Venus */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={2} metalness={1} />
      </mesh>

      <mesh>
        <sphereGeometry args={[3.53, 64, 64]} />
        <meshPhongMaterial
          map={atmTexture}
          transparent={true}
          opacity={0.5}
          emissive={"#ffcc88"}
          emissiveIntensity={0.01}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// 🎬 Main Venus View Scene
export default function VenusView() {
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
        <h3>🟠 Venus View</h3>
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
        camera={{ position: [0, 0, 15], fov: 65 }}
        style={{ background: "black" }}
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
        <Venus />

        <EffectComposer>
          <Bloom intensity={1.3} luminanceThreshold={0.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
