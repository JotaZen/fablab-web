"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Text } from '@react-three/drei';
import useClickPrice from '@/shared/helpers/easter-eggs/click-price';
import { InacapLogo3D } from './inacap-logo-3d';
import DonutModel from './donut-3d';
import DotGridBackground from '@/shared/ui/backgrounds/dot-grid';

function DarkCubeModel() {
    const group = useRef<THREE.Group | null>(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMouse({
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.x = state.clock.elapsedTime * 0.2;
            group.current.rotation.y = state.clock.elapsedTime * 0.25;
            group.current.rotation.z = state.clock.elapsedTime * 0.15;
            group.current.position.x = -mouse.x * 0.05;
            group.current.position.y = -mouse.y * 0.02;
        }
    });

    const cubeSize = isMobile ? 1.6 : 2.5;

    return (
        <group ref={group} rotation={[-0.2, 0.6, 0]}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
                <meshStandardMaterial color="#050505" metalness={0} roughness={0.28} />
            </mesh>
        </group>
    );
}

// Componente que renderiza texto con shader adaptativo
function AdaptiveText() {
    const textGroupRef = useRef<THREE.Group>(null);
    const renderTargetRef = useRef<THREE.WebGLRenderTarget | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si es móvil
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    // Shader material que lee la textura de la escena
    const textMaterial = useMemo(() => {
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
                    
                    // Si es oscuro (modelo), texto blanco. Si es claro (fondo), texto negro.
                    vec3 textColor = luminance < 0.5 ? vec3(1.0) : vec3(0.0);
                    
                    gl_FragColor = vec4(textColor, 1.0);
                }
            `,
        });
    }, []);

    useFrame((state) => {
        if (!textGroupRef.current) return;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rootState = state as any;
        const gl = rootState.gl as THREE.WebGLRenderer;
        const scene = rootState.scene as THREE.Scene;
        const camera = rootState.camera as THREE.Camera;
        const size = rootState.size as { width: number; height: number };
        
        // Crear render target si no existe o si cambió el tamaño
        if (!renderTargetRef.current || 
            renderTargetRef.current.width !== size.width || 
            renderTargetRef.current.height !== size.height) {
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

function Scene({ model }: { model: "donut" | "cube" | "inacap" }) {
    return (
        <>
            {
                model === "donut" ? <DonutModel /> :
                model === "inacap" ? <InacapLogo3D /> :
                <DarkCubeModel />
            }
            <AdaptiveText />
        </>
    );
}

export function Hero3DSection() {
    const [model, setModel] = useState<"donut" | "cube" | "inacap">("cube");
    const hook = useClickPrice({
        initialPrice: 5,
        resetPrice: true,
        onPrice: () => {
            if (model === "cube") setModel("inacap");
            else if (model === "inacap") setModel("donut");
            else setModel("cube");
        }
    });

    return (
        <section className="relative w-full h-screen bg-white flex items-center justify-center isolate">
            <div className="absolute inset-0 z-0" onClick={hook.handleClick}>
                <DotGridBackground gap={30} dotSize={2} color="rgba(0,0,0,0.1)" fadeRadius="80%" />
                <Canvas className="w-full h-full">
                    <color attach="background" args={['#ffffff']} />
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[26, 8, 6]} intensity={1} />
                    <spotLight
                        position={[-4, 6, 4]}
                        angle={0.9}
                        penumbra={0.4}
                        intensity={1.1}
                    />
                    <Scene model={model} />
                </Canvas>
            </div>
        </section>
    );
}
