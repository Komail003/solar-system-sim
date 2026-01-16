// MercuryView.jsx
import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

import sunTexture from "../textures/sun.jpg";
import mercuryTexture from "../textures/mercury.jpg";
// import venusAtmTexture from "../textures/venusatm.jpg";
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

      {/* Actual light affecting Mercury */}
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

function Mercury() {
  const venusRef = useRef();
  const texture = useLoader(THREE.TextureLoader, mercuryTexture);

  useFrame(() => {
    venusRef.current.rotation.y += 0;
  });

  return (
    <group ref={venusRef}>
      {/* Core Mercury */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={15} metalness={0.5} />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.25, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff50"
          opacity={0.05} // <-- set opacity
          transparent={true} // <-- must enable transparent
        />
      </mesh>
    </group>
  );
}

// 🎬 Main Mercury View Scene
export default function MercuryView() {
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
        <h3>🟠 Mercury View</h3>
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
        <Mercury />

        <EffectComposer>
          <Bloom intensity={1.3} luminanceThreshold={0.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
