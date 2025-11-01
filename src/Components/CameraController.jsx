import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export default function CameraController({
  selectedPlanetRef,
  selectedPlanetName,
  PLANETS,
}) {
  const controlsRef = useRef();
  const { camera } = useThree();

  // Default camera setup (looking at the Sun)
  const defaultPos = new THREE.Vector3(0, 80, 220);
  const defaultTarget = new THREE.Vector3(0, 0, 0);

  // Set up initial position once
  useEffect(() => {
    camera.position.copy(defaultPos);
    if (controlsRef.current) {
      controlsRef.current.target.copy(defaultTarget);
      controlsRef.current.update();
    }
  }, []);

  useFrame(() => {
    // 🎯 If a planet is selected → follow it
    if (selectedPlanetRef?.current) {
      const planet = PLANETS.find((p) => p.name === selectedPlanetName);
      const planetPos = selectedPlanetRef.current.position;
      const dirFromSun = planetPos.clone().normalize();

      const offset = dirFromSun
        .clone()
        .multiplyScalar(-planet.size * 5)
        .add(new THREE.Vector3(0, planet.size * 2.5, 0));

      const desiredPos = planetPos.clone().add(offset);

      camera.position.lerp(desiredPos, 0.1);
      controlsRef.current.target.lerp(planetPos, 1);
    } else {
      // 🌞 Default: freely move around Sun (no auto camera movement)
      // Just ensure target is centered on the Sun once
      if (controlsRef.current) {
        controlsRef.current.enablePan = true;
        controlsRef.current.enableRotate = true;
        controlsRef.current.enableZoom = true;
        controlsRef.current.target.lerp(defaultTarget, 0.05);
      }
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxDistance={800}
      minDistance={5}
    />
  );
}
