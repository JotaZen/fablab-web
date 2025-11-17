"use client";

import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

function DonutModel() {
    const group = useRef<THREE.Group | null>(null);

    useFrame((state, dt) => {
        if (group.current) {
            group.current.rotation.y += dt * 0.2;
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.25;
            group.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.05;
        }
    });

    return (
        <group ref={group} rotation={[-0.2, 0.6, 0]}>
            <mesh castShadow receiveShadow>
                <torusGeometry args={[1.8, 0.75, 28, 64]} />
                <meshStandardMaterial color="#050505" metalness={0.7} roughness={0.28} />
            </mesh>
        </group>
    );
}

export function Hero3DSection() {
    return (
        <section className="relative w-full h-screen bg-white flex items-center justify-center isolate
        
            style={{ background: 'linear-gradient(to bottom, #fff 0%, #cc000050 9%)' }}
        ">
            <div className="absolute inset-0 z-0">
                <Canvas className="w-full h-full">
                    <PerspectiveCamera makeDefault position={[1.5, 1, 7]} rotation={[-0.1, 0.2, 0]} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[26, 8, 6]} intensity={1} />
                    <spotLight
                        position={[-4, 6, 4]}
                        angle={0.9}
                        penumbra={0.4}
                        intensity={1.1}
                        castShadow
                    />
                    <DonutModel />
                </Canvas>
            </div>
            <h1
                className="m-0 relative z-10 text-center font-extrabold leading-none text-[14vw] select-none pointer-events-none"
                style={{ mixBlendMode: "difference", color: "#ffffff" }}
            >
                FABLAB
            </h1>
        </section>
    );
}
