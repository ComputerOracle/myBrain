import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Model } from './Full_brain_model.jsx'

export default function App() {
  const [isAdvanced, setIsAdvanced] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <button
        onClick={() => setIsAdvanced((prev) => !prev)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 10,
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '0.5px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: isAdvanced ? '#3b82f6' : '#27272a',
          color: '#ffffff',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.2s ease',
        }}
      >
        {isAdvanced ? 'Mode: Advanced (Shell Transparent)' : 'Mode: Beginner (Solid Brain)'}
      </button>

      <Canvas
        style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}
        camera={{ position: [140, 20, 220], fov: 45 }}
      >
        <color attach="background" args={['#1a1a1a']} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <Suspense fallback={null}>
          <Environment preset="warehouse" />
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Model isAdvanced={isAdvanced} />
          </group>
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  )
}
