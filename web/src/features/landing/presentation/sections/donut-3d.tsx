import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from 'three';

function DonutModel() {
    const group = useRef<THREE.Group | null>(null);

    useFrame((state, dt) => {
        if (group.current) {
            group.current.rotation.y += dt * 0.2;
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.25;
            group.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.05;
        }
    });

    return (
        <group ref={group} rotation={[-0.2, 0.6, 0]}>
            <mesh castShadow receiveShadow>
                <torusGeometry args={[1.8, 0.75, 28, 64]} />
                <meshStandardMaterial color="#050505" metalness={0.7} roughness={0.28} />
            </mesh>
        </group>
    );
}

export default DonutModel;