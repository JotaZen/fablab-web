"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text3D, Center, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { useScrollAnimation, useParallaxScroll } from "@/shared/hooks/use-scroll-animations";
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
            <Sphere ref={sphereRef} args={[1, 100, 200]} scale={1 + scrollProgress * 0.5}>
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

// Partículas flotantes simplificadas
function FloatingParticles() {
    const particlesRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    return (
        <points ref={particlesRef}>
            <bufferGeometry attach="geometry">
                {/* <bufferAttribute
                    args={[[1], 2]}
                    attach="attributes-position"
                    array={positions}
                    count={particleCount}
                    itemSize={3}
                /> */}
            </bufferGeometry>
            <pointsMaterial size={0.02} color="#8b5cf6" transparent opacity={0.6} />
        </points>
    );
}

// Texto 3D animado
function AnimatedText3D({ text, scrollProgress }: { text: string; scrollProgress: number }) {
    const textRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (textRef.current) {
            textRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
        }
    });

    return (
        <Center>
            <Text3D
                ref={textRef}
                font="/fonts/Inter_Bold.json"
                size={0.5}
                height={0.1}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
                position={[0, 0, 0]}
                scale={1 + scrollProgress * 0.3}
            >
                {text}
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#3b82f6"
                    emissiveIntensity={scrollProgress * 0.3}
                    metalness={0.7}
                    roughness={0.2}
                />
            </Text3D>
        </Center>
    );
}

interface Hero3DProps {
    className?: string;
    showText?: boolean;
    textContent?: string;
}

export function Hero3D({
    className = "",
    showText = true,
    textContent = "FabLab"
}: Hero3DProps) {
    const { elementRef, scrollProgress } = useScrollAnimation({
        threshold: 0.1,
        triggerOnce: false
    });

    const parallaxOffset = useParallaxScroll(0.3);

    return (
        <div
            ref={elementRef}
            className={`relative w-full h-screen overflow-hidden ${className}`}
            style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                style={{
                    background: "transparent",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%"
                }}
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

                    {/* Partículas de fondo */}
                    <FloatingParticles />

                    {/* Esfera principal */}
                    <AnimatedSphere scrollProgress={scrollProgress} />

                    {/* Texto 3D opcional */}
                    {showText && (
                        <group position={[0, -2, 0]}>
                            <AnimatedText3D text={textContent} scrollProgress={scrollProgress} />
                        </group>
                    )}

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

            {/* Overlay con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />

            {/* Efectos de luz adicionales */}
            <div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                style={{
                    opacity: scrollProgress * 0.5,
                    transform: `scale(${1 + scrollProgress})`,
                }}
            />
            <div
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
                style={{
                    opacity: scrollProgress * 0.3,
                    transform: `scale(${1 + scrollProgress * 0.5})`,
                }}
            />
        </div>
    );
}

// Componente Loading para escenas 3D
export function Scene3DLoading() {
    return (
        <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Cargando modelo 3D...</p>
            </div>
        </div>
    );
}
