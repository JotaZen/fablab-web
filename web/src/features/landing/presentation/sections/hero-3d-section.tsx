"use client";

import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

// Stable minimal hero: Canvas with a rotating 3D model and an overlaid H1.

function RotatingModel() {
    const group = useRef<THREE.Group | null>(null);
    useFrame((state, dt) => {
        if (group.current) {
            group.current.rotation.y += dt * 0.6;
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.06;
        }
    });

    return (
        <group ref={group}>
            <mesh position={[0, -0.2, 0]}>
                <torusKnotGeometry args={[1.2, 0.35, 128, 32]} />
                <meshStandardMaterial color="#0b0b0b" roughness={0.45} metalness={0.95} />
            </mesh>
        </group>
    );
}

export function Hero3DSection() {
    return (
        <section className="relative w-full h-screen bg-white flex items-center justify-center isolate">
            <div className="absolute inset-0 z-0">
                <Canvas className="w-full h-full">
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 5, 5]} intensity={1.0} />
                    <pointLight position={[-5, -5, 5]} intensity={0.3} />
                    <RotatingModel />
                </Canvas>
            </div>
            <h1
                className="relative z-10 text-center font-extrabold leading-none text-[14vw] select-none pointer-events-none"
                style={{ mixBlendMode: "difference", color: "#ffffff" }}
            >
                FABLAB
            </h1>
        </section>
    );
}
