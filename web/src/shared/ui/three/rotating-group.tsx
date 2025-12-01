"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMousePosition } from "@/shared/hooks";

interface RotatingGroupProps {
  children: React.ReactNode;
  rotationSpeed?: { x: number; y: number; z: number };
  mouseInfluence?: { x: number; y: number };
  initialRotation?: [number, number, number];
}

/**
 * Grupo 3D que rota automáticamente y reacciona al mouse
 */
export function RotatingGroup({
  children,
  rotationSpeed = { x: 0.2, y: 0.25, z: 0.15 },
  mouseInfluence = { x: 0.05, y: 0.02 },
  initialRotation = [-0.2, 0.6, 0],
}: RotatingGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition();

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed.x;
    groupRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed.y;
    groupRef.current.rotation.z = state.clock.elapsedTime * rotationSpeed.z;
    groupRef.current.position.x = -mouse.x * mouseInfluence.x;
    groupRef.current.position.y = -mouse.y * mouseInfluence.y;
  });

  return (
    <group ref={groupRef} rotation={initialRotation}>
      {children}
    </group>
  );
}
