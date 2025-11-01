import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import React, { useMemo, useRef } from "react";

export default function AsteroidBelt({
  innerRadius = 70,
  outerRadius = 90,
  count = 1500,
  dustCount = 5000,
  tilt = 0.2,
  rotationSpeed = 0.1,
}) {
  const meshRef = useRef();
  const dustRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Use a realistic rocky texture (moon surface)
  const rockTex = useLoader(
    THREE.TextureLoader,
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg"
  );

  // Use a small circular alpha for dust
  const dustTex = useLoader(
    THREE.TextureLoader,
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/spark1.png"
  );

  // --- ASTEROID POSITIONS ---
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * tilt * 10;
      const size = Math.random() * 1 + 0.4;
      arr.push({ radius, angle, height, size });
    }
    return arr;
  }, [count, innerRadius, outerRadius, tilt]);

  // --- DUST POSITIONS ---
  const dustPositions = useMemo(() => {
    const arr = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * tilt * 20;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = height;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, [dustCount, innerRadius, outerRadius, tilt]);

  // --- FRAME LOOP ---
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    positions.forEach((p, i) => {
      const a = p.angle + t * rotationSpeed * 0.3;
      const x = Math.cos(a) * p.radius;
      const z = Math.sin(a) * p.radius;
      const y = p.height;
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, a, 0);
      dummy.scale.set(p.size, p.size, p.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;

    // slowly rotate dust too
    if (dustRef.current) {
      dustRef.current.rotation.y += rotationSpeed * 0.05;
    }
  });

  return (
    <group rotation={[0, 0, 0]}>
      {/* Asteroids */}
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          map={rockTex}
          roughness={0.8}
          metalness={0.4}
          color="#aaaaaa"
          emissive="#555555"
          emissiveIntensity={0.25}
        />
      </instancedMesh>

      {/* Dust particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustCount}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={dustTex}
          size={1}
          transparent={true}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          color="#c0b8ff"
        />
      </points>
    </group>
  );
}
