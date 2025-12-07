"use client";

import React, { useRef, useEffect } from "react";

interface DotGridProps {
    dotSize?: number;
    gap?: number;
    baseOpacity?: number;
    hoverOpacity?: number;
    hoverRadius?: number;
}

export function DotGridBackground({
    dotSize = 1.5,
    gap = 28,
    baseOpacity = 0.2,
    hoverOpacity = 0.5,
    hoverRadius = 120,
}: DotGridProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let animX = -9999;
        let animY = -9999;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        };

        const draw = () => {
            const rect = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);

            // Faster lerp
            animX += (mouseRef.current.x - animX) * 0.15;
            animY += (mouseRef.current.y - animY) * 0.15;

            const hoverRadiusSq = hoverRadius * hoverRadius;

            for (let x = gap / 2; x < rect.width; x += gap) {
                for (let y = gap / 2; y < rect.height; y += gap) {
                    // Simple Y fade - visible everywhere, slightly more at bottom
                    const yFade = 0.6 + (y / rect.height) * 0.4;

                    // Distance squared (faster than sqrt)
                    const dx = x - animX;
                    const dy = y - animY;
                    const distSq = dx * dx + dy * dy;

                    // Hover effect
                    const hover = distSq < hoverRadiusSq
                        ? 1 - Math.sqrt(distSq) / hoverRadius
                        : 0;

                    const alpha = (baseOpacity + hover * (hoverOpacity - baseOpacity)) * yFade;
                    const size = dotSize * (1 + hover * 0.3);
                    const gray = Math.round(140 - hover * 60);

                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, 6.28);
                    ctx.fillStyle = `rgba(${gray},${gray},${gray},${alpha})`;
                    ctx.fill();
                }
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        const onMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        const onLeave = () => {
            mouseRef.current = { x: -9999, y: -9999 };
        };

        resize();
        window.addEventListener("resize", resize);
        canvas.addEventListener("mousemove", onMove);
        canvas.addEventListener("mouseleave", onLeave);
        rafRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("mousemove", onMove);
            canvas.removeEventListener("mouseleave", onLeave);
            cancelAnimationFrame(rafRef.current);
        };
    }, [dotSize, gap, baseOpacity, hoverOpacity, hoverRadius]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "auto",
            }}
        />
    );
}

export default DotGridBackground;
