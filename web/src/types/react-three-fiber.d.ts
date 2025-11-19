declare module "@react-three/fiber" {
  import type * as React from "react";
  import type * as THREE from "three";

  export interface RootState {
    clock: THREE.Clock;
  }

  export interface CanvasProps {
    className?: string;
    children?: React.ReactNode;
  }

  export const Canvas: React.FC<CanvasProps>;

  export function useFrame(
    callback: (state: RootState, delta: number) => void
  ): void;
}
