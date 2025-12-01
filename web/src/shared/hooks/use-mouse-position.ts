"use client";

import { useState, useEffect } from "react";

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Hook para trackear la posición normalizada del mouse (-1 a 1)
 */
export function useMousePosition(): MousePosition {
  const [mouse, setMouse] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mouse;
}
