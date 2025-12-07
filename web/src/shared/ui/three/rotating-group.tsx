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
  rotationSpeed = { x: 0, y: 0.3, z: 0 },
  mouseInfluence = { x: 0.05, y: 0.02 },
  initialRotation = [0.15, 0, 0],
}: RotatingGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition();

  useFrame((state) => {
    if (!groupRef.current) return;

    // Solo rotar en eje Y, mantener inclinación inicial en X
    groupRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed.y;
    groupRef.current.position.x = -mouse.x * mouseInfluence.x;
    groupRef.current.position.y = -mouse.y * mouseInfluence.y;
  });

  return (
    <group ref={groupRef} rotation={initialRotation}>
      {children}
    </group>
  );
}
