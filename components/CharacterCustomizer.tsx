import React, { useState } from 'react';
import { CharacterCustomization, OutfitStyle, HelmetStyle } from '../types';
import { CartoonAvatar } from './CartoonAvatar';
import { soundEffects } from '../services/soundEffects';
import {
  Sparkles,
  Check,
  X,
  RotateCcw,
  Shield,
  Star,
  Rocket,
  Eye,
  Lock,
  Award,
  Shirt,
  Palette,
} from 'lucide-react';

interface CharacterCustomizerProps {
  customization: CharacterCustomization;
  onSave: (updated: CharacterCustomization) => void;
  onClose: () => void;
  unlockedBadgesCount?: number;
}

const OUTFIT_STYLES: Array<{
  id: OutfitStyle;
  label: string;
  desc: string;
  tag: string;
}> = [
  {
    id: 'classic_eva',
    label: 'Classic EVA Spacesuit',
    desc: 'Standard spacewalk suit equipped with chest life-support module and utility belt',
    tag: 'Standard 🚀',
  },
  {
    id: 'commander_jacket',
    label: 'Field Commander Jacket',
    desc: 'Sleek cosmic flight jacket featuring golden shoulder rank insignia and cargo pockets',
    tag: 'Command 🎖️',
  },
  {
    id: 'stealth_armor',
    label: 'Advanced Tactical Armor',
    desc: 'Angular composite chest and shoulder plating powered by a glowing energy core',
    tag: 'Armored 🛡️',
  },
  {
    id: 'galactic_cape',
    label: 'Royal Explorer Cape Suit',
    desc: 'Star-woven cosmic cloak paired with an ornate golden ceremonial sash',
    tag: 'Legendary 👑',
  },
  {
    id: 'retro_apollo',
    label: 'Heritage Apollo Suit',
    desc: 'Classic Moon-landing era silhouette featuring historic mission stripes',
    tag: 'Heritage 🌕',
  },
  {
    id: 'nebula_hoodie',
    label: 'Modern Nebula Hoodie',
    desc: 'Comfortable cosmic pullover with a padded collar and sporty neon accents',
    tag: 'Modern ⚡',
  },
];

const HELMET_STYLES: Array<{
  id: HelmetStyle;
  label: string;
  desc: string;
  tag: string;
}> = [
  {
    id: 'classic',
    label: 'Classic Bubble Helmet',
    desc: 'Traditional spherical dome with a pressurized silver neck ring and oval visor',
    tag: 'Classic 🪐',
  },
  {
    id: 'tactical',
    label: 'Tactical Recon Helmet',
    desc: 'Angular armored shell with a glowing crown ridge, cheek vents, and hexagonal HUD visor',
    tag: 'Tactical 🛡️',
  },
  {
    id: 'panoramic',
    label: 'Panoramic Observatory Dome',
    desc: 'Extra-wide full-view glass bubble topped with dual exploration brow floodlights',
    tag: 'Wide View 🔭',
  },
  {
    id: 'heritage_apollo',
    label: 'Heritage Apollo Boxy Helmet',
    desc: 'Tall Moon-mission silhouette with an upper sun-shield brow and rectangular viewport',
    tag: 'Heritage 🌕',
  },
];

const SUIT_COLORS = [
  { name: 'Space White', value: '#ffffff' },
  { name: 'Cosmic Cyan', value: '#06b6d4' },
  { name: 'Solar Gold', value: '#f59e0b' },
  { name: 'Nebula Violet', value: '#8b5cf6' },
  { name: 'Orbital Emerald', value: '#10b981' },
  { name: 'Crimson Flare', value: '#ef4444' },
  { name: 'Midnight Blue', value: '#2563eb' },
  { name: 'Nova Pink', value: '#ec4899' },
];

const SECONDARY_COLORS = [
  { name: 'Deep Navy', value: '#1e293b' },
  { name: 'Steel Slate', value: '#475569' },
  { name: 'Sky Azure', value: '#0284c7' },
  { name: 'Amber Gold', value: '#d97706' },
  { name: 'Royal Purple', value: '#6d28d9' },
  { name: 'Deep Crimson', value: '#be123c' },
];

const VISOR_TINTS = [
  { name: 'Golden Reflection', value: '#fbbf24' },
  { name: 'Polar Blue', value: '#38bdf8' },
  { name: 'Nebula Purple', value: '#c084fc' },
  { name: 'Hologram Green', value: '#34d399' },
  { name: 'Crystal Silver', value: '#e2e8f0' },
];

const BADGE_SYMBOLS: Array<{ id: CharacterCustomization['badgeSymbol']; label: string; icon: React.ReactNode }> = [
  { id: 'star', label: 'Explorer Star', icon: <Star className="w-4 h-4 text-amber-400" /> },
  { id: 'rocket', label: 'Pathfinder Rocket', icon: <Rocket className="w-4 h-4 text-cyan-400" /> },
  { id: 'planet', label: 'Orbital Planet', icon: <Eye className="w-4 h-4 text-purple-400" /> },
  { id: 'shield', label: 'Aegis Shield', icon: <Shield className="w-4 h-4 text-emerald-400" /> },
  { id: 'atom', label: 'Science Core', icon: <Sparkles className="w-4 h-4 text-sky-400" /> },
];

export interface ExplorerGear {
  id: CharacterCustomization['accessory'];
  label: string;
  desc: string;
  requiredBadges: number;
  iconName: string;
}

export const EXPLORER_GEAR_LIST: ExplorerGear[] = [
  {
    id: 'none',
    label: 'Lightweight Base Suit',
    desc: 'Ultra-light streamlined configuration for new recruits',
    requiredBadges: 0,
    iconName: 'user',
  },
  {
    id: 'antenna',
    label: 'Cosmic Comms Antenna',
    desc: 'Captures deep-space transmissions and telemetry pulses',
    requiredBadges: 1,
    iconName: 'radio',
  },
  {
    id: 'goggles',
    label: 'Laser Recon Goggles',
    desc: 'Thermal-vision optics for spotting planetary debris in the dark',
    requiredBadges: 2,
    iconName: 'goggles',
  },
  {
    id: 'jetpack',
    label: 'Free-Flight Flame Jetpack',
    desc: 'Dual thruster pack for agile zero-gravity maneuvers',
    requiredBadges: 3,
    iconName: 'jetpack',
  },
  {
    id: 'backpack',
    label: 'Advanced Explorer Pack',
    desc: 'Insulated canisters for storing rock samples and extra oxygen tanks',
    requiredBadges: 4,
    iconName: 'backpack',
  },
  {
    id: 'scanner',
    label: 'Handheld Resonance Radar',
    desc: 'Holographic field scanner to diagnose forgotten spacecraft systems',
    requiredBadges: 6,
    iconName: 'scanner',
  },
  {
    id: 'quantum_wings',
    label: 'Quantum Solar Wings',
    desc: 'Radiant holographic energy wings built for advanced orbital flight',
    requiredBadges: 8,
    iconName: 'wings',
  },
];

export const CharacterCustomizer: React.FC<CharacterCustomizerProps> = ({
  customization,
  onSave,
  onClose,
  unlockedBadgesCount = 0,
}) => {
  const [draft, setDraft] = useState<CharacterCustomization>({
    outfitStyle: 'classic_eva',
    secondaryColor: '#1e293b',
    helmetStyle: 'classic',
    ...customization,
  });
  const [activeTab, setActiveTab] = useState<'outfit' | 'suit' | 'accessory' | 'visor' | 'badge'>('outfit');

  const handleOutfitChange = (style: OutfitStyle) => {
    soundEffects.playClick();
    setDraft((prev) => ({ ...prev, outfitStyle: style }));
  };

  const handleHelmetChange = (style: HelmetStyle) => {
    soundEffects.playClick();
    setDraft((prev) => ({ ...prev, helmetStyle: style }));
  };

  const handleSuitChange = (color: string) => {
    soundEffects.playClick();
    setDraft((prev) => ({ ...prev, suitColor: color }));
  };

  const handleSecondaryColorChange = (color: string) => {
    soundEffects.playClick();
    setDraft((prev) => ({ ...prev, secondaryColor: color }));
  };

  const handleVisorChange = (color: string) => {
    soundEffects.playClick();
    setDraft((prev) => ({ ...prev, visorTint: color }));
  };

  const handleBadgeChange = (symbol: CharacterCustomization['badgeSymbol']) => {
    soundEffects.playClick();
    setDraft((prev) => ({ ...prev, badgeSymbol: symbol }));
  };

  const handleAccessoryChange = (item: ExplorerGear) => {
    if (unlockedBadgesCount < item.requiredBadges) {
      soundEffects.playClick();
      return;
    }
    soundEffects.playClick();
    setDraft((prev) => ({ ...prev, accessory: item.id }));
  };

  const handleReset = () => {
    soundEffects.playClick();
    setDraft({
      name: 'Little Astronaut',
      suitColor: '#06b6d4',
      secondaryColor: '#1e293b',
      outfitStyle: 'classic_eva',
      helmetStyle: 'classic',
      visorTint: '#fbbf24',
      badgeSymbol: 'rocket',
      companionTitle: 'Cosmic Explorer',
      accessory: unlockedBadgesCount >= 2 ? 'goggles' : 'none',
    });
  };

  const handleSaveAndClose = () => {
    soundEffects.playSuccess();
    onSave(draft);
    onClose();
  };

  const activeOutfitInfo = OUTFIT_STYLES.find((o) => o.id === (draft.outfitStyle || 'classic_eva'));
  const activeHelmetInfo = HELMET_STYLES.find((h) => h.id === (draft.helmetStyle || 'classic'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  Customize Astronaut Outfit &amp; Look
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[11px] font-bold border border-amber-500/30">
                  {unlockedBadgesCount} / 10 Badges
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose your spacesuit design, helmet design, favorite colors, and exploration gear!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 overflow-y-auto">
          {/* Avatar Preview Box */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 relative">
            <div className="absolute top-3 left-3 text-[11px] text-cyan-400/90 font-mono tracking-wider">
              LIVE PREVIEW
            </div>

            <CartoonAvatar
              customization={draft}
              size="hero"
              isExcited={false}
              isStanding={true}
              isFlying={draft.accessory === 'jetpack' || draft.accessory === 'quantum_wings'}
              unlockedBadgesCount={unlockedBadgesCount}
            />

            <div className="mt-4 text-center">
              <span className="text-base font-bold text-slate-200">{draft.name || 'Space Explorer'}</span>
              <div className="text-xs text-cyan-400 mt-0.5">{activeOutfitInfo?.label}</div>
              <div className="text-[11px] text-amber-300/90 mt-0.5">{activeHelmetInfo?.label}</div>

              {/* Current Active Tool Tag */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[11px] text-cyan-300 font-medium">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>
                  {EXPLORER_GEAR_LIST.find((g) => g.id === draft.accessory)?.label || 'Base Gear'}
                </span>
              </div>
            </div>

            {/* Quick reset */}
            <button
              onClick={handleReset}
              className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          </div>

          {/* Controls Panel */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Explorer Name</label>
              <input
                type="text"
                value={draft.name}
                maxLength={24}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Enter your astronaut's name..."
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Customization Tabs */}
            <div className="flex border-b border-slate-800 pb-1 gap-3 overflow-x-auto">
              <button
                onClick={() => { soundEffects.playClick(); setActiveTab('outfit'); }}
                className={`pb-2 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'outfit'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shirt className="w-3.5 h-3.5 text-cyan-400" />
                <span>Suit Design 👕</span>
              </button>
              <button
                onClick={() => { soundEffects.playClick(); setActiveTab('visor'); }}
                className={`pb-2 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'visor'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>Helmet &amp; Visor 🪖</span>
              </button>
              <button
                onClick={() => { soundEffects.playClick(); setActiveTab('suit'); }}
                className={`pb-2 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'suit'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Suit Colors 🎨</span>
              </button>
              <button
                onClick={() => { soundEffects.playClick(); setActiveTab('accessory'); }}
                className={`pb-2 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'accessory'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Explorer Gear 🎒</span>
              </button>
              <button
                onClick={() => { soundEffects.playClick(); setActiveTab('badge'); }}
                className={`pb-2 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'badge'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Chest Emblem
              </button>
            </div>

            {/* Tab 1: Outfit & Clothing Style Selection */}
            {activeTab === 'outfit' && (
              <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                {OUTFIT_STYLES.map((style) => {
                  const isSelected = (draft.outfitStyle || 'classic_eva') === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => handleOutfitChange(style.id)}
                      className={`flex items-start justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                          : 'border-slate-800 bg-slate-900/70 hover:border-slate-600 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-100'}`}>
                            {style.label}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-semibold">
                            {style.tag}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {style.desc}
                        </div>
                      </div>
                      <div className="pt-0.5 shrink-0">
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Primary & Secondary Clothing Colors */}
            {activeTab === 'suit' && (
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-300 mb-2">
                    Primary Color (Jacket / Suit)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {SUIT_COLORS.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => handleSuitChange(item.value)}
                        className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          draft.suitColor === item.value
                            ? 'border-cyan-400 bg-cyan-950/30'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: item.value }}
                        />
                        <span className="text-xs text-slate-200 truncate">{item.name}</span>
                        {draft.suitColor === item.value && <Check className="w-3.5 h-3.5 text-cyan-400 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-300 mb-2">
                    Secondary Color (Pants / Cape / Accents)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SECONDARY_COLORS.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => handleSecondaryColorChange(item.value)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          (draft.secondaryColor || '#1e293b') === item.value
                            ? 'border-amber-400 bg-amber-950/30'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: item.value }}
                        />
                        <span className="text-[11px] text-slate-200 truncate">{item.name}</span>
                        {(draft.secondaryColor || '#1e293b') === item.value && (
                          <Check className="w-3 h-3 text-amber-400 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Exploration Tools (Unlocked by Badges) */}
            {activeTab === 'accessory' && (
              <div className="flex flex-col gap-2">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 animate-bounce" />
                    <span className="text-slate-300 font-medium">Earned Badges:</span>
                  </div>
                  <span className="font-bold text-amber-300 font-mono">
                    {unlockedBadgesCount} of 10 Badges
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                  {EXPLORER_GEAR_LIST.map((item) => {
                    const isUnlocked = unlockedBadgesCount >= item.requiredBadges;
                    const isSelected = draft.accessory === item.id;

                    return (
                      <button
                        key={item.id}
                        disabled={!isUnlocked}
                        onClick={() => handleAccessoryChange(item)}
                        className={`flex items-start justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : isUnlocked
                            ? 'border-slate-800 bg-slate-900/70 hover:border-slate-600 hover:bg-slate-900'
                            : 'border-slate-800/50 bg-slate-950/60 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex-1 pr-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold ${
                                isSelected
                                  ? 'text-cyan-300'
                                  : isUnlocked
                                  ? 'text-slate-100'
                                  : 'text-slate-400'
                              }`}
                            >
                              {item.label}
                            </span>
                            {item.requiredBadges > 0 && (
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                                  isUnlocked
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                                }`}
                              >
                                {isUnlocked
                                  ? 'Unlocked ✓'
                                  : `Requires ${item.requiredBadges} Badges`}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            {item.desc}
                          </div>
                        </div>

                        <div className="pt-0.5 shrink-0">
                          {isSelected ? (
                            <Check className="w-4 h-4 text-cyan-400" />
                          ) : !isUnlocked ? (
                            <Lock className="w-4 h-4 text-slate-500" />
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 4: Helmet Design & Visor Tint */}
            {activeTab === 'visor' && (
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                <div>
                  <span className="block text-xs font-semibold text-slate-300 mb-2">
                    Helmet Design
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {HELMET_STYLES.map((h) => {
                      const isSelected = (draft.helmetStyle || 'classic') === h.id;
                      return (
                        <button
                          key={h.id}
                          onClick={() => handleHelmetChange(h.id)}
                          className={`flex items-start justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                              : 'border-slate-800 bg-slate-900/70 hover:border-slate-600 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex-1 pr-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-100'}`}>
                                {h.label}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-semibold">
                                {h.tag}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              {h.desc}
                            </div>
                          </div>
                          <div className="pt-0.5 shrink-0">
                            {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-300 mb-2">Helmet Visor Tint</span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {VISOR_TINTS.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => handleVisorChange(item.value)}
                        className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          draft.visorTint === item.value
                            ? 'border-cyan-400 bg-cyan-950/30'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: item.value }}
                        />
                        <span className="text-xs text-slate-200 truncate">{item.name}</span>
                        {draft.visorTint === item.value && <Check className="w-3.5 h-3.5 text-cyan-400 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Badge Symbol */}
            {activeTab === 'badge' && (
              <div className="grid grid-cols-1 gap-2">
                {BADGE_SYMBOLS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleBadgeChange(item.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      draft.badgeSymbol === item.id
                        ? 'border-cyan-400 bg-cyan-950/30'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded bg-slate-800">{item.icon}</div>
                      <span className="text-xs font-medium text-slate-200">{item.label}</span>
                    </div>
                    {draft.badgeSymbol === item.id && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <div className="text-xs text-slate-400">
            {unlockedBadgesCount === 0 ? (
              <span>Complete planetary quizzes to unlock advanced explorer gear!</span>
            ) : (
              <span className="text-cyan-400 font-bold">
                Awesome! You unlocked {EXPLORER_GEAR_LIST.filter((g) => unlockedBadgesCount >= g.requiredBadges).length} of 7 explorer tools.
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndClose}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Save New Look ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
