"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FuturisticBackgroundProps {
  className?: string;
  showDots?: boolean;
  showCables?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export function FuturisticBackground({ 
  className = '', 
  showDots = true, 
  showCables = true,
  intensity = 'medium'
}: FuturisticBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dotCount = intensity === 'low' ? 50 : intensity === 'medium' ? 100 : 150;
  const cableCount = intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8;

  // Generar puntos de fondo aleatorios
  const dots = Array.from({ length: dotCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2
  }));

  // Generar cables/líneas de energía
  const cables = Array.from({ length: cableCount }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    endX: Math.random() * 100,
    endY: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 4 + 3
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Malla de puntos para toda la página */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-60">
          {/* Máscara radial para desvanecimiento solo en bordes */}
          <defs>
            <radialGradient id="globalGridFade" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="white" stopOpacity="1"/>
              <stop offset="60%" stopColor="white" stopOpacity="0.8"/>
              <stop offset="80%" stopColor="white" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </radialGradient>
            <mask id="globalGridMask">
              <rect width="100%" height="100%" fill="url(#globalGridFade)"/>
            </mask>
          </defs>
          
          <g mask="url(#globalGridMask)">
            {/* Grilla de puntos para toda la pantalla */}
            {Array.from({ length: 20 }, (_, i) =>
              Array.from({ length: 25 }, (_, j) => (
                <motion.circle
                  key={`global-grid-${i}-${j}`}
                  cx={`${(i + 1) * 5}%`}
                  cy={`${(j + 1) * 4}%`}
                  r="1"
                  fill="#3b82f6"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: (i + j) * 0.02,
                    repeat: Infinity,
                    repeatDelay: 8,
                    ease: "easeInOut"
                  }}
                />
              ))
            ).flat()}
            
            {/* Líneas de grilla horizontales */}
            {Array.from({ length: 24 }, (_, i) => (
              <motion.line
                key={`global-h-line-${i}`}
                x1="5%"
                y1={`${(i + 1) * 4}%`}
                x2="95%"
                y2={`${(i + 1) * 4}%`}
                stroke="#3b82f6"
                strokeWidth="0.15"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 4,
                  delay: i * 0.05,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Líneas de grilla verticales */}
            {Array.from({ length: 19 }, (_, i) => (
              <motion.line
                key={`global-v-line-${i}`}
                x1={`${(i + 1) * 5}%`}
                y1="4%"
                x2={`${(i + 1) * 5}%`}
                y2="96%"
                stroke="#3b82f6"
                strokeWidth="0.15"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 4,
                  delay: i * 0.05 + 1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </g>
        </svg>
      </div>
      {/* Puntos de fondo solo en lado derecho */}
      {showDots && (
        <div className="absolute inset-0 left-1/2">
          {dots.map((dot) => (
            <motion.div
              key={dot.id}
              className="absolute rounded-full bg-blue-400/20"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
                boxShadow: [
                  '0 0 0px rgba(59, 130, 246, 0.5)',
                  '0 0 10px rgba(59, 130, 246, 0.8)',
                  '0 0 0px rgba(59, 130, 246, 0.5)'
                ]
              }}
              transition={{
                duration: dot.duration,
                delay: dot.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Cables de energía solo en lado derecho */}
      {showCables && (
        <div className="absolute inset-0 left-1/2">
          <svg className="w-full h-full">
            {cables.map((cable) => (
            <g key={cable.id}>
              {/* Línea base del cable */}
              <motion.line
                x1={`${cable.startX}%`}
                y1={`${cable.startY}%`}
                x2={`${cable.endX}%`}
                y2={`${cable.endY}%`}
                stroke="rgba(99, 102, 241, 0.3)"
                strokeWidth="1"
                strokeDasharray="5,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0, 1, 0], 
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: cable.duration,
                  delay: cable.delay,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Partículas de energía corriendo por el cable */}
              <motion.circle
                r="2"
                fill="#3b82f6"
                filter="blur(1px)"
                initial={{ 
                  cx: `${cable.startX}%`, 
                  cy: `${cable.startY}%`,
                  opacity: 0 
                }}
                animate={{
                  cx: [`${cable.startX}%`, `${cable.endX}%`],
                  cy: [`${cable.startY}%`, `${cable.endY}%`],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: cable.duration * 0.8,
                  delay: cable.delay + 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </g>
          ))}
          </svg>
        </div>
      )}

      {/* Efectos de destello ambiental */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
              width: '300px',
              height: '300px',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              delay: i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Gradiente de overlay sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-purple-950/10" />
    </div>
  );
}
