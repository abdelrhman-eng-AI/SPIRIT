import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { EraId, SpacecraftRelic, CharacterCustomization } from './types';
import { SPACE_RELICS } from './data/spaceData';
import { HomeScreen } from './components/HomeScreen';
import { ThreeStarfield } from './components/ThreeStarfield';
import { CosmicDustCanvas } from './components/CosmicDustCanvas';
import { SpaceLoadingScreen } from './components/SpaceLoadingScreen';
import { CriticalAsset, useAssetPreloader } from './hooks/useAssetPreloader';
import { FailedAssetsProvider } from './context/AssetPreloadContext';
import { soundEffects } from './services/soundEffects';

const PlanetSystemView = lazy(() =>
  import('./components/PlanetSystemView').then((m) => ({ default: m.PlanetSystemView }))
);
const PlanetRelicView = lazy(() =>
  import('./components/PlanetRelicView').then((m) => ({ default: m.PlanetRelicView }))
);
const WormholeTransition = lazy(() =>
  import('./components/WormholeTransition').then((m) => ({ default: m.WormholeTransition }))
);
const CharacterCustomizer = lazy(() =>
  import('./components/CharacterCustomizer').then((m) => ({ default: m.CharacterCustomizer }))
);
const EraSelectionModal = lazy(() =>
  import('./components/EraSelectionModal').then((m) => ({ default: m.EraSelectionModal }))
);
const MissionQuizModal = lazy(() =>
  import('./components/MissionQuizModal').then((m) => ({ default: m.MissionQuizModal }))
);
const TrophyRoomModal = lazy(() =>
  import('./components/TrophyRoomModal').then((m) => ({ default: m.TrophyRoomModal }))
);
const GrandCelebrationModal = lazy(() =>
  import('./components/GrandCelebrationModal').then((m) => ({ default: m.GrandCelebrationModal }))
);
const KidOnboardingModal = lazy(() =>
  import('./components/KidOnboardingModal').then((m) => ({ default: m.KidOnboardingModal }))
);

// Only assets actually visible on the initial HomeScreen (no mission, gallery, or video assets)
const CRITICAL_HOME_ASSETS: CriticalAsset[] = [
  {
    id: 'home-hero-backdrop',
    url: '/assets/images/realistic_deep_space_cinematic_1792424017979.jpg',
    label: 'Loading Deep Space Backdrop',
  },
  {
    id: 'team-mission-emblem',
    url: '/assets/images/spirit_el_team_emblem_1792422933263.jpg',
    label: 'Loading SPIRIT EL TEAM Emblem',
  },
];

const DEFAULT_CHARACTER: CharacterCustomization = {
  name: 'Little Astronaut',
  suitColor: '#06b6d4',
  secondaryColor: '#1e293b',
  outfitStyle: 'classic_eva',
  helmetStyle: 'classic',
  visorTint: '#fbbf24',
  badgeSymbol: 'rocket',
  companionTitle: 'Cosmic Explorer',
  accessory: 'jetpack',
};

const ViewSuspenseFallback: React.FC = () => (
  <div className="min-h-screen bg-[#03060d] flex items-center justify-center text-xs font-mono text-cyan-300">
    Preparing cosmic telemetry...
  </div>
);

export default function App() {
  const preloadState = useAssetPreloader(CRITICAL_HOME_ASSETS);

  // Navigation View State
  const [currentView, setCurrentView] = useState<'home' | 'galaxy' | 'wormhole' | 'planet'>('home');
  const [selectedEraId, setSelectedEraId] = useState<EraId>('1960-1980');
  const [selectedRelic, setSelectedRelic] = useState<SpacecraftRelic>(SPACE_RELICS[0]);

  // Modals
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isEraSelectorOpen, setIsEraSelectorOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isTrophyRoomOpen, setIsTrophyRoomOpen] = useState(false);
  const [isGrandCelebrationOpen, setIsGrandCelebrationOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Sound Settings
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Persistent User Progress
  const [character, setCharacter] = useState<CharacterCustomization>(() => {
    try {
      const saved = localStorage.getItem('spirit_custom_character');
      if (!saved) return DEFAULT_CHARACTER;
      const parsed = JSON.parse(saved) as CharacterCustomization;
      return {
        ...DEFAULT_CHARACTER,
        ...parsed,
        name: parsed.name === 'رائد الفضاء الصغير' ? DEFAULT_CHARACTER.name : parsed.name,
        companionTitle: parsed.companionTitle === 'مستكشف كوني' ? DEFAULT_CHARACTER.companionTitle : parsed.companionTitle,
      };
    } catch {
      return DEFAULT_CHARACTER;
    }
  });

  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('spirit_unlocked_badges');
      const parsed = saved ? (JSON.parse(saved) as string[]) : [];
      const validIds = new Set(SPACE_RELICS.map((r) => r.id));
      return Array.isArray(parsed) ? parsed.filter((id) => validIds.has(id)) : [];
    } catch {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('spirit_custom_character', JSON.stringify(character));
    } catch {
      // ignore
    }
  }, [character]);

  useEffect(() => {
    try {
      localStorage.setItem('spirit_unlocked_badges', JSON.stringify(unlockedBadgeIds));
    } catch {
      // ignore
    }
  }, [unlockedBadgeIds]);

  const handleToggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    soundEffects.setSoundEnabled(next);
  };

  const handleStartJourney = () => {
    // Open Kid-Friendly Onboarding guide with spoken narration on Start
    setIsOnboardingOpen(true);
  };

  const handleSelectEra = (eraId: EraId) => {
    setSelectedEraId(eraId);
    setIsEraSelectorOpen(false);
    setCurrentView('galaxy');
  };

  // Called when tapping on a planet in the galaxy view
  const handleSelectRelicForWormhole = (relic: SpacecraftRelic) => {
    setSelectedRelic(relic);
    setCurrentView('wormhole');
  };

  // Called after wormhole animation completes
  const handleWormholeComplete = () => {
    setCurrentView('planet');
  };

  const handleSelectRelicFromHome = (relicId: string) => {
    const found = SPACE_RELICS.find((r) => r.id === relicId);
    if (found) {
      setSelectedEraId(found.eraId);
      setSelectedRelic(found);
      setCurrentView('wormhole');
    }
  };

  const celebrationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (celebrationTimerRef.current !== null) {
        window.clearTimeout(celebrationTimerRef.current);
      }
    };
  }, []);

  const handleBadgeAwarded = (relicId: string) => {
    if (!unlockedBadgeIds.includes(relicId)) {
      const updated = [...unlockedBadgeIds, relicId];
      setUnlockedBadgeIds(updated);

      // If user unlocked 3 or more badges, automatically trigger Grand Celebration
      if (updated.length >= 3) {
        if (celebrationTimerRef.current !== null) {
          window.clearTimeout(celebrationTimerRef.current);
        }
        celebrationTimerRef.current = window.setTimeout(() => {
          setIsQuizOpen(false);
          setIsGrandCelebrationOpen(true);
        }, 1200);
      }
    }
  };

  // Trigger welcoming sound effects when opening or switching main screens (after initial loader settles)
  useEffect(() => {
    if (!isSoundEnabled || !preloadState.isReady) return;
    if (currentView === 'home') {
      soundEffects.playHomeScreenWelcome();
    } else if (currentView === 'galaxy') {
      soundEffects.playGalaxyWelcomeRadar();
    } else if (currentView === 'planet') {
      soundEffects.playPlanetArrivalHum();
    }
  }, [currentView, isSoundEnabled, preloadState.isReady]);

  const handleOpenCustomizer = () => {
    soundEffects.playModalWelcome();
    setIsCustomizerOpen(true);
  };

  const handleOpenTrophyRoom = () => {
    soundEffects.playModalWelcome();
    setIsTrophyRoomOpen(true);
  };

  const handleOpenEraSelector = () => {
    soundEffects.playModalWelcome();
    setIsEraSelectorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#03060d] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative">
      {/* Space-themed startup loading overlay until critical home assets settle */}
      <SpaceLoadingScreen preloadState={preloadState} />

      {preloadState.isReady && (
        <FailedAssetsProvider failedUrls={preloadState.failedUrls}>
          <div className="relative min-h-screen transition-opacity duration-500 ease-out motion-reduce:transition-none opacity-100">
          {/* Interactive Three.js Random Twinkling Stars with Mouse Parallax Depth (paused when occluded) */}
          <ThreeStarfield
            speed={1.1}
            starCount={1600}
            paused={currentView === 'wormhole' || currentView === 'planet'}
          />

          {/* Interactive Space Dust Particle System that reacts to mouse movement (paused during full-screen transition) */}
          <CosmicDustCanvas
            particleCount={140}
            paused={currentView === 'wormhole'}
          />

          {/* 1. Home Screen */}
          {currentView === 'home' && (
            <HomeScreen
              character={character}
              unlockedBadgeIds={unlockedBadgeIds}
              isSoundEnabled={isSoundEnabled}
              onToggleSound={handleToggleSound}
              onStartJourney={handleStartJourney}
              onOpenCustomizer={handleOpenCustomizer}
              onOpenTrophyRoom={handleOpenTrophyRoom}
              onSelectRelicFromHome={handleSelectRelicFromHome}
              onSelectEraDirectly={handleSelectEra}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
            />
          )}

          {/* 2. Deep Space Galaxy & Planets View for Selected Era */}
          {currentView === 'galaxy' && (
            <Suspense fallback={<ViewSuspenseFallback />}>
              <PlanetSystemView
                currentEraId={selectedEraId}
                character={character}
                unlockedBadgeIds={unlockedBadgeIds}
                onSelectRelic={handleSelectRelicForWormhole}
                onSelectEra={(newEra) => setSelectedEraId(newEra)}
                onBackToHome={() => setCurrentView('home')}
                onOpenCustomizer={handleOpenCustomizer}
                onOpenTrophyRoom={handleOpenTrophyRoom}
              />
            </Suspense>
          )}

          {/* 3. Character Boarding & Wormhole Warp Animation Sequence */}
          {currentView === 'wormhole' && (
            <Suspense fallback={<ViewSuspenseFallback />}>
              <WormholeTransition
                character={character}
                targetRelic={selectedRelic}
                onTransitionComplete={handleWormholeComplete}
              />
            </Suspense>
          )}

          {/* 4. Planet Surface Relic Exploration & Spoken Audio Story */}
          {currentView === 'planet' && (
            <Suspense fallback={<ViewSuspenseFallback />}>
              <PlanetRelicView
                relic={selectedRelic}
                character={character}
                isBadgeUnlocked={unlockedBadgeIds.includes(selectedRelic.id)}
                onBackToGalaxy={() => setCurrentView('galaxy')}
                onStartQuiz={() => setIsQuizOpen(true)}
              />
            </Suspense>
          )}

          {/* MODALS (Lazy-loaded only when opened) */}
          {isCustomizerOpen && (
            <Suspense fallback={null}>
              <CharacterCustomizer
                customization={character}
                unlockedBadgesCount={unlockedBadgeIds.length}
                onSave={(updated) => setCharacter(updated)}
                onClose={() => setIsCustomizerOpen(false)}
              />
            </Suspense>
          )}

          {isEraSelectorOpen && (
            <Suspense fallback={null}>
              <EraSelectionModal
                character={character}
                onSelectEra={handleSelectEra}
                onClose={() => setIsEraSelectorOpen(false)}
              />
            </Suspense>
          )}

          {isQuizOpen && (
            <Suspense fallback={null}>
              <MissionQuizModal
                relic={selectedRelic}
                character={character}
                onBadgeAwarded={handleBadgeAwarded}
                onClose={() => setIsQuizOpen(false)}
                onExploreMore={() => {
                  setIsQuizOpen(false);
                  setCurrentView('galaxy');
                }}
              />
            </Suspense>
          )}

          {isTrophyRoomOpen && (
            <Suspense fallback={null}>
              <TrophyRoomModal
                unlockedBadgeIds={unlockedBadgeIds}
                character={character}
                onClose={() => setIsTrophyRoomOpen(false)}
                onOpenGrandCelebration={() => {
                  setIsTrophyRoomOpen(false);
                  setIsGrandCelebrationOpen(true);
                }}
                onSelectRelicToExplore={(relicId) => {
                  const r = SPACE_RELICS.find((x) => x.id === relicId);
                  if (r) {
                    setSelectedEraId(r.eraId);
                    setSelectedRelic(r);
                    setCurrentView('wormhole');
                  }
                }}
              />
            </Suspense>
          )}

          {isGrandCelebrationOpen && (
            <Suspense fallback={null}>
              <GrandCelebrationModal
                character={character}
                completedBadgesCount={unlockedBadgeIds.length}
                totalMissions={SPACE_RELICS.length}
                onClose={() => setIsGrandCelebrationOpen(false)}
              />
            </Suspense>
          )}

          {isOnboardingOpen && (
            <Suspense fallback={null}>
              <KidOnboardingModal
                isOpen={isOnboardingOpen}
                onClose={() => {
                  try {
                    localStorage.setItem('spirit_onboarding_completed', 'true');
                  } catch {
                    // ignore
                  }
                  setIsOnboardingOpen(false);
                }}
                onStartExploring={() => {
                  try {
                    localStorage.setItem('spirit_onboarding_completed', 'true');
                  } catch {
                    // ignore
                  }
                  setIsOnboardingOpen(false);
                  setIsEraSelectorOpen(true);
                }}
                suitColor={character.suitColor}
                isSoundEnabled={isSoundEnabled}
              />
            </Suspense>
          )}
          </div>
        </FailedAssetsProvider>
      )}
    </div>
  );
}
