import React, { useRef, useState, useEffect, useCallback } from 'react';
import { SpacecraftRelic, CharacterCustomization } from '../types';
import { soundEffects } from '../services/soundEffects';
import { Volume2, VolumeX, RotateCcw, FastForward, Compass } from 'lucide-react';

interface WormholeTransitionProps {
  character: CharacterCustomization;
  targetRelic: SpacecraftRelic;
  onTransitionComplete: () => void;
}

const TRANSITION_VIDEO_SRC =
  '/assets/aistudio/Spaceship_flies_toward_planet_415c70a7_d7eddebd.mp4';
const TRANSITION_POSTER_SRC =
  '/assets/aistudio/WhatsApp_Image_2026-11-12_at_2.13.31_AM_a112763e.jpeg';

export const WormholeTransition: React.FC<WormholeTransitionProps> = ({
  character,
  targetRelic,
  onTransitionComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const completionTimeoutRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);

  const [isMuted, setIsMuted] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const isJupiterFlyby =
    targetRelic.id === 'pioneer-10-11' || targetRelic.celestialBody.id === 'jupiter-flyby';

  const clearCompletionTimer = useCallback(() => {
    if (completionTimeoutRef.current !== null) {
      window.clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
  }, []);

  const releaseVideoBuffers = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.pause();
      video.removeAttribute('src');
      video.load();
    } catch {
      // ignore media cleanup errors
    }
  }, []);

  const finishTransition = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    clearCompletionTimer();
    releaseVideoBuffers();
    soundEffects.playWarp();
    onTransitionComplete();
  }, [clearCompletionTimer, onTransitionComplete, releaseVideoBuffers]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    soundEffects.playRadioChirp();

    if (prefersReducedMotion) {
      // Gentle, brief arrival settle when user prefers reduced motion (no jarring autoplay flash)
      completionTimeoutRef.current = window.setTimeout(() => {
        finishTransition();
      }, 1200);
    } else if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay handled gracefully
      });
    }

    return () => {
      clearCompletionTimer();
      releaseVideoBuffers();
    };
  }, [prefersReducedMotion, clearCompletionTimer, finishTransition, releaseVideoBuffers]);

  const handleVideoEnded = () => {
    if (hasCompletedRef.current) return;
    setHasEnded(true);
    soundEffects.playWarp();
    clearCompletionTimer();
    completionTimeoutRef.current = window.setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        releaseVideoBuffers();
        onTransitionComplete();
      }
    }, 650);
  };

  const handleReplay = () => {
    clearCompletionTimer();
    hasCompletedRef.current = false;
    setHasEnded(false);
    if (videoRef.current) {
      if (!videoRef.current.getAttribute('src')) {
        videoRef.current.setAttribute('src', TRANSITION_VIDEO_SRC);
        videoRef.current.load();
      }
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay handled
      });
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black text-slate-100 overflow-hidden select-none font-sans p-0 m-0 border-0">
      {/* 1. FULL-BLEED BORDERLESS VIDEO - NATURAL, NO COLORED DOTS OVERLAY */}
      <div className="absolute inset-0 w-full h-full p-0 m-0 border-0 rounded-none overflow-hidden bg-black flex items-center justify-center">
        {prefersReducedMotion ? (
          <img
            src={TRANSITION_POSTER_SRC}
            alt="Spacecraft approaching target"
            sizes="100vw"
            decoding="async"
            className="block w-screen h-screen object-cover border-0 outline-none m-0 p-0 rounded-none opacity-85"
          />
        ) : (
          <video
            ref={videoRef}
            src={TRANSITION_VIDEO_SRC}
            poster={TRANSITION_POSTER_SRC}
            preload="auto"
            className="block w-screen h-screen object-cover border-0 outline-none m-0 p-0 rounded-none"
            autoPlay
            muted={isMuted}
            playsInline
            onEnded={handleVideoEnded}
          />
        )}

        {/* Cinematic smooth fade transition when video reaches the event horizon end */}
        {hasEnded && !prefersReducedMotion && (
          <div className="absolute inset-0 z-20 bg-gradient-to-tr from-cyan-400 via-white to-amber-300 motion-safe:animate-pulse mix-blend-screen opacity-90 transition-opacity duration-500 pointer-events-none" />
        )}
      </div>

      {/* 2. FLOATING HUD CONTROLS - MINIMAL & SEAMLESS */}
      {/* Top Floating Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between gap-4 pointer-events-none bg-gradient-to-b from-black/80 via-black/40 to-transparent border-0">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-400/40 bg-slate-900 shadow-md shadow-cyan-500/25 shrink-0">
            <img
              src={TRANSITION_POSTER_SRC}
              alt="Spacecraft"
              width={40}
              height={40}
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/25 text-cyan-200 border border-cyan-400/30 font-bold backdrop-blur-md">
                Cosmic Jump Scene
              </span>
              <span className="text-xs text-slate-200 font-semibold flex items-center gap-1 drop-shadow-md">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                Target: <span className="text-cyan-300 font-bold">{targetRelic.name}</span>
              </span>
            </div>
            <div className="text-xs font-bold text-slate-100 mt-0.5 drop-shadow-md">
              Captain: {character.name}
            </div>
          </div>
        </div>

        {/* Top Floating Controls */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {!prefersReducedMotion && (
            <>
              <button
                onClick={toggleSound}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-xs text-slate-200 hover:text-white transition-all shadow-lg active:scale-95 cursor-pointer"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-[11px]">Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px]">Audio On</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReplay}
                className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-slate-200 hover:text-white transition-all shadow-lg active:scale-95 cursor-pointer"
                title="Replay Scene"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={finishTransition}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <span>Skip Scene</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Bottom Floating Bar */}
      <footer className="absolute bottom-0 left-0 right-0 z-30 px-4 sm:px-8 py-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none border-0">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-200 font-mono drop-shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 motion-safe:animate-ping" />
            <span className="flex items-center gap-1.5">
              <span>Approach Trajectory: Scanning {targetRelic.name}</span>
              <span className="text-cyan-400">✦</span>
              <span className="text-amber-300 font-bold">Crossing Event Horizon</span>
            </span>
          </div>

          <button
            onClick={finishTransition}
            className="pointer-events-auto w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>{isJupiterFlyby ? 'Enter Jupiter Flyby View' : 'Land on Planet Surface Now'}</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
