import React, { useEffect } from 'react';
import { CharacterCustomization } from '../types';
import { CartoonAvatar } from './CartoonAvatar';
import { TeamLogo } from './TeamLogo';
import { soundEffects } from '../services/soundEffects';
import { speechService } from '../services/speechSynthesis';
import {
  Trophy,
  Sparkles,
  X,
  Star,
  CheckCircle,
  Volume2,
  Share2,
} from 'lucide-react';

interface GrandCelebrationModalProps {
  character: CharacterCustomization;
  completedBadgesCount: number;
  totalMissions: number;
  onClose: () => void;
}

export const GrandCelebrationModal: React.FC<GrandCelebrationModalProps> = ({
  character,
  completedBadgesCount,
  totalMissions,
  onClose,
}) => {
  const speechThanks = [
    `What an extraordinary space hero you are, ${character.name}!`,
    'Thanks to your courage and curiosity, these forgotten machines are no longer lost in the silence of deep space.',
    'You dusted off the cosmic archives and revived humanity’s greatest pioneering voyages.',
    'In honor of this remarkable achievement, SPIRIT EL TEAM awards you your personalized Legendary Cosmic Explorer Badge!',
    'May you always keep looking up at the stars and dreaming of the future!',
  ];

  useEffect(() => {
    soundEffects.playFanfare();
    speechService.startStoryNarration(speechThanks);

    return () => {
      speechService.stop();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0c1427] via-[#080d1a] to-[#04060c] border border-amber-500/40 rounded-2xl shadow-[0_0_80px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Decorative Golden Starfield Sparkles */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            <h2 className="text-base font-bold text-amber-300">
              Legendary Cosmic Honor Ceremony
            </h2>
          </div>
          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-6 overflow-y-auto flex-1 flex flex-col items-center text-center space-y-6">
          {/* Animated Cartoon Character expressing celebration */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center p-2 shadow-xl">
              <CartoonAvatar
                customization={character}
                size="lg"
                isExcited={true}
                isFlying={true}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold whitespace-nowrap shadow-md">
              Special Salute!
            </div>
          </div>

          {/* Character Spoken Message Card */}
          <div className="max-w-md p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 text-left space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Gratitude Message from {character.name}</span>
              <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              &ldquo;Thank you from the heart for keeping the memory of these forgotten spacecraft alive! Their legacy will keep shining bright like a star.&rdquo;
            </p>
          </div>

          {/* ================= THE USER'S PERSONALIZED GRAND BADGE ================= */}
          <div className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-400/60 shadow-[0_0_40px_rgba(245,158,11,0.3)] relative overflow-hidden flex flex-col items-center">
            {/* Shimmer line */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent" />

            {/* Official Team Logo embedded at top */}
            <TeamLogo size="sm" withGlow={false} className="mb-2" />

            <div className="text-[10px] tracking-widest text-cyan-400 font-mono">
              SPIRIT EL TEAM · OFFICIAL CERTIFICATION
            </div>

            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 mt-1">
              Legendary Cosmic Explorer Badge
            </h3>

            {/* Inner character medal token */}
            <div className="my-4 flex items-center justify-center gap-4 p-3 rounded-xl bg-slate-900/80 border border-slate-700 w-full">
              <CartoonAvatar customization={character} size="md" isExcited={true} />
              <div className="text-left">
                <div className="text-sm font-extrabold text-white">{character.name}</div>
                <div className="text-xs text-amber-400 font-semibold">{character.companionTitle}</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Badges Completed: {completedBadgesCount} / {totalMissions}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-normal text-center">
              This historic crest is awarded to the Explorer in recognition of visiting and preserving the legacy of forgotten spacecraft across all cosmic eras (1967–1997, 1971–1972, and 1969–2004).
            </p>

            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Officially Certified in Team Archives</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <span className="text-xs text-slate-400">
            SPIRIT EL TEAM salutes you 🚀
          </span>
          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Thank You! Continue Exploring 🌠
          </button>
        </div>
      </div>
    </div>
  );
};
