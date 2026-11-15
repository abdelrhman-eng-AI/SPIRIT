import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CharacterCustomization, SpacecraftRelic } from '../types';
import { CartoonAvatar } from './CartoonAvatar';
import { soundEffects } from '../services/soundEffects';
import { speechService, VoiceToneProfile } from '../services/speechSynthesis';
import {
  Volume2,
  Sparkles,
  RotateCcw,
  Minimize2,
  Maximize2,
  X,
  Headphones,
  Minus,
  Plus,
  MoveDiagonal2,
} from 'lucide-react';

interface TalkingAstronautPresenterProps {
  character: CharacterCustomization;
  relic?: SpacecraftRelic;
  activeSentence: string;
  isSpeaking: boolean;
  onReplaySpeech: () => void;
  className?: string;
}

interface PresenterSize {
  width: number;
  height: number;
}

const STORAGE_KEY = 'spirit_presenter_panel_size';
const DEFAULT_SIZE: PresenterSize = { width: 432, height: 248 };
const STEP_WIDTH = 36;
const STEP_HEIGHT = 28;

function getViewportBounds() {
  if (typeof window === 'undefined') {
    return { minWidth: 280, maxWidth: 760, minHeight: 196, maxHeight: 580 };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const horizontalMargin = vw < 640 ? 24 : 32;
  const verticalMargin = vh < 640 ? 64 : 88;
  const maxWidth = Math.max(260, Math.min(780, vw - horizontalMargin));
  const minWidth = Math.min(280, maxWidth);
  const maxHeight = Math.max(200, Math.min(600, vh - verticalMargin));
  const minHeight = Math.min(196, maxHeight);
  return { minWidth, maxWidth, minHeight, maxHeight };
}

function clampSize(size: PresenterSize): PresenterSize {
  const { minWidth, maxWidth, minHeight, maxHeight } = getViewportBounds();
  return {
    width: Math.round(Math.min(maxWidth, Math.max(minWidth, size.width))),
    height: Math.round(Math.min(maxHeight, Math.max(minHeight, size.height))),
  };
}

function loadSavedSize(): PresenterSize {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PresenterSize>;
      if (
        typeof parsed.width === 'number' &&
        Number.isFinite(parsed.width) &&
        typeof parsed.height === 'number' &&
        Number.isFinite(parsed.height)
      ) {
        return clampSize({ width: parsed.width, height: parsed.height });
      }
    }
  } catch {
    // ignore storage errors
  }
  return clampSize(DEFAULT_SIZE);
}

const SPACE_JOKES = [
  'How do astronauts throw a party in deep space? They "planet" well in advance! 🪐🎉',
  'Why do astronauts love using keyboards? Because the "Space" bar is huge! ⌨️🚀',
  'What does a hungry astronaut order? A "Martian" grilled cheese sandwich! 🥪😋',
  'Did you know sunsets on Mars look bright blue instead of red like on Earth? 🌅✨',
  'Space is completely silent because sound waves need air molecules to travel! 🌌🤫',
];

export const TalkingAstronautPresenter: React.FC<TalkingAstronautPresenterProps> = ({
  character,
  activeSentence,
  isSpeaking,
  onReplaySpeech,
  className = '',
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [customJoke, setCustomJoke] = useState<string | null>(null);
  // Default to realistic standing astronaut mode to satisfy user request for realism!
  const [isRealisticMode, setIsRealisticMode] = useState(true);
  const [currentTone, setCurrentTone] = useState<VoiceToneProfile>('soothing');

  const [panelSize, setPanelSize] = useState<PresenterSize>(loadSavedSize);
  const [isResizing, setIsResizing] = useState(false);

  const panelSizeRef = useRef<PresenterSize>(panelSize);
  panelSizeRef.current = panelSize;

  const dragStateRef = useRef<{
    active: boolean;
    axis: 'both' | 'width' | 'height';
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const persistSize = useCallback((size: PresenterSize) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(size));
    } catch {
      // ignore storage errors
    }
  }, []);

  // Re-clamp cleanly whenever the viewport resizes (desktop window resize / mobile rotation)
  useEffect(() => {
    const handleViewportResize = () => {
      setPanelSize((prev) => clampSize(prev));
    };
    window.addEventListener('resize', handleViewportResize, { passive: true });
    return () => window.removeEventListener('resize', handleViewportResize);
  }, []);

  // Global pointer drag listeners while resizing
  useEffect(() => {
    if (!isResizing) return;

    const handlePointerMove = (e: PointerEvent) => {
      const drag = dragStateRef.current;
      if (!drag || !drag.active) return;

      const deltaX = e.clientX - drag.startX;
      // Panel is anchored to bottom-left, so dragging upward increases height
      const deltaY = drag.startY - e.clientY;

      const next = clampSize({
        width: drag.axis === 'height' ? drag.startWidth : drag.startWidth + deltaX,
        height: drag.axis === 'width' ? drag.startHeight : drag.startHeight + deltaY,
      });
      setPanelSize(next);
    };

    const stopDragging = () => {
      if (dragStateRef.current) {
        dragStateRef.current.active = false;
      }
      setIsResizing(false);
      persistSize(panelSizeRef.current);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('pointercancel', stopDragging);
    };
  }, [isResizing, persistSize]);

  const startResize = (axis: 'both' | 'width' | 'height') => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragStateRef.current = {
      active: true,
      axis,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: panelSizeRef.current.width,
      startHeight: panelSizeRef.current.height,
    };
    setIsResizing(true);
  };

  const adjustSizeBy = (deltaW: number, deltaH: number) => {
    soundEffects.playClick();
    if (isMinimized && deltaH > 0) {
      setIsMinimized(false);
    }
    setPanelSize((prev) => {
      const next = clampSize({
        width: prev.width + deltaW,
        height: prev.height + deltaH,
      });
      persistSize(next);
      return next;
    });
  };

  const handleResizeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      adjustSizeBy(STEP_WIDTH, 0);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      adjustSizeBy(-STEP_WIDTH, 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      adjustSizeBy(0, STEP_HEIGHT);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      adjustSizeBy(0, -STEP_HEIGHT);
    } else if (e.key === 'Home') {
      e.preventDefault();
      soundEffects.playClick();
      const reset = clampSize(DEFAULT_SIZE);
      setPanelSize(reset);
      persistSize(reset);
    }
  };

  const handleToggleTone = () => {
    soundEffects.playClick();
    const next: VoiceToneProfile = currentTone === 'soothing' ? 'warm' : currentTone === 'warm' ? 'friendly' : 'soothing';
    setCurrentTone(next);
    speechService.setToneProfile(next);
  };

  const handleTellJoke = () => {
    soundEffects.playRadioChirp();
    const random = SPACE_JOKES[Math.floor(Math.random() * SPACE_JOKES.length)];
    setCustomJoke(random);
    speechService.startStoryNarration([random]);
  };

  const handleCloseJoke = () => {
    setCustomJoke(null);
  };

  const bounds = getViewportBounds();
  const canShrink = panelSize.width > bounds.minWidth || (!isMinimized && panelSize.height > bounds.minHeight);
  const canEnlarge = panelSize.width < bounds.maxWidth || (!isMinimized && panelSize.height < bounds.maxHeight);

  return (
    <div
      className={`fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 select-none ${
        isResizing ? 'transition-none' : 'transition-[box-shadow] duration-200'
      } ${className}`}
      style={{
        width: `${panelSize.width}px`,
        height: isMinimized ? undefined : `${panelSize.height}px`,
        maxWidth: 'calc(100vw - 1.5rem)',
        maxHeight: 'calc(100vh - 2rem)',
      }}
    >
      <div className="relative h-full flex flex-col rounded-2xl bg-gradient-to-b from-[#090e1a]/95 via-[#060a14]/95 to-[#020409]/98 border-2 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.3)] p-3.5 sm:p-4 backdrop-blur-xl">
        {/* Top-Edge & Right-Edge Pointer Resize Zones */}
        {!isMinimized && (
          <div
            onPointerDown={startResize('height')}
            aria-hidden="true"
            title="Drag top edge to resize height"
            className="absolute -top-1.5 inset-x-4 h-3 cursor-ns-resize z-20"
          />
        )}
        <div
          onPointerDown={startResize('width')}
          aria-hidden="true"
          title="Drag right edge to resize width"
          className="absolute inset-y-4 -right-1.5 w-3 cursor-ew-resize z-20"
        />

        {/* Floating Soundwave rings when speaking */}
        {isSpeaking && (
          <div className="absolute -top-3 -left-3 flex items-center justify-center pointer-events-none z-20">
            <span className="absolute w-8 h-8 rounded-full border-2 border-cyan-400 animate-ping opacity-60" />
            <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg font-bold">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            </span>
          </div>
        )}

        {/* Top-Right Draggable & Keyboard-Accessible Corner Resize Handle */}
        <button
          type="button"
          onPointerDown={startResize(isMinimized ? 'width' : 'both')}
          onKeyDown={handleResizeKeyDown}
          aria-label="Resize astronaut dialogue box. Drag or use arrow keys to adjust width and height, or Home to reset."
          title="Drag corner or use Arrow keys to resize (Home to reset)"
          className="absolute -top-2.5 -right-2.5 z-30 w-6 h-6 rounded-full bg-slate-900 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-400/70 shadow-lg flex items-center justify-center cursor-nesw-resize focus:outline-none focus:ring-2 focus:ring-cyan-400 touch-none transition-colors"
        >
          <MoveDiagonal2 className="w-3 h-3" />
        </button>

        {/* Presenter Header & Telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2.5 border-b border-slate-800 text-xs shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-white text-xs leading-none truncate">
                {isRealisticMode ? 'Space Commander (EVA)' : character.name}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono mt-0.5 truncate">
                {isSpeaking ? 'Speaking Live Over Radio 🎙️' : 'Standing By on Deck'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-wrap justify-end">
            {/* Accessible Size Controls: Smaller / Larger */}
            <div className="flex items-center rounded bg-slate-900 border border-slate-700 overflow-hidden">
              <button
                type="button"
                onClick={() => adjustSizeBy(-STEP_WIDTH, -STEP_HEIGHT)}
                disabled={!canShrink}
                aria-label="Make dialogue box smaller"
                title="Make dialogue box smaller"
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => adjustSizeBy(STEP_WIDTH, STEP_HEIGHT)}
                disabled={!canEnlarge}
                aria-label="Make dialogue box larger"
                title="Make dialogue box larger"
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border-l border-slate-700 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Mode Toggle: Realistic Standing Astronaut vs Custom Avatar */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setIsRealisticMode(!isRealisticMode);
              }}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-[10px] text-cyan-300 font-mono transition-colors cursor-pointer"
              title="Switch astronaut visual (Realistic / Cartoon)"
            >
              {isRealisticMode ? 'Realistic 👨‍🚀' : 'Companion 🎨'}
            </button>

            {/* Tone Toggle: Soothing vs Warm vs Friendly */}
            <button
              type="button"
              onClick={handleToggleTone}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-[10px] text-amber-300 font-mono transition-colors flex items-center gap-1 cursor-pointer"
              title="Change astronaut voice tone (Soothing / Warm / Friendly)"
            >
              <Headphones className="w-2.5 h-2.5 text-amber-400" />
              <span className="hidden sm:inline">
                {currentTone === 'soothing' ? 'Soothing Tone 🎧' : currentTone === 'warm' ? 'Warm Tone 🎙️' : 'Friendly Tone 🌟'}
              </span>
              <span className="sm:hidden">
                {currentTone === 'soothing' ? '🎧' : currentTone === 'warm' ? '🎙️' : '🌟'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { soundEffects.playClick(); setIsMinimized(!isMinimized); }}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={isMinimized ? 'Expand dialogue box' : 'Minimize dialogue box'}
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Presenter Body: Standing Astronaut & Dialogue */}
        <div className={`flex items-stretch gap-3 ${isMinimized ? '' : 'flex-1 min-h-0'}`}>
          {/* Standing Astronaut Viewport (Boots firmly planted, standing pose) */}
          <div className="relative shrink-0 flex flex-col items-center justify-start">
            {isRealisticMode ? (
              // Realistic Standing Astronaut on Command Deck
              <div
                className={`relative w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden transition-all duration-300 ${
                  isSpeaking
                    ? 'border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.45)] ring-2 ring-cyan-500/30'
                    : 'border border-slate-700 bg-black'
                }`}
              >
                <img
                  src="/assets/images/realistic_standing_astronaut_1792425059943.jpg"
                  alt="Realistic Standing NASA Astronaut"
                  width={80}
                  height={112}
                  sizes="(max-width: 640px) 64px, 80px"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />

                {/* Subtle Breathing & Speech Pulsing Rim Light */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none transition-opacity ${
                    isSpeaking ? 'opacity-80' : 'opacity-60'
                  }`}
                />

                {/* Audio reactive comms indicator at helmet */}
                {isSpeaking && (
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5">
                    <span className="w-1.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-mono text-red-400 font-bold">REC</span>
                  </div>
                )}

                {/* Ground standing base badge */}
                <div className="absolute bottom-1 inset-x-1 text-center bg-black/85 py-0.5 rounded text-[8px] font-mono text-cyan-300 border border-cyan-500/30">
                  On Deck
                </div>
              </div>
            ) : (
              // Cartoon Standing Avatar on Platform
              <div
                className={`p-1 rounded-xl transition-all ${
                  isSpeaking
                    ? 'bg-cyan-500/10 border-2 border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.35)] scale-105'
                    : 'bg-slate-900 border border-slate-800'
                }`}
              >
                <CartoonAvatar
                  customization={character}
                  size="md"
                  isSpeaking={isSpeaking}
                  isExcited={isSpeaking || !!customJoke}
                  isStanding={true}
                  isFlying={false}
                />
                <div className="text-[9px] text-center font-mono text-slate-400 mt-1">
                  Standing Firm
                </div>
              </div>
            )}

            {/* Equalizer Waveform Bars when speaking */}
            {isSpeaking && (
              <div className="flex items-center gap-0.5 mt-1.5">
                {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7].map((height, i) => (
                  <span
                    key={i}
                    className="w-1 bg-cyan-400 rounded-full animate-pulse"
                    style={{
                      height: `${height * 12}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Speech Dialogue Bubble & Telemetry Box */}
          {!isMinimized && (
            <div className="flex-1 min-w-0 min-h-0 flex flex-col justify-between gap-2">
              {/* Dialogue text box with speech arrow */}
              <div className="relative flex-1 min-h-0 flex flex-col p-2.5 sm:p-3 rounded-xl bg-slate-950/95 border border-slate-700/80 text-xs text-slate-100 leading-relaxed text-left shadow-inner">
                {/* Speech tail pointing left to the standing astronaut */}
                <div className="absolute top-5 -left-1.5 w-3 h-3 bg-slate-950 border-l border-b border-slate-700/80 rotate-45" />

                <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono mb-1 pb-1 border-b border-slate-800 shrink-0">
                  <span>LIVE RADIO // CH-4</span>
                  <span className="text-slate-400">NAV SYSTEM</span>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto pr-1 select-text">
                  <p className="font-medium text-slate-200 whitespace-pre-wrap break-words">
                    {customJoke
                      ? customJoke
                      : activeSentence ||
                        'I am standing right beside you in full mission gear to explore and document this extraordinary space relic!'}
                  </p>
                </div>
              </div>

              {/* Action Buttons row */}
              <div className="flex items-center justify-between gap-1.5 text-[10px] shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playRadioChirp();
                    onReplaySpeech();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Replay Audio</span>
                </button>

                <button
                  type="button"
                  onClick={handleTellJoke}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors font-semibold cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Space Joke</span>
                </button>

                {customJoke && (
                  <button
                    type="button"
                    onClick={handleCloseJoke}
                    className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                    title="Return to original narration"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
