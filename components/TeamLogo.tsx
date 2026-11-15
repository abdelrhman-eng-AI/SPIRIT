import React, { useState } from 'react';
import { Rocket } from 'lucide-react';
import { useIsAssetFailed } from '../context/AssetPreloadContext';

const TEAM_EMBLEM_URL = '/assets/images/spirit_el_team_emblem_1792422933263.jpg';

interface TeamLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  withGlow?: boolean;
}

const SIZE_CONFIG = {
  sm: { classes: 'w-12 h-12', px: 48, sizes: '48px', iconClass: 'w-5 h-5' },
  md: { classes: 'w-20 h-20', px: 80, sizes: '80px', iconClass: 'w-8 h-8' },
  lg: { classes: 'w-36 h-36', px: 144, sizes: '144px', iconClass: 'w-12 h-12' },
  hero: {
    classes: 'w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80',
    px: 320,
    sizes: '(max-width: 640px) 240px, (max-width: 768px) 288px, 320px',
    iconClass: 'w-20 h-20',
  },
} as const;

export const TeamLogo: React.FC<TeamLogoProps> = ({
  size = 'hero',
  className = '',
  withGlow = true,
}) => {
  const preloadFailed = useIsAssetFailed(TEAM_EMBLEM_URL);
  const [hasImageError, setHasImageError] = useState(false);
  const showFallback = preloadFailed || hasImageError;
  const config = SIZE_CONFIG[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Outer Cosmic Red/Silver Aura Glow */}
      {withGlow && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-600/30 via-orange-500/25 to-cyan-400/20 blur-2xl animate-pulse-glow" />
      )}

      {/* Rotating Silver Celestial Ring Accent */}
      {size === 'hero' && (
        <div className="absolute -inset-4 sm:-inset-6 rounded-full border border-slate-400/20 pointer-events-none animate-orbit-spin" />
      )}

      {/* Main Emblem Container */}
      <div
        className={`relative ${config.classes} aspect-square rounded-full p-1.5 bg-gradient-to-b from-slate-200 via-slate-400 to-slate-700 shadow-[0_10px_35px_rgba(0,0,0,0.8)] border border-slate-300/40 overflow-hidden group`}
      >
        {/* Inner Dark Rim */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-950 border border-slate-600/40 flex items-center justify-center">
          {!showFallback ? (
            <img
              src={TEAM_EMBLEM_URL}
              alt="SPIRIT EL TEAM Official Mission Emblem"
              width={config.px}
              height={config.px}
              sizes={config.sizes}
              loading="eager"
              decoding="async"
              fetchPriority={size === 'hero' ? 'high' : 'auto'}
              onError={() => setHasImageError(true)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black text-cyan-300">
              <Rocket className={config.iconClass} aria-hidden="true" />
              {size === 'hero' && (
                <span className="mt-2 text-xs font-mono font-bold tracking-widest text-slate-200">
                  SPIRIT EL TEAM
                </span>
              )}
            </div>
          )}

          {/* Shimmer sweep effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </div>
      </div>
    </div>
  );
};
