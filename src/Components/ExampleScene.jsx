// App.jsx
import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
// import "./styles.css"; // import the CSS

function MultiCameraScene() {
  const cubeRef = useRef();
  const { gl, scene, camera, size } = useThree();
  const miniCam = useRef();

  useFrame(() => {
    // Spin the cube
    cubeRef.current.rotation.y += 0.01;

    // --- Render main scene ---
    gl.setViewport(0, 0, size.width, size.height);
    gl.setScissor(0, 0, size.width, size.height);
    gl.setScissorTest(true);
    gl.render(scene, camera);

    // --- Render mini camera (inset) ---
    const insetSize = size.height / 3;
    gl.setViewport(size.width - insetSize - 20, 20, insetSize, insetSize);
    gl.setScissor(size.width - insetSize - 20, 20, insetSize, insetSize);
    gl.setScissorTest(true);

    if (miniCam.current) {
      miniCam.current.lookAt(0, 0, 0);
      gl.render(scene, miniCam.current);
    }

    gl.setScissorTest(false);
  }, 1);

  return (
    <>
      <perspectiveCamera
        ref={miniCam}
        args={[60, 1, 0.1, 100]}
        position={[5, 5, 5]}
      />

      <mesh ref={cubeRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} />
    </>
  );
}

export default function Cameras() {
  return (
    <Canvas
      camera={{ position: [3, 3, 3], fov: 75 }}
      style={{ width: "100vw", height: "100vh", display: "block" }}
    >
      <MultiCameraScene />
    </Canvas>
  );
}
