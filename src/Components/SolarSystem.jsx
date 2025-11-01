import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useNavigate } from "react-router-dom";

import Sun from "./Sun";
import Planet from "./Planet";
import OrbitPath from "./OrbitPath";
import CameraController from "./CameraController";
import sunTexture from "../textures/sun.jpg";
import mercuryTexture from "../textures/mercury.jpg";
import venusTexture from "../textures/venus.jpg";
import earthTexture from "../textures/earth.jpg";
import marsTexture from "../textures/mars.jpg";
import jupiterTexture from "../textures/jupiter.jpg";
import saturnTexture from "../textures/saturn.jpg";
import uranusTexture from "../textures/uranus.jpg";
import neptuneTexture from "../textures/neptune.jpg";
import plutoTexture from "../textures/pluto.jpg";
import starsTexture from "../textures/stars.jpg";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

// optional star background component (if you use it)
function StarBackground() {
  const texture = useLoader(THREE.TextureLoader, starsTexture);
  return (
    <mesh>
      <sphereGeometry args={[1000, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
function SunLighting({ position = new THREE.Vector3(0, 0, 0) }) {
  const texture = useLoader(THREE.TextureLoader, sunTexture);

  return (
    <>
      {/* Visible glowing Sun sphere */}
      <mesh position={[position.x, position.y, position.z]}>
        <sphereGeometry args={[15, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive="#FFD980"
          emissiveIntensity={5}
        />
      </mesh>

      <directionalLight
        position={[position.x, position.y, position.z]}
        intensity={13.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      />

      {/* Focused bright center light (for flare effect) */}
      <spotLight
        position={[position.x, position.y, position.z]}
        angle={Math.PI / 10}
        penumbra={0.2}
        intensity={0.8}
        target-position={[0, 0, 0]}
      />

      {/* Soft ambient scattering */}
      <hemisphereLight
        skyColor="#8899ff"
        groundColor="#220022"
        intensity={2.18}
      />

      {/* Night-side fill (very soft, bluish tint) */}
      <pointLight
        position={[-position.x * 0.2, -position.y * 0.2, -position.z * 0.2]}
        intensity={0.06}
        color="#334455"
      />
    </>
  );
}

export default function SolarSystem() {
  const navigate = useNavigate();
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const PLANETS = [
    {
      name: "Mercury",
      size: 2.49,
      distance: 30,
      speed: 1.2,
      texture: mercuryTexture,
    },
    {
      name: "Venus",
      size: 2.85,
      distance: 40,
      speed: 1.0,
      texture: venusTexture,
    },
    {
      name: "Earth",
      size: 2.5,
      distance: 55,
      speed: 0.8,
      texture: earthTexture,
    },
    { name: "Mars", size: 2, distance: 65, speed: 0.7, texture: marsTexture },
    {
      name: "Jupiter",
      size: 11.21,
      distance: 85,
      speed: 0.5,
      texture: jupiterTexture,
    },
    {
      name: "Saturn",
      size: 9.45,
      distance: 120,
      speed: 0.4,
      texture: saturnTexture,
    },
    {
      name: "Uranus",
      size: 4.01,
      distance: 145,
      speed: 0.3,
      texture: uranusTexture,
    },
    {
      name: "Neptune",
      size: 3.88,
      distance: 165,
      speed: 0.2,
      texture: neptuneTexture,
    },
    {
      name: "Pluto",
      size: 0.8,
      distance: 195,
      speed: 0.105,
      texture: plutoTexture,
    },
  ];

  const planetRefs = useMemo(() => {
    const refs = {};
    PLANETS.forEach((p) => (refs[p.name] = React.createRef()));
    return refs;
  }, []);

  const selectedPlanetRef = selectedPlanet ? planetRefs[selectedPlanet] : null;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      {/* Sidebar */}
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
        <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>Planets</h3>
        {PLANETS.map((p) => (
          <div
            key={p.name}
            style={{
              cursor: "pointer",
              margin: "4px 0",
              color: selectedPlanet === p.name ? "#FFD700" : "white",
            }}
            onClick={() => setSelectedPlanet(p.name)}
          >
            {p.name}
          </div>
        ))}
        <div
          style={{ cursor: "pointer", margin: "4px 0", color: "white" }}
          onClick={() => setSelectedPlanet(null)}
        >
          Solar System
        </div>
        <hr style={{ margin: "8px 0", borderColor: "#444" }} />
        <div
          style={{ cursor: "pointer", color: "#ff4c4c" }}
          onClick={() => navigate("/")}
        >
          ⬅ Back to Menu
        </div>
      </div>

      {/* Scene */}
      <Canvas shadows camera={{ position: [0, 80, 220], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <StarBackground />
        <SunLighting position={new THREE.Vector3(0, 0, 0)} />
        <CameraController
          selectedPlanetRef={selectedPlanetRef}
          selectedPlanetName={selectedPlanet}
          PLANETS={PLANETS}
        />

        <Sun />
        {PLANETS.map((p) => (
          <React.Fragment key={p.name}>
            <OrbitPath radius={p.distance} />
            <Planet
              ref={planetRefs[p.name]}
              name={p.name}
              textureUrl={p.texture}
              size={p.size}
              distance={p.distance}
              speed={p.speed}
            />
          </React.Fragment>
        ))}

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={1.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
