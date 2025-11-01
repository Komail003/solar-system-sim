import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import saturnRingTexture from "../textures/saturnring.png";

export default function SaturnRings({ saturnSize = 9.45, tilt = 0.46 }) {
  const ringRef = useRef();
  const tex = useLoader(THREE.TextureLoader, saturnRingTexture);

  // Texture configuration
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.rotation = Math.PI / 2;
  tex.center.set(0.5, 0.5);
  tex.anisotropy = 16; // Sharper texture when seen at an angle

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.0002;
    }
  });

  const innerRadius = saturnSize * 1.4;
  const outerRadius = saturnSize * 2.8;

  return (
    <mesh
      ref={ringRef}
      rotation={[-Math.PI / 2 + tilt, 0, 0]} // horizontal ring
      position={[0, 0, 0]}
    >
      <ringGeometry args={[innerRadius, outerRadius, 256]} />
      <meshStandardMaterial
        map={tex}
        side={THREE.DoubleSide}
        transparent={true}
        opacity={0.9}
        roughness={0.5}
        metalness={0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
