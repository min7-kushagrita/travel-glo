import { useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, OrbitControls, Stars, useTexture } from '@react-three/drei'
import { Earth } from 'lucide-react'
import * as THREE from 'three'
import { places, visitedPlaces, wishlistPlaces } from './data.js'

const EARTH_MAP = 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
const EARTH_BUMP = 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'

function latLngToVector(latitude, longitude, radius = 1.015) {
  const lat = THREE.MathUtils.degToRad(latitude)
  const lon = THREE.MathUtils.degToRad(longitude) + Math.PI
  return new THREE.Vector3(
    -radius * Math.cos(lat) * Math.sin(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.cos(lon),
  )
}

function DestinationPin({ place, selected, onSelect }) {
  const point = useMemo(() => latLngToVector(...place.coordinates), [place.coordinates])
  const orientation = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), point.clone().normalize()), [point])
  const wishlistRing = useMemo(() => Array.from({ length: 49 }, (_, index) => {
    const angle = (index / 48) * Math.PI * 2
    return new THREE.Vector3(Math.cos(angle) * 0.12, Math.sin(angle) * 0.12, 0)
  }), [])
  const wishlist = place.kind === 'wishlist'

  return (
    <group position={point} quaternion={orientation}>
      <mesh onClick={(event) => { event.stopPropagation(); onSelect(place) }}>
        <sphereGeometry args={[0.045, 18, 18]} />
        <meshBasicMaterial color={wishlist ? '#72d4ca' : '#ffd47f'} />
      </mesh>
      <mesh>
        <sphereGeometry args={[selected ? 0.105 : 0.08, 18, 18]} />
        <meshBasicMaterial color={wishlist ? '#72d4ca' : '#ffc967'} transparent opacity={wishlist ? 0.12 : 0.2} />
      </mesh>
      {wishlist && (
        <Line points={wishlistRing} color="#72d4ca" lineWidth={1.4} dashed dashSize={0.015} gapSize={0.012} transparent opacity={0.85} />
      )}
      <mesh position={[0, 0, 0.018]} onClick={(event) => { event.stopPropagation(); onSelect(place) }}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

function EarthMesh({ selected, onSelect }) {
  const [colorMap, bumpMap] = useTexture([EARTH_MAP, EARTH_BUMP])
  colorMap.colorSpace = THREE.SRGBColorSpace
  const textureRotation = useMemo(() => new THREE.Euler(0, 0, 0), [])
  return (
    <group rotation={textureRotation}>
      <mesh>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial map={colorMap} bumpMap={bumpMap} bumpScale={0.025} roughness={0.88} metalness={0.04} />
      </mesh>
      <mesh scale={1.035}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#42a9b0" transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>
      {places.map((place) => (
        <DestinationPin key={place.id} place={place} selected={selected?.id === place.id} onSelect={onSelect} />
      ))}
    </group>
  )
}

function CameraFlight({ selected, controlsRef, resetSignal }) {
  const { camera } = useThree()
  const destination = useMemo(() => new THREE.Vector3(), [])
  const lookAt = useMemo(() => new THREE.Vector3(), [])
  const currentTarget = useMemo(() => new THREE.Vector3(), [])
  const flightProgress = useMemo(() => ({ active: false }), [])

  useEffect(() => {
    if (!selected) {
      destination.set(0, 0, 3.4)
      lookAt.set(0, 0, 0)
    } else {
      destination.copy(latLngToVector(...selected.coordinates, 2.35))
      lookAt.set(0, 0, 0)
    }
    flightProgress.active = true
  }, [selected, resetSignal, destination, lookAt, flightProgress])

  useFrame((_, delta) => {
    if (!flightProgress.active) return
    const alpha = 1 - Math.exp(-delta * 2.4)
    camera.position.lerp(destination, alpha)
    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookAt, alpha)
      controlsRef.current.update()
      currentTarget.copy(controlsRef.current.target)
    }
    if (camera.position.distanceTo(destination) < 0.012 && currentTarget.distanceTo(lookAt) < 0.012) {
      camera.position.copy(destination)
      if (controlsRef.current) controlsRef.current.target.copy(lookAt)
      flightProgress.active = false
    }
  })
  return null
}

function Globe({ selected, onSelect, resetSignal }) {
  const controlsRef = React.useRef()
  return (
    <Canvas camera={{ position: [0, 0, 3.4], fov: 42 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={['#07111b']} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[-4, 2, 5]} intensity={2.6} color="#d7e7eb" />
      <directionalLight position={[4, -2, -4]} intensity={0.55} color="#56b8bd" />
      <Stars radius={80} depth={50} count={2200} factor={3} saturation={0.25} fade speed={0.18} />
      <React.Suspense fallback={null}>
        <EarthMesh selected={selected} onSelect={onSelect} />
      </React.Suspense>
      <OrbitControls ref={controlsRef} enablePan={false} enableDamping dampingFactor={0.06} minDistance={1.55} maxDistance={5.4} rotateSpeed={0.42} zoomSpeed={0.72} />
      <CameraFlight selected={selected} controlsRef={controlsRef} resetSignal={resetSignal} />
    </Canvas>
  )
}

function App() {
  const [selected, setSelected] = useState(places[0])
  const [query, setQuery] = useState('')
  const [resetSignal, setResetSignal] = useState(0)
  const [searchMessage, setSearchMessage] = useState('')
  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    return places.filter((place) => `${place.name} ${place.country}`.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  function selectPlace(place) {
    setSelected(place)
    setQuery('')
    setSearchMessage('')
  }

  function submitSearch(event) {
    event.preventDefault()
    const match = suggestions[0] ?? places.find((place) => place.name.toLowerCase() === query.trim().toLowerCase())
    if (match) selectPlace(match)
    else setSearchMessage(query.trim() ? 'Try Kyoto, Paris, Goa, or Switzerland' : '')
  }

  function resetGlobe() {
    setSelected(null)
    setResetSignal((value) => value + 1)
  }

  return (
    <main className="app-shell">
      <div className="star-wash" aria-hidden="true" />
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Atlas of Elsewhere home">
          <span className="wordmark-mark"><Earth size={19} strokeWidth={1.5} /></span>
          <span>ATLAS <i>OF</i> ELSEWHERE</span>
        </a>
        <div className="topbar-note"><span className="live-dot" /> YOUR WORLD, REMEMBERED</div>
        <button className="avatar-button" aria-label="Profile">M</button>
      </header>

      <section className="stage" id="home" aria-label="Interactive travel globe">
        <div className="stage-copy">
          <p className="eyebrow">A PERSONAL ATLAS <span>·</span> EST. 2022</p>
          <h1>Everywhere<br /><em>stays with you.</em></h1>
          <p className="stage-description">A small world of places you've been<br />and places that are calling.</p>
        </div>

        <div className="globe-wrap">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="globe-canvas"><Globe selected={selected} onSelect={selectPlace} resetSignal={resetSignal} /></div>
          <div className="globe-caption"><span className="caption-line" /> DRAG TO TURN <span className="caption-dot">·</span> SCROLL TO EXPLORE</div>
        </div>

        <aside className="place-panel glass-panel" aria-live="polite">
          <div className="panel-topline">
            <span className={`place-type ${selected?.kind ?? 'visited'}`}><span />{selected?.kind === 'wishlist' ? 'ON THE WISH LIST' : selected ? 'PERSONAL MEMORY' : 'THE WHOLE WORLD'}</span>
            <button className="icon-button reset-button" onClick={resetGlobe} aria-label="Reset globe" title="Reset globe">↺</button>
          </div>
          <div className="place-heading">
            <div>
              <h2>{selected?.name ?? 'Earth'}</h2>
              <p>{selected ? selected.country : 'All the places, all at once'}</p>
            </div>
            {selected && <span className="place-date">{selected.date}</span>}
          </div>
          <div className="place-image" style={{ backgroundImage: selected ? `linear-gradient(180deg, transparent 46%, rgba(5, 13, 20, .54)), url("${selected.image}")` : undefined }}>
            {!selected && <span className="image-placeholder">A world of your own</span>}
          </div>
          <p className="place-note">“{selected?.note ?? 'Choose a pin or search for a place to begin.'}”</p>
          {selected && <p className="place-detail">{selected.detail}</p>}
          <div className="panel-rule" />
          <div className="panel-footer">
            <span><i className={selected?.kind === 'wishlist' ? 'legend-ring wishlist-ring' : 'legend-ring'} />{selected?.kind === 'wishlist' ? 'DREAMING OF' : 'REMEMBERING'}</span>
            <span className="coordinates">{selected ? `${Math.abs(selected.coordinates[0]).toFixed(1)}° ${selected.coordinates[0] >= 0 ? 'N' : 'S'}  /  ${Math.abs(selected.coordinates[1]).toFixed(1)}° ${selected.coordinates[1] >= 0 ? 'E' : 'W'}` : 'EARTH · 001'}</span>
          </div>
        </aside>

        <form className="search-box glass-panel" onSubmit={submitSearch} role="search">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => { setQuery(event.target.value); setSearchMessage('') }} placeholder="Find a place..." aria-label="Search places" />
          <kbd>↵</kbd>
          {query && <div className="search-results">
            {suggestions.length ? suggestions.map((place) => (
              <button type="button" key={place.id} onClick={() => selectPlace(place)}>
                <span className={`result-dot ${place.kind}`} />
                <span>{place.name}<small>{place.country}</small></span>
                <span className="result-kind">{place.kind === 'visited' ? 'MEMORY' : 'WISHLIST'}</span>
              </button>
            )) : <p>{searchMessage || 'Kyoto · Paris · Goa · Switzerland'}</p>}
          </div>}
        </form>

        <div className="collection-summary glass-panel">
          <div className="summary-group"><span className="summary-number">0{visitedPlaces.length}</span><span className="summary-label">PLACES<br />REMEMBERED</span></div>
          <div className="summary-divider" />
          <div className="summary-group"><span className="summary-number teal-number">0{wishlistPlaces.length}</span><span className="summary-label">PLACES<br />DREAMED OF</span></div>
        </div>

        <div className="legend glass-panel">
          <span><i className="legend-ring" /> VISITED</span>
          <span><i className="legend-ring wishlist-ring" /> WISHLIST</span>
        </div>
      </section>

      <footer className="bottom-bar">
        <span className="footer-left">A LIVING COLLECTION OF LITTLE ELSEWHERES</span>
        <div className="footer-nav"><span className="nav-active">01 <b>THE GLOBE</b></span><span>02 <b>MEMORIES</b></span><span>03 <b>WISHLIST</b></span></div>
        <span className="footer-right">{new Date().getFullYear()} <span>·</span> MADE OF MILES</span>
      </footer>
    </main>
  )
}

export default App