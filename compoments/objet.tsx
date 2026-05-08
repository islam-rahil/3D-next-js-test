"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/* =========================
   SOL
========================= */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#d9f0c7" />
    </mesh>
  );
}

/* =========================
   MAISON
========================= */
function House() {
  return (
    <group>

      {/* Corps de la maison */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 2.5, 4]} />
        <meshStandardMaterial
          color="#f5c16c"
          roughness={0.7}
        />
      </mesh>

      {/* Toit */}
      <mesh
        position={[0, 3, 0]}
        rotation={[3, 0,Math.PI / 0.999]}
        castShadow
      >
        <coneGeometry args={[3.3, 2, 4]} />
        <meshStandardMaterial color="#E43E56" />
      </mesh>

      {/* Porte */}
      <mesh position={[0, 0.3, 2.02]} castShadow>
        <boxGeometry args={[0.9, 1.4, 0.1]} />
        <meshStandardMaterial color="#5c3b28" />
      </mesh>

      {/* Fenêtre gauche */}
      <mesh position={[-1.2, 1.2, 2.02]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#9ad0ec" />
      </mesh>

      {/* Fenêtre droite */}
      <mesh position={[1.2, 1.2, 2.02]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#9ad0ec" />
      </mesh>

    </group>
  );
}

/* =========================
   SCENE
========================= */
export default function HouseScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [8, 5, 8], fov: 50 }}
      style={{ width: "100%", height: "100vh" }}
    >
      {/* Fond */}
      <color attach="background" args={["#FFF8E8"]} />

      {/* Lumières */}
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={2}
        castShadow
      />

      {/* Sol */}
      <Ground />

      {/* Maison */}
      <House />

      {/* Contrôles caméra */}
      <OrbitControls />
    </Canvas>
  );
}