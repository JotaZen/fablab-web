"use client";

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import useClickPrice from '@/shared/helpers/easter-eggs/click-price';
import { InacapLogo3D } from './inacap-logo-3d';
import DonutModel from './donut-3d';
import DotGridBackground from '@/shared/ui/backgrounds/dot-grid';

function DarkCubeModel() {
    const group = useRef<THREE.Group | null>(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMouse({
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        if (group.current) {
            // Rotación base continua más fluida
            group.current.rotation.x = state.clock.elapsedTime * 0.2;
            group.current.rotation.y = state.clock.elapsedTime * 0.25;
            group.current.rotation.z = state.clock.elapsedTime * 0.15;

            // Efecto parallax contrario cambiando la posición
            group.current.position.x = -mouse.x * 0.1;
            group.current.position.y = -mouse.y * 0.05;
        }
    });

    return (
        <group ref={group} rotation={[-0.2, 0.6, 0]}>
            {/* Cubo principal */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[2.5, 2.5, 2.5]} />
                <meshStandardMaterial color="#050505" metalness={0} roughness={0.28} />
            </mesh>
        </group>
    );
}

export function Hero3DSection() {
    const [model, setModel] = useState<"donut" | "cube" | "inacap">("cube");
    const hook = useClickPrice({
        initialPrice: 5,
        resetPrice: true,
        onPrice: () => {
            if (model === "cube") setModel("inacap");
            else if (model === "inacap") setModel("donut");
            else setModel("cube");
        }
    });

    return (
        <section className="relative w-full h-screen bg-white flex items-center justify-center isolate
            style={{ background: 'linear-gradient(to bottom, #fff 0%, #cc000050 9%)' }}
        ">
            <div className="absolute inset-0 z-0" onClick={hook.handleClick}>
                <DotGridBackground gap={30} dotSize={2} color="rgba(0,0,0,0.1)" fadeRadius="80%" />
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
                    {
                        model === "donut" ? <DonutModel /> :
                            model === "inacap" ? <InacapLogo3D /> :
                                <DarkCubeModel />
                    }
                </Canvas>
            </div>
            <h1
                className="m-0 relative z-10 text-center font-extrabold leading-none text-[14vw] select-none pointer-events-none"
                style={{ mixBlendMode: "difference", color: "#ffffff" }}
            >
                FAPLAB
            </h1>
        </section>
    );
}
