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
 */
export function FabLabCube({ 
  desktopSize = 2.5, 
  mobileSize = 1.6 
}: FabLabCubeProps) {
  const isMobile = useIsMobile();
  const cubeSize = isMobile ? mobileSize : desktopSize;

  return (
    <RotatingGroup>
      <LogoCube size={cubeSize} logoPath={LOGOS.FABLAB_MAIN} />
    </RotatingGroup>
  );
}
