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
    baseOpacity = 0.25,
    hoverOpacity = 0.6,
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

            animX += (mouseRef.current.x - animX) * 0.15;
            animY += (mouseRef.current.y - animY) * 0.15;

            const hoverRadiusSq = hoverRadius * hoverRadius;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const ellipseA = rect.width * 0.32;
            const ellipseB = rect.height * 0.28;

            for (let x = gap / 2; x < rect.width; x += gap) {
                for (let y = gap / 2; y < rect.height; y += gap) {
                    const ex = (x - centerX) / ellipseA;
                    const ey = (y - centerY) / ellipseB;
                    const ellipseDist = Math.sqrt(ex * ex + ey * ey);
                    const centerFade = Math.min(1, Math.max(0, ellipseDist - 0.5) * 1.5);

                    if (centerFade < 0.03) continue;

                    const xFromCenter = Math.abs(x - centerX) / (rect.width / 2);
                    const yRatio = y / rect.height;
                    const cornerBoost = xFromCenter * yRatio * 1.2;

                    const dx = x - animX;
                    const dy = y - animY;
                    const distSq = dx * dx + dy * dy;
                    const hover = distSq < hoverRadiusSq ? 1 - Math.sqrt(distSq) / hoverRadius : 0;

                    const alpha = (baseOpacity * centerFade + cornerBoost * 0.15 + hover * hoverOpacity) * (0.8 + cornerBoost * 0.4);
                    const size = dotSize * (1 + cornerBoost * 0.5 + hover * 0.5);
                    const gray = Math.round(150 - cornerBoost * 30 - hover * 50);

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
