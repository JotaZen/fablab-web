'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface Model3DProps {
    color?: string;
    roughness?: number;
    metalness?: number;
    rotationSpeed?: number;
    className?: string;
}

function RotatingModel({
    color = '#000000',
    roughness = 0.3,
    metalness = 0.7,
    rotationSpeed = 0.15
}: Omit<Model3DProps, 'className'>) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
        }
    });

    return (
        <mesh ref={meshRef}>
            <torusKnotGeometry args={[1.8, 0.6, 200, 32]} />
            <meshStandardMaterial
                color={color}
                roughness={roughness}
                metalness={metalness}
            />
        </mesh>
    );
}

export function Model3D({
    color = '#000000',
    roughness = 0.3,
    metalness = 0.7,
    rotationSpeed = 0.15,
    className = 'absolute inset-0 w-full h-full'
}: Model3DProps) {
    return (
        <div className={className}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <directionalLight position={[-5, -5, -5]} intensity={0.4} />
                <RotatingModel
                    color={color}
                    roughness={roughness}
                    metalness={metalness}
                    rotationSpeed={rotationSpeed}
                />
            </Canvas>
        </div>
    );
}
