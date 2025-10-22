import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ReactNode } from 'react';

interface Scene3DProps {
  children: ReactNode;
  enableControls?: boolean;
}

export function Scene3D({ children, enableControls = false }: Scene3DProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#60a5fa" intensity={0.5} />
        {children}
        {enableControls && <OrbitControls enableZoom={false} enablePan={false} />}
      </Canvas>
    </div>
  );
}
