import React, { useEffect, useState } from 'react';
import { EraId, CharacterCustomization } from '../types';
import { ERAS_CONFIG, SPACE_RELICS } from '../data/spaceData';
import { CartoonAvatar } from './CartoonAvatar';
import { TeamLogo } from './TeamLogo';
import { soundEffects } from '../services/soundEffects';
import { speechService } from '../services/speechSynthesis';
import {
  X,
  Compass,
  ArrowRight,
  Volume2,
  VolumeX,
  Radio,
  RotateCcw,
  Sparkles,
  Activity,
  Layers,
  CheckCircle,
} from 'lucide-react';

interface EraSelectionModalProps {
  character: CharacterCustomization;
  onSelectEra: (eraId: EraId) => void;
  onClose: () => void;
}

export const EraSelectionModal: React.FC<EraSelectionModalProps> = ({
  character,
  onSelectEra,
  onClose,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechText, setActiveSpeechText] = useState('');
  const [isRealisticAstronaut, setIsRealisticAstronaut] = useState(true);

  const speechLines = [
    `Welcome Commander to the Forgotten Space Relics Archive!`,
    `I am your navigation companion, standing with you on the command deck to start our historic voyage.`,
    'Together we will travel across eras to document and rescue humanity’s greatest probes left in distant planetary orbits.',
    'Choose the time era you wish to explore, and I will lock in the wormhole coordinates right away!',
  ];

  useEffect(() => {
    // 1. Play soft cabin radio chime
    soundEffects.playRadioChirp();

    // 2. Start astronaut voice communication immediately with zero delay
    startSpeech();

    return () => {
      speechService.stop();
    };
  }, []);

  const startSpeech = () => {
    speechService.startStoryNarration(speechLines, {
      onStart: () => {
        setIsSpeaking(true);
      },
      onSentenceChange: (idx) => {
        setActiveSpeechText(speechLines[idx] || speechLines[0]);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setActiveSpeechText(speechLines[speechLines.length - 1]);
      },
      onError: () => {
        setIsSpeaking(false);
      },
    });
  };

  const handleReplaySpeech = () => {
    soundEffects.playRadioChirp();
    speechService.stop();
    setTimeout(() => {
      startSpeech();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl select-none">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#0b1224] via-[#070b17] to-[#02040a] border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_90px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <TeamLogo size="sm" withGlow={false} />
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>Mission Navigation — Command Deck</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h2>
              <span className="text-[11px] text-cyan-400 font-mono">
                SPIRIT EL TEAM // Orbital Launch &amp; Control Station
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= STANDING ASTRONAUT OFFICIAL MISSION BRIEFING DECK ================= */}
        <div className="px-5 py-4 bg-gradient-to-r from-cyan-950/40 via-slate-900/70 to-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-center gap-4">
          {/* Standing Astronaut Viewport (Standing firmly upright on command platform) */}
          <div className="relative shrink-0 flex flex-col items-center">
            {isRealisticAstronaut ? (
              // Photorealistic Standing Astronaut
              <div
                className={`relative w-24 h-36 sm:w-28 sm:h-40 rounded-2xl overflow-hidden transition-all duration-300 ${
                  isSpeaking
                    ? 'border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)] ring-2 ring-cyan-400/40'
                    : 'border border-slate-700 bg-black'
                }`}
              >
                <img
                  src="/assets/images/realistic_standing_astronaut_1792425059943.jpg"
                  alt="Realistic Standing Astronaut Commander"
                  width={112}
                  height={160}
                  sizes="(max-width: 640px) 96px, 112px"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />

                {/* Subdued shadow vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Active Speaking Indicator */}
                {isSpeaking && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600/90 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full shadow animate-pulse">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Speaking</span>
                  </div>
                )}

                {/* Stand tag */}
                <div className="absolute bottom-1 inset-x-1 text-center bg-black/90 py-0.5 rounded text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
                  On Launch Deck
                </div>
              </div>
            ) : (
              // Standing Custom Avatar
              <div
                className={`p-2 rounded-2xl transition-all ${
                  isSpeaking
                    ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105'
                    : 'bg-slate-900 border border-slate-700'
                }`}
              >
                <CartoonAvatar
                  customization={character}
                  size="lg"
                  isSpeaking={isSpeaking}
                  isExcited={true}
                  isStanding={true}
                  isFlying={false}
                />
                <div className="text-[10px] text-center font-mono text-cyan-300 mt-1">
                  Standing Ready
                </div>
              </div>
            )}

            {/* Mode switcher: Realistic vs Avatar */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setIsRealisticAstronaut(!isRealisticAstronaut);
              }}
              className="mt-1.5 px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 hover:text-cyan-300 font-mono transition-colors"
            >
              {isRealisticAstronaut ? 'Custom Companion 🎨' : 'Realistic Astronaut 👨‍🚀'}
            </button>
          </div>

          {/* Spoken Narration Stream & Live Comms Box */}
          <div className="flex-1 w-full flex flex-col justify-between">
            <div className="relative p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-inner">
              {/* Radio Header Info */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] font-mono">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="font-bold">RADIO CHANNEL: CAPCOM DIRECT // 1420.40 MHz</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-400 font-semibold">LIVE AUDIO</span>
                </div>
              </div>

              {/* Spoken Text with speech tail */}
              <div className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed text-left min-h-[50px]">
                {activeSpeechText || speechLines[0]}
              </div>

              {/* Equalizer animation bars during speech */}
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/80 text-[11px]">
                <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                  <span>Audio Signal:</span>
                  <div className="flex items-center gap-0.5">
                    {[0.3, 0.7, 1, 0.5, 0.8, 0.4, 0.9, 0.6, 0.4].map((val, idx) => (
                      <span
                        key={idx}
                        className={`w-1 rounded-full ${
                          isSpeaking ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'
                        }`}
                        style={{
                          height: isSpeaking ? `${val * 14}px` : '4px',
                          animationDelay: `${idx * 0.08}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleReplaySpeech}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Replay Briefing</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3 ERAS SELECTION SECTION ================= */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-white">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Select a time era to jump through the wormhole:</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">3 Eras Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ERAS_CONFIG.map((era) => {
              return (
                <div
                  key={era.id}
                  onClick={() => {
                    soundEffects.playClick();
                    speechService.stop();
                    onSelectEra(era.id);
                  }}
                  className={`group relative rounded-2xl p-4.5 bg-gradient-to-b ${era.colorTheme} border-2 hover:border-cyan-400 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.02] shadow-xl hover:shadow-[0_0_35px_rgba(6,182,212,0.3)]`}
                >
                  <div>
                    {/* Years badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 text-xs font-mono font-bold text-white shadow-inner">
                        {era.years}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                        {SPACE_RELICS.filter((r) => r.eraId === era.id).length} / {era.slotsCount} Slots
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                      {era.arabicTitle}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                      {era.description}
                    </p>
                  </div>

                  {/* Launch CTA */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>Explore This Era</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
