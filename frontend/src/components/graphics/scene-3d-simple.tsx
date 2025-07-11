"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animations";
import * as THREE from "three";

function SimpleCube({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const rotation = scrollProgress * Math.PI * 2;
  const scale = 0.8 + (scrollProgress * 0.4);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef} rotation={[rotation, rotation, 0]} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

// Impresora 3D simplificada
function SimplePrinter({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const printProgress = scrollProgress;

  return (
    <group ref={groupRef}>
      {/* Base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1.2, 0.2, 1.2]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Torre */}
      <mesh position={[0.5, 0, 0.5]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <mesh position={[-0.5, 0, 0.5]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      {/* Extrusor */}
      <mesh position={[0, 0.2 + (scrollProgress * 0.2), 0]}>
        <boxGeometry args={[0.2, 0.15, 0.2]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Objeto impreso */}
      <mesh position={[0, -0.2, 0]} scale={[1, 0.3 + printProgress, 1]}>
        <cylinderGeometry args={[0.25, 0.25, 0.6]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// Chip simplificado
function SimpleChip({ scrollProgress }: { scrollProgress: number }) {
  const chipRef = useRef<THREE.Group>(null);

  return (
    <group ref={chipRef} rotation={[0, scrollProgress * Math.PI, 0]}>
      {/* Base del chip */}
      <mesh>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Circuitos */}
      <mesh position={[0.2, 0.06, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.05]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1e40af"
          emissiveIntensity={scrollProgress * 0.5}
        />
      </mesh>
      <mesh position={[-0.2, 0.06, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.05]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1e40af"
          emissiveIntensity={scrollProgress * 0.5}
        />
      </mesh>
    </group>
  );
}

// Dona/Torus con brillito animado simple
function SimpleTorus() {
  const torusRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Animación simple para los brillitos
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (torusRef.current) {
      // Brillito pulsante suave en la dona principal
      const emissiveIntensity = 0.2 + Math.sin(time * 2) * 0.1;
      (torusRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = emissiveIntensity;
    }

    if (ringRef.current) {
      // Brillito pulsante en el anillo (más rápido)
      const ringIntensity = 0.8 + Math.sin(time * 3) * 0.4;
      (ringRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = ringIntensity;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.1}>
      <group rotation={[Math.PI / 4, 0, 0]}>
        <mesh ref={torusRef}>
          <torusGeometry args={[1, 0.4, 16, 100]} />
          <meshStandardMaterial
            color="#8b5cf6"
            metalness={0.6}
            roughness={0.2}
            emissive="#4c1d95"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Anillo de brillito animado */}
        <mesh ref={ringRef} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[1.05, 0.05, 8, 50]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#1e40af"
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
    </Float>
  );
}

interface Scene3DProps {
  model?: "cube" | "printer" | "chip" | "torus";
  className?: string;
  autoRotate?: boolean;
  enableControls?: boolean;
}

export function Scene3D({
  model = "cube",
  className = "",
  autoRotate = true,
  enableControls = false
}: Scene3DProps) {
  const { elementRef, scrollProgress } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: false
  });

  const renderModel = () => {
    switch (model) {
      case "printer":
        return <SimplePrinter scrollProgress={scrollProgress} />;
      case "chip":
        return <SimpleChip scrollProgress={scrollProgress} />;
      case "torus":
        return <SimpleTorus />;
      default:
        return <SimpleCube scrollProgress={scrollProgress} />;
    }
  };

  // Para el torus, no usar animación de scroll que lo hace pequeño inicialmente
  if (model === "torus") {
    return (
      <div className={`w-full h-96 ${className}`}>
        <Canvas
          camera={{ position: [2, 1, 3], fov: 60 }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            {/* Iluminación normal */}
            <ambientLight intensity={0.4} />
            <spotLight
              position={[5, 5, 5]}
              angle={0.3}
              penumbra={1}
              intensity={1}
              castShadow
            />
            <pointLight position={[-5, 5, -5]} intensity={0.5} />

            {/* Modelo 3D */}
            {renderModel()}

            {/* Controles opcionales */}
            {enableControls && (
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate={autoRotate}
                autoRotateSpeed={2}
              />
            )}
          </Suspense>
        </Canvas>
      </div>
    );
  }

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`w-full h-96 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Canvas
        camera={{ position: [2, 1, 3], fov: 60 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Iluminación normal */}
          <ambientLight intensity={0.4} />
          <spotLight
            position={[5, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} />

          {/* Modelo 3D */}
          {renderModel()}

          {/* Controles opcionales */}
          {enableControls && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              autoRotate={autoRotate}
              autoRotateSpeed={2}
            />
          )}
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

// Loading component
export function Scene3DLoading() {
  return (
    <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-center"
      >
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Cargando modelo 3D...</p>
      </motion.div>
    </div>
  );
}
