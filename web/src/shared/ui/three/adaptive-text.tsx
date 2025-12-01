"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useIsMobile } from "@/shared/hooks";

/**
 * Material shader que invierte colores según el fondo
 */
function useAdaptiveTextMaterial() {
  return useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSceneTexture: { value: null },
      },
      vertexShader: `
        varying vec2 vScreenPos;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vec4 clipPos = projectionMatrix * mvPosition;
          vScreenPos = clipPos.xy / clipPos.w * 0.5 + 0.5;
          gl_Position = clipPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uSceneTexture;
        varying vec2 vScreenPos;
        
        void main() {
          vec4 sceneColor = texture2D(uSceneTexture, vScreenPos);
          float luminance = dot(sceneColor.rgb, vec3(0.299, 0.587, 0.114));
          vec3 textColor = luminance < 0.5 ? vec3(1.0) : vec3(0.0);
          gl_FragColor = vec4(textColor, 1.0);
        }
      `,
    });
  }, []);
}

/**
 * Texto adaptativo que cambia de color según el fondo
 */
export function AdaptiveText() {
  const textGroupRef = useRef<THREE.Group>(null);
  const renderTargetRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const isMobile = useIsMobile();
  const textMaterial = useAdaptiveTextMaterial();

  useFrame((state) => {
    if (!textGroupRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rootState = state as any;
    const gl = rootState.gl as THREE.WebGLRenderer;
    const scene = rootState.scene as THREE.Scene;
    const camera = rootState.camera as THREE.Camera;
    const size = rootState.size as { width: number; height: number };

    // Crear render target si no existe o si cambió el tamaño
    if (
      !renderTargetRef.current ||
      renderTargetRef.current.width !== size.width ||
      renderTargetRef.current.height !== size.height
    ) {
      renderTargetRef.current?.dispose();
      renderTargetRef.current = new THREE.WebGLRenderTarget(size.width, size.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      });
    }

    // Ocultar texto temporalmente
    textGroupRef.current.visible = false;

    // Renderizar escena (sin texto) al render target
    gl.setRenderTarget(renderTargetRef.current);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Mostrar texto de nuevo
    textGroupRef.current.visible = true;

    // Actualizar la textura en el material
    textMaterial.uniforms.uSceneTexture.value = renderTargetRef.current.texture;
  });

  useEffect(() => {
    return () => {
      renderTargetRef.current?.dispose();
    };
  }, []);

  // Tamaños responsivos
  const titleSize = isMobile ? 0.7 : 1.1;
  const subtitleSize = isMobile ? 0.09 : 0.14;
  const titleY = isMobile ? 0.2 : 0.3;
  const subtitleY = isMobile ? -0.25 : -0.4;

  return (
    <group ref={textGroupRef} position={[0, 0, 4]}>
      <Text
        position={[0, titleY, 0]}
        fontSize={titleSize}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
        fontWeight={800}
        material={textMaterial}
      >
        FABLAB
      </Text>
      <Text
        position={[0, subtitleY, 0]}
        fontSize={subtitleSize}
        anchorX="center"
        anchorY="middle"
        font="/fonts/exo2/Exo2-VariableFont_wght.ttf"
        material={textMaterial}
        maxWidth={isMobile ? 2.5 : 10}
      >
        Laboratorio de Fabricación Digital INACAP
      </Text>
    </group>
  );
}
