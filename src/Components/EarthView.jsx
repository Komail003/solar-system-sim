import { useNavigate } from "react-router-dom";
// EarthView.jsx
import React, { useRef, useEffect, useMemo } from "react";
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
import NightOverlay from "./NightOverlay";
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

/* 🌙 Moon orbiting Earth (unchanged) */
function Moon({ earthSize = 2.5, orbitRadius = 10, speed = 0.3 }) {
  const moonRef = useRef();
  const moonTex = useLoader(THREE.TextureLoader, moonTexture);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (moonRef.current) {
      moonRef.current.position.x = Math.cos(t) * orbitRadius;
      moonRef.current.position.z = Math.sin(t) * orbitRadius;
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

export default function EarthView() {
  const earthRef = useRef();
  const controlsRef = useRef();
  const initialCamPos = [0, 8, 40];

  // Sun position used by lighting and by night shader
  const sunPos = new THREE.Vector3(0, 0, -200);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, []);
  let navigate = useNavigate();
  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
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
        <h3>🌎 Earth View</h3>
        <div
          style={{ cursor: "pointer", color: "#ff4c4c", marginTop: "5px" }}
          onClick={() => navigate("/")}
        >
          ⬅ Back to Menu
        </div>
      </div>
      <Canvas shadows camera={{ position: initialCamPos, fov: 60 }}>
        <ambientLight intensity={0.01} />
        <StarBackground />
        <SunBehind position={sunPos} />

        {/* Earth (unchanged) */}
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

        {/* Night overlay (inside Canvas, uses hooks safely) */}
        <NightOverlay earthRef={earthRef} sunPosition={sunPos} radius={3.001} />

        {/* Moon (unchanged) */}
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
