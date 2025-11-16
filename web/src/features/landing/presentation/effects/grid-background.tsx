"use client";

import { motion } from 'framer-motion';

export function GridBackground() {
  // Crear grilla de puntos
  const gridSize = 15; // Espaciado entre puntos más denso
  const points = [];

  for (let x = 0; x <= 100; x += gridSize) {
    for (let y = 0; y <= 100; y += gridSize) {
      points.push({ x, y });
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none opacity-60">
      <svg className="w-full h-full">
        {/* Puntos de la grilla */}
        {points.map((point, i) => (
          <motion.circle
            key={i}
            cx={`${point.x}%`}
            cy={`${point.y}%`}
            r="1.5"
            fill="#3b82f6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0.4],
              scale: [0, 1, 0.8]
            }}
            transition={{
              duration: 2,
              delay: i * 0.01,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut"
            }}
            style={{
              filter: 'blur(0.5px)'
            }}
          />
        ))}
        
        {/* Líneas de grilla muy sutiles */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${i * 20}%`}
            y1="0%"
            x2={`${i * 20}%`}
            y2="100%"
            stroke="#3b82f6"
            strokeWidth="0.2"
            opacity="0.1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {Array.from({ length: 6 }, (_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0%"
            y1={`${i * 20}%`}
            x2="100%"
            y2={`${i * 20}%`}
            stroke="#3b82f6"
            strokeWidth="0.2"
            opacity="0.1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3,
              delay: i * 0.2 + 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Círculos concéntricos centrales */}
        {[30, 50, 70].map((radius, i) => (
          <motion.circle
            key={`circle-${i}`}
            cx="50%"
            cy="50%"
            r={`${radius}%`}
            fill="none"
            stroke="#6366f1"
            strokeWidth="0.3"
            opacity="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1,
              opacity: [0, 0.15, 0.1]
            }}
            transition={{
              duration: 4,
              delay: i * 0.5 + 1,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
            style={{
              transformOrigin: '50% 50%'
            }}
          />
        ))}
      </svg>
    </div>
  );
}
