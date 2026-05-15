'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useMediaQuery } from '@/hooks/use-media-query';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Simplex 3D (Ashima Arts) + curvas de nivel.
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uMouseInfluence;
  uniform float uLineCount;
  uniform float uLineWidth;
  uniform vec3  uAccent;
  uniform vec3  uBase;

  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 uv = vUv;

    float dist = distance(uv, uMouse);
    float mouseField = smoothstep(0.45, 0.0, dist) * uMouseInfluence;

    float n  = snoise(vec3(uv * 3.0, uTime * 0.3));
    n += snoise(vec3(uv * 6.0, uTime * 0.15)) * 0.5;
    n += mouseField * 0.4;

    float lines = abs(fract(n * uLineCount) - 0.5);
    float aa = fwidth(lines);
    float line = 1.0 - smoothstep(uLineWidth - aa, uLineWidth + aa, lines);

    vec3 col = mix(uBase, uAccent, mouseField * 0.7);
    gl_FragColor = vec4(col * line, line * 0.9);
  }
`;

type TopoUniforms = {
  uTime: { value: number };
  uMouse: { value: THREE.Vector2 };
  uMouseInfluence: { value: number };
  uLineCount: { value: number };
  uLineWidth: { value: number };
  uAccent: { value: THREE.Color };
  uBase: { value: THREE.Color };
};

function TopoPlane({ lineCount, speed }: { lineCount: number; speed: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const targetVec = useRef(new THREE.Vector2());

  // useMemo crea el objeto de uniforms una sola vez; las mutaciones posteriores
  // van vía materialRef.current.uniforms para que la regla
  // react-hooks/immutability no se dispare (los valores de useMemo no se
  // mutan; lo que mutamos es lo que cuelga del material en three.js).
  const initialUniforms = useMemo<TopoUniforms>(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseInfluence: { value: 0.6 },
      uLineCount: { value: lineCount },
      uLineWidth: { value: 0.04 },
      uAccent: { value: new THREE.Color('#7E3FF2') }, // morado — tinte de las líneas cerca del cursor
      uBase: { value: new THREE.Color('#c5c2b5') }, // canvas-200 — gris claro, líneas claramente visibles
    }),
    // los uniforms se inicializan una sola vez; cambios en `lineCount`
    // se aplican vía useFrame leyendo el prop a través del ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state, delta) => {
    const u = materialRef.current?.uniforms as TopoUniforms | undefined;
    if (!u) return;
    u.uTime.value += delta * speed;
    u.uLineCount.value = lineCount;
    targetVec.current.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
    u.uMouse.value.lerp(targetVec.current, 0.08);
    const desired = state.pointer.length() > 0 ? 1 : 0.3;
    u.uMouseInfluence.value = THREE.MathUtils.lerp(u.uMouseInfluence.value, desired, 0.05);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={initialUniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
}

export default function TopographyBg() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  // Líneas más separadas: ~25 desktop, ~15 mobile.
  const lineCount = isMobile ? 15 : 25;
  // Velocidad lenta por defecto; aún más lenta si el sistema pide reducción.
  // Nunca congelamos a 0 — preservamos la "respiración" de la marca pero sin marear.
  const speed = reduced ? 0.01 : 0.025;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1], near: 0.1, far: 10 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        frameloop="always"
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <TopoPlane lineCount={lineCount} speed={speed} />
      </Canvas>
    </div>
  );
}
