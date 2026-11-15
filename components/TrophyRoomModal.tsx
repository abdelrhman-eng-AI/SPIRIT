import React, { useState } from 'react';
import { SpacecraftRelic, CharacterCustomization, EraId } from '../types';
import { SPACE_RELICS, ERAS_CONFIG } from '../data/spaceData';
import { TeamLogo } from './TeamLogo';
import { CartoonAvatar } from './CartoonAvatar';
import { soundEffects } from '../services/soundEffects';
import {
  Award,
  X,
  Lock,
  Sparkles,
  CheckCircle,
  Trophy,
  Star,
  Compass,
} from 'lucide-react';

interface TrophyRoomModalProps {
  unlockedBadgeIds: string[];
  character: CharacterCustomization;
  onClose: () => void;
  onOpenGrandCelebration: () => void;
  onSelectRelicToExplore: (relicId: string) => void;
}

export const TrophyRoomModal: React.FC<TrophyRoomModalProps> = ({
  unlockedBadgeIds,
  character,
  onClose,
  onOpenGrandCelebration,
  onSelectRelicToExplore,
}) => {
  const [selectedEraFilter, setSelectedEraFilter] = useState<'all' | EraId>('all');
  const [activeBadgePreview, setActiveBadgePreview] = useState<SpacecraftRelic | null>(null);

  const totalRelics = SPACE_RELICS.length;
  const unlockedCount = unlockedBadgeIds.length;
  const completionPercentage = totalRelics > 0 ? Math.round((unlockedCount / totalRelics) * 100) : 0;

  const filteredRelics = selectedEraFilter === 'all'
    ? SPACE_RELICS
    : SPACE_RELICS.filter((r) => r.eraId === selectedEraFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#090e1a] border border-cyan-500/30 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                Cosmic Trophy &amp; Badge Room
              </h2>
              <span className="text-xs text-slate-400">
                Official SPIRIT EL TEAM Exploration Relics &amp; Honors Museum
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

        {/* Overview Stats Strip */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Progress Bar */}
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Relics &amp; Badges Discovery Progress</span>
              <span className="font-mono text-cyan-400 font-bold">
                {unlockedCount} / {totalRelics} ({completionPercentage}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Special Grand Badge CTA Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenGrandCelebration();
            }}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>View Custom Grand Honor Badge</span>
          </button>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900/30 border-b border-slate-800 overflow-x-auto text-xs">
          <button
            onClick={() => { soundEffects.playClick(); setSelectedEraFilter('all'); }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedEraFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Badges ({totalRelics})
          </button>
          {ERAS_CONFIG.map((era) => (
            <button
              key={era.id}
              onClick={() => { soundEffects.playClick(); setSelectedEraFilter(era.id); }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedEraFilter === era.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {era.years}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredRelics.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
              <Lock className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-bold text-slate-300">No Spacecraft Assigned in This Era Yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Both spacecraft slots for this era are currently empty.
              </p>
            </div>
          ) : (
            filteredRelics.map((relic) => {
              const isUnlocked = unlockedBadgeIds.includes(relic.id);

              return (
                <div
                  key={relic.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveBadgePreview(relic);
                  }}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center group ${
                    isUnlocked
                      ? 'bg-slate-900/70 border-amber-500/30 hover:border-amber-400 hover:bg-slate-900 shadow-md'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 opacity-60'
                  }`}
                >
                  {/* Badge Visual Disc */}
                  <div className="relative mb-3">
                    <div
                      className={`w-20 h-20 rounded-full p-1.5 flex items-center justify-center relative transition-transform group-hover:scale-105 ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-cyan-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                          : 'bg-slate-800 border border-slate-700'
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center p-1 relative overflow-hidden">
                        {isUnlocked ? (
                          <>
                            <TeamLogo size="sm" withGlow={false} className="w-8 h-8 mb-0.5" />
                            <span className="text-[7px] text-amber-300 font-bold line-clamp-1">
                              {relic.badge.title}
                            </span>
                          </>
                        ) : (
                          <Lock className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                    </div>

                    {isUnlocked && (
                      <div className="absolute -top-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Badge Info */}
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {relic.badge.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {relic.celestialBody.arabicName}
                  </span>

                  <div className="mt-3 text-[11px] font-semibold">
                    {isUnlocked ? (
                      <span className="text-emerald-400">Earned &amp; Saved 🏅</span>
                    ) : (
                      <span className="text-slate-500">Locked (Complete Planet Quiz)</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Badge Detailed Inspect Drawer */}
        {activeBadgePreview && (
          <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <TeamLogo size="sm" withGlow={false} />
              <div>
                <div className="text-xs font-bold text-white">
                  {activeBadgePreview.badge.title}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  {activeBadgePreview.badge.description}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onSelectRelicToExplore(activeBadgePreview.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Visit Planet &amp; Relic</span>
              </button>
              <button
                onClick={() => setActiveBadgePreview(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
