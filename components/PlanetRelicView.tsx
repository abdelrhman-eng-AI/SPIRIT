import React, { useEffect, useState } from 'react';
import { SpacecraftRelic, CharacterCustomization } from '../types';
import { CartoonAvatar } from './CartoonAvatar';
import { speechService } from '../services/speechSynthesis';
import { soundEffects } from '../services/soundEffects';
import { TeamLogo } from './TeamLogo';
import { LiveAudioTranscription } from './LiveAudioTranscription';
import { TalkingAstronautPresenter } from './TalkingAstronautPresenter';
import { MissionLogView } from './MissionLogView';
import { PlanetWeatherCanvas, getPlanetWeatherConfig } from './PlanetWeatherCanvas';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Calendar,
  Compass,
  Award,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  ClipboardCheck,
  CloudRain,
} from 'lucide-react';

interface PlanetRelicViewProps {
  relic: SpacecraftRelic;
  character: CharacterCustomization;
  onBackToGalaxy: () => void;
  onStartQuiz: () => void;
  isBadgeUnlocked?: boolean;
}

export const PlanetRelicView: React.FC<PlanetRelicViewProps> = ({
  relic,
  character,
  onBackToGalaxy,
  onStartQuiz,
  isBadgeUnlocked = false,
}) => {
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
  const [activeWord, setActiveWord] = useState('');
  const [speechRate, setSpeechRate] = useState(0.95);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'links'>('overview');
  const [planetViewMode, setPlanetViewMode] = useState<'surface' | 'globe' | 'relic'>('surface');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [isWeatherEnabled, setIsWeatherEnabled] = useState<boolean>(true);
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const [isMissionLogOpen, setIsMissionLogOpen] = useState<boolean>(false);

  const weatherConfig = React.useMemo(() => getPlanetWeatherConfig(relic), [relic]);
  const isFlybyRelic = relic.celestialBody.id === 'jupiter-flyby' || relic.id === 'pioneer-10-11';

  useEffect(() => {
    setActiveGalleryIndex(0);
  }, [relic.id]);

  // Idle Attention Detection: pulses key interactive elements after 5.5s of inactivity
  useEffect(() => {
    let idleTimeout: number;

    const resetIdleTimer = () => {
      setIsIdle(false);
      window.clearTimeout(idleTimeout);
      idleTimeout = window.setTimeout(() => {
        setIsIdle(true);
      }, 5500);
    };

    resetIdleTimer();

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((evt) => window.addEventListener(evt, resetIdleTimer, { passive: true }));

    return () => {
      window.clearTimeout(idleTimeout);
      events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
    };
  }, [relic.id]);

  const planetAssets = React.useMemo(() => {
    const bodyId = (relic.celestialBody.id || relic.celestialBody.name).toLowerCase();
    if (bodyId.includes('ares') || relic.id.includes('sojourner')) {
      return {
        surfaceImage: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_12.50.50_AM__2__3f2dc579.jpeg',
        globeImage: '/assets/images/realistic_mars_globe_sphere_1792425629915.jpg',
        globeColor: '#c2410c',
        globeGlow: 'rgba(239, 68, 68, 0.55)',
        atmosphere: '95.3% CO₂ · 6.1 mbar pressure',
        gravity: '0.38 g (3.72 m/s²)',
        temp: '-63°C (Surface Avg)',
        featureName: 'Ares Vallis (Carl Sagan Memorial Station)',
      };
    }
    if (bodyId.includes('mars') || relic.id.includes('spirit') || relic.id.includes('opportunity')) {
      return {
        surfaceImage: '/assets/images/realistic_mars_surface_panorama_1792424891866.jpg',
        globeImage: '/assets/images/realistic_mars_globe_sphere_1792425629915.jpg',
        globeColor: '#c2410c',
        globeGlow: 'rgba(239, 68, 68, 0.55)',
        atmosphere: '95.3% CO₂ · 6.1 mbar pressure',
        gravity: '0.38 g (3.72 m/s²)',
        temp: '-63°C (Surface Avg)',
        featureName: 'Gusev Crater & Meridiani Planum',
      };
    }
    if (bodyId.includes('tranquility') || relic.id.includes('eagle')) {
      return {
        surfaceImage: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_2.10.36_AM_1b8c428b.jpeg',
        globeImage: '/assets/images/realistic_moon_globe_sphere_1792425648811.jpg',
        globeColor: '#94a3b8',
        globeGlow: 'rgba(203, 213, 225, 0.55)',
        atmosphere: 'Near-Total Vacuum (0 bar)',
        gravity: '0.166 g (1.62 m/s²)',
        temp: '-130°C to +120°C',
        featureName: 'Tranquility Base (Mare Tranquillitatis)',
      };
    }
    if (bodyId.includes('imbrium') || bodyId.includes('apennine') || relic.id.includes('apollo-15')) {
      return {
        surfaceImage: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_1.24.43_AM__1__d693c709.jpeg',
        globeImage: '/assets/images/realistic_moon_globe_sphere_1792425648811.jpg',
        globeColor: '#94a3b8',
        globeGlow: 'rgba(203, 213, 225, 0.55)',
        atmosphere: 'Near-Total Vacuum (0 bar)',
        gravity: '0.166 g (1.62 m/s²)',
        temp: '-130°C to +120°C',
        featureName: 'Mare Imbrium Plain & Apennine Mountains',
      };
    }
    if (bodyId.includes('moon') || bodyId.includes('lunar') || relic.id.includes('surveyor') || relic.id.includes('apollo')) {
      return {
        surfaceImage: '/assets/images/realistic_moon_surface_panorama_1792424893445.jpg',
        globeImage: '/assets/images/realistic_moon_globe_sphere_1792425648811.jpg',
        globeColor: '#94a3b8',
        globeGlow: 'rgba(203, 213, 225, 0.55)',
        atmosphere: 'Near-Total Vacuum (0 bar)',
        gravity: '0.166 g (1.62 m/s²)',
        temp: '-130°C to +120°C',
        featureName: 'Southeastern Oceanus Procellarum',
      };
    }
    if (bodyId.includes('jupiter-flyby') || relic.id.includes('pioneer')) {
      return {
        surfaceImage: '/assets/images/realistic_jupiter_atmosphere_clouds_1792424893304.jpg',
        globeImage: '/assets/images/realistic_jupiter_globe_sphere_1792425662391.jpg',
        globeColor: '#d97706',
        globeGlow: 'rgba(245, 158, 11, 0.55)',
        atmosphere: 'Hydrogen & Helium · Flyby Encounter Only',
        gravity: '2.53 g (24.79 m/s²)',
        temp: '-110°C (Ammonia Cloud Tops)',
        featureName: 'Jupiter Flyby Encounter (No Landing — Outbound Trajectory)',
      };
    }
    if (bodyId.includes('jupiter') || relic.id.includes('galileo')) {
      return {
        surfaceImage: '/assets/images/realistic_jupiter_atmosphere_clouds_1792424893304.jpg',
        globeImage: '/assets/images/realistic_jupiter_globe_sphere_1792425662391.jpg',
        globeColor: '#d97706',
        globeGlow: 'rgba(245, 158, 11, 0.55)',
        atmosphere: 'Hydrogen & Helium · Crushing Pressure',
        gravity: '2.53 g (24.79 m/s²)',
        temp: '-110°C (Ammonia Cloud Tops)',
        featureName: 'Great Red Spot & Jovian Jet Streams',
      };
    }
    if (bodyId.includes('venus') || relic.id.includes('venera') || relic.id.includes('magellan')) {
      return {
        surfaceImage: '/assets/images/realistic_venus_surface_planet_1792425000849.jpg',
        globeImage: '/assets/images/realistic_venus_globe_sphere_1792425676376.jpg',
        globeColor: '#ca8a04',
        globeGlow: 'rgba(234, 179, 8, 0.55)',
        atmosphere: 'CO₂ & Sulfuric Acid Clouds · 92 bar',
        gravity: '0.904 g (8.87 m/s²)',
        temp: '+465°C (Lead-Melting Heat)',
        featureName: 'Ishtar Terra & Volcanic Lava Plains',
      };
    }
    if (bodyId.includes('comet') || bodyId.includes('halley') || bodyId.includes('67p') || relic.id.includes('giotto') || relic.id.includes('philae')) {
      return {
        surfaceImage: '/assets/images/realistic_comet_surface_1792425014985.jpg',
        globeImage: '/assets/images/realistic_comet_nucleus_1792425691890.jpg',
        globeColor: '#475569',
        globeGlow: 'rgba(148, 163, 184, 0.45)',
        atmosphere: 'Sublimating Water Vapor & Coma Jets',
        gravity: '0.0001 g (Ultra-Low Microgravity)',
        temp: '-70°C to -180°C',
        featureName: 'Agilkia Terrain & Active Ice Vents',
      };
    }
    return {
      surfaceImage: '/assets/images/realistic_deep_space_cinematic_1792424017979.jpg',
      globeImage: '/assets/images/realistic_deep_space_cinematic_1792424017979.jpg',
      globeColor: '#0284c7',
      globeGlow: 'rgba(56, 189, 248, 0.55)',
      atmosphere: 'Open Interstellar Medium',
      gravity: '0.00 g (Orbital Weightlessness)',
      temp: '2.7 Kelvin (-270.45°C)',
      featureName: 'Outer Edges of the Heliosphere',
    };
  }, [relic]);

  const galleryItems = React.useMemo(() => {
    if (relic.gallery && relic.gallery.length > 0) {
      return relic.gallery;
    }
    return relic.image?.trim()
      ? [{ src: relic.image.trim(), label: relic.arabicName }]
      : [];
  }, [relic.gallery, relic.image, relic.arabicName]);

  const activeGalleryItem = galleryItems[activeGalleryIndex] || galleryItems[0] || null;
  const relicImage = activeGalleryItem?.src || '';

  // Atmospheric Glow & Haze config dynamic based on the spacecraft relic type and location
  const atmosphericGlow = React.useMemo(() => {
    const id = relic.id.toLowerCase();
    const body = (relic.celestialBody.id || relic.celestialBody.name).toLowerCase();

    // 1. Venus landers/orbiters (Venera 7, Magellan): Thick acidic sulfur haze, ultra-dense glowing yellow-amber atmosphere
    if (id.includes('venera') || id.includes('magellan') || body.includes('venus')) {
      return {
        typeLabel: 'Dense Scorching Atmosphere (Sulfuric Acid Clouds)',
        colorName: 'Sulfur Gold',
        densityLevel: 'Extreme Density (92 bar)',
        glowColor: 'rgba(234, 179, 8, 0.45)',
        hazeGradient: 'radial-gradient(ellipse at 50% 50%, rgba(234, 179, 8, 0.35) 0%, rgba(202, 138, 4, 0.22) 45%, rgba(113, 63, 18, 0.6) 80%, rgba(0,0,0,0.85) 100%)',
        outerRingShadow: '0 0 60px rgba(234, 179, 8, 0.5), inset 0 0 45px rgba(234, 179, 8, 0.4)',
        blurAmount: 'blur-[2px]',
        particlesColor: '#facc15',
        fogOpacity: 'opacity-70',
        badgeBg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
        pulseDuration: '6s',
      };
    }

    // 2. Mars rovers (Spirit, Opportunity): Dusty basalt rust haze, red iron oxide particulate drift
    if (id.includes('spirit') || id.includes('opportunity') || body.includes('mars')) {
      return {
        typeLabel: 'Drifting Red Iron-Oxide Dust (Martian Sandstorms)',
        colorName: 'Martian Rust Red',
        densityLevel: 'Thin Atmosphere (6.1 mbar)',
        glowColor: 'rgba(239, 68, 68, 0.4)',
        hazeGradient: 'radial-gradient(ellipse at 50% 50%, rgba(249, 115, 22, 0.28) 0%, rgba(220, 38, 38, 0.2) 45%, rgba(127, 29, 29, 0.5) 75%, rgba(0,0,0,0.85) 100%)',
        outerRingShadow: '0 0 50px rgba(239, 68, 68, 0.45), inset 0 0 35px rgba(249, 115, 22, 0.35)',
        blurAmount: 'blur-[1.5px]',
        particlesColor: '#fb923c',
        fogOpacity: 'opacity-55',
        badgeBg: 'bg-orange-950/80 border-orange-500/40 text-orange-300',
        pulseDuration: '8s',
      };
    }

    // 3. Jupiter Atmospheric Probes (Galileo probe): Jovian ammonia storm swirls & fierce radiation haze
    if (id.includes('galileo') || body.includes('jupiter')) {
      return {
        typeLabel: 'Radiation & Ammonia Haze (Deep Jovian Storms)',
        colorName: 'Deep Amber Plasma',
        densityLevel: 'Immense Turbulence (Jovian Depths)',
        glowColor: 'rgba(245, 158, 11, 0.42)',
        hazeGradient: 'radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.3) 0%, rgba(180, 83, 9, 0.22) 50%, rgba(69, 26, 3, 0.6) 80%, rgba(0,0,0,0.9) 100%)',
        outerRingShadow: '0 0 55px rgba(245, 158, 11, 0.5), inset 0 0 40px rgba(217, 119, 6, 0.4)',
        blurAmount: 'blur-[2px]',
        particlesColor: '#f59e0b',
        fogOpacity: 'opacity-65',
        badgeBg: 'bg-amber-950/80 border-amber-600/40 text-amber-300',
        pulseDuration: '5s',
      };
    }

    // 4. Comet Landers / Flybys (Philae, Giotto): Sublimating ice outgassing & crystal coma vapor
    if (id.includes('philae') || id.includes('giotto') || body.includes('comet') || body.includes('halley') || body.includes('67p')) {
      return {
        typeLabel: 'Crystalline Ice Vapor & Coma Outgassing',
        colorName: 'Cold Crystal Ice',
        densityLevel: 'Low-Density Vapor Jets',
        glowColor: 'rgba(56, 189, 248, 0.45)',
        hazeGradient: 'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.32) 0%, rgba(147, 197, 253, 0.18) 45%, rgba(15, 23, 42, 0.55) 75%, rgba(0,0,0,0.85) 100%)',
        outerRingShadow: '0 0 55px rgba(56, 189, 248, 0.5), inset 0 0 35px rgba(186, 230, 253, 0.35)',
        blurAmount: 'blur-[1.5px]',
        particlesColor: '#38bdf8',
        fogOpacity: 'opacity-55',
        badgeBg: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300',
        pulseDuration: '7s',
      };
    }

    // 5. Lunar Landers (Surveyor 3, Apollo relics): Pure vacuum exosphere, electrostatic levitating lunar dust glow
    if (id.includes('surveyor') || id.includes('apollo') || body.includes('moon') || body.includes('lunar')) {
      return {
        typeLabel: 'Orbital Vacuum & Faint Electrostatic Lunar Dust',
        colorName: 'Translucent Silver',
        densityLevel: 'Ultra-Thin (0 bar Lunar Vacuum)',
        glowColor: 'rgba(226, 232, 240, 0.28)',
        hazeGradient: 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.18) 0%, rgba(203, 213, 225, 0.1) 45%, rgba(15, 23, 42, 0.45) 80%, rgba(0,0,0,0.88) 100%)',
        outerRingShadow: '0 0 40px rgba(226, 232, 240, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.25)',
        blurAmount: 'blur-[1px]',
        particlesColor: '#e2e8f0',
        fogOpacity: 'opacity-35',
        badgeBg: 'bg-slate-900/80 border-slate-700/60 text-slate-300',
        pulseDuration: '10s',
      };
    }

    // 6. Deep Space Probes & Telescopes (Mariner 4, Kepler, Voyager, Sputnik): Interstellar cosmic radiation & faint solar wind glow
    return {
      typeLabel: 'Solar Wind & Subtle Interstellar Radiation Glow',
      colorName: 'Neon Cosmic Blue',
      densityLevel: 'Crystal Clear (Deep Space)',
      glowColor: 'rgba(14, 165, 233, 0.32)',
      hazeGradient: 'radial-gradient(ellipse at 50% 50%, rgba(14, 165, 233, 0.22) 0%, rgba(99, 102, 241, 0.14) 45%, rgba(2, 6, 23, 0.5) 80%, rgba(0,0,0,0.9) 100%)',
      outerRingShadow: '0 0 45px rgba(14, 165, 233, 0.4), inset 0 0 30px rgba(125, 211, 252, 0.25)',
      blurAmount: 'blur-[1px]',
      particlesColor: '#38bdf8',
      fogOpacity: 'opacity-40',
      badgeBg: 'bg-sky-950/80 border-sky-500/40 text-sky-300',
      pulseDuration: '9s',
    };
  }, [relic]);

  // Start narration immediately on mount with zero delay
  useEffect(() => {
    speechService.setRate(speechRate);
    startNarration();

    return () => {
      speechService.stop();
    };
  }, [relic.id]);

  const startNarration = () => {
    speechService.startStoryNarration(relic.narrationScript, {
      onStart: () => {
        setIsPlayingNarration(true);
        setIsPaused(false);
      },
      onSentenceChange: (idx) => {
        setActiveSentenceIndex(idx);
        setActiveWord('');
      },
      onWordBoundary: (word) => {
        setActiveWord(word);
      },
      onEnd: () => {
        setIsPlayingNarration(false);
        setIsPaused(false);
        setActiveSentenceIndex(relic.narrationScript.length - 1);
        setActiveWord('');
      },
      onError: () => {
        setIsPlayingNarration(false);
        setIsPaused(false);
      },
    });
  };

  const handleTogglePlay = () => {
    soundEffects.playClick();
    if (isPlayingNarration && !isPaused) {
      speechService.pause();
      setIsPaused(true);
    } else if (isPlayingNarration && isPaused) {
      speechService.resume();
      setIsPaused(false);
    } else {
      startNarration();
    }
  };

  const handleRestartNarration = () => {
    soundEffects.playClick();
    speechService.stop();
    startNarration();
  };

  const handleRateChange = (newRate: number) => {
    soundEffects.playClick();
    setSpeechRate(newRate);
    speechService.setRate(newRate);
    if (isPlayingNarration) {
      speechService.stop();
      startNarration();
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Dynamic Celestial Atmosphere Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(circle at 75% 20%, ${relic.celestialBody.glowColor} 0%, rgba(15,23,42,0.8) 50%, #03060d 100%)`,
        }}
      />

      {/* Ambient Dynamic Planetary Weather Layer across screen backdrop */}
      {isWeatherEnabled && (
        <PlanetWeatherCanvas
          weatherType={weatherConfig.type}
          intensity="ambient"
          className="fixed inset-0 w-full h-full z-0 opacity-75"
        />
      )}

      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between gap-4 px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              speechService.stop();
              onBackToGalaxy();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Space Map</span>
          </button>

          {/* Quick Team Emblem Token */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800">
            <TeamLogo size="sm" withGlow={false} />
            <div className="text-left">
              <span className="text-xs font-bold text-slate-200 block">SPIRIT EL TEAM</span>
              <span className="text-[10px] text-cyan-400 font-mono block">Forgotten Space Archive</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Badge Status (shifted next to Mission Log) + Mission Log + Start Quiz */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {isBadgeUnlocked && (
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Badge Unlocked!</span>
            </div>
          )}

          <button
            onClick={() => {
              soundEffects.playClick();
              setIsMissionLogOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 hover:text-white text-xs font-bold shadow-lg shadow-cyan-500/10 active:scale-95 transition-all cursor-pointer ${
              isIdle ? 'animate-idle-nudge' : ''
            }`}
            title="Open Mission Log & Field Checkpoints"
          >
            <ClipboardCheck className="w-4 h-4 text-cyan-400" />
            <span>Mission Log 📋</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              speechService.stop();
              onStartQuiz();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Space Knowledge Quiz</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Planet Viewport & Visual Companion (lg: 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Ultra-Realistic Planet & Surface Visual Stage Card */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#0b1222]/95 via-[#070b16]/95 to-[#020409]/98 border border-slate-700/80 p-5 flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* View Mode Switcher Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800 text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>HD Planetary Observatory</span>
                </span>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setIsWeatherEnabled(!isWeatherEnabled);
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] transition-all cursor-pointer ${
                    isWeatherEnabled
                      ? weatherConfig.badgeClass
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                  title={weatherConfig.description}
                >
                  <CloudRain className="w-3 h-3" />
                  <span>{isWeatherEnabled ? 'Weather: Active' : 'Weather: Off'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => { soundEffects.playClick(); setPlanetViewMode('surface'); }}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    planetViewMode === 'surface'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isFlybyRelic ? 'Jupiter Atmosphere 🪐' : 'Planet Surface 🪐'}
                </button>
                <button
                  onClick={() => { soundEffects.playClick(); setPlanetViewMode('globe'); }}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    planetViewMode === 'globe'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Orbital Globe 🌐
                </button>
                <button
                  onClick={() => { soundEffects.playClick(); setPlanetViewMode('relic'); }}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    planetViewMode === 'relic'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  } ${
                    isIdle && planetViewMode !== 'relic'
                      ? 'animate-idle-nudge ring-2 ring-amber-400/80 text-amber-300 bg-amber-950/50'
                      : ''
                  }`}
                >
                  Forgotten Relic 🛰️
                </button>
              </div>
            </div>

            {/* Central Realistic Display Area */}
            <div
              className={`relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border bg-black flex items-center justify-center shadow-inner group transition-all ${
                isIdle ? 'border-cyan-400/80 animate-idle-nudge' : 'border-slate-700/60'
              }`}
            >
              {/* 1. Ultra-Realistic Planetary Surface Mode */}
              {planetViewMode === 'surface' && (
                <div className="relative w-full h-full">
                  <img
                    src={planetAssets.surfaceImage}
                    alt={`${relic.celestialBody.arabicName} Realistic Surface`}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle realistic Atmospheric haze vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Scientific Camera Overlay HUD */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-black/80 border border-slate-700/80 font-mono text-[9px] text-emerald-400 flex items-center gap-1.5 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SURFACE CAM // HIGH RES SPECTRUM</span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 text-right font-mono text-[10px] text-slate-200">
                    <span className="text-cyan-300 font-bold block">{relic.celestialBody.arabicName}</span>
                    <span className="text-slate-400 text-[9px]">{planetAssets.featureName}</span>
                  </div>
                </div>
              )}

              {/* 2. Ultra-Realistic 3D Planetary Globe with Terminator Shadow & Atmosphere */}
              {planetViewMode === 'globe' && (
                <div className="relative w-full h-full flex items-center justify-center bg-[#010308] overflow-hidden">
                  {/* Background stars */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#091428_0%,_#010308_100%)] opacity-80" />

                  {/* Planetary Sphere with physical 3D lighting, terminator line & atmospheric limb */}
                  <div
                    className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] flex items-center justify-center transition-transform duration-700"
                    style={{
                      boxShadow: `0 0 50px ${planetAssets.globeGlow}`,
                    }}
                  >
                    {/* Planet photorealistic spherical globe */}
                    <img
                      src={planetAssets.globeImage}
                      alt="Planetary texture"
                      width={192}
                      height={192}
                      sizes="(max-width: 640px) 176px, 192px"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover scale-110"
                    />

                    {/* Realistic 3D Day/Night Terminator Shadow Gradient */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.4)_0%,_transparent_55%,_rgba(0,0,0,0.95)_90%)] pointer-events-none" />

                    {/* Atmospheric limb scattering */}
                    <div
                      className="absolute inset-0 rounded-full border-2 pointer-events-none"
                      style={{ borderColor: planetAssets.globeGlow }}
                    />
                  </div>

                  {/* Satellite Orbital Tracking Ring */}
                  <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-cyan-400/30 animate-orbit-spin pointer-events-none flex items-start justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8] -translate-y-1" />
                  </div>

                  <div className="absolute bottom-2 inset-x-2 text-center text-[10px] font-mono text-cyan-300 bg-black/70 py-0.5 rounded backdrop-blur-sm">
                    Orbital Path around {relic.celestialBody.arabicName} · Telemetry Lock
                  </div>
                </div>
              )}

              {/* 3. The Forgotten Relic Spacecraft Historical Imagery with Dynamic Atmospheric Glow */}
              {planetViewMode === 'relic' && (
                <div className="relative w-full h-full bg-black overflow-hidden group">
                  {/* Outer Atmospheric Aura & Corona surrounding the relic */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-700 animate-pulse"
                    style={{
                      boxShadow: atmosphericGlow.outerRingShadow,
                      animationDuration: atmosphericGlow.pulseDuration,
                    }}
                  />

                  {/* Relic Base Spacecraft Image (kept empty when no supplied image is available) */}
                  {relicImage ? (
                    <img
                      src={relicImage}
                      alt={activeGalleryItem?.label || relic.arabicName}
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/90 text-center px-6">
                      <span className="text-xs font-bold text-slate-300">No Spacecraft Image Available</span>
                      <span className="text-[11px] font-mono text-slate-500 mt-1">
                        Image field kept empty for {relic.name}
                      </span>
                    </div>
                  )}

                  {/* Dynamic CSS Atmospheric Haze Layer 1: Radial Soft Density Fog */}
                  <div
                    className={`absolute inset-0 pointer-events-none transition-all duration-700 ${atmosphericGlow.fogOpacity} ${atmosphericGlow.blurAmount}`}
                    style={{
                      background: atmosphericGlow.hazeGradient,
                      mixBlendMode: 'screen',
                    }}
                  />

                  {/* Dynamic CSS Atmospheric Haze Layer 2: Drifting Particulate Cloud Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-45 mix-blend-color-dodge transition-all duration-1000"
                    style={{
                      backgroundImage: `radial-gradient(circle at 40% 40%, ${atmosphericGlow.glowColor} 0%, transparent 60%), radial-gradient(circle at 70% 65%, ${atmosphericGlow.glowColor} 0%, transparent 55%)`,
                    }}
                  />

                  {/* Depth Vignette for High-Contrast Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

                  {/* Atmospheric Glow Indicator Badge (Top Left) */}
                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-mono border backdrop-blur-md shadow-lg transition-all"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      borderColor: atmosphericGlow.glowColor,
                      color: atmosphericGlow.particlesColor,
                    }}
                    title={`Surrounding atmospheric haze density: ${atmosphericGlow.densityLevel}`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-ping"
                      style={{ backgroundColor: atmosphericGlow.particlesColor }}
                    />
                    <span className="font-bold">Atmosphere:</span>
                    <span>{atmosphericGlow.densityLevel}</span>
                  </div>

                  {/* Gallery Image Switcher when multiple photos are attached */}
                  {galleryItems.length > 1 && (
                    <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-black/80 p-1 rounded-lg border border-slate-700/80 backdrop-blur-md">
                      {galleryItems.map((item, idx) => (
                        <button
                          key={item.src}
                          onClick={() => {
                            soundEffects.playClick();
                            setActiveGalleryIndex(idx);
                          }}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-colors cursor-pointer ${
                            activeGalleryIndex === idx
                              ? 'bg-cyan-500 text-slate-950'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800'
                          }`}
                          title={item.label}
                        >
                          {item.tabLabel || (item.isEarthTest ? 'Airbag Test' : `Photo ${idx + 1}`)}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Relic Designation & Operator Label (Bottom Right) */}
                  <div className="absolute bottom-2.5 right-2.5 text-right font-mono text-[10px] text-slate-200 z-10 max-w-[70%]">
                    <span className="text-amber-400 font-bold block">{relic.arabicName}</span>
                    {activeGalleryItem?.label && (galleryItems.length > 1 || activeGalleryItem.label !== relic.arabicName) && (
                      <span className="text-[9px] text-cyan-300 block truncate" title={activeGalleryItem.label}>
                        {activeGalleryItem.label}
                      </span>
                    )}
                    <span className="text-slate-300 text-[9px] flex items-center gap-1 justify-end">
                      <span>{relic.designation} · {relic.operator}</span>
                    </span>
                    <span className="text-[8px] text-slate-400 block mt-0.5" style={{ color: atmosphericGlow.particlesColor }}>
                      {atmosphericGlow.typeLabel}
                    </span>
                  </div>
                </div>
              )}

              {/* Dynamic Planetary Weather Canvas Overlay on Viewport */}
              {isWeatherEnabled && (
                <PlanetWeatherCanvas
                  weatherType={weatherConfig.type}
                  intensity="viewport"
                  className="absolute inset-0 w-full h-full z-10"
                />
              )}

              {/* Idle Attention Hint Prompt drawing eye to the Space Relic */}
              {isIdle && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setPlanetViewMode('relic');
                    setIsIdle(false);
                  }}
                  className="absolute top-2.5 left-2.5 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/80 text-[10px] font-bold text-cyan-200 shadow-lg backdrop-blur-md animate-bounce cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{planetViewMode === 'relic' ? 'Relic Inspection Active ✨' : 'Click to Inspect Forgotten Relic 🛰️'}</span>
                </button>
              )}

              {/* Standing Astronaut Companion standing firmly upright on the viewing deck */}
              <div className="absolute bottom-2 left-2 z-20 flex flex-col items-center">
                <CartoonAvatar
                  customization={character}
                  size="md"
                  isExcited={isPlayingNarration}
                  isStanding={true}
                  isFlying={false}
                  unlockedBadgesCount={isBadgeUnlocked ? 4 : 0}
                />
                <span className="text-[8px] bg-black/85 text-cyan-300 font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 mt-0.5 shadow">
                  {isFlybyRelic ? 'Flyby Trajectory' : 'On Surface'}
                </span>
              </div>
            </div>

            {/* Relocated Story & Interactive Audio Player Deck directly beneath the photo */}
            <div className="mt-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 p-4 shadow-lg backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">
                      {relic.storyTitle || 'Space Relic Voice Narrator'}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {relic.storySubtitle || 'Clear English Mission Briefing'}
                    </p>
                  </div>
                </div>

                {/* Rate buttons */}
                <div className="flex items-center gap-1 text-[10px] bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                  <span className="text-slate-400">Speed:</span>
                  {[0.8, 1.0, 1.2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`px-1.5 py-0.5 rounded ${
                        speechRate === rate ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all active:scale-95 ${
                      isIdle && !isPlayingNarration ? 'animate-idle-nudge' : ''
                    }`}
                  >
                    {isPlayingNarration && !isPaused ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>{isPaused ? 'Resume' : 'Listen to Story'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleRestartNarration}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    title="Restart narration from beginning"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  {isPlayingNarration && !isPaused ? (
                    <span className="flex items-center gap-1 text-cyan-400">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span>Speaking...</span>
                    </span>
                  ) : isPaused ? (
                    <span className="text-amber-400">Paused</span>
                  ) : (
                    <span className="text-slate-400">Ready to listen</span>
                  )}
                </div>
              </div>

              {/* Live Real-Time Audio Transcription Feed */}
              <div className="mt-4">
                <LiveAudioTranscription
                  sentences={relic.narrationScript}
                  currentSentenceIndex={activeSentenceIndex}
                  activeWord={activeWord}
                  isBroadcasting={isPlayingNarration && !isPaused}
                  speakerName={`${relic.arabicName} · Live Broadcast`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: In-depth Story & Answers to Core Questions (lg: 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Main Title Header */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
              <span>{relic.designation}</span>
              <span>·</span>
              <span>Operator: {relic.operator}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {relic.arabicName}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {relic.currentLocationAndStatus}
            </p>
          </div>

          {/* Nav Tabs for Deep Story Exploration */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto text-xs">
            <button
              onClick={() => { soundEffects.playClick(); setActiveTab('overview'); }}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview &amp; Goal
            </button>
            <button
              onClick={() => { soundEffects.playClick(); setActiveTab('achievements'); }}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'achievements'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Key Achievements
            </button>
            <button
              onClick={() => { soundEffects.playClick(); setActiveTab('links'); }}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'links'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Links &amp; Sources
            </button>
          </div>

          {/* Tab 1: Overview, Timeline & Why Abandoned */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Section 1: Why Launched & Goal */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold mb-2">
                    <Compass className="w-4 h-4" />
                    <h3>Why Was It Launched &amp; What Was Its Goal?</h3>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {relic.whyLaunched}
                  </p>
                </div>

                {/* Quick specs grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Launch Date</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{relic.launchDate}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Launch Vehicle</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{relic.launchVehicle}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block">Launch Site</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{relic.launchSite}</span>
                  </div>
                  {relic.mass && (
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Mass</span>
                      <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{relic.mass}</span>
                    </div>
                  )}
                  {relic.endOfService && (
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 col-span-2">
                      <span className="text-[10px] text-slate-400 block">End of Service</span>
                      <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{relic.endOfService}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Launch Timeline */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                  <Calendar className="w-4 h-4" />
                  <h3>When Did It Go to Space &amp; Flight Path?</h3>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {relic.launchTimeline}
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-400 leading-normal">
                  💡 <span className="font-semibold text-slate-300">Short Fact:</span>{' '}
                  {relic.shortFact ||
                    'This flight marked one of the defining turning points in space exploration history, when mission success odds were often below 50% due to extreme frontier conditions.'}
                </div>
              </div>

              {/* Section 3: Why Abandoned */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-rose-500/20 space-y-4">
                <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <h3>Why Was It Left Behind in Space?</h3>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {relic.whyAbandoned}
                </p>
                <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200 leading-normal">
                  ❤️ <span className="font-semibold text-rose-300">Immortal Legacy:</span> These spacecraft were never forgotten out of neglect—they were left on station to honor their pioneering triumphs, becoming humanity's greatest open museums across the cosmos.
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Achievements */}
          {activeTab === 'achievements' && (
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-3">
                <Award className="w-4 h-4" />
                <h3>Major Scientific &amp; Historic Achievements</h3>
              </div>
              <div className="space-y-2.5">
                {relic.achievements.map((ach, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{ach}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: External Links & Further Discovery */}
          {activeTab === 'links' && (
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-sky-400 text-sm font-bold">
                <ExternalLink className="w-4 h-4" />
                <h3>Trusted Archives &amp; Further Reading</h3>
              </div>
              <p className="text-xs text-slate-400">
                Explore official mission logs and scientific archives from space agencies worldwide:
              </p>
              <div className="space-y-3">
                {relic.externalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                          {link.label}
                        </div>
                        <div className="text-[10px] text-slate-400">{link.source}</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-cyan-400 font-medium">Visit Link ↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Card: Quiz Launch Trigger */}
          <div className="mt-2 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-100">
                  Mastered the story of {relic.arabicName}?
                </h4>
                <p className="text-[11px] text-slate-400">
                  Answer 3 quick questions to earn this mission's commemorative badge for your Trophy Room!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.playClick();
                speechService.stop();
                onStartQuiz();
              }}
              className={`px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md whitespace-nowrap active:scale-95 transition-all ${
                isIdle ? 'animate-idle-nudge' : ''
              }`}
            >
              Start Quiz Now 🏆
            </button>
          </div>
        </div>
      </main>

      {/* Interactive Talking Astronaut Presenter */}
      <TalkingAstronautPresenter
        character={character}
        relic={relic}
        activeSentence={relic.narrationScript[activeSentenceIndex] || relic.narrationScript[0]}
        isSpeaking={isPlayingNarration && !isPaused}
        onReplaySpeech={handleRestartNarration}
      />

      {/* Mission Log Modal triggered from Top Header */}
      {isMissionLogOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => {
            soundEffects.playClick();
            setIsMissionLogOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <MissionLogView
              relic={relic}
              character={character}
              onClose={() => setIsMissionLogOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
