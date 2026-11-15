import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  rgb: string;
  glowRadius: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface CosmicDustCanvasProps {
  className?: string;
  particleCount?: number;
  paused?: boolean;
}

export const CosmicDustCanvas: React.FC<CosmicDustCanvasProps> = ({
  className = '',
  particleCount = 130,
  paused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pausedRef = useRef<boolean>(paused);
  pausedRef.current = paused;

  const controlRef = useRef<{ syncPlayback: () => void } | null>(null);

  useEffect(() => {
    controlRef.current?.syncPlayback();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isConstrained =
      window.innerWidth < 768 ||
      (typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 8) <= 4);
    const effectiveCount = isConstrained ? Math.round(particleCount * 0.55) : particleCount;

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      isMoving: false,
      radius: 170,
      radiusSq: 170 * 170,
    };

    let idleTimer: number | null = null;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (pausedRef.current || document.hidden) return;
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (mouse.prevX === -1000) {
        mouse.prevX = clientX;
        mouse.prevY = clientY;
      }

      mouse.targetX = clientX;
      mouse.targetY = clientY;
      mouse.vx = clientX - mouse.prevX;
      mouse.vy = clientY - mouse.prevY;
      mouse.prevX = clientX;
      mouse.prevY = clientY;
      mouse.isMoving = true;

      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        mouse.isMoving = false;
        mouse.vx = 0;
        mouse.vy = 0;
      }, 120);
    };

    const handlePointerLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.vx = 0;
      mouse.vy = 0;
      mouse.isMoving = false;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchstart', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);

    const dustRgb = [
      '56, 189, 248',  // sky-400 cyan
      '147, 197, 253', // blue-300 soft ice
      '255, 255, 255', // pure starlight
      '251, 191, 36',  // cosmic amber gold
      '167, 139, 250', // celestial violet
      '34, 211, 238',  // cyan-400 bright
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < effectiveCount; i++) {
      const size = Math.random() * 2.2 + 0.8;
      const baseAlpha = Math.random() * 0.55 + 0.25;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45 - 0.1,
        size,
        baseAlpha,
        alpha: baseAlpha,
        rgb: dustRgb[Math.floor(Math.random() * dustRgb.length)],
        glowRadius: size * (Math.random() * 1.4 + 2.0),
        pulseSpeed: Math.random() * 0.025 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    const motionQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    let reducedMotion = motionQuery?.matches ?? false;

    let time = 0;
    const webDistSq = 65 * 65;

    const drawFrame = (advanceSimulation: boolean) => {
      if (advanceSimulation) {
        time += 0.02;

        if (mouse.targetX !== -1000) {
          mouse.x += (mouse.targetX - mouse.x) * 0.25;
          mouse.y += (mouse.targetY - mouse.y) * 0.25;
        } else {
          mouse.x = -1000;
          mouse.y = -1000;
        }
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (advanceSimulation) {
          p.x += p.vx;
          p.y += p.vy;

          const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulsePhase);
          p.alpha = p.baseAlpha + pulse * 0.18;
          if (p.alpha < 0.08) p.alpha = 0.08;

          if (mouse.x !== -1000) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < mouse.radiusSq && distSq > 1) {
              const dist = Math.sqrt(distSq);
              const force = 1 - dist / mouse.radius;
              const invDist = 1 / dist;
              const nx = dx * invDist;
              const ny = dy * invDist;

              const push = force * 2.2;
              p.x += nx * push;
              p.y += ny * push;

              // Tangent swirl (rotated 90 deg: -ny, nx) without atan2/sin/cos
              const swirlStrength = force * 0.9;
              p.x += -ny * swirlStrength;
              p.y += nx * swirlStrength;

              if (mouse.isMoving) {
                p.x += mouse.vx * force * 0.12;
                p.y += mouse.vy * force * 0.12;
              }

              p.alpha = Math.min(1.0, p.alpha + force * 0.55);
            }
          }

          if (p.x < -20) p.x = width + 20;
          else if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          else if (p.y > height + 20) p.y = -20;

          p.vx *= 0.995;
          p.vy *= 0.995;
          if (Math.abs(p.vx) < 0.08) p.vx += (Math.random() - 0.5) * 0.1;
          if (Math.abs(p.vy) < 0.08) p.vy += (Math.random() - 0.5) * 0.1;
        }

        // Fast soft outer glow halo (replaces costly software shadowBlur)
        ctx.fillStyle = `rgba(${p.rgb}, ${(p.alpha * 0.22).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Crisp particle body
        ctx.fillStyle = `rgba(${p.rgb}, ${p.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.size > 1.8) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, p.alpha + 0.3).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Fast squared-distance stellar dust web
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          if (dx > 65 || dx < -65) continue;
          const dy = p1.y - p2.y;
          if (dy > 65 || dy < -65) continue;
          const distSq = dx * dx + dy * dy;

          if (distSq < webDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 65) * 0.15 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha.toFixed(3)})`;
            ctx.stroke();
          }
        }
      }
    };

    const stopLoop = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const render = () => {
      if (pausedRef.current || document.hidden || reducedMotion) {
        animationFrameId = null;
        return;
      }
      drawFrame(true);
      animationFrameId = requestAnimationFrame(render);
    };

    const syncPlayback = () => {
      if (pausedRef.current || document.hidden) {
        stopLoop();
        return;
      }
      if (reducedMotion) {
        stopLoop();
        drawFrame(false);
        return;
      }
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    controlRef.current = { syncPlayback };
    drawFrame(false);
    syncPlayback();

    const handleVisibilityChange = () => syncPlayback();
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      syncPlayback();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery?.addEventListener('change', handleMotionChange);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (reducedMotion && !pausedRef.current) {
        drawFrame(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      controlRef.current = null;
      stopLoop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery?.removeEventListener('change', handleMotionChange);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchstart', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      if (idleTimer !== null) clearTimeout(idleTimer);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-10 overflow-hidden ${className} ${
        paused ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
};
