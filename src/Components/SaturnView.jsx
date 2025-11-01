import React, { useRef, useEffect } from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import saturnTexture from "../textures/saturn.jpg";
import starsTexture from "../textures/stars.jpg";
import sunTexture from "../textures/sun.jpg";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import SaturnRings from "./Rings";
import { useNavigate } from "react-router-dom";
/* Star background */
function StarBackground() {
  const tex = useLoader(THREE.TextureLoader, starsTexture);
  const { scene } = useThree();

  useEffect(() => {
    const prev = scene.background;
    scene.background = tex;
    return () => {
      scene.background = prev;
    };
  }, [scene, tex]);

  return (
    <mesh>
      <sphereGeometry args={[2000, 64, 64]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

/* Sun light behind Saturn */
function SunBehind({ position = new THREE.Vector3(0, 0, -400) }) {
  const texture = useLoader(THREE.TextureLoader, sunTexture);
  return (
    <>
      <mesh position={[position.x, position.y, position.z]}>
        <sphereGeometry args={[35, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive="#FFD980"
          emissiveIntensity={3.5}
        />
      </mesh>
      <directionalLight
        position={[position.x, position.y, position.z]}
        intensity={3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      />
      <hemisphereLight
        skyColor="#8899ff"
        groundColor="#220022"
        intensity={0.1}
      />
    </>
  );
}

/* ✅ Rotating Saturn mesh (inside Canvas) */
function RotatingSaturn({ texture, size }) {
  const saturnRef = useRef();
  const tex = useLoader(THREE.TextureLoader, texture);

  useFrame(() => {
    if (saturnRef.current) saturnRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={saturnRef}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial map={tex} />
    </mesh>
  );
}

export default function SaturnView() {
  const saturn = { size: 9.45, texture: saturnTexture };
  const initialCamPos = [0, saturn.size * 1.5, saturn.size * 8.5];
  const controlsRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <div
        style={{
          position: "absolute",
          width: "200px",
          backdropFilter: "blur(20px)",
          color: "white",
          margin: "1rem",
          zIndex: 999,
          fontSize: "2rem",
          display: "flex",
          cursor: "pointer",
        }}
        onClick={() => {
          navigate("/");
        }}
      >
        <div>🔙</div>
        Saturn
      </div>
      <Canvas shadows camera={{ position: initialCamPos, fov: 60 }}>
        <ambientLight intensity={0.12} />
        <StarBackground />
        <SunBehind position={new THREE.Vector3(0, 0, -400)} />

        {/* ✅ Saturn rotates properly now */}
        <RotatingSaturn texture={saturn.texture} size={saturn.size} />

        <SaturnRings saturnSize={saturn.size * 2.45} tilt={1.14} />

        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          enableRotate
          maxDistance={800}
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
