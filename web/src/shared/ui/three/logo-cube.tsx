"use client";

import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface LogoCubeProps {
  size: number;
  logoPath: string;
}

/**
 * Cubo 3D con logo en todas las caras
 */
export function LogoCube({ size, logoPath }: LogoCubeProps) {
  const texture = useTexture(logoPath);
  
  // Configurar la textura para mejor calidad
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.1}
        roughness={0.3}
      />
    </mesh>
  );
}
