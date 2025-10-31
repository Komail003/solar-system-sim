import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// 🌍 Textures
import earthTexture from "./textures/earth.jpg";
import marsTexture from "./textures/mars.jpg";
import jupiterTexture from "./textures/jupiter.jpg";
import sunTexture from "./textures/sun.jpg";
import mercuryTexture from "./textures/mercury.jpg";
import venusTexture from "./textures/venus.jpg";
import saturnTexture from "./textures/saturn.jpg";
import uranusTexture from "./textures/uranus.jpg";
import neptuneTexture from "./textures/neptune.jpg";

// ☀️ Sun
// ☀️ Sun with a strong point light casting shadows
function Sun() {
  const texture = useLoader(THREE.TextureLoader, sunTexture);
  const sunRef = useRef();
  useFrame(() => (sunRef.current.rotation.y += 0.002));

  return (
    <>
      <mesh ref={sunRef} castShadow>
        <sphereGeometry args={[20, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive="#FDB813"
          emissiveIntensity={2.5}
          emissiveMap={texture}
        />
      </mesh>

      {/* Point light from the Sun */}
      <pointLight
        position={[0, 0, 0]}
        intensity={6} // brighter light
        color="white"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.00005}
      />
    </>
  );
}

// 🌍 Planet
const Planet = React.forwardRef(
  ({ textureUrl, size, distance, speed, name }, ref) => {
    const texture = useLoader(THREE.TextureLoader, textureUrl);

    // Subtle atmosphere glow using a secondary emissive material
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: "white",
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
    });

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime() * speed;
      ref.current.position.x = Math.cos(t) * distance;
      ref.current.position.z = Math.sin(t) * distance;
      ref.current.rotation.y += 0.01;
    });

    return (
      <group ref={ref} castShadow receiveShadow>
        {/* Planet */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            roughness={1}
            metalness={0.1}
            emissive={"#000000"}
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Thin atmospheric glow */}
        <mesh scale={[1.03, 1.03, 1.03]}>
          <sphereGeometry args={[size, 64, 64]} />
          <primitive object={atmosphereMaterial} />
        </mesh>
      </group>
    );
  }
);

// ⚪ Orbit Path
function OrbitPath({ radius }) {
  const points = React.useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const theta = (i / 128) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
      );
    }
    return pts;
  }, [radius]);

  const geometry = React.useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="white" transparent opacity={0.3} />
    </line>
  );
}

// 🎯 Camera Controller
function CameraController({ selectedPlanetRef, selectedPlanetName, PLANETS }) {
  const controlsRef = useRef();
  const { camera } = useThree();

  const defaultPos = new THREE.Vector3(0, 40, 150);
  const defaultTarget = new THREE.Vector3(0, 0, 0);

  useFrame(() => {
    if (selectedPlanetRef?.current) {
      const planet = PLANETS.find((p) => p.name === selectedPlanetName);
      const planetPos = selectedPlanetRef.current.position;

      // Vector from Sun (0,0,0) to planet
      const dirFromSun = planetPos.clone().normalize();

      // Camera offset positioned behind the planet, along the orbit direction
      const offset = dirFromSun
        .clone()
        .multiplyScalar(-planet.size * 5) // move camera behind planet
        .add(new THREE.Vector3(0, planet.size * 2.5, 0)); // small upward offset

      const desiredPos = planetPos.clone().add(offset);

      // Smooth movement
      camera.position.lerp(desiredPos, 0.1);
      controlsRef.current.target.lerp(planetPos, 1);
    } else {
      // Default solar system view
      camera.position.lerp(defaultPos, 0.05);
      controlsRef.current.target.lerp(defaultTarget, 0.05);
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping
      dampingFactor={0.05}
      maxDistance={400}
      minDistance={5}
    />
  );
}

// 🌌 Main App
export default function App() {
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
      size:  2.85,
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
    {
      name: "Mars",
      size: 2,
      distance: 65,
      speed: 0.7,
      texture: marsTexture,
    },
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
  ];

  // Create refs for each planet
  const planetRefs = useMemo(() => {
    const refs = {};
    PLANETS.forEach((p) => (refs[p.name] = React.createRef()));
    return refs;
  }, []);

  const selectedPlanetRef = selectedPlanet ? planetRefs[selectedPlanet] : null;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      {/* 🪐 Planet Selector */}
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
      </div>

      {/* 🌌 Scene */}
      <Canvas shadows camera={{ position: [0, 40, 150], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={4} color="white" />
        <Stars radius={300} depth={60} count={20000} factor={7} fade />

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
          <ambientLight intensity={0.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
