"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { RootState } from '@react-three/fiber';

export function InacapLogo3D() {
    const group = useRef<THREE.Group | null>(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const elapsedRef = useRef(0);

    const cubeSize = 2.5;
    const barThickness = cubeSize * 0.16; // un poco más gruesa
    const barHeight = cubeSize * 0.55; // ligeramente más alta
    const barDepth = cubeSize * 0.05; // sobresale casi nada
    const faceProtrusion = cubeSize / 2 - barDepth / 2 + cubeSize * 0.005; // casi al ras de la cara
    const rightOffset = cubeSize / 2 - barThickness / 2 - cubeSize * 0.12; // deja margen a la derecha
    const bottomAlignedY = -cubeSize / 2 + barHeight / 2; // toca el bottom

    const edgeMaterial = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    uColor: { value: new THREE.Color("#ff6b6b") },
                },
                vertexShader: `
                    varying float vEdge;
                    void main() {
                        vec3 worldNormal = normalize(normalMatrix * normal);
                        vec3 viewDir = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
                        vEdge = pow(1.0 - dot(worldNormal, viewDir), 1.5);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying float vEdge;
                    uniform vec3 uColor;
                    void main() {
                        float intensity = smoothstep(0.0, 1.0, vEdge);
                        gl_FragColor = vec4(uColor * intensity, intensity * 0.85);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            }),
        []
    );

    useEffect(() => {
        return () => {
            edgeMaterial.dispose();
        };
    }, [edgeMaterial]);

    const barConfigs = useMemo(() => {
        const faces = [
            { key: "front", rotation: new THREE.Euler(0, 0, 0) },
            { key: "back", rotation: new THREE.Euler(0, Math.PI, 0) },
            { key: "right", rotation: new THREE.Euler(0, Math.PI / 2, 0) },
            { key: "left", rotation: new THREE.Euler(0, -Math.PI / 2, 0) },
        ];

        return faces.map(({ key, rotation }) => {
            const rotatedPosition = new THREE.Vector3(rightOffset, bottomAlignedY, faceProtrusion).applyEuler(rotation);
            return {
                key,
                rotation: [rotation.x, rotation.y, rotation.z] as const,
                position: [rotatedPosition.x, rotatedPosition.y, rotatedPosition.z] as const,
            };
        });
    }, [bottomAlignedY, faceProtrusion, rightOffset]);

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

    useFrame((state: RootState, delta: number) => {
        if (group.current) {
            elapsedRef.current += delta;
            const elapsed = elapsedRef.current;

            group.current.rotation.x = 0;
            group.current.rotation.y = elapsed * 0.3;
            group.current.rotation.z = 0;

            group.current.position.x = -mouse.x * 0.5;
            group.current.position.y = -mouse.y * 0.3;
        }
    });

    return (
        <group ref={group} rotation={[-0.2, 0.6, 0]}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
                <meshStandardMaterial color="#050505" metalness={0} roughness={0.28} />
            </mesh>

            <mesh scale={[1.03, 1.03, 1.03]} material={edgeMaterial}>
                <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
            </mesh>

            {barConfigs.map(({ key, position, rotation }) => (
                <mesh key={key} castShadow receiveShadow position={position} rotation={rotation}>
                    <boxGeometry args={[barThickness, barHeight, barDepth]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#f1f5f9"
                        emissiveIntensity={0.4}
                        metalness={0}
                        roughness={0.15}
                    />
                </mesh>
            ))}
        </group>
    );
}
