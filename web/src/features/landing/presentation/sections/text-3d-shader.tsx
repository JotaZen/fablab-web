"use client";

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

/**
 * Shader que renderiza texto en blanco o negro basado en la luminosidad del fondo.
 * - Fondo oscuro (luminosidad < 0.5) → texto blanco
 * - Fondo claro (luminosidad >= 0.5) → texto negro
 */

const vertexShader = `
  varying vec2 vUv;
  varying vec4 vWorldPosition;
  
  void main() {
    vUv = uv;
    vWorldPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D tBackground;
  uniform vec2 resolution;
  varying vec2 vUv;
  
  float luminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }
  
  void main() {
    // Obtener posición en pantalla
    vec2 screenUv = gl_FragCoord.xy / resolution;
    
    // Leer color del fondo
    vec4 bgColor = texture2D(tBackground, screenUv);
    
    // Calcular luminosidad
    float lum = luminance(bgColor.rgb);
    
    // Si el fondo es oscuro, texto blanco; si es claro, texto negro
    vec3 textColor = lum < 0.5 ? vec3(1.0) : vec3(0.0);
    
    gl_FragColor = vec4(textColor, 1.0);
  }
`;

interface LuminosityTextProps {
    children: string;
    fontSize?: number;
    position?: [number, number, number];
    anchorX?: "left" | "center" | "right";
    anchorY?: "top" | "top-baseline" | "middle" | "bottom-baseline" | "bottom";
}

export function LuminosityText({ 
    children, 
    fontSize = 1, 
    position = [0, 0, 0],
    anchorX = "center",
    anchorY = "middle"
}: LuminosityTextProps) {
    return (
        <Text
            position={position}
            fontSize={fontSize}
            anchorX={anchorX}
            anchorY={anchorY}
            font="/fonts/exo2/Exo2-ExtraBold.ttf"
        >
            {children}
            <meshBasicMaterial color="white" transparent opacity={1} />
        </Text>
    );
}

/**
 * Componente simplificado que usa difference blend mode
 * pero con un truco: renderiza el texto con un color gris
 * que al hacer difference produce solo blanco/negro/gris
 */
export function ContrastText({ 
    text,
    subtext,
    mainFontSize = 2,
    subFontSize = 0.3,
}: { 
    text: string;
    subtext?: string;
    mainFontSize?: number;
    subFontSize?: number;
}) {
    const groupRef = useRef<THREE.Group>(null);
    
    return (
        <group ref={groupRef} position={[0, 0, 3]}>
            <Text
                position={[0, 0, 0]}
                fontSize={mainFontSize}
                anchorX="center"
                anchorY="middle"
                font="/fonts/exo2/Exo2-ExtraBold.ttf"
                letterSpacing={0.05}
            >
                {text}
                <meshBasicMaterial color="#ffffff" />
            </Text>
            {subtext && (
                <Text
                    position={[0, -mainFontSize * 0.6, 0]}
                    fontSize={subFontSize}
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/exo2/Exo2-Regular.ttf"
                >
                    {subtext}
                    <meshBasicMaterial color="#ffffff" />
                </Text>
            )}
        </group>
    );
}
