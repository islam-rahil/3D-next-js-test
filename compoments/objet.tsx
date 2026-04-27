"use client";

import { useGLTF, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function Model() {
  const { scene } = useGLTF("/tree.glb");

  return <primitive object={scene} scale={1.5} />;
}

export default function TreeScene() {
  return (
    <div className="h-screen w-full">
      <Canvas camera={{ position: [-7, 2, -12], fov: 35 }}>
        {/* Lumières */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 6, -3]} intensity={1.5} />

        {/* Arbre */}
        <Model />

        {/* Contrôles */}
        <OrbitControls autoRotate enableZoom={false} />
      </Canvas>
    </div>
  );
}