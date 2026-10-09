import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing'
import { Model } from './Full_brain_model.jsx'
import { ANATOMY_DATA, MACRO_GROUPS } from './anatomyData.js'

export default function App() {
  const [currentStage, setCurrentStage] = useState('macro') // 'macro' | 'lobe_focus' | 'deep_core'
  const [activeGroup, setActiveGroup] = useState('Frontal')
  const [selectedMesh, setSelectedMesh] = useState(null)

  const activeGroupInfo = MACRO_GROUPS[activeGroup] || {
    title: activeGroup,
    function: 'Anatomical region of the brain.',
  }

  const selectedMeshInfo = selectedMesh ? ANATOMY_DATA[selectedMesh] : null

  const handleGroupSelect = (group) => {
    setActiveGroup(group)
    setSelectedMesh(null)
  }

  const handleMeshSelect = (meshName) => {
    setSelectedMesh(meshName)
    const anatomy = ANATOMY_DATA[meshName]
    if (anatomy?.parentGroup && currentStage !== 'deep_core') {
      setActiveGroup(anatomy.parentGroup)
    }
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#12151c' }}>
      {/* Floating Interactive UI Card */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 10,
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          background: 'rgba(18, 22, 31, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.2)',
          padding: '22px',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          userSelect: 'none',
        }}
      >
        {/* Stage Badge & Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '4px 10px',
              borderRadius: '20px',
              background:
                currentStage === 'deep_core'
                  ? 'rgba(255, 215, 0, 0.2)'
                  : currentStage === 'lobe_focus'
                  ? 'rgba(0, 229, 255, 0.2)'
                  : 'rgba(255, 210, 168, 0.2)',
              color:
                currentStage === 'deep_core'
                  ? '#ffd700'
                  : currentStage === 'lobe_focus'
                  ? '#00e5ff'
                  : '#ffd2a8',
              border: `1px solid ${
                currentStage === 'deep_core'
                  ? 'rgba(255, 215, 0, 0.4)'
                  : currentStage === 'lobe_focus'
                  ? 'rgba(0, 229, 255, 0.4)'
                  : 'rgba(255, 210, 168, 0.4)'
              }`,
            }}
          >
            {currentStage === 'macro' && 'Stage 1: Macro Overview'}
            {currentStage === 'lobe_focus' && 'Stage 2: Focused Lobe'}
            {currentStage === 'deep_core' && 'Stage 3: Deep Core'}
          </span>

          {currentStage !== 'macro' && (
            <button
              onClick={() => {
                setCurrentStage('macro')
                setSelectedMesh(null)
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.16)')}
              onMouseLeave={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.08)')}
            >
              ← Back to Overview
            </button>
          )}
        </div>

        {/* ================================================= */}
        {/* 1. MACRO STAGE CARD CONTENT                      */}
        {/* ================================================= */}
        {currentStage === 'macro' && (
          <>
            <div>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.3px' }}>
                {activeGroupInfo.title}
              </h2>
              {activeGroupInfo.subtitle && (
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
                  {activeGroupInfo.subtitle}
                </div>
              )}
              <p style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.55', color: '#cbd5e1' }}>
                {activeGroupInfo.function}
              </p>
            </div>

            {/* Quick Macro Selector Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Frontal', 'Parietal', 'Temporal', 'Occipital', 'Cerebellum', 'Subcortical'].map((group) => {
                const isActive = activeGroup === group
                return (
                  <button
                    key={group}
                    onClick={() => handleGroupSelect(group)}
                    style={{
                      background: isActive ? '#ffd2a8' : 'rgba(255, 255, 255, 0.06)',
                      color: isActive ? '#1a1107' : '#cbd5e1',
                      border: isActive ? '1px solid #ffd2a8' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '5px 10px',
                      fontSize: '12px',
                      fontWeight: isActive ? '700' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {group}
                  </button>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={() => {
                  if (activeGroup === 'Subcortical') {
                    setCurrentStage('deep_core')
                  } else {
                    setCurrentStage('lobe_focus')
                  }
                  setSelectedMesh(null)
                }}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
              >
                Inspect {activeGroupInfo.title} →
              </button>

              <button
                onClick={() => {
                  setCurrentStage('deep_core')
                  setActiveGroup('Subcortical')
                  setSelectedMesh(null)
                }}
                style={{
                  background: 'rgba(255, 215, 0, 0.12)',
                  color: '#ffd700',
                  border: '1px solid rgba(255, 215, 0, 0.35)',
                  borderRadius: '10px',
                  padding: '11px 16px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.target.style.background = 'rgba(255, 215, 0, 0.2)')}
                onMouseLeave={(e) => (e.target.style.background = 'rgba(255, 215, 0, 0.12)')}
              >
                Explore Deep Core 🧠
              </button>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', textAlign: 'center' }}>
              💡 Click any region on the 3D model to select its lobe
            </div>
          </>
        )}

        {/* ================================================= */}
        {/* 2. LOBE FOCUS STAGE CARD CONTENT                  */}
        {/* ================================================= */}
        {currentStage === 'lobe_focus' && (
          <>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.3px' }}>
                {activeGroupInfo.title}
              </h2>
              <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                Focused Lobe Inspection • Individual Gyri Clickable
              </div>
            </div>

            {selectedMeshInfo ? (
              <div
                style={{
                  background: 'rgba(0, 229, 255, 0.08)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#00e5ff', textTransform: 'uppercase' }}>
                  Selected Region
                </div>
                <div style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff' }}>
                  {selectedMeshInfo.displayName}
                </div>
                <div style={{ fontSize: '13.5px', lineHeight: '1.55', color: '#e2e8f0' }}>
                  {selectedMeshInfo.description}
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px dashed rgba(255, 255, 255, 0.18)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#94a3b8',
                  lineHeight: '1.5',
                }}
              >
                👆 Click any gyrus in the highlighted lobe to inspect its specific functional anatomy.
              </div>
            )}

            <button
              onClick={() => {
                setCurrentStage('deep_core')
                setActiveGroup('Subcortical')
                setSelectedMesh(null)
              }}
              style={{
                background: 'rgba(255, 215, 0, 0.1)',
                color: '#ffd700',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '8px',
                padding: '9px 12px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Explore Deep Core 🧠
            </button>
          </>
        )}

        {/* ================================================= */}
        {/* 3. DEEP CORE STAGE CARD CONTENT                   */}
        {/* ================================================= */}
        {currentStage === 'deep_core' && (
          <>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.3px', color: '#ffd700' }}>
                Deep Subcortical Core
              </h2>
              <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                Cortical lobes hidden • Internal structures & Cerebellum exposed
              </div>
            </div>

            {selectedMeshInfo ? (
              <div
                style={{
                  background: 'rgba(255, 215, 0, 0.08)',
                  border: '1px solid rgba(255, 215, 0, 0.35)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#ffd700', textTransform: 'uppercase' }}>
                  Deep Structure
                </div>
                <div style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff' }}>
                  {selectedMeshInfo.displayName}
                </div>
                <div style={{ fontSize: '13.5px', lineHeight: '1.55', color: '#e2e8f0' }}>
                  {selectedMeshInfo.description}
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px dashed rgba(255, 255, 255, 0.18)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#94a3b8',
                  lineHeight: '1.5',
                }}
              >
                👆 All 4 cortical lobes are hidden. Click any internal structure (Thalamus, Ventricles, Hippocampus, Brainstem, Cerebellum) to inspect.
              </div>
            )}

            {/* Quick Core Structure Shortcuts */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                Quick Focus
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {[
                  { name: 'Thalamus', id: 'Left_Thalamus' },
                  { name: 'Hippocampus', id: 'Left_Hippocampus' },
                  { name: 'Ventricles', id: 'Left_Lateral_Ventricle' },
                  { name: 'Brainstem', id: 'Brain-Stem' },
                  { name: 'Caudate', id: 'Left_Caudate' },
                  { name: 'Putamen', id: 'Left_Putamen' },
                  { name: 'Amygdala', id: 'Left_Amygdala' },
                  { name: 'Cerebellum', id: 'Left_Crus_I' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setSelectedMesh(item.id)}
                    style={{
                      background: selectedMesh === item.id ? '#ffd700' : 'rgba(255, 255, 255, 0.06)',
                      color: selectedMesh === item.id ? '#1a1107' : '#cbd5e1',
                      border: selectedMesh === item.id ? '1px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11.5px',
                      fontWeight: selectedMesh === item.id ? '700' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3D Scene Canvas */}
      <Canvas
        shadows
        style={{ width: '100vw', height: '100vh', background: '#12151c' }}
        camera={{ position: [0, 0, 250], fov: 35 }}
      >
        <color attach="background" args={['#12151c']} />

        {/* 3-Point Lighting Setup */}
        <directionalLight position={[100, 100, 100]} intensity={2.5} castShadow />
        <directionalLight position={[-100, -100, -100]} intensity={1} color="#8fb4ff" />
        <spotLight position={[0, 200, -200]} intensity={3} angle={0.3} penumbra={1} />

        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={0.3} />
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Model
              currentStage={currentStage}
              activeGroup={activeGroup}
              selectedMesh={selectedMesh}
              onSelectMesh={handleMeshSelect}
              onSelectGroup={handleGroupSelect}
            />
          </group>
        </Suspense>

        <EffectComposer multisampling={4}>
          <SSAO radius={2} intensity={15} luminanceInfluence={0.5} />
          <Bloom luminanceThreshold={0.5} intensity={0.15} />
        </EffectComposer>

        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  )
}
