import React, { useEffect, useRef } from 'react';
import { SpacecraftRelic } from '../types';

export type PlanetWeatherType =
  | 'mars_dust'
  | 'ice_crystals'
  | 'venus_acid'
  | 'jupiter_storms'
  | 'lunar_dust'
  | 'solar_wind';

export interface PlanetWeatherConfig {
  type: PlanetWeatherType;
  label: string;
  conditionBadge: string;
  windLabel: string;
  accentColor: string;
  badgeClass: string;
  description: string;
}

export function getPlanetWeatherConfig(relic: SpacecraftRelic): PlanetWeatherConfig {
  const id = relic.id.toLowerCase();
  const body = (relic.celestialBody.id || relic.celestialBody.name).toLowerCase();

  if (
    body.includes('mars') ||
    id.includes('sojourner') ||
    id.includes('spirit') ||
    id.includes('opportunity')
  ) {
    return {
      type: 'mars_dust',
      label: 'Light Martian Dust Storm',
      conditionBadge: 'Iron Oxide Dust 🌪️',
      windLabel: 'Westerly Winds 28 km/h',
      accentColor: '#fb923c',
      badgeClass: 'bg-orange-950/80 border-orange-500/40 text-orange-300',
      description: 'Fine red Martian sand particles drifting across the low-pressure atmosphere.',
    };
  }

  if (
    body.includes('comet') ||
    body.includes('halley') ||
    body.includes('67p') ||
    id.includes('philae') ||
    id.includes('giotto')
  ) {
    return {
      type: 'ice_crystals',
      label: 'Ice Crystals & Vapor Jets',
      conditionBadge: 'Ice Crystals ❄️',
      windLabel: 'Active Sublimation',
      accentColor: '#38bdf8',
      badgeClass: 'bg-cyan-950/80 border-cyan-400/40 text-cyan-200',
      description: 'Shimmering ice crystals and vapor plumes venting from the frozen comet core.',
    };
  }

  if (body.includes('venus') || id.includes('venera') || id.includes('magellan')) {
    return {
      type: 'venus_acid',
      label: 'Dense Sulfuric Acid Clouds',
      conditionBadge: 'Scorching Acid Haze 🌫️',
      windLabel: 'Super-Rotation 350 km/h',
      accentColor: '#facc15',
      badgeClass: 'bg-amber-950/80 border-amber-400/40 text-amber-200',
      description: 'Golden sulfuric acid cloud droplets swirling under crushing atmospheric pressure.',
    };
  }

  if (body.includes('jupiter') || id.includes('galileo')) {
    return {
      type: 'jupiter_storms',
      label: 'Ammonia Jet Streams & Storms',
      conditionBadge: 'Jovian Tempest ⚡',
      windLabel: 'Cyclones 420 km/h',
      accentColor: '#f59e0b',
      badgeClass: 'bg-amber-950/85 border-orange-500/50 text-amber-300',
      description: 'Fierce ammonia wind currents illuminated by deep atmospheric lightning flashes.',
    };
  }

  if (body.includes('moon') || body.includes('lunar') || id.includes('surveyor') || id.includes('apollo')) {
    return {
      type: 'lunar_dust',
      label: 'Electrostatic Lunar Dust',
      conditionBadge: 'Lunar Vacuum 🌑',
      windLabel: 'Zero Wind (0 km/h)',
      accentColor: '#e2e8f0',
      badgeClass: 'bg-slate-900/85 border-slate-500/40 text-slate-200',
      description: 'Microscopic lunar dust motes floating slowly above the surface via solar static charge.',
    };
  }

  return {
    type: 'solar_wind',
    label: 'Solar Wind & Cosmic Rays',
    conditionBadge: 'Cosmic Plasma ✨',
    windLabel: 'Solar Wind 450 km/s',
    accentColor: '#38bdf8',
    badgeClass: 'bg-sky-950/80 border-sky-400/40 text-sky-300',
    description: 'Ionized solar plasma particles streaming through deep interstellar space.',
  };
}

interface PlanetWeatherCanvasProps {
  weatherType: PlanetWeatherType;
  intensity?: 'ambient' | 'viewport';
  className?: string;
}

interface WeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  rotation: number;
  rotSpeed: number;
  length: number;
  color: string;
}

export const PlanetWeatherCanvas: React.FC<PlanetWeatherCanvasProps> = ({
  weatherType,
  intensity = 'viewport',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number | null = null;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const motionQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    let reducedMotion = motionQuery?.matches ?? false;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      if (reducedMotion) {
        drawFrame(false);
      }
    };
    window.addEventListener('resize', handleResize);

    const isAmbient = intensity === 'ambient';
    const isConstrained =
      window.innerWidth < 768 ||
      (typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 8) <= 4);
    const scaleFactor = isConstrained ? 0.65 : 1;

    const countMap: Record<PlanetWeatherType, number> = {
      mars_dust: Math.round((isAmbient ? 45 : 85) * scaleFactor),
      ice_crystals: Math.round((isAmbient ? 36 : 70) * scaleFactor),
      venus_acid: Math.round((isAmbient ? 30 : 52) * scaleFactor),
      jupiter_storms: Math.round((isAmbient ? 40 : 75) * scaleFactor),
      lunar_dust: Math.round((isAmbient ? 28 : 48) * scaleFactor),
      solar_wind: Math.round((isAmbient ? 34 : 58) * scaleFactor),
    };

    // Pre-cache soft radial glow sprites for Venus clouds so we don't allocate gradients per frame
    const venusSprites = new Map<string, HTMLCanvasElement>();
    if (weatherType === 'venus_acid') {
      const spriteColors = ['#fef08a', '#facc15', '#eab308', '#fde047'];
      spriteColors.forEach((c) => {
        const off = document.createElement('canvas');
        off.width = 64;
        off.height = 64;
        const octx = off.getContext('2d');
        if (octx) {
          const grad = octx.createRadialGradient(32, 32, 0, 32, 32, 32);
          grad.addColorStop(0, c);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          octx.fillStyle = grad;
          octx.fillRect(0, 0, 64, 64);
        }
        venusSprites.set(c, off);
      });
    }

    const particleCount = countMap[weatherType];
    const particles: WeatherParticle[] = [];

    const createParticle = (randomX = true): WeatherParticle => {
      switch (weatherType) {
        case 'mars_dust': {
          const colors = ['#fdba74', '#fb923c', '#ea580c', '#fca5a5'];
          return {
            x: randomX ? Math.random() * width : -20,
            y: Math.random() * height,
            vx: 0.35 + Math.random() * 0.55,
            vy: (Math.random() - 0.5) * 0.22,
            size: Math.random() * 1.4 + 0.5,
            alpha: (isAmbient ? 0.16 : 0.28) * (0.5 + Math.random() * 0.5),
            rotation: 0,
            rotSpeed: 0,
            length: 0,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
        }
        case 'ice_crystals': {
          const colors = ['#e0f2fe', '#7dd3fc', '#bae6fd', '#ffffff'];
          return {
            x: Math.random() * width,
            y: randomX ? Math.random() * height : -15,
            vx: (Math.random() - 0.5) * 0.9,
            vy: 0.7 + Math.random() * 1.2,
            size: Math.random() * 3.5 + 2.0,
            alpha: (isAmbient ? 0.35 : 0.75) * (0.5 + Math.random() * 0.5),
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.035,
            length: 0,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
        }
        case 'venus_acid': {
          const colors = ['#fef08a', '#facc15', '#eab308', '#fde047'];
          return {
            x: randomX ? Math.random() * width : -30,
            y: Math.random() * height,
            vx: 0.9 + Math.random() * 1.1,
            vy: 0.25 + Math.random() * 0.45,
            size: Math.random() * 16 + 8,
            alpha: (isAmbient ? 0.06 : 0.14) * (0.5 + Math.random() * 0.5),
            rotation: 0,
            rotSpeed: 0,
            length: 0,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
        }
        case 'jupiter_storms': {
          const colors = ['#fde68a', '#f59e0b', '#fbbf24', '#fed7aa'];
          return {
            x: randomX ? Math.random() * width : -40,
            y: Math.random() * height,
            vx: 3.4 + Math.random() * 3.6,
            vy: Math.sin(Math.random() * Math.PI) * 0.5,
            size: Math.random() * 2.2 + 1.0,
            alpha: (isAmbient ? 0.25 : 0.55) * (0.5 + Math.random() * 0.5),
            rotation: 0,
            rotSpeed: 0,
            length: 20 + Math.random() * 35,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
        }
        case 'lunar_dust': {
          const colors = ['#f8fafc', '#cbd5e1', '#e2e8f0'];
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: -0.15 - Math.random() * 0.2,
            size: Math.random() * 1.8 + 0.6,
            alpha: (isAmbient ? 0.22 : 0.45) * (0.4 + Math.random() * 0.6),
            rotation: 0,
            rotSpeed: 0,
            length: 0,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
        }
        case 'solar_wind':
        default: {
          const colors = ['#38bdf8', '#818cf8', '#a5f3fc', '#c084fc'];
          return {
            x: randomX ? Math.random() * width : -25,
            y: Math.random() * height,
            vx: 2.2 + Math.random() * 2.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 1.8 + 0.8,
            alpha: (isAmbient ? 0.22 : 0.5) * (0.5 + Math.random() * 0.5),
            rotation: 0,
            rotSpeed: 0,
            length: 14 + Math.random() * 22,
            color: colors[Math.floor(Math.random() * colors.length)],
          };
        }
      }
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    let time = 0;
    let lightningAlpha = 0;
    let lastAmbientTime = 0;

    const drawCrystal = (x: number, y: number, r: number, rot: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.1;

      for (let k = 0; k < 3; k++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.lineTo(r, 0);
        ctx.stroke();
      }
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawFrame = (advance: boolean) => {
      if (advance) {
        time += isAmbient ? 0.032 : 0.02;
      }

      ctx.clearRect(0, 0, width, height);

      if (advance && weatherType === 'jupiter_storms' && !isAmbient) {
        if (Math.random() < 0.008) {
          lightningAlpha = 0.22;
        }
        if (lightningAlpha > 0.005) {
          ctx.fillStyle = `rgba(254, 240, 138, ${lightningAlpha})`;
          ctx.fillRect(0, 0, width, height);
          lightningAlpha *= 0.85;
        }
      }

      const stepMul = isAmbient ? 1.5 : 1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (advance) {
          p.x += p.vx * stepMul;
          p.y += (p.vy + (weatherType === 'mars_dust' ? Math.sin(time * 2 + i) * 0.35 : 0)) * stepMul;
          p.rotation += p.rotSpeed * stepMul;

          if (p.x > width + 45) {
            p.x = -35;
            p.y = Math.random() * height;
          } else if (p.x < -45) {
            p.x = width + 35;
          }
          if (p.y > height + 30) {
            p.y = -20;
            p.x = Math.random() * width;
          } else if (p.y < -30) {
            p.y = height + 20;
          }
        }

        if (weatherType === 'ice_crystals') {
          const twinkle = 0.7 + 0.3 * Math.sin(time * 3 + i);
          drawCrystal(p.x, p.y, p.size, p.rotation, p.color, p.alpha * twinkle);
        } else if (weatherType === 'venus_acid') {
          const sprite = venusSprites.get(p.color);
          if (sprite) {
            ctx.globalAlpha = p.alpha;
            ctx.drawImage(sprite, p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
          }
        } else if (weatherType === 'jupiter_storms' || weatherType === 'solar_wind') {
          ctx.globalAlpha = p.alpha;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.x - p.length, p.y - p.vy * 3);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = p.alpha * (0.65 + 0.35 * Math.sin(time * 1.5 + i));
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const stopLoop = () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const render = (now: number) => {
      if (document.hidden || reducedMotion) {
        animId = null;
        return;
      }
      animId = requestAnimationFrame(render);

      if (isAmbient && now - lastAmbientTime < 32) {
        return;
      }
      lastAmbientTime = now;
      drawFrame(true);
    };

    const syncPlayback = () => {
      if (document.hidden) {
        stopLoop();
        return;
      }
      if (reducedMotion) {
        stopLoop();
        drawFrame(false);
        return;
      }
      if (animId === null) {
        animId = requestAnimationFrame(render);
      }
    };

    drawFrame(false);
    syncPlayback();

    const handleVisibilityChange = () => syncPlayback();
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      syncPlayback();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery?.addEventListener('change', handleMotionChange);

    return () => {
      stopLoop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery?.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleResize);
    };
  }, [weatherType, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};
