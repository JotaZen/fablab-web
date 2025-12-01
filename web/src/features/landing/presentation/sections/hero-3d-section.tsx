"use client";

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import useClickPrice from '@/shared/helpers/easter-eggs/click-price';
import { InacapLogo3D } from './inacap-logo-3d';
import DonutModel from './donut-3d';
import DotGridBackground from '@/shared/ui/backgrounds/dot-grid';
import { FabLabCube, AdaptiveText } from '@/shared/ui/three';

function Scene({ model }: { model: "donut" | "cube" | "inacap" }) {
    return (
        <>
            {
                model === "donut" ? <DonutModel /> :
                model === "inacap" ? <InacapLogo3D /> :
                <FabLabCube />
            }
            <AdaptiveText />
        </>
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
        <section className="relative w-full h-screen bg-white flex items-center justify-center isolate">
            <div className="absolute inset-0 z-0" onClick={hook.handleClick}>
                <DotGridBackground gap={30} dotSize={2} color="rgba(0,0,0,0.1)" fadeRadius="80%" />
                <Canvas className="w-full h-full">
                    <color attach="background" args={['#ffffff']} />
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[26, 8, 6]} intensity={1} />
                    <spotLight
                        position={[-4, 6, 4]}
                        angle={0.9}
                        penumbra={0.4}
                        intensity={1.1}
                    />
                    <Scene model={model} />
                </Canvas>
            </div>
        </section>
    );
}
