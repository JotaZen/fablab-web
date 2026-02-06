"use client";

import { RotatingGroup } from "./rotating-group";
import { LogoCube } from "./logo-cube";
import { useIsMobile } from "@/shared/hooks";
import { LOGOS } from "@/shared/constants/assets";

interface FabLabCubeProps {
  desktopSize?: number;
  mobileSize?: number;
}

/**
 * Cubo 3D con el logo de FabLab que rota
 * Centrado con el texto FABLAB
 */
export function FabLabCube({
  desktopSize = 2.5,
  mobileSize = 1.2
}: FabLabCubeProps) {
  const isMobile = useIsMobile();
  const cubeSize = isMobile ? mobileSize : desktopSize;
  // Centrar con el texto FABLAB (mismo Y que titleY en AdaptiveText)
  const centerY = isMobile ? 0.15 : 0.3;

  return (
    <group position={[0, centerY, 0]}>
      <RotatingGroup>
        <LogoCube size={cubeSize} logoPath={LOGOS.FABLAB_MAIN} />
      </RotatingGroup>
    </group>
  );
}
