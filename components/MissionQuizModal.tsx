import React, { useState } from 'react';
import { SpacecraftRelic, CharacterCustomization } from '../types';
import { CartoonAvatar } from './CartoonAvatar';
import { TeamLogo } from './TeamLogo';
import { soundEffects } from '../services/soundEffects';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  ArrowRight,
  X,
  Compass,
} from 'lucide-react';

interface MissionQuizModalProps {
  relic: SpacecraftRelic;
  character: CharacterCustomization;
  onBadgeAwarded: (relicId: string) => void;
  onClose: () => void;
  onExploreMore: () => void;
}

export const MissionQuizModal: React.FC<MissionQuizModalProps> = ({
  relic,
  character,
  onBadgeAwarded,
  onClose,
  onExploreMore,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = relic.quiz;
  const currentQ = questions[currentQIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      soundEffects.playSuccess();
      setScore((prev) => prev + 1);
    } else {
      soundEffects.playError();
    }
  };

  const handleNext = () => {
    soundEffects.playClick();
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed!
      setIsCompleted(true);
      soundEffects.playBadgeAward();
      onBadgeAwarded(relic.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#090e1a] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Mission Knowledge Quiz: {relic.arabicName}
              </h2>
              <span className="text-[11px] text-slate-400">
                Question {currentQIndex + 1} of {questions.length}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isCompleted ? (
            <div className="space-y-5">
              {/* Question Text */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-cyan-400 block mb-1">
                  EXPLORER CHALLENGE
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  let btnStyle = 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-200';
                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold';
                    } else if (idx === selectedOption) {
                      btnStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                    } else {
                      btnStyle = 'border-slate-800/40 bg-slate-900/20 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all text-xs sm:text-sm ${btnStyle}`}
                    >
                      <span className="leading-relaxed">{option}</span>
                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Educational Explanation Box */}
              {isAnswered && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    selectedOption === currentQ.correctIndex
                      ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                      : 'border-amber-500/30 bg-amber-950/20 text-amber-300'
                  }`}
                >
                  <span className="font-bold block mb-0.5">
                    {selectedOption === currentQ.correctIndex ? 'Brilliant Answer! 🎉' : 'Science Insight: 💡'}
                  </span>
                  {currentQ.explanation}
                </div>
              )}
            </div>
          ) : (
            /* ================= BADGE AWARDED CELEBRATION ================= */
            <div className="flex flex-col items-center text-center py-4 space-y-4">
              <div className="relative">
                {/* Official Badge with Team Logo & Celestial Token */}
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full p-2 bg-gradient-to-tr from-amber-400 via-rose-500 to-cyan-400 shadow-[0_0_50px_rgba(245,158,11,0.4)] flex items-center justify-center relative group">
                  <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center p-3 relative overflow-hidden border border-slate-800">
                    {/* Team Logo embedded in badge */}
                    <TeamLogo size="sm" withGlow={false} className="mb-1" />
                    
                    <span className="text-[10px] font-mono text-cyan-400 tracking-wider">
                      SPIRIT EL TEAM
                    </span>
                    <span className="text-xs font-bold text-amber-300 line-clamp-1 mt-0.5">
                      {relic.badge.title}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5">
                      {relic.celestialBody.arabicName}
                    </span>
                  </div>
                </div>

                <div className="absolute -top-2 -right-2 p-2 rounded-full bg-amber-500 text-slate-950 shadow-md animate-bounce">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              {/* Character Cheers */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <CartoonAvatar customization={character} size="sm" isExcited={true} />
                <div className="text-left text-xs">
                  <span className="font-bold text-white block">
                    {character.name || 'Explorer'}: We earned this badge!
                  </span>
                  <span className="text-[10px] text-cyan-400">
                    Added the {relic.celestialBody.arabicName} badge to your space log.
                  </span>
                </div>
              </div>

              <div className="max-w-md">
                <h3 className="text-lg font-extrabold text-white">
                  You unlocked {relic.badge.title}!
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {relic.badge.description}
                </p>
                <div className="mt-2 text-xs font-mono text-emerald-400">
                  Mastery Score: {score} out of {questions.length}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/40">
          {!isCompleted ? (
            <>
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Postpone Quiz
              </button>
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  isAnswered
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{currentQIndex + 1 < questions.length ? 'Next Question' : 'Claim Badge 🏅'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={onExploreMore}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 text-xs font-bold shadow-lg active:scale-95 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Explore More Planets</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
