import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import sunTexture from "../textures/sun.jpg";

export default function Sun() {
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
      <pointLight
        position={[0, 0, 0]}
        intensity={6}
        color="white"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.00005}
      />
    </>
  );
}
