"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/shared/hooks/use-scroll-animations";
import * as THREE from "three";

// Componente de modelo 3D simple (cubo con texturas)
function RotatingCube({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animación basada en scroll
  const rotation = scrollProgress * Math.PI * 2;
  const scale = 0.5 + (scrollProgress * 0.5);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} rotation={[rotation, rotation, 0]} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#3b82f6"
          metalness={0.7}
          roughness={0.2}
          emissive="#1e40af"
          emissiveIntensity={scrollProgress * 0.3}
        />
      </mesh>
    </Float>
  );
}

// Impresora 3D simplificada
function Printer3D({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Animación de "impresión" basada en scroll
  const printProgress = Math.min(scrollProgress * 2, 1);
  const printerHeight = 0.5 + (printProgress * 0.8);

  return (
    <group ref={groupRef}>
      {/* Base de la impresora */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1.5, 0.2, 1.5]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      
      {/* Marco de la impresora */}
      <mesh position={[0.6, 0, 0.6]}>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <mesh position={[-0.6, 0, 0.6]}>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <mesh position={[0.6, 0, -0.6]}>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      <mesh position={[-0.6, 0, -0.6]}>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      {/* Extrusor */}
      <mesh position={[0, 0.2 + (scrollProgress * 0.3), 0]}>
        <boxGeometry args={[0.3, 0.2, 0.3]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Objeto siendo "impreso" */}
      <mesh position={[0, -0.3, 0]} scale={[1, printerHeight, 1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// Modelo de chip/circuito
function TechChip({ scrollProgress }: { scrollProgress: number }) {
  const chipRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={chipRef} rotation={[0, scrollProgress * Math.PI, 0]}>
      {/* Base del chip */}
      <mesh>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      
      {/* Circuitos */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 0.8,
            0.06,
            (Math.random() - 0.5) * 0.8
          ]}
        >
          <boxGeometry args={[0.05, 0.02, 0.2]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#1e40af"
            emissiveIntensity={scrollProgress * 0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

interface Scene3DProps {
  model?: "cube" | "printer" | "chip";
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
        return <Printer3D scrollProgress={scrollProgress} />;
      case "chip":
        return <TechChip scrollProgress={scrollProgress} />;
      default:
        return <RotatingCube scrollProgress={scrollProgress} />;
    }
  };

  return (
    <motion.div
      ref={elementRef}
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
          {/* Iluminación */}
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

          {/* Ambiente */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

// Componente de showcase 3D con múltiples modelos
export function Tech3DShowcase() {
  const models = [
    { type: "printer" as const, title: "Impresora 3D", description: "Manufactura aditiva" },
    { type: "chip" as const, title: "Electrónica", description: "Diseño de circuitos" },
    { type: "cube" as const, title: "Modelado", description: "Prototipado rápido" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {models.map((model, index) => (
        <motion.div
          key={model.type}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.6 }}
          className="relative group"
        >
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 group-hover:shadow-xl transition-all duration-300">
            <Scene3D 
              model={model.type} 
              className="mb-4"
              autoRotate={false}
            />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                {model.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {model.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
