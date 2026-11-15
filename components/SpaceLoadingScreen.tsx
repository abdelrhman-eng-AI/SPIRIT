import React, { useEffect, useState } from 'react';
import { Rocket, Sparkles } from 'lucide-react';
import { AssetPreloadState } from '../hooks/useAssetPreloader';

interface SpaceLoadingScreenProps {
  preloadState: AssetPreloadState;
}

export const SpaceLoadingScreen: React.FC<SpaceLoadingScreenProps> = ({ preloadState }) => {
  const { progress, settledCount, total, loadedCount, failedCount, isReady, activeLabel } = preloadState;
  const [shouldRender, setShouldRender] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isReady) {
      setShouldRender(true);
      setIsFadingOut(false);
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setShouldRender(false);
      return;
    }

    setIsFadingOut(true);
    const timer = window.setTimeout(() => {
      setShouldRender(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [isReady]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Forgotten Space Relics Explorer"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#03060d] text-slate-100 px-6 select-none transition-opacity duration-500 ease-out motion-reduce:transition-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient Cosmic Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(6, 182, 212, 0.16) 0%, rgba(15, 23, 42, 0.45) 45%, #020409 100%)',
        }}
      />

      {/* Subtle Orbital Frame & Central Beacon */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-orbit-spin motion-reduce:animate-none" />
          <div className="absolute inset-2.5 rounded-full border border-dashed border-sky-400/25" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-950/90 border border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.35)] flex items-center justify-center">
            <Rocket className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-300 motion-safe:animate-pulse" />
          </div>
        </div>

        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>SPIRIT EL TEAM Observatory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Forgotten Space Relics Archive
          </h1>
          <p className="text-xs text-slate-400 font-mono">{activeLabel}</p>
        </div>

        {/* Real Settled Asset Progress Bar */}
        <div className="w-full space-y-2">
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden shadow-inner"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-[width] duration-300 ease-out motion-reduce:transition-none shadow-[0_0_12px_rgba(34,211,238,0.65)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>
              Critical Assets: {settledCount} / {total}
              {failedCount > 0 ? ` (${loadedCount} loaded, ${failedCount} fallback)` : ''}
            </span>
            <span className="text-cyan-300 font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
