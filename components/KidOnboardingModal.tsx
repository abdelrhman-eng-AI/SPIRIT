import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Compass,
  Search,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Volume2,
  VolumeX,
  Stars,
  Radio,
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';
import { speechService } from '../services/speechSynthesis';

interface KidOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExploring: () => void;
  suitColor?: string;
  isSoundEnabled?: boolean;
}

// English voice narrations for each step in Explorer Guide
const STEP_NARRATIONS: Record<number, string[]> = {
  1: [
    'Welcome Space Explorer to the Explorer Guide!',
    'There are many forgotten objects and spacecraft resting across the Moon, Mars, and deep space.',
    'Let us go find them together and uncover their secrets!',
  ],
  2: [
    'Step Two: Explore Space.',
    'Use the interactive space map to discover where old spacecraft, rovers, and forgotten equipment were left behind.',
  ],
  3: [
    'Step Three: Investigate Lost Objects.',
    'Click on any spacecraft or probe to learn its story, when it launched, why it was left behind, and its greatest achievements!',
  ],
  4: [
    'Step Four: Become a Space Detective!',
    'Complete missions, collect discovery badges, and protect the history of space exploration!',
    'Press Start Exploring to begin your adventure right now!',
  ],
};

export const KidOnboardingModal: React.FC<KidOnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartExploring,
  suitColor = '#06b6d4',
  isSoundEnabled = true,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number>(0);

  const totalSteps = 4;

  // Speak narration when modal opens or step changes
  useEffect(() => {
    if (!isOpen) {
      speechService.stop();
      return;
    }

    if (!isVoiceActive || !isSoundEnabled) {
      speechService.stop();
      return;
    }

    // Start speech immediately with zero delay
    const sentences = STEP_NARRATIONS[currentStep] || STEP_NARRATIONS[1];
    speechService.startStoryNarration(sentences, {
      onSentenceChange: (idx) => setActiveSentenceIdx(idx),
      onEnd: () => {},
    });

    return () => {
      speechService.stop();
    };
  }, [isOpen, currentStep, isVoiceActive, isSoundEnabled]);

  if (!isOpen) return null;

  const handleNext = () => {
    soundEffects.playClick();
    speechService.stop();
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      soundEffects.playSuccess();
      onStartExploring();
    }
  };

  const handlePrev = () => {
    soundEffects.playClick();
    speechService.stop();
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleJumpToStep = (stepNumber: number) => {
    soundEffects.playClick();
    speechService.stop();
    setCurrentStep(stepNumber);
  };

  const toggleVoice = () => {
    soundEffects.playClick();
    if (isVoiceActive) {
      speechService.stop();
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);
      const sentences = STEP_NARRATIONS[currentStep] || STEP_NARRATIONS[1];
      speechService.startStoryNarration(sentences, {
        onSentenceChange: (idx) => setActiveSentenceIdx(idx),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none font-sans overflow-hidden">
      {/* 1. Backdrop Blur & NASA Deep Cosmos Gradient Overlay */}
      <div
        onClick={() => {
          speechService.stop();
          onClose();
        }}
        className="absolute inset-0 bg-[#02040b]/85 backdrop-blur-md transition-opacity duration-500"
      />

      {/* Floating Space Ambiance: Slow Animated Stars & Distant Spaceship */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating background stars */}
        <div className="absolute top-[12%] left-[18%] w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-60" style={{ animationDuration: '3.5s' }} />
        <div className="absolute top-[28%] right-[22%] w-3 h-3 rounded-full bg-amber-300 animate-pulse opacity-70" />
        <div className="absolute bottom-[20%] left-[25%] w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping opacity-50" style={{ animationDuration: '4.5s' }} />
        <div className="absolute top-[65%] right-[15%] w-2 h-2 rounded-full bg-white animate-pulse opacity-80" />

        {/* Friendly spaceship moving slowly across top */}
        <div className="absolute -top-6 left-0 w-full flex justify-between pointer-events-none opacity-40 animate-pulse">
          <div className="text-4xl transform translate-x-12 translate-y-24 rotate-12 transition-transform duration-1000">
            🛰️
          </div>
          <div className="text-3xl transform -translate-x-20 translate-y-36 -rotate-12">
            🚀
          </div>
        </div>
      </div>

      {/* 2. Kid-Friendly NASA / Cartoon Main Card */}
      <div className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-[#0f172a] via-[#090e1f] to-[#040714] rounded-3xl sm:rounded-[36px] border-2 border-cyan-500/50 shadow-[0_0_80px_rgba(6,182,212,0.35),0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Colorful Glow Accents */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-purple-600/30 blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-cyan-500/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-48 rounded-full bg-orange-500/25 blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-20 flex items-center justify-between px-5 sm:px-8 pt-5 pb-3 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
          {/* Mission Badge & App Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-orange-400 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0a0f24] rounded-[14px] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-cyan-300 animate-bounce" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black tracking-wide text-white uppercase flex items-center gap-1.5">
                  <span>Forgotten, But Not Lost</span>
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold font-mono border border-orange-500/30">
                  Explorer Guide
                </span>
              </div>
              <p className="text-[11px] text-cyan-400 font-medium">
                Exploring Lost Objects Across Space · Interactive Voice Guide
              </p>
            </div>
          </div>

          {/* Controls: Voice Toggle & Close */}
          <div className="flex items-center gap-2">
            {/* Voice Narration Audio Toggle */}
            <button
              onClick={toggleVoice}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer shadow-sm ${
                isVoiceActive
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isVoiceActive ? 'Mute Voice Guide' : 'Enable Voice Guide'}
            >
              {isVoiceActive ? (
                <>
                  <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="hidden sm:inline">Voice On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">Muted</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                speechService.stop();
                onClose();
              }}
              className="w-9 h-9 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-orange-400 text-slate-300 hover:text-white flex items-center justify-center transition-colors shadow-md group cursor-pointer"
              title="Close Guide"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Progress Indicator 1/4, 2/4, 3/4, 4/4 with Fun Space Stepper */}
        <div className="relative z-20 px-5 sm:px-8 pt-4 pb-2 bg-slate-950/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" />
                <span>Mission Step:</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-md">
                {currentStep} / {totalSteps}
              </span>
            </div>

            {/* Step Name Tag */}
            <span className="text-[11px] font-bold text-orange-400">
              {currentStep === 1 && '1. Welcome Explorer 🚀'}
              {currentStep === 2 && '2. Explore Space 🌌'}
              {currentStep === 3 && '3. Investigate Relics 🔍'}
              {currentStep === 4 && '4. Space Detective 🌟'}
            </span>
          </div>

          {/* Interactive Step Track Dots / Progress Bars */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <button
                key={stepNum}
                onClick={() => handleJumpToStep(stepNum)}
                className="group relative h-2.5 rounded-full overflow-hidden bg-slate-800 transition-all cursor-pointer"
                title={`Jump to step ${stepNum}`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    stepNum <= currentStep
                      ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-orange-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                      : 'bg-transparent'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Live Audio Narration Indicator Ribbon */}
        {isVoiceActive && (
          <div className="px-5 sm:px-8 py-1.5 bg-cyan-950/40 border-y border-cyan-500/20 flex items-center justify-center gap-2 text-[11px] font-mono text-cyan-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Voice guide narrating...</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
        )}

        {/* Content Body with Fun Large Illustrations & Kid-Friendly Texts */}
        <div className="relative z-10 flex-1 px-5 sm:px-8 py-5 sm:py-6 overflow-y-auto flex flex-col justify-center items-center text-center">
          {/* ================= STEP 1: WELCOME SPACE EXPLORER! ================= */}
          {currentStep === 1 && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              {/* Cute Waving Astronaut Illustration Card */}
              <div className="relative mb-4 w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                {/* Glowing Aura Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-orange-500/30 blur-xl animate-pulse" />

                {/* Orbiting Planets & Stars */}
                <div className="absolute -top-2 right-4 text-2xl animate-bounce" style={{ animationDuration: '2.5s' }}>
                  🪐
                </div>
                <div className="absolute bottom-3 left-3 text-2xl animate-pulse">
                  ✨
                </div>

                {/* Central Astronaut SVG (Custom Kid-Friendly Waving) */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_12px_28px_rgba(6,182,212,0.4)]">
                    <defs>
                      <linearGradient id="vis-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                        <stop offset="35%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                      <linearGradient id="suit-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="45%" stopColor="#e0f2fe" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>

                    {/* Backpack */}
                    <rect x="55" y="85" width="22" height="50" rx="9" fill="#475569" stroke="#64748b" strokeWidth="2.5" />
                    <rect x="123" y="85" width="22" height="50" rx="9" fill="#475569" stroke="#64748b" strokeWidth="2.5" />

                    {/* Left Arm (Waving) */}
                    <g className="origin-[65px_95px] animate-pulse">
                      <path d="M 65 95 Q 40 70 35 48 Q 42 42 50 48 Q 58 70 72 95 Z" fill="url(#suit-g1)" stroke="#0284c7" strokeWidth="2.5" />
                      {/* Waving Glove */}
                      <circle cx="36" cy="45" r="11" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
                      <circle cx="30" cy="42" r="4" fill="#f97316" />
                    </g>

                    {/* Right Arm (Resting friendly) */}
                    <path d="M 135 95 Q 160 115 155 130 Q 146 135 140 125 Q 130 110 128 95 Z" fill="url(#suit-g1)" stroke="#0284c7" strokeWidth="2.5" />
                    <circle cx="152" cy="130" r="10" fill="#f97316" stroke="#ea580c" strokeWidth="2" />

                    {/* Astronaut Body */}
                    <rect x="68" y="82" width="64" height="65" rx="20" fill="url(#suit-g1)" stroke="#0284c7" strokeWidth="3" />

                    {/* NASA-inspired Chest Control Panel */}
                    <rect x="80" y="98" width="40" height="24" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                    <circle cx="89" cy="110" r="4" fill="#22c55e" className="animate-pulse" />
                    <circle cx="100" cy="110" r="4" fill="#ef4444" />
                    <rect x="108" y="107" width="8" height="6" rx="2" fill="#38bdf8" />

                    {/* Legs */}
                    <rect x="74" y="142" width="22" height="34" rx="10" fill="url(#suit-g1)" stroke="#0284c7" strokeWidth="2.5" />
                    <rect x="104" y="142" width="22" height="34" rx="10" fill="url(#suit-g1)" stroke="#0284c7" strokeWidth="2.5" />
                    {/* Orange Space Boots */}
                    <ellipse cx="85" cy="178" rx="15" ry="8" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
                    <ellipse cx="115" cy="178" rx="15" ry="8" fill="#f97316" stroke="#c2410c" strokeWidth="2" />

                    {/* Helmet Head */}
                    <circle cx="100" cy="56" r="38" fill="url(#suit-g1)" stroke="#0284c7" strokeWidth="3.5" />
                    {/* Golden Reflective Visor */}
                    <rect x="73" y="38" width="54" height="36" rx="18" fill="url(#vis-g1)" stroke="#d97706" strokeWidth="2" />
                    {/* Cute Visor Reflection Sparkle */}
                    <ellipse cx="85" cy="46" rx="6" ry="3" fill="#ffffff" opacity="0.8" transform="rotate(-25 85 46)" />
                  </svg>
                </div>
              </div>

              {/* Title & Speech */}
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-orange-400 mb-2">
                Welcome Space Explorer!
              </h2>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 max-w-lg shadow-inner">
                <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                  &quot;Hi Explorer! 🚀<br />
                  There are many forgotten objects across the Moon, Mars, and deep space.<br />
                  Let&apos;s go find them together!&quot;
                </p>
                <div className="mt-2 text-xs text-cyan-300 font-bold">
                  Tap &ldquo;Next Mission&rdquo; to learn how to track down every hidden probe across our solar system.
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: EXPLORE SPACE ================= */}
          {currentStep === 2 && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              {/* Illustration: Moon, Mars, Satellite and Rover */}
              <div className="relative mb-4 w-full max-w-md h-44 sm:h-52 rounded-2xl bg-slate-950/90 border border-indigo-500/30 p-3 flex items-center justify-around overflow-hidden shadow-2xl">
                {/* Space Backdrop Dust */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15)_0%,_transparent_70%)] pointer-events-none" />

                {/* 1. Moon */}
                <div className="flex flex-col items-center group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-slate-400 via-slate-200 to-white shadow-[0_0_25px_rgba(255,255,255,0.4)] relative flex items-center justify-center border-2 border-slate-300 group-hover:scale-110 transition-transform">
                    {/* Craters */}
                    <div className="w-3 h-3 rounded-full bg-slate-400/60 absolute top-2 left-3" />
                    <div className="w-4 h-4 rounded-full bg-slate-400/50 absolute bottom-3 right-3" />
                    <div className="w-2 h-2 rounded-full bg-slate-400/40 absolute bottom-3 left-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 mt-1.5 font-mono">The Moon 🌙</span>
                </div>

                {/* 2. Orbiting Satellite */}
                <div className="flex flex-col items-center animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400 p-2 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <span className="text-2xl">🛰️</span>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-300 mt-1.5 font-mono">Satellite</span>
                </div>

                {/* 3. Mars */}
                <div className="flex flex-col items-center group">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-amber-700 via-red-600 to-orange-400 shadow-[0_0_28px_rgba(239,68,68,0.5)] relative flex items-center justify-center border-2 border-orange-300 group-hover:scale-110 transition-transform">
                    {/* Polar ice cap */}
                    <div className="w-5 h-2 rounded-full bg-white/80 absolute top-1" />
                    {/* Canyon shadow */}
                    <div className="w-8 h-2 rounded-full bg-red-950/60 absolute bottom-4" />
                  </div>
                  <span className="text-[11px] font-bold text-orange-300 mt-1.5 font-mono">Mars 🪐</span>
                </div>

                {/* 4. Planetary Rover */}
                <div className="flex flex-col items-center animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-orange-950/80 border border-orange-400 p-2 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <span className="text-2xl">🚜</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-300 mt-1.5 font-mono">Rover</span>
                </div>
              </div>

              {/* Title & Speech */}
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-white to-cyan-400 mb-2">
                Explore Space
              </h2>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-orange-500/30 max-w-lg shadow-inner">
                <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                  &quot;Use the interactive space map to discover where old spacecraft, rovers, and equipment were left behind.&quot;
                </p>
                <div className="mt-2 text-xs text-orange-300 font-bold">
                  Switch between Planetary Orbits, the High-Power Telescope, and the Deep Space Debris Radar!
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: INVESTIGATE LOST OBJECTS ================= */}
          {currentStep === 3 && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              {/* Illustration: Magnifying glass searching an abandoned rover */}
              <div className="relative mb-4 w-full max-w-md h-44 sm:h-52 rounded-2xl bg-slate-950/90 border border-cyan-500/30 p-4 flex items-center justify-center overflow-hidden shadow-2xl">
                {/* Background Grid Radar HUD */}
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,_transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

                {/* Abandoned Rover on Celestial Surface */}
                <div className="relative z-10 flex items-center gap-4">
                  {/* Abandoned Historic Space Rover Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-xl flex flex-col items-center">
                    <div className="text-4xl mb-1">🤖</div>
                    <span className="text-xs font-bold text-amber-300 font-mono">Spirit / Opportunity</span>
                    <span className="text-[10px] text-slate-400">Gusev Crater · Mars</span>
                  </div>

                  {/* Pulsing Search Scan Beam */}
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-cyan-400 font-mono animate-pulse">
                      SCANNING...
                    </span>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-orange-400 my-1 animate-pulse" />
                  </div>

                  {/* Big Fun Magnifying Glass */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-cyan-500/20 border-4 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center animate-pulse">
                    <Search className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-200" />
                    {/* Handle */}
                    <div className="absolute -bottom-4 -right-3 w-5 h-8 bg-orange-500 rounded-full rotate-45 border-2 border-orange-300 shadow-md" />
                  </div>
                </div>
              </div>

              {/* Title & Speech */}
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-400 mb-2">
                Investigate Lost Objects
              </h2>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 max-w-lg shadow-inner">
                <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                  &quot;Click on any object to learn its story, location, and why it matters.&quot;
                </p>
                <div className="mt-2 text-xs text-cyan-300 font-bold">
                  Discover when it launched, why it was left behind in space, and listen to its narrated story!
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: BECOME A SPACE DETECTIVE ================= */}
          {currentStep === 4 && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              {/* Illustration: Kid astronaut holding a glowing discovery badge */}
              <div className="relative mb-4 w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                {/* Radiant Discovery Aura */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/30 via-orange-500/25 to-purple-600/30 blur-2xl animate-pulse" />

                {/* Floating Medals and Star Shimmer */}
                <div className="absolute top-2 left-2 text-2xl animate-spin" style={{ animationDuration: '8s' }}>
                  ⭐
                </div>
                <div className="absolute top-3 right-4 text-2xl animate-bounce">
                  ✨
                </div>

                {/* Heroic Badge Container */}
                <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-purple-700 p-1 shadow-[0_0_50px_rgba(245,158,11,0.7)] flex items-center justify-center animate-pulse">
                  <div className="w-full h-full bg-[#0a0f28] rounded-[22px] flex flex-col items-center justify-center p-3 text-center border-2 border-amber-300/60">
                    <Award className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400 mb-1 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-bounce" />
                    <span className="text-xs font-black text-white tracking-wider uppercase font-mono">
                      SPACE DETECTIVE
                    </span>
                    <span className="text-[10px] text-amber-300 font-bold">
                      Certified Cosmic Guardian 🏆
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Speech */}
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-purple-400 mb-2">
                Become a Space Detective
              </h2>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-amber-500/40 max-w-lg shadow-inner">
                <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                  &quot;Complete missions, collect discoveries, and protect the history of space exploration.&quot;
                </p>
                <div className="mt-2 text-xs text-amber-300 font-bold">
                  Finish quizzes to unlock golden mission badges and gear upgrades in the Trophy Room!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar with Big Kid-Friendly Buttons */}
        <div className="relative z-20 px-5 sm:px-8 py-4 sm:py-5 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          {/* Back or Skip button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            {currentStep > 1 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-xs sm:text-sm font-bold text-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  speechService.stop();
                  onClose();
                }}
                className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 font-medium transition-colors"
              >
                Skip Tour
              </button>
            )}

            <span className="sm:hidden text-xs font-mono text-cyan-400 font-bold">
              {currentStep}/4
            </span>
          </div>

          {/* Forward Action Buttons with Large Click Targets */}
          <div className="w-full sm:w-auto">
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-sky-300 text-slate-950 text-sm sm:text-base font-black shadow-[0_0_35px_rgba(6,182,212,0.6)] active:scale-95 transition-all cursor-pointer"
              >
                <span>
                  {currentStep === 1 && 'Next Mission'}
                  {currentStep === 2 && 'Continue'}
                  {currentStep === 3 && 'Learn More'}
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              /* Big Final CTA Button for Step 4 */
              <button
                onClick={handleNext}
                className="w-full sm:w-auto group flex items-center justify-center gap-3 px-9 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-base sm:text-lg font-black shadow-[0_0_50px_rgba(245,158,11,0.8)] active:scale-95 transition-all cursor-pointer animate-pulse"
              >
                <Rocket className="w-6 h-6 animate-bounce" />
                <span>Start Exploring</span>
                <Stars className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
