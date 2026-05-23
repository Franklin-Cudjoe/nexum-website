import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type CompanyKey = 'dc' | 'teq';

type NexumSceneProps = {
  activeCompany: CompanyKey;
};

type LatticeProps = {
  activeCompany: CompanyKey;
};

type RailProps = {
  color: string;
  opacity: number;
  points: THREE.Vector3[];
};

const colors = {
  dc: '#d89a43',
  teq: '#62ddff',
  base: '#e9f7ff',
  rail: '#49e59d',
};

function Rail({ color, opacity, points }: RailProps) {
  const rail = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, opacity, transparent: true });

    return new THREE.Line(geometry, material);
  }, [color, opacity, points]);

  return <primitive object={rail} />;
}

function Lattice({ activeCompany }: LatticeProps) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  const points = useMemo(
    () => [
      new THREE.Vector3(-4.4, -1.6, -0.4),
      new THREE.Vector3(-3.1, 1.3, 0.9),
      new THREE.Vector3(-1.4, -0.2, -0.9),
      new THREE.Vector3(0.1, 1.8, 0.5),
      new THREE.Vector3(1.3, -1.2, 1.1),
      new THREE.Vector3(2.9, 0.6, -0.7),
      new THREE.Vector3(4.2, -0.7, 0.2),
    ],
    [],
  );

  const rails = useMemo(
    () => [
      [points[0], points[1], points[2], points[3], points[5], points[6]],
      [points[0], points[2], points[4], points[6]],
      [points[1], points[3], points[4], points[5]],
      [points[2], points[3], points[4]],
    ],
    [points],
  );

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    if (group.current) {
      group.current.rotation.y = Math.sin(elapsed * 0.18) * 0.18;
      group.current.rotation.x = Math.sin(elapsed * 0.12) * 0.08;
    }

    if (inner.current) {
      inner.current.rotation.z = elapsed * 0.08;
      inner.current.position.y = Math.sin(elapsed * 0.9) * 0.12;
    }
  });

  return (
    <group ref={group} position={[0.55, 0, 0]}>
      <group ref={inner}>
        {rails.map((rail, index) => (
          <Rail
            color={index % 2 === 0 ? colors.rail : colors.base}
            key={index}
            opacity={index === 0 ? 0.62 : 0.28}
            points={rail}
          />
        ))}

        {points.map((point, index) => {
          const isDrillingSupply = index < 3;
          const active = activeCompany === (isDrillingSupply ? 'dc' : 'teq');
          const color = active ? (isDrillingSupply ? colors.dc : colors.teq) : colors.base;

          return (
            <mesh key={`${point.x}-${point.y}`} position={point} rotation={[0.6, index * 0.42, 0.8]}>
              {isDrillingSupply ? (
                <cylinderGeometry args={[active ? 0.2 : 0.14, active ? 0.2 : 0.14, active ? 0.34 : 0.24, 6]} />
              ) : (
                <octahedronGeometry args={[active ? 0.24 : 0.16, 0]} />
              )}
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={active ? 1.1 : 0.35}
                metalness={0.45}
                roughness={0.18}
              />
            </mesh>
          );
        })}

        <mesh position={[0.1, 0.2, -0.2]} rotation={[0.4, 0.9, 0.1]}>
          <torusKnotGeometry args={[1.2, 0.03, 160, 10, 2, 5]} />
          <meshStandardMaterial color="#f7fbff" emissive="#49e59d" emissiveIntensity={0.45} metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export default function NexumScene({ activeCompany }: NexumSceneProps) {
  return (
    <div className="scene-wrap" aria-hidden="true">
      <Canvas
        camera={{ fov: 42, position: [0, 0.2, 8.6] }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={['#080b0f']} />
        <ambientLight intensity={0.95} />
        <directionalLight color="#ffffff" intensity={2.3} position={[4, 5, 5]} />
        <pointLight color={activeCompany === 'dc' ? colors.dc : colors.teq} intensity={18} position={[0, 1.2, 3]} />
        <Lattice activeCompany={activeCompany} />
      </Canvas>
    </div>
  );
}
