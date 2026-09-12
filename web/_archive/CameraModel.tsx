import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, useTexture } from '@react-three/drei'
import * as THREE from 'three'

const ACCENT = '#f7ac42'
const BODY = '#17171a'
const BODY_SOFT = '#232327'
const METAL = '#3a3a40'

/** Pantalla trasera dibujada por código: UI de grabación estilo cinema camera */
function useScreenTexture() {
  return useMemo(() => {
    const w = 512
    const h = 320
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    const ctx = c.getContext('2d')!

    // fondo
    ctx.fillStyle = '#0a0a0c'
    ctx.fillRect(0, 0, w, h)

    // marco de imagen (zona de video)
    const grd = ctx.createLinearGradient(0, 40, 0, h - 40)
    grd.addColorStop(0, '#1c2a1f')
    grd.addColorStop(0.5, '#31463a')
    grd.addColorStop(1, '#16211a')
    ctx.fillStyle = grd
    ctx.fillRect(24, 36, w - 48, h - 88)

    // "imagen" abstracta: horizonte y silueta
    ctx.fillStyle = '#f7ac42'
    ctx.globalAlpha = 0.85
    ctx.beginPath()
    ctx.arc(w * 0.68, h * 0.42, 34, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.fillStyle = '#0d130f'
    ctx.beginPath()
    ctx.moveTo(24, h - 88 + 36)
    ctx.lineTo(w * 0.3, h * 0.55)
    ctx.lineTo(w * 0.5, h - 52)
    ctx.lineTo(w * 0.72, h * 0.62)
    ctx.lineTo(w - 24, h - 60)
    ctx.lineTo(w - 24, h - 52)
    ctx.lineTo(24, h - 52)
    ctx.closePath()
    ctx.fill()

    // barra superior
    ctx.fillStyle = '#0a0a0c'
    ctx.fillRect(0, 0, w, 36)
    // REC
    ctx.fillStyle = '#ff3b30'
    ctx.beginPath()
    ctx.arc(30, 18, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#f5f5f5'
    ctx.font = 'bold 15px monospace'
    ctx.fillText('REC', 46, 23)
    ctx.fillText('4K DCI  24.00p', 130, 23)
    ctx.fillStyle = ACCENT
    ctx.fillText('00:00:14:07', w - 130, 23)

    // barra inferior de datos
    ctx.fillStyle = '#0a0a0c'
    ctx.fillRect(0, h - 52, w, 52)
    ctx.fillStyle = '#f5f5f5'
    ctx.font = '13px monospace'
    ctx.fillText('ISO 800', 26, h - 30)
    ctx.fillText('f/2.8', 120, h - 30)
    ctx.fillText('5600K', 190, h - 30)
    ctx.fillStyle = ACCENT
    ctx.fillText('BMPCC 6K · RENDER', 26, h - 12)

    // histograma
    ctx.strokeStyle = '#f7ac42'
    ctx.lineWidth = 1.4
    ctx.beginPath()
    for (let i = 0; i < 60; i++) {
      const x = w - 160 + i * 2.2
      const yv = 12 + 26 * Math.abs(Math.sin(i * 0.35) * Math.cos(i * 0.12))
      ctx.moveTo(x, h - 8)
      ctx.lineTo(x, h - 8 - yv)
    }
    ctx.stroke()

    // batería
    ctx.strokeStyle = '#f5f5f5'
    ctx.strokeRect(w - 44, 10, 26, 14)
    ctx.fillStyle = '#f7ac42'
    ctx.fillRect(w - 42, 12, 16, 10)

    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }, [])
}

function LensGlass() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const m = ref.current
    if (m) {
      const mat = m.material as THREE.MeshPhysicalMaterial
      mat.emissiveIntensity = 0.25 + Math.sin(clock.elapsedTime * 1.4) * 0.08
    }
  })
  return (
    <mesh ref={ref} position={[0, 0, 0.02]} rotation={[0, 0, 0]}>
      <circleGeometry args={[0.42, 48]} />
      <meshPhysicalMaterial
        color="#0b1c2c"
        metalness={0.1}
        roughness={0.05}
        emissive="#2b6ea8"
        emissiveIntensity={0.25}
        clearcoat={1}
        clearcoatRoughness={0.08}
      />
    </mesh>
  )
}

export default function CameraModel(props: { scrollProgress?: React.MutableRefObject<number> }) {
  const screenTex = useScreenTexture()
  const isotipo = useTexture('/assets/Isotipo-Render.png')
  const group = useRef<THREE.Group>(null)

  // parallax de puntero + rotación por scroll, con interpolación suave
  const pointer = useRef({ x: 0, y: 0 })
  useFrame(({ pointer: p, camera, clock }) => {
    pointer.current.x = THREE.MathUtils.damp(pointer.current.x, p.x, 4, 0.016)
    pointer.current.y = THREE.MathUtils.damp(pointer.current.y, p.y, 4, 0.016)
    const g = group.current
    if (!g) return
    const scroll = props.scrollProgress?.current ?? 0
    const targetY = scroll * Math.PI * 2 + pointer.current.x * 0.55
    const targetX = -0.08 + pointer.current.y * 0.28
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3.2, 0.016)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3.2, 0.016)
    g.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.05
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 7.6 - scroll * 1.6, 3, 0.016)
    camera.lookAt(0, 0, 0)
  })

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  return (
    <group
      ref={group}
      position={isMobile ? [0.05, -1.05, 0] : [2.05, -0.6, 0]}
      rotation={[0.06, -0.5, 0]}
      scale={isMobile ? 0.44 : 0.62}
    >
      {/* ===== CUERPO ===== */}
      <RoundedBox args={[3.4, 2.1, 1.7]} radius={0.14} smoothness={6} castShadow receiveShadow>
        <meshStandardMaterial color={BODY} metalness={0.55} roughness={0.42} />
      </RoundedBox>

      {/* placa frontal */}
      <RoundedBox args={[3.05, 1.75, 0.18]} radius={0.08} position={[0, 0, 0.86]}>
        <meshStandardMaterial color={BODY_SOFT} metalness={0.6} roughness={0.35} />
      </RoundedBox>

      {/* empuñadura */}
      <RoundedBox args={[0.62, 1.9, 1.5]} radius={0.22} smoothness={6} position={[1.78, -0.12, 0.08]} rotation={[0, 0, -0.06]}>
        <meshStandardMaterial color="#101013" metalness={0.3} roughness={0.75} />
      </RoundedBox>

      {/* ===== LENTE (izquierda, estilo rig de cine) ===== */}
      <group position={[-0.95, 0.08, 0.95]}>
        {/* montura */}
        <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.72, 0.74, 0.22, 48]} />
          <meshStandardMaterial color={METAL} metalness={0.9} roughness={0.25} />
        </mesh>
        {/* aro naranja RENDER */}
        <mesh position={[0, 0, 0.19]}>
          <torusGeometry args={[0.66, 0.045, 20, 64]} />
          <meshStandardMaterial color={ACCENT} metalness={0.4} roughness={0.3} emissive={ACCENT} emissiveIntensity={0.25} />
        </mesh>
        {/* barril */}
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.58, 0.62, 0.55, 48]} />
          <meshStandardMaterial color="#1d1d21" metalness={0.7} roughness={0.32} />
        </mesh>
        {/* anillos de foco / zoom */}
        {[0.32, 0.5, 0.68].map((z, i) => (
          <mesh key={i} position={[0, 0, z]}>
            <torusGeometry args={[0.6 - i * 0.015, 0.035, 14, 48]} />
            <meshStandardMaterial color="#2c2c31" metalness={0.5} roughness={0.55} />
          </mesh>
        ))}
        {/* cara frontal del lente */}
        <mesh position={[0, 0, 0.79]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.56, 0.12, 48]} />
          <meshStandardMaterial color="#141416" metalness={0.8} roughness={0.28} />
        </mesh>
        {/* vidrio */}
        <group position={[0, 0, 0.86]}>
          <LensGlass />
        </group>
        {/* parasol */}
        <mesh position={[0, 0, 0.98]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.5, 0.22, 48, 1, true]} />
          <meshStandardMaterial color="#0c0c0e" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ===== PARTE SUPERIOR ===== */}
      {/* joroba EVF */}
      <RoundedBox args={[1.25, 0.55, 1.05]} radius={0.12} smoothness={6} position={[-0.6, 1.28, -0.1]}>
        <meshStandardMaterial color={BODY} metalness={0.55} roughness={0.42} />
      </RoundedBox>
      {/* visor ocular */}
      <mesh position={[-0.6, 1.28, -0.68]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.18, 32]} />
        <meshStandardMaterial color="#0c0c0e" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* zapata */}
      <mesh position={[0.75, 1.08, 0.1]}>
        <boxGeometry args={[0.5, 0.06, 0.55]} />
        <meshStandardMaterial color={METAL} metalness={0.9} roughness={0.25} />
      </mesh>
      {/* botón REC superior */}
      <mesh position={[1.15, 1.1, 0.35]}>
        <cylinderGeometry args={[0.09, 0.09, 0.07, 24]} />
        <meshStandardMaterial color="#ff3b30" emissive="#ff3b30" emissiveIntensity={0.5} roughness={0.35} />
      </mesh>
      {/* botones pequeños */}
      {[0.55, 0.78, 1.01].map((x, i) => (
        <mesh key={i} position={[x, 1.08, -0.35]}>
          <cylinderGeometry args={[0.055, 0.055, 0.06, 20]} />
          <meshStandardMaterial color="#2e2e33" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* dial */}
      <mesh position={[-1.35, 1.1, 0.25]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.09, 24]} />
        <meshStandardMaterial color="#26262b" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* rejillas de ventilación */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-0.4 + i * 0.14, 1.06, 0.55]}>
          <boxGeometry args={[0.07, 0.02, 0.28]} />
          <meshStandardMaterial color="#050506" roughness={0.9} />
        </mesh>
      ))}

      {/* ===== TRASERA: pantalla ===== */}
      <RoundedBox args={[2.5, 1.62, 0.1]} radius={0.05} position={[0, 0.1, -0.88]}>
        <meshStandardMaterial color="#0c0c0e" metalness={0.5} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0.1, -0.94]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.3, 1.44]} />
        <meshBasicMaterial map={screenTex} toneMapped={false} />
      </mesh>

      {/* ===== DECAL: isotipo RENDER en la empuñadura ===== */}
      <mesh position={[2.1, 0.1, 0.1]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.55, 0.68]} />
        <meshBasicMaterial map={isotipo} transparent toneMapped={false} opacity={0.95} />
      </mesh>
      {/* decal frontal pequeño */}
      <mesh position={[0.95, 0.62, 0.956]}>
        <planeGeometry args={[0.34, 0.42]} />
        <meshBasicMaterial map={isotipo} transparent toneMapped={false} opacity={0.9} />
      </mesh>

      {/* puertos laterales */}
      {[0.3, 0.62].map((y, i) => (
        <mesh key={i} position={[-1.71, y - 0.4, -0.3]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.28, 0.12]} />
          <meshStandardMaterial color="#050506" roughness={0.8} />
        </mesh>
      ))}

      {/* base / plato */}
      <mesh position={[0, -1.1, 0]}>
        <boxGeometry args={[1.6, 0.12, 1.1]} />
        <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.3} />
      </mesh>
    </group>
  )
}
