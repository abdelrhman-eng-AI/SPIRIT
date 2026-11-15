import React from 'react';
import { CharacterCustomization, EraId } from '../types';
import { TeamLogo } from './TeamLogo';
import { CartoonAvatar } from './CartoonAvatar';
import { useIsAssetFailed } from '../context/AssetPreloadContext';
import { soundEffects } from '../services/soundEffects';

const HOME_HERO_BACKDROP_URL = '/assets/images/realistic_deep_space_cinematic_1792424017979.jpg';
import { ERAS_CONFIG, SPACE_RELICS } from '../data/spaceData';
import {
  Rocket,
  Trophy,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Activity,
  Layers,
  Music,
  Play,
  Pause,
  HelpCircle,
} from 'lucide-react';
import { ambientMusicService } from '../services/ambientMusicService';

interface HomeScreenProps {
  character: CharacterCustomization;
  unlockedBadgeIds: string[];
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onStartJourney: () => void;
  onOpenCustomizer: () => void;
  onOpenTrophyRoom: () => void;
  onSelectRelicFromHome?: (relicId: string) => void;
  onSelectEraDirectly: (eraId: EraId) => void;
  onOpenOnboarding: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  character,
  unlockedBadgeIds,
  isSoundEnabled,
  onToggleSound,
  onStartJourney,
  onOpenCustomizer,
  onOpenTrophyRoom,
  onSelectEraDirectly,
  onOpenOnboarding,
}) => {
  const [isMusicPlaying, setIsMusicPlaying] = React.useState<boolean>(false);
  const [volume, setVolume] = React.useState<number>(0.65);
  const preloadHeroFailed = useIsAssetFailed(HOME_HERO_BACKDROP_URL);
  const [hasHeroImageError, setHasHeroImageError] = React.useState<boolean>(false);
  const hideHeroImage = preloadHeroFailed || hasHeroImageError;

  React.useEffect(() => {
    // Attempt auto-start on first user interaction in window
    const handleFirstInteraction = () => {
      if (!ambientMusicService.getIsPlaying()) {
        ambientMusicService.startMusic();
        setIsMusicPlaying(true);
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    // Also check if already playing
    if (ambientMusicService.getIsPlaying()) {
      setIsMusicPlaying(true);
    }

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const handleToggleMusic = () => {
    soundEffects.playClick();
    const playing = ambientMusicService.toggleMusic();
    setIsMusicPlaying(playing);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    ambientMusicService.setVolume(val);
    if (!isMusicPlaying && val > 0) {
      ambientMusicService.startMusic();
      setIsMusicPlaying(true);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Photorealistic Cinematic Deep Space Nebula & Earth Horizon Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#03060d]">
        {!hideHeroImage && (
          <img
            src={HOME_HERO_BACKDROP_URL}
            alt="Cinematic Deep Space"
            sizes="100vw"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onError={() => setHasHeroImageError(true)}
            className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
          />
        )}
        {/* Vignette Scrim & Soft Dark Gradients for Maximum Readability */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#03060f]/60 to-[#020409]/90" />
      </div>

      {/* 2. Top Header Navigation (Clean 3-Zone Contract) */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-md">
        {/* Zone 1: Team Brand Identity */}
        <div className="flex items-center gap-3">
          <TeamLogo size="sm" withGlow={false} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                SPIRIT EL TEAM
              </h1>
              <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-cyan-400 font-mono block">
              Forgotten Spacecraft &amp; Cosmic Relics Observatory
            </span>
          </div>
        </div>

        {/* Zone 2: Real-time Telemetry Status Banner */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Cosmic Radar: Active</span>
          <span className="text-slate-600">·</span>
          <span className="text-cyan-300">
            {SPACE_RELICS.length} Forgotten Space {SPACE_RELICS.length === 1 ? 'Relic' : 'Relics'} Tracked
          </span>
        </div>

        {/* Zone 3: Actions (Music, Sound, Trophies, Custom Character) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Ambient Space Soundtrack Button */}
          <button
            onClick={handleToggleMusic}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl border transition-all shadow-md text-xs font-semibold ${
              isMusicPlaying
                ? 'bg-cyan-950/80 border-cyan-400/80 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/90 border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-500'
            }`}
            title={isMusicPlaying ? 'Pause Space Soundtrack' : 'Play Cosmic Soundtrack'}
          >
            <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'text-cyan-400 animate-spin' : ''}`} />
            <span className="hidden sm:inline">Space Music</span>
            {isMusicPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-0.5 sm:w-1 bg-cyan-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                <span className="w-0.5 sm:w-1 bg-cyan-300 rounded-full animate-bounce h-3.5" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 sm:w-1 bg-cyan-400 rounded-full animate-bounce h-2.5" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <Play className="w-3 h-3 text-slate-400" />
            )}
          </button>

          {/* Kid-Friendly Onboarding Guide Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenOnboarding();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-cyan-500/20 hover:from-orange-500/30 hover:to-cyan-500/30 border border-orange-400/60 text-xs font-bold text-orange-300 hover:text-white transition-all shadow-md group"
            title="Explorer Guide (How to Play)"
          >
            <HelpCircle className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Explorer Guide</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-slate-300 hover:text-white transition-colors shadow-md"
            title={isSoundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Trophy Room Access */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenTrophyRoom();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-xs font-semibold text-amber-300 transition-colors shadow-md"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Badges ({unlockedBadgeIds.length})</span>
          </button>

          {/* Character Quick Customize */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenCustomizer();
            }}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-xs font-semibold text-slate-200 transition-colors shadow-md"
            title="Customize Your Astronaut"
          >
            <CartoonAvatar
              customization={character}
              size="sm"
              isStanding={true}
              isFlying={false}
              unlockedBadgesCount={unlockedBadgeIds.length}
            />
            <span className="hidden sm:inline font-bold">{character.name}</span>
          </button>
        </div>
      </header>

      {/* Main Center Stage: Official Team Emblem & "Start Your Journey" */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center max-w-4xl mx-auto w-full my-auto">
        {/* Realistic Central Hub: Team Official Emblem with Celestial Orbit */}
        <div className="relative mb-5">
          <TeamLogo size="hero" withGlow={true} />

          {/* Cartoon Character hovering near emblem with prompt */}
          <div className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 z-30">
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenCustomizer();
              }}
              className="group flex flex-col items-center cursor-pointer"
              title="Click to customize your astronaut"
            >
              <CartoonAvatar
                customization={character}
                size="md"
                isExcited={true}
                isStanding={true}
                isFlying={false}
                unlockedBadgesCount={unlockedBadgeIds.length}
              />
              <span className="text-[10px] bg-cyan-950/90 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/40 font-bold shadow-lg -mt-1 group-hover:scale-105 transition-transform backdrop-blur-sm">
                Customize Suit 🎨
              </span>
            </button>
          </div>
        </div>

        {/* Title Proclamation */}
        <div className="space-y-2 mb-4 max-w-2xl">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Forgotten Space Relics Archive
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl mx-auto drop-shadow-md">
            An interactive journey across 3 cosmic eras (1967–1997 · 1971–1972 · 1969–2004) to discover and document lost spacecraft and probes resting across distant planets.
          </p>
        </div>

        {/* Interactive Space Soundtrack Banner in Home Screen */}
        <div className="mb-6 w-full max-w-md mx-auto">
          <div className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-black/70 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.25)]">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleMusic}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
                title={isMusicPlaying ? 'Pause Music' : 'Play Space Soundtrack'}
              >
                {isMusicPlaying ? (
                  <Pause className="w-5 h-5 fill-slate-950" />
                ) : (
                  <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
                )}
              </button>

              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Cosmic Soundtrack</span>
                  {isMusicPlaying && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>
                <span className="text-[10px] text-cyan-300 font-mono block">
                  Interstellar Exploration Theme 🎵
                </span>
              </div>
            </div>

            {/* Live Visualizer Waves & Volume */}
            <div className="flex items-center gap-2">
              {isMusicPlaying ? (
                <div className="flex items-end gap-1 h-5 px-1">
                  <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-3" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 bg-sky-300 rounded-full animate-bounce h-5" style={{ animationDelay: '120ms' }} />
                  <span className="w-1 bg-teal-400 rounded-full animate-bounce h-4" style={{ animationDelay: '240ms' }} />
                  <span className="w-1 bg-cyan-300 rounded-full animate-bounce h-2" style={{ animationDelay: '360ms' }} />
                </div>
              ) : (
                <button
                  onClick={handleToggleMusic}
                  className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 transition-colors"
                >
                  Play ▶
                </button>
              )}

              {/* Volume Slider */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                title={`Volume: ${Math.round(volume * 100)}%`}
              />
            </div>
          </div>
        </div>

        {/* Central Primary CTA Button: "Start Your Journey" */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              // Ensure music starts on journey start if not already playing
              if (!ambientMusicService.getIsPlaying()) {
                ambientMusicService.startMusic();
                setIsMusicPlaying(true);
              }
              onStartJourney();
            }}
            className="group relative flex items-center gap-3 px-8 sm:px-11 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-sky-300 text-slate-950 text-base sm:text-lg font-black shadow-[0_0_50px_rgba(6,182,212,0.6)] active:scale-95 transition-all cursor-pointer"
          >
            <Rocket className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse group-hover:translate-x-1 transition-transform" />
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Eras Direct Quick Access Strip */}
        <div className="mt-8 w-full max-w-2xl">
          <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-cyan-400/90 mb-2.5 tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Select a historical era directly to warp into:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {ERAS_CONFIG.map((era) => (
              <button
                key={era.id}
                onClick={() => {
                  soundEffects.playClick();
                  onSelectEraDirectly(era.id);
                }}
                className="flex flex-col items-center p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900/90 border border-slate-800/80 hover:border-cyan-400/80 backdrop-blur-md transition-all text-center group cursor-pointer shadow-lg"
              >
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {era.years}
                </span>
                <span className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">
                  {era.arabicTitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Realistic Footer Info Strip */}
      <footer className="relative z-20 px-6 py-3 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">SPIRIT EL TEAM</span>
          <span>·</span>
          <span>Preserving the Heritage of Forgotten Space Relics Across the Solar System</span>
        </div>
        <div className="text-cyan-400 font-mono font-semibold">
          Earned Badges: {unlockedBadgeIds.length} / {SPACE_RELICS.length}
        </div>
      </footer>
    </div>
  );
};
