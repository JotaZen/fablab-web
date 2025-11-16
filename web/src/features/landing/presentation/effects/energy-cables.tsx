"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function EnergyCables() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Definir rutas de cables que parecen conectar elementos
  const cableRoutes = [
    // Cable horizontal superior
    { 
      path: "M 10 20 Q 50 15 90 25", 
      delay: 0, 
      duration: 4,
      color: "#3b82f6"
    },
    // Cable diagonal
    { 
      path: "M 20 80 Q 60 50 85 15", 
      delay: 1, 
      duration: 5,
      color: "#6366f1"
    },
    // Cable serpenteante
    { 
      path: "M 5 60 Q 25 40 45 55 Q 65 70 90 50", 
      delay: 2, 
      duration: 6,
      color: "#8b5cf6"
    },
    // Cable vertical izquierdo
    { 
      path: "M 15 10 Q 12 30 18 50 Q 15 70 20 90", 
      delay: 0.5, 
      duration: 4.5,
      color: "#06b6d4"
    },
    // Cable curvo derecho
    { 
      path: "M 80 30 Q 95 45 85 65 Q 75 80 90 90", 
      delay: 1.5, 
      duration: 5.5,
      color: "#10b981"
    }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none opacity-10">
      <svg className="w-full h-full">
        {cableRoutes.map((route, i) => (
          <g key={i}>
            {/* Cable base */}
            <motion.path
              d={route.path}
              fill="none"
              stroke={route.color}
              strokeWidth="1"
              strokeLinecap="round"
              className="drop-shadow-sm"
              style={{
                filter: 'blur(0.5px)',
                strokeOpacity: 0.2
              }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1], 
                opacity: [0, 0.2, 0.2],
              }}
              transition={{
                pathLength: { duration: 2, delay: route.delay },
                opacity: { duration: 1, delay: route.delay }
              }}
            />
            
            {/* Efecto de energía corriendo */}
            <motion.path
              d={route.path}
              fill="none"
              stroke={route.color}
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                filter: 'blur(1px)',
                strokeOpacity: 0.8
              }}
              initial={{ pathLength: 0, pathOffset: 1 }}
              animate={{ 
                pathLength: [0, 0.3, 0],
                pathOffset: [1, 0, -1],
              }}
              transition={{
                duration: route.duration,
                delay: route.delay + 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Partículas brillantes */}
            {[...Array(3)].map((_, j) => (                <motion.circle
                  key={j}
                  r="2"
                  fill={route.color}
                  style={{
                    filter: 'blur(1px)',
                    opacity: 0.9,
                    offsetPath: `path("${route.path}")`,
                    offsetRotate: 'auto'
                  } as React.CSSProperties}
                  initial={{ 
                    offsetDistance: '0%',
                    scale: 0
                  }}
                  animate={{
                    offsetDistance: ['0%', '100%'],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: route.duration * 0.8,
                    delay: route.delay + 2.5 + j * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
            ))}
          </g>
        ))}
        
        {/* Nodos de conexión */}
        {[
          { x: 10, y: 20 },
          { x: 90, y: 25 },
          { x: 20, y: 80 },
          { x: 85, y: 15 },
          { x: 90, y: 50 }
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r="4"
            fill="#3b82f6"
            style={{
              filter: 'blur(0.5px)'
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>
    </div>
  );
}
