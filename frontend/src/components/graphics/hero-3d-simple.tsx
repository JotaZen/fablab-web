"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation, useParallaxScroll } from "@/lib/hooks/use-scroll-animations";
import * as THREE from "three";

// Esfera animada con distorsión
function AnimatedSphere({ scrollProgress }: { scrollProgress: number }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
      <Sphere ref={sphereRef} args={[1, 64, 32]} scale={1 + scrollProgress * 0.5}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.3 + scrollProgress * 0.2}
          speed={1}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

interface Hero3DProps {
  className?: string;
}

export function Hero3D({ className = "" }: Hero3DProps) {
  const { elementRef, scrollProgress } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const parallaxOffset = useParallaxScroll(0.3);

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`relative w-full h-screen overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div 
        className="absolute inset-0"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          className="w-full h-full"
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            {/* Iluminación dinámica */}
            <ambientLight intensity={0.3} />
            <spotLight 
              position={[10, 10, 10]} 
              angle={0.15} 
              penumbra={1} 
              intensity={1}
              castShadow
            />
            <pointLight 
              position={[-10, -10, -10]} 
              intensity={0.5}
              color="#8b5cf6"
            />

            {/* Esfera principal */}
            <AnimatedSphere scrollProgress={scrollProgress} />

            {/* Controles suaves */}
            <OrbitControls 
              enablePan={false}
              enableZoom={false}
              autoRotate
              autoRotateSpeed={1}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 4}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />
      
      {/* Efectos de luz con CSS */}
      <div 
        className={`absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl transition-all duration-1000`}
        style={{
          opacity: scrollProgress * 0.5,
          transform: `scale(${1 + scrollProgress})`,
        }}
      />
      <div 
        className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl transition-all duration-1000`}
        style={{
          opacity: scrollProgress * 0.3,
          transform: `scale(${1 + scrollProgress * 0.5})`,
        }}
      />
    </motion.div>
  );
}

// Componente Loading para escenas 3D
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
