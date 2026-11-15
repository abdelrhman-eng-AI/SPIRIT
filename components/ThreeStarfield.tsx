import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeStarfieldProps {
  className?: string;
  speed?: number;
  starCount?: number;
  paused?: boolean;
}

export const ThreeStarfield: React.FC<ThreeStarfieldProps> = ({
  className = '',
  speed = 1.0,
  starCount = 1800,
  paused = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef<boolean>(paused);
  pausedRef.current = paused;

  const controlRef = useRef<{ syncPlayback: () => void } | null>(null);

  useEffect(() => {
    controlRef.current?.syncPlayback();
  }, [paused]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Adapt particle budget slightly for compact screens or low-core hardware
    const isConstrained =
      window.innerWidth < 768 ||
      (typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 8) <= 4);
    const effectiveStarCount = isConstrained ? Math.round(starCount * 0.6) : starCount;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.z = 400;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Performance optimized for starfield
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Mouse tracking for parallax
    const targetMouse = { x: 0, y: 0 };
    const currentMouse = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      if (pausedRef.current || document.hidden) return;
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // ================= 1. MULTI-LAYER TWINKLING STARS SHADER =================
    const starVertexShader = `
      attribute float aScale;
      attribute float aTwinkleSpeed;
      attribute float aTwinkleOffset;
      attribute vec3 aColor;

      uniform float uTime;
      uniform vec2 uMouseOffset;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = aColor;

        float twinkle = 0.4 + 0.6 * sin(uTime * aTwinkleSpeed + aTwinkleOffset);
        vAlpha = twinkle;

        vec3 pos = position;
        pos.x += uMouseOffset.x * (500.0 - pos.z) * 0.08;
        pos.y += uMouseOffset.y * (500.0 - pos.z) * 0.08;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        gl_PointSize = aScale * (180.0 / -mvPosition.z) * (0.8 + 0.4 * twinkle);
      }
    `;

    const starFragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;

        float intensity = pow(1.0 - (dist * 2.0), 2.0);
        gl_FragColor = vec4(vColor, intensity * vAlpha);
      }
    `;

    // Geometry buffers
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(effectiveStarCount * 3);
    const colors = new Float32Array(effectiveStarCount * 3);
    const scales = new Float32Array(effectiveStarCount);
    const twinkleSpeeds = new Float32Array(effectiveStarCount);
    const twinkleOffsets = new Float32Array(effectiveStarCount);

    const starColors = [
      new THREE.Color('#38bdf8'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#fbbf24'),
      new THREE.Color('#a78bfa'),
      new THREE.Color('#67e8f9'),
    ];

    for (let i = 0; i < effectiveStarCount; i++) {
      const radius = 250 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 200;

      const chosenColor = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      scales[i] = 1.4 + Math.random() * 3.8;
      twinkleSpeeds[i] = 1.2 + Math.random() * 3.5;
      twinkleOffsets[i] = Math.random() * Math.PI * 2;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    starGeo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    starGeo.setAttribute('aTwinkleSpeed', new THREE.BufferAttribute(twinkleSpeeds, 1));
    starGeo.setAttribute('aTwinkleOffset', new THREE.BufferAttribute(twinkleOffsets, 1));

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouseOffset: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starPoints = new THREE.Points(starGeo, starMaterial);
    scene.add(starPoints);

    // ================= 2. FOREGROUND ACCENT DRIFTING PARTICLES =================
    const dustCount = isConstrained ? 45 : 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 600;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 600;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 400 + 100;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 3,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // ================= ANIMATION LOOP =================
    let animationFrameId: number | null = null;
    const clock = new THREE.Clock();
    const motionQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    let reducedMotion = motionQuery?.matches ?? false;

    const renderFrame = (elapsedTime: number) => {
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.04;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.04;

      starMaterial.uniforms.uTime.value = elapsedTime;
      starMaterial.uniforms.uMouseOffset.value.set(currentMouse.x, currentMouse.y);

      starPoints.rotation.y = elapsedTime * 0.015;
      starPoints.rotation.x = currentMouse.y * 0.04;
      starPoints.rotation.z = -currentMouse.x * 0.04;

      dustParticles.rotation.y = -elapsedTime * 0.025;
      dustParticles.position.x = currentMouse.x * 25;
      dustParticles.position.y = currentMouse.y * 25;

      renderer.render(scene, camera);
    };

    const stopLoop = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const animate = () => {
      if (pausedRef.current || document.hidden || reducedMotion) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime() * speed;
      renderFrame(elapsedTime);
    };

    const syncPlayback = () => {
      if (pausedRef.current || document.hidden) {
        stopLoop();
        return;
      }
      if (reducedMotion) {
        stopLoop();
        renderFrame(0);
        return;
      }
      if (animationFrameId === null) {
        clock.getDelta(); // reset delta gap after pause
        animate();
      }
    };

    controlRef.current = { syncPlayback };
    renderFrame(0);
    syncPlayback();

    const handleVisibilityChange = () => syncPlayback();
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      syncPlayback();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery?.addEventListener('change', handleMotionChange);

    // ================= RESIZE LISTENER =================
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(w, h);
      if (reducedMotion && !pausedRef.current) {
        renderFrame(0);
      }
    };

    window.addEventListener('resize', handleResize);

    // ================= CLEANUP =================
    return () => {
      controlRef.current = null;
      stopLoop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery?.removeEventListener('change', handleMotionChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      starGeo.dispose();
      starMaterial.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
    };
  }, [speed, starCount]);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className} ${
        paused ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    />
  );
};
