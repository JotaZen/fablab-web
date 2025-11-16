"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function DonutBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Puntos específicos para el área de la dona
  const donutDots = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: 25 + Math.random() * 50, // Concentrar alrededor del centro
    y: 25 + Math.random() * 50,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2
  }));

  // Círculos concéntricos alrededor de la dona
  const concentricCircles = [
    { radius: 120, delay: 0, duration: 8 },
    { radius: 180, delay: 1, duration: 10 },
    { radius: 240, delay: 2, duration: 12 }
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">      
      {/* Puntos minimalistas alrededor de la dona */}
      {donutDots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)'
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Círculos concéntricos sutiles */}
      {concentricCircles.map((circle, i) => (
        <motion.div
          key={i}
          className="absolute border border-blue-400/10 rounded-full"
          style={{
            width: `${circle.radius}px`,
            height: `${circle.radius}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            opacity: [0, 0.2, 0],
            scale: [0.8, 1, 1.2],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Líneas de energía que convergen hacia la dona */}
      <svg className="absolute inset-0 w-full h-full">
        {[...Array(6)].map((_, i) => {
          const angle = (i * 60) * (Math.PI / 180);
          const startRadius = 300;
          const endRadius = 100;
          const centerX = 50;
          const centerY = 50;
          
          const startX = centerX + Math.cos(angle) * (startRadius / 8);
          const startY = centerY + Math.sin(angle) * (startRadius / 8);
          const endX = centerX + Math.cos(angle) * (endRadius / 8);
          const endY = centerY + Math.sin(angle) * (endRadius / 8);

          return (
            <motion.line
              key={i}
              x1={`${startX}%`}
              y1={`${startY}%`}
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke="rgba(99, 102, 241, 0.2)"
              strokeWidth="1"
              strokeDasharray="8,4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0], 
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 4 + i * 0.5,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </svg>

      {/* Destello central sutil */}
      <motion.div
        className="absolute w-32 h-32 rounded-full"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(99, 102, 241, 0.025) 50%, transparent 100%)'
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
