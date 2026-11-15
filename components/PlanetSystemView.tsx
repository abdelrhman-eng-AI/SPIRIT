import React, { useState } from 'react';
import { EraId, SpacecraftRelic, CharacterCustomization } from '../types';
import { ERAS_CONFIG, SPACE_RELICS } from '../data/spaceData';
import { CartoonAvatar } from './CartoonAvatar';
import { TeamLogo } from './TeamLogo';
import { soundEffects } from '../services/soundEffects';
import {
  ArrowLeft,
  Sparkles,
  Trophy,
  Radio,
  Compass,
  CheckCircle,
  X,
  Layers,
  Navigation,
  Eye,
  Orbit,
  Radar,
  Thermometer,
  Gauge,
  Globe,
  Activity,
  Flame,
  Satellite,
  Maximize2,
  Crosshair,
} from 'lucide-react';

interface PlanetSystemViewProps {
  currentEraId: EraId;
  character: CharacterCustomization;
  unlockedBadgeIds: string[];
  onSelectRelic: (relic: SpacecraftRelic) => void;
  onSelectEra: (eraId: EraId) => void;
  onBackToHome: () => void;
  onOpenCustomizer: () => void;
  onOpenTrophyRoom: () => void;
}

// Photorealistic assets and real scientific telemetry for each celestial body
export interface CelestialScientificData {
  globeImage: string;
  surfaceImage: string;
  distanceFromSunAU: string;
  distanceKm: string;
  orbitalSpeedKmS: string;
  orbitalPeriod: string;
  gravity: string;
  atmPressure: string;
  atmosphereComposition: string;
  temperatureRange: string;
  diameterKm: string;
  landingCoordinates: string;
  landingSiteName: string;
  spacecraftStatus: string;
  signalFrequency: string;
}

export const CELESTIAL_REALISTIC_DATA: Record<string, CelestialScientificData> = {
  mars: {
    globeImage: '/assets/images/realistic_mars_globe_sphere_1792425629915.jpg',
    surfaceImage: '/assets/images/realistic_mars_surface_panorama_1792424891866.jpg',
    distanceFromSunAU: '1.52 AU',
    distanceKm: '227.9 million km',
    orbitalSpeedKmS: '24.1 km/s',
    orbitalPeriod: '687 Earth days',
    gravity: '0.38 g (3.72 m/s²)',
    atmPressure: '0.006 bar (Ultra-thin CO₂)',
    atmosphereComposition: '95.3% Carbon Dioxide, 2.6% Nitrogen, 1.9% Argon',
    temperatureRange: '-140°C to +20°C (Avg -63°C)',
    diameterKm: '6,779 km',
    landingCoordinates: 'Ares Vallis, Northern Hemisphere',
    landingSiteName: 'Ares Vallis — Carl Sagan Memorial Station',
    spacecraftStatus: 'Final data transmission on 27 September 1997; lander and Sojourner remain at Ares Vallis',
    signalFrequency: '8.4 GHz (X-Band - Silent)',
  },
  'mars-ares-vallis': {
    globeImage: '/assets/images/realistic_mars_globe_sphere_1792425629915.jpg',
    surfaceImage: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_12.50.50_AM__2__3f2dc579.jpeg',
    distanceFromSunAU: '1.52 AU',
    distanceKm: '227.9 million km',
    orbitalSpeedKmS: '24.1 km/s',
    orbitalPeriod: '687 Earth days',
    gravity: '0.38 g (3.72 m/s²)',
    atmPressure: '0.006 bar (Ultra-thin CO₂)',
    atmosphereComposition: '95.3% Carbon Dioxide, 2.6% Nitrogen, 1.9% Argon',
    temperatureRange: '-140°C to +20°C (Avg -63°C)',
    diameterKm: '6,779 km',
    landingCoordinates: 'Ares Vallis (Ancient Dry Flood Channel)',
    landingSiteName: 'Ares Vallis — Carl Sagan Memorial Station',
    spacecraftStatus: 'Final data transmission on 27 September 1997; lander and Sojourner remain at Ares Vallis',
    signalFrequency: '8.4 GHz (X-Band - Silent)',
  },
  'mars-gusev-meridiani': {
    globeImage: '/assets/images/realistic_mars_globe_sphere_1792425629915.jpg',
    surfaceImage: '/assets/images/realistic_mars_surface_panorama_1792424891866.jpg',
    distanceFromSunAU: '1.52 AU',
    distanceKm: '227.9 million km',
    orbitalSpeedKmS: '24.1 km/s',
    orbitalPeriod: '687 Earth days',
    gravity: '0.38 g (3.72 m/s²)',
    atmPressure: '0.006 bar (Ultra-thin CO₂)',
    atmosphereComposition: '95.3% Carbon Dioxide, 2.6% Nitrogen, 1.9% Argon',
    temperatureRange: '-140°C to +20°C (Avg -63°C)',
    diameterKm: '6,779 km',
    landingCoordinates: 'Gusev Crater (Spirit) & Meridiani Planum (Opportunity)',
    landingSiteName: 'Gusev Crater & Meridiani Planum (Opposite Sides of Mars)',
    spacecraftStatus: 'Spirit landed 3 Jan 2004 (ended 2010, 7.7 km); Opportunity landed 24 Jan 2004 (last contact 10 Jun 2018, 45.16 km)',
    signalFrequency: 'Deep Space Radio (Spirit ended 2010; Opportunity last signal 10 Jun 2018)',
  },
  moon: {
    globeImage: '/assets/images/realistic_moon_globe_sphere_1792425648811.jpg',
    surfaceImage: '/assets/images/realistic_moon_surface_panorama_1792424893445.jpg',
    distanceFromSunAU: '1.00 AU',
    distanceKm: '149.6 million km (384,400 km from Earth)',
    orbitalSpeedKmS: '1.02 km/s (Lunar orbit)',
    orbitalPeriod: '27.3 days',
    gravity: '0.166 g (1.62 m/s²)',
    atmPressure: '0.00 bar (Near-total space vacuum)',
    atmosphereComposition: 'Vacuum with trace exosphere of Helium and Neon',
    temperatureRange: '-130°C night to +120°C day',
    diameterKm: '3,474 km',
    landingCoordinates: 'Southeastern Oceanus Procellarum',
    landingSiteName: 'Southeastern Oceanus Procellarum',
    spacecraftStatus: 'Last contact on 4 May 1967, two days after lunar night began; parts later recovered by Apollo 12',
    signalFrequency: '2295 MHz (S-Band - Silent)',
  },
  'moon-mare-imbrium': {
    globeImage: '/assets/images/realistic_moon_globe_sphere_1792425648811.jpg',
    surfaceImage: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_1.24.43_AM__1__d693c709.jpeg',
    distanceFromSunAU: '1.00 AU',
    distanceKm: '149.6 million km (384,400 km from Earth)',
    orbitalSpeedKmS: '1.02 km/s (Lunar orbit)',
    orbitalPeriod: '27.3 days',
    gravity: '0.166 g (1.62 m/s²)',
    atmPressure: '0.00 bar (Near-total space vacuum)',
    atmosphereComposition: 'Vacuum with trace exosphere of Helium and Neon',
    temperatureRange: '-130°C night to +120°C day',
    diameterKm: '3,474 km',
    landingCoordinates: 'Mare Imbrium Plain (Foot of the Apennine Mountains)',
    landingSiteName: 'Mare Imbrium — Near the Apennine Mountains',
    spacecraftStatus: 'Falcon ascent stage impacted 3 August 1971; descent stage & ALSEP remained (ALSEP active until 30 Sep 1977)',
    signalFrequency: 'ALSEP Radio Station (Shut down 30 September 1977)',
  },
  'moon-tranquility-base': {
    globeImage: '/assets/images/realistic_moon_globe_sphere_1792425648811.jpg',
    surfaceImage: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_2.10.36_AM_1b8c428b.jpeg',
    distanceFromSunAU: '1.00 AU',
    distanceKm: '149.6 million km (384,400 km from Earth)',
    orbitalSpeedKmS: '1.02 km/s (Lunar orbit)',
    orbitalPeriod: '27.3 days',
    gravity: '0.166 g (1.62 m/s²)',
    atmPressure: '0.00 bar (Near-total space vacuum)',
    atmosphereComposition: 'Vacuum with trace exosphere of Helium and Neon',
    temperatureRange: '-130°C night to +120°C day',
    diameterKm: '3,474 km',
    landingCoordinates: 'Mare Tranquillitatis (Sea of Tranquility — Tranquility Base)',
    landingSiteName: 'Tranquility Base — Sea of Tranquility',
    spacecraftStatus: 'Descent stage & EASEP remain at Tranquility Base; ascent stage jettisoned 22 July 1969 (final fate unknown)',
    signalFrequency: 'EASEP Experiment Link (Ended 27 August 1969)',
  },
  jupiter: {
    globeImage: '/assets/images/realistic_jupiter_globe_sphere_1792425662391.jpg',
    surfaceImage: '/assets/images/realistic_jupiter_atmosphere_clouds_1792424893304.jpg',
    distanceFromSunAU: '5.20 AU',
    distanceKm: '778.5 million km',
    orbitalSpeedKmS: '13.1 km/s',
    orbitalPeriod: '11.86 Earth years',
    gravity: '2.53 g (24.79 m/s²)',
    atmPressure: 'Over 22 bar in deep descent (No solid surface)',
    atmosphereComposition: '89% Hydrogen, 10% Helium, Ammonia & Methane clouds',
    temperatureRange: '-110°C (Cloud tops) to +24,000°C core',
    diameterKm: '139,820 km (Gas Giant)',
    landingCoordinates: '06.57°N 04.88°W (Atmospheric Dive Layer)',
    landingSiteName: 'Jupiter Jovian Cloud Belt Depth',
    spacecraftStatus: 'Capsule vaporized after descending 150 km deep',
    signalFrequency: '1387 MHz (L-Band - Attenuated)',
  },
  'jupiter-flyby': {
    globeImage: '/assets/images/realistic_jupiter_globe_sphere_1792425662391.jpg',
    surfaceImage: '/assets/images/realistic_jupiter_atmosphere_clouds_1792424893304.jpg',
    distanceFromSunAU: '5.20 AU',
    distanceKm: '778.5 million km',
    orbitalSpeedKmS: '13.1 km/s',
    orbitalPeriod: '11.86 Earth years',
    gravity: '2.53 g (24.79 m/s²)',
    atmPressure: 'Gas Giant (No landing — Flyby encounter only)',
    atmosphereComposition: '89% Hydrogen, 10% Helium, Ammonia & Methane clouds',
    temperatureRange: '-110°C (Cloud tops) to +24,000°C core',
    diameterKm: '139,820 km (Gas Giant)',
    landingCoordinates: 'Flyby Path (Did not land on Jupiter or Mars)',
    landingSiteName: 'Jupiter Flyby Encounter (Outbound Trajectory)',
    spacecraftStatus: 'Flyby only (Pioneer 10: 4 Dec 1973; Pioneer 11: 3 Dec 1974 & Saturn: 1 Sep 1979) — Both continued outbound',
    signalFrequency: 'Deep Space Radio (Pioneer 10 last signal 23 Jan 2003; Pioneer 11 ended 1995)',
  },
  venus: {
    globeImage: '/assets/images/realistic_venus_globe_sphere_1792425676376.jpg',
    surfaceImage: '/assets/images/realistic_venus_surface_planet_1792425000849.jpg',
    distanceFromSunAU: '0.72 AU',
    distanceKm: '108.2 million km',
    orbitalSpeedKmS: '35.0 km/s',
    orbitalPeriod: '224.7 Earth days',
    gravity: '0.904 g (8.87 m/s²)',
    atmPressure: '92.0 bar (Equivalent to 900m underwater)',
    atmosphereComposition: '96.5% Carbon Dioxide, 3.5% Nitrogen, Sulfuric Acid clouds',
    temperatureRange: '+465°C to +480°C (Hottest planet)',
    diameterKm: '12,104 km',
    landingCoordinates: '05.00°S 351.00°E (Navka Planitia)',
    landingSiteName: 'Navka Planitia Volcanic Basalt Plain',
    spacecraftStatus: 'Survived 23 minutes under lead-melting heat',
    signalFrequency: '922.76 MHz (Soviet UHF - Silent)',
  },
  comet: {
    globeImage: '/assets/images/realistic_comet_nucleus_1792425691890.jpg',
    surfaceImage: '/assets/images/realistic_comet_surface_1792425014985.jpg',
    distanceFromSunAU: '3.46 AU (Elliptical orbit)',
    distanceKm: '517.0 million km',
    orbitalSpeedKmS: '34.0 to 68.0 km/s (At perihelion)',
    orbitalPeriod: '6.44 yrs (67P) / 76 yrs (Halley)',
    gravity: '0.0001 g (10⁻⁴ m/s²)',
    atmPressure: '10⁻¹⁰ bar (Transient coma jets)',
    atmosphereComposition: 'Sublimating Water Vapor, Carbon Monoxide, Organics',
    temperatureRange: '-70°C to -180°C',
    diameterKm: '4.1 × 3.3 × 1.8 km (Bilobed nucleus)',
    landingCoordinates: 'Agilkia & Abydos Boulders (Shadowed Cliff)',
    landingSiteName: 'Abydos Site under Cliff Margin',
    spacecraftStatus: 'Resting in a shadowed icy fissure on the comet',
    signalFrequency: '8.4 GHz (S/X Deep Space Transponder)',
  },
  deep_space: {
    globeImage: '/assets/images/realistic_deep_space_cinematic_1792424017979.jpg',
    surfaceImage: '/assets/images/realistic_deep_space_cinematic_1792424017979.jpg',
    distanceFromSunAU: '159.0 AU (Heliopause edge)',
    distanceKm: '23,800 million km (Interstellar Medium)',
    orbitalSpeedKmS: '17.0 km/s (Solar escape velocity)',
    orbitalPeriod: 'Hyperbolic trajectory out of the Solar System forever',
    gravity: '0.00 g (Zero gravity)',
    atmPressure: '0.00 bar (Interstellar Medium)',
    atmosphereComposition: 'Diffuse cosmic Hydrogen & Helium plasma',
    temperatureRange: '2.7 Kelvin (-270.45°C Cosmic Background)',
    diameterKm: 'Boundless Interstellar Space',
    landingCoordinates: 'Interstellar Space (Heliopause Boundary)',
    landingSiteName: 'Interstellar Boundary & Heliopause',
    spacecraftStatus: 'Carrying the Golden Record toward Milky Way stars',
    signalFrequency: '8.415 GHz (Deep Space Network Goldstone)',
  },
};

// Helper to determine scientific data for relic
export function getCelestialData(relic: SpacecraftRelic): CelestialScientificData {
  const bodyId = (relic.celestialBody.id || relic.celestialBody.name).toLowerCase();
  const relicId = relic.id.toLowerCase();

  if (bodyId.includes('ares-vallis') || relicId.includes('sojourner')) {
    return CELESTIAL_REALISTIC_DATA['mars-ares-vallis'];
  }
  if (bodyId.includes('gusev') || bodyId.includes('meridiani') || relicId.includes('spirit-opportunity')) {
    return CELESTIAL_REALISTIC_DATA['mars-gusev-meridiani'];
  }
  if (bodyId.includes('mars') || relicId.includes('spirit') || relicId.includes('opportunity') || relicId.includes('mariner-4')) {
    return CELESTIAL_REALISTIC_DATA.mars;
  }
  if (bodyId.includes('tranquility') || relicId.includes('eagle')) {
    return CELESTIAL_REALISTIC_DATA['moon-tranquility-base'];
  }
  if (bodyId.includes('imbrium') || bodyId.includes('apennine') || relicId.includes('apollo-15')) {
    return CELESTIAL_REALISTIC_DATA['moon-mare-imbrium'];
  }
  if (bodyId.includes('moon') || bodyId.includes('lunar') || relicId.includes('surveyor') || relicId.includes('apollo')) {
    return CELESTIAL_REALISTIC_DATA.moon;
  }
  if (bodyId.includes('jupiter-flyby') || relicId.includes('pioneer')) {
    return CELESTIAL_REALISTIC_DATA['jupiter-flyby'];
  }
  if (bodyId.includes('jupiter') || relicId.includes('galileo')) {
    return CELESTIAL_REALISTIC_DATA.jupiter;
  }
  if (bodyId.includes('venus') || relicId.includes('venera') || relicId.includes('magellan')) {
    return CELESTIAL_REALISTIC_DATA.venus;
  }
  if (bodyId.includes('comet') || bodyId.includes('halley') || bodyId.includes('67p') || relicId.includes('giotto') || relicId.includes('philae')) {
    return CELESTIAL_REALISTIC_DATA.comet;
  }
  return CELESTIAL_REALISTIC_DATA.deep_space;
}

// Map each relic to its iconic forgotten artifacts / items on that planet
const RELIC_FORGOTTEN_ITEMS: Record<string, Array<{ name: string; desc: string; icon: string }>> = {
  'surveyor-3': [
    { name: 'Surface Sampler (Soil Scoop)', desc: 'Mechanical arm that dug four trenches, performed four bearing tests and thirteen impact tests', icon: '⛏️' },
    { name: 'Television Camera System', desc: 'Transmitted 6,326 TV pictures; camera system and soil scoop later recovered by Apollo 12', icon: '📷' },
    { name: 'Lunar Landing Site', desc: 'Settled in southeastern Oceanus Procellarum on 20 April 1967; last contact on 4 May 1967', icon: '🌑' },
  ],
  'sojourner-rover': [
    { name: 'Alpha Proton X-Ray Spectrometer (APXS)', desc: 'Determined the elemental composition of Martian rocks and soil in over 15 chemical analyses', icon: '🔬' },
    { name: 'Multi-Lobed Airbag Landing System', desc: 'First Mars airbag landing; bounced over 15 times before settling at Ares Vallis on 4 July 1997', icon: '🎈' },
    { name: 'Carl Sagan Memorial Station & Rear Ramp', desc: 'Stationary Pathfinder lander from which the 10.6 kg Sojourner rover rolled down on 5 July 1997', icon: '🛞' },
  ],
  'apollo-15': [
    { name: 'Lunar Module Falcon (Descent Stage & Impacted Ascent Stage)', desc: 'Lower descent stage remained near the Apennine Mountains; ascent stage returned the crew to orbit and impacted the Moon on 3 August 1971', icon: '🛬' },
    { name: 'ALSEP Experiment Station & 70W Plutonium Generator', desc: 'Measured moonquakes, lunar heat, magnetic field, and solar wind until commanded to shut down on 30 September 1977', icon: '📡' },
    { name: 'Lunar Roving Vehicle & Fallen Astronaut Memorial', desc: 'First car driven beyond Earth (27.9 km across three moonwalks), plus Scott’s fallen astronaut figure and memorial plaque', icon: '🚙' },
  ],
  'pioneer-10-11': [
    { name: 'Pioneer 10 Jupiter Flyby & Asteroid Belt Crossing', desc: 'Launched 2 March 1972; flew past Jupiter on 4 December 1973 (not a landing), crossed Neptune’s orbit in 1983, final signal 23 January 2003', icon: '🛰️' },
    { name: 'Pioneer 11 Outer-Planet Flybys (Jupiter & Saturn)', desc: 'Launched 6 April 1973; flew past Jupiter on 3 December 1974 and Saturn on 1 September 1979 before mission end in 1995 (not landed)', icon: '🪐' },
    { name: 'Outbound Trajectory & Pioneer 10 Plaque', desc: 'Neither probe landed on Mars or Jupiter; Pioneer 10 carries a plaque showing a man, a woman, and Earth’s location on its interstellar path', icon: '🌌' },
  ],
  eagle: [
    { name: 'Eagle Descent Stage (LM-5)', desc: 'Remained at Tranquility Base in the Sea of Tranquility after serving as the launch platform for the ascent stage on 21 July 1969', icon: '🛬' },
    { name: 'Eagle Ascent Stage (Jettisoned in Orbit)', desc: 'Returned Neil Armstrong and Buzz Aldrin to the Command/Service Module; jettisoned into lunar orbit on 22 July 1969 (final fate unknown)', icon: '🚀' },
    { name: 'EASEP & Laser Ranging Retroreflector', desc: '48 kg experiment package (passive seismometer & dust detector) stopped accepting commands on 27 August 1969; retroreflector deployed nearby', icon: '📡' },
  ],
  'spirit-opportunity': [
    { name: 'Spirit Rover (Gusev Crater)', desc: 'Landed 3 January 2004 at Gusev Crater; travelled 7.7 km and concluded its mission in 2010 after studying rocks for signs of past water', icon: '🛞' },
    { name: 'Opportunity Rover (Meridiani Planum)', desc: 'Landed 24 January 2004 at Meridiani Planum; travelled 45.16 km (record held until 11 Oct 2026); last contact 10 June 2018 during dust storm', icon: '🧭' },
    { name: 'Ancient Water Record & "Lion King" Panorama', desc: 'Twin rovers confirmed ancient liquid water persisted on Mars; Opportunity captured the 558-image "Lion King" panorama', icon: '🏜️' },
  ],
};

const isFlybyRelic = (relic: SpacecraftRelic): boolean =>
  relic.celestialBody.id === 'jupiter-flyby' || relic.id === 'pioneer-10-11';

interface EraSlot {
  slotNumber: 1 | 2;
  eraId: EraId;
  coordinates: { x: number; y: number };
  relic: SpacecraftRelic | null;
}

const DEFAULT_SLOT_COORDINATES: Record<1 | 2, { x: number; y: number }> = {
  1: { x: 28, y: 38 },
  2: { x: 72, y: 38 },
};

export const PlanetSystemView: React.FC<PlanetSystemViewProps> = ({
  currentEraId,
  character,
  unlockedBadgeIds,
  onSelectRelic,
  onSelectEra,
  onBackToHome,
  onOpenCustomizer,
  onOpenTrophyRoom,
}) => {
  const currentEra = ERAS_CONFIG.find((e) => e.id === currentEraId) || ERAS_CONFIG[0];
  const eraRelics = SPACE_RELICS.filter((r) => r.eraId === currentEraId);

  const eraSlots: EraSlot[] = React.useMemo(() => {
    return ([1, 2] as const).map((slotNum) => {
      const matched =
        eraRelics.find((r) => r.slotNumber === slotNum) ||
        (slotNum === 1 ? eraRelics.find((r) => !r.slotNumber) : undefined) ||
        null;
      return {
        slotNumber: slotNum,
        eraId: currentEraId,
        coordinates: matched?.celestialBody.coordinates || DEFAULT_SLOT_COORDINATES[slotNum],
        relic: matched,
      };
    });
  }, [currentEraId, eraRelics]);

  // Active view mode: system (orbits), observatory (telescope zoom), radar (debris tracking)
  const [activeSystemView, setActiveSystemView] = useState<'system' | 'observatory' | 'radar'>('system');
  const [selectedPlanetDetail, setSelectedPlanetDetail] = useState<SpacecraftRelic | null>(null);
  const [selectedEmptySlot, setSelectedEmptySlot] = useState<EraSlot | null>(null);
  const [modalViewTab, setModalViewTab] = useState<'globe' | 'surface' | 'relic'>('globe');
  const [hoveredRelic, setHoveredRelic] = useState<SpacecraftRelic | null>(null);
  const [hoveredEmptySlot, setHoveredEmptySlot] = useState<EraSlot | null>(null);
  const [observatorySlotNumber, setObservatorySlotNumber] = useState<1 | 2>(1);

  React.useEffect(() => {
    setSelectedPlanetDetail(null);
    setSelectedEmptySlot(null);
    setHoveredRelic(null);
    setHoveredEmptySlot(null);
    setObservatorySlotNumber(1);
  }, [currentEraId]);

  const activeObservatorySlot =
    eraSlots.find((s) => s.slotNumber === observatorySlotNumber) || eraSlots[0];
  const observatoryTarget = activeObservatorySlot.relic;

  const handlePlanetClick = (relic: SpacecraftRelic) => {
    soundEffects.playTelemetryPing(1600);
    if (relic.slotNumber === 1 || relic.slotNumber === 2) {
      setObservatorySlotNumber(relic.slotNumber);
    }
    setSelectedEmptySlot(null);
    setSelectedPlanetDetail(relic);
  };

  const handleEmptySlotClick = (slot: EraSlot) => {
    soundEffects.playTelemetryPing(1100);
    setObservatorySlotNumber(slot.slotNumber);
    setSelectedPlanetDetail(null);
    setSelectedEmptySlot(slot);
  };

  const handlePlanetHover = (relic: SpacecraftRelic | null) => {
    if (relic && relic.id !== hoveredRelic?.id) {
      soundEffects.playTelemetryPing(2200);
    }
    setHoveredEmptySlot(null);
    setHoveredRelic(relic);
  };

  const handleEmptySlotHover = (slot: EraSlot | null) => {
    if (slot && slot.slotNumber !== hoveredEmptySlot?.slotNumber) {
      soundEffects.playTelemetryPing(1200);
    }
    setHoveredRelic(null);
    setHoveredEmptySlot(slot);
  };

  const handleLaunchWormhole = () => {
    if (!selectedPlanetDetail) return;
    const relic = selectedPlanetDetail;
    setSelectedPlanetDetail(null);
    onSelectRelic(relic);
  };

  return (
    <div className="relative min-h-screen bg-[#030611] text-slate-100 flex flex-col overflow-hidden select-none font-sans">
      {/* Ultra-Realistic Panoramic Deep Space Background (Milky Way & Star Clusters) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Photorealistic 8K Deep Cosmos Panorama */}
        <img
          src="/assets/images/realistic_deep_cosmos_panorama_1792426163138.jpg"
          alt="Realistic Deep Space and Milky Way Panorama"
          sizes="100vw"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover scale-105 opacity-65 transform motion-safe:animate-pulse"
          style={{ animationDuration: '16s' }}
        />
        {/* Natural Vignette & Contrast Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-[#02040a]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#02040a]/70 via-transparent to-[#02040a]/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#030611]/30 to-[#010206]/90" />
      </div>

      {/* Top Bar Navigation (Clean 3-Zone Contract) */}
      <header className="relative z-30 flex items-center justify-between gap-4 px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { soundEffects.playClick(); onBackToHome(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <TeamLogo size="sm" withGlow={false} />
            <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
              SPIRIT EL TEAM
            </span>
          </div>
        </div>

        {/* Zone 2: 3 Era Switcher Buttons */}
        <nav className="flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-medium">
          {ERAS_CONFIG.map((era) => {
            const isActive = era.id === currentEraId;
            return (
              <button
                key={era.id}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedPlanetDetail(null);
                  onSelectEra(era.id);
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{era.years}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Trophy Room & Custom Character) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { soundEffects.playClick(); onOpenTrophyRoom(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-xs font-semibold text-amber-300 transition-colors"
            title="Trophy Room"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Badges ({unlockedBadgeIds.length})</span>
          </button>

          <button
            onClick={() => { soundEffects.playClick(); onOpenCustomizer(); }}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-xs text-slate-200 transition-colors"
            title="Customize Astronaut"
          >
            <CartoonAvatar customization={character} size="sm" isStanding={true} isFlying={false} />
            <span className="hidden sm:inline font-bold">{character.name}</span>
          </button>
        </div>
      </header>

      {/* Realistic Scientific Mode Switcher Sub-Bar */}
      <div className="relative z-20 px-4 sm:px-8 py-2.5 bg-slate-950/60 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Era Context */}
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-bold text-slate-200">{currentEra.arabicTitle}</span>
          <span className="text-slate-500 hidden sm:inline">·</span>
          <span className="text-slate-400 text-[11px] hidden md:inline">{currentEra.description}</span>
        </div>

        {/* Center / Right: View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px]">
          <button
            onClick={() => { soundEffects.playClick(); setActiveSystemView('system'); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              activeSystemView === 'system'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>Solar System Orbits</span>
          </button>

          <button
            onClick={() => { soundEffects.playRadarSweep(); setActiveSystemView('observatory'); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              activeSystemView === 'observatory'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Deep Space Telescope 🔭</span>
          </button>

          <button
            onClick={() => { soundEffects.playTelemetryPing(1400); setActiveSystemView('radar'); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              activeSystemView === 'radar'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>Space Debris Radar 🛰️</span>
          </button>
        </div>
      </div>

      {/* Main Celestial Viewport Area */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col items-center justify-center">

        {/* ================= MODE 1: REALISTIC HELIOCENTRIC ORBITAL SYSTEM ================= */}
        {activeSystemView === 'system' && (
          <div className="relative w-full h-[520px] sm:h-[620px] max-w-5xl flex items-center justify-center">
            {/* Orbital concentric Keplerian elliptical tracks */}
            <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full border border-dashed border-cyan-500/25 pointer-events-none" />
            <div className="absolute w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] rounded-full border border-dashed border-slate-700/50 pointer-events-none" />
            <div className="absolute w-[520px] h-[520px] sm:w-[700px] sm:h-[700px] rounded-full border border-dashed border-slate-800/60 pointer-events-none" />
            <div className="absolute w-[660px] h-[660px] sm:w-[900px] sm:h-[900px] rounded-full border border-dashed border-slate-800/40 pointer-events-none" />

            {/* Central Photorealistic Thermonuclear Sun Core */}
            <div className="absolute flex flex-col items-center justify-center z-10">
              <div className="relative group cursor-pointer" onClick={() => soundEffects.playTelemetryPing(800)}>
                {/* Coronal plasma flare glow */}
                <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-amber-500/40 via-orange-600/30 to-yellow-400/20 blur-2xl animate-pulse" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.85)] border-2 border-amber-300/60">
                  <img
                    src="/assets/images/realistic_sun_solar_core_1792425601914.jpg"
                    alt="Solar Dynamics Observatory Sun Core"
                    width={80}
                    height={80}
                    sizes="(max-width: 640px) 64px, 80px"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover scale-110"
                  />
                  {/* Solar flare rotation shimmer */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_transparent_40%,_rgba(0,0,0,0.5)_95%)] pointer-events-none" />
                </div>
              </div>
              <div className="mt-2 text-center pointer-events-none">
                <span className="text-[11px] font-bold text-amber-300 tracking-wider block">
                  The Sun (Gravitational Core)
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  G2V · 15,000,000 K
                </span>
              </div>
            </div>

            {/* Realistic Drifting Space Debris in Orbit */}
            <div className="absolute top-[18%] left-[22%] pointer-events-none flex items-center gap-1.5 opacity-60 animate-bounce duration-1000">
              <span className="text-[10px]">🛰️</span>
              <span className="text-[9px] font-mono text-slate-500 bg-black/60 px-1 py-0.5 rounded border border-slate-800">
                Orbital Debris: Sputnik Booster Core #24
              </span>
            </div>
            <div className="absolute bottom-[20%] right-[15%] pointer-events-none flex items-center gap-1.5 opacity-60 animate-pulse">
              <span className="text-[10px]">☄️</span>
              <span className="text-[9px] font-mono text-slate-500 bg-black/60 px-1 py-0.5 rounded border border-slate-800">
                Asteroid Belt: Comet Dust Stream
              </span>
            </div>

            {/* Celestial Bodies & Spacecraft Relic Slots placed in Orbit */}
            <div className="relative w-full h-full">
              {eraSlots.map((slot) => {
                if (!slot.relic) {
                  return (
                    <div
                      key={`empty-slot-${slot.eraId}-${slot.slotNumber}`}
                      style={{
                        top: `${slot.coordinates.y}%`,
                        left: `${slot.coordinates.x}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="absolute z-20 group"
                      onMouseEnter={() => handleEmptySlotHover(slot)}
                      onMouseLeave={() => handleEmptySlotHover(null)}
                    >
                      <button
                        onClick={() => handleEmptySlotClick(slot)}
                        className="relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none"
                      >
                        <div className="relative w-16 h-16 sm:w-[74px] sm:h-[74px] rounded-full border-2 border-dashed border-slate-600/80 group-hover:border-cyan-400/80 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.12)] transition-colors">
                          <Radio className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        </div>

                        <div className="mt-2 px-1.5 py-0.5 rounded-full bg-black/80 border border-slate-700 text-[8px] font-mono text-slate-400">
                          Slot {slot.slotNumber}
                        </div>

                        <div className="mt-1.5 flex flex-col items-center text-center">
                          <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-300 transition-colors whitespace-nowrap drop-shadow">
                            Empty Slot
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold whitespace-nowrap">
                            Awaiting Spacecraft
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                }

                const relic = slot.relic;
                const isUnlocked = unlockedBadgeIds.includes(relic.id);
                const { glowColor, size, arabicName } = relic.celestialBody;
                const sciData = getCelestialData(relic);

                return (
                  <div
                    key={relic.id}
                    style={{
                      top: `${slot.coordinates.y}%`,
                      left: `${slot.coordinates.x}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute z-20 group"
                    onMouseEnter={() => handlePlanetHover(relic)}
                    onMouseLeave={() => handlePlanetHover(null)}
                  >
                    <button
                      onClick={() => handlePlanetClick(relic)}
                      className="relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-115 focus:outline-none"
                    >
                      {/* Atmospheric Rayleigh Glow Ring */}
                      <div
                        className="absolute -inset-3.5 rounded-full blur-md opacity-50 group-hover:opacity-95 transition-opacity"
                        style={{ backgroundColor: glowColor }}
                      />

                      {/* 3D Photorealistic Spherical Planetary Globe with Physical Terminator Shadow */}
                      <div
                        className="relative rounded-full border-2 border-white/40 shadow-2xl overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:rotate-6"
                        style={{
                          width: `${Math.max(size, 48)}px`,
                          height: `${Math.max(size, 48)}px`,
                          boxShadow: `0 0 40px ${glowColor}, inset 0 0 15px rgba(0,0,0,0.8)`,
                        }}
                      >
                        {/* High-Resolution Planet Texture */}
                        <img
                          src={sciData.globeImage}
                          alt={arabicName}
                          width={Math.max(size, 48)}
                          height={Math.max(size, 48)}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover scale-110"
                        />

                        {/* Physical Day/Night Terminator Shadow Gradient (Facing outward away from Sun) */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,_rgba(255,255,255,0.3)_0%,_transparent_55%,_rgba(0,0,0,0.92)_90%)] pointer-events-none" />

                        {/* Atmospheric Limb Scatter Ring */}
                        <div
                          className="absolute inset-0 rounded-full border pointer-events-none"
                          style={{ borderColor: glowColor }}
                        />
                      </div>

                      {/* Stationed Forgotten Relic Transponder Pulsing on Planet */}
                      <div className="absolute -top-3.5 -right-3.5 z-30 p-1 rounded-full bg-slate-950 border border-cyan-400 shadow-[0_0_12px_#22d3ee] group-hover:border-amber-400 transition-colors flex items-center justify-center">
                        <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      </div>

                      {/* Distance in AU Badge */}
                      <div className="absolute -bottom-2 px-1.5 py-0.5 rounded-full bg-black/80 border border-slate-700 text-[8px] font-mono text-cyan-300">
                        {sciData.distanceFromSunAU}
                      </div>

                      {/* Planet & Relic Label */}
                      <div className="mt-3.5 flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap drop-shadow">
                          {arabicName.split(' - ')[0]}
                        </span>
                        <span className="text-[10px] text-amber-400 font-semibold whitespace-nowrap flex items-center gap-1">
                          <span>{relic.arabicName}</span>
                          {isUnlocked && <CheckCircle className="w-3 h-3 text-emerald-400 inline" />}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Live Hover Telemetry Card (Appears when hovering any planet or empty slot) */}
            {hoveredRelic && (
              <div className="absolute top-4 right-4 z-40 p-3.5 rounded-xl bg-slate-950/95 border border-cyan-500/50 backdrop-blur-md shadow-2xl max-w-xs text-left animate-fade-in pointer-events-none">
                <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2 mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                    LIVE TELEMETRY
                  </span>
                  <span className="font-bold text-xs text-white">
                    {hoveredRelic.celestialBody.arabicName}
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between gap-2 text-[10px]">
                    <span className="text-slate-400">Historic Spacecraft:</span>
                    <span className="font-bold text-amber-300">{hoveredRelic.arabicName}</span>
                  </div>
                  <div className="flex justify-between gap-2 text-[10px]">
                    <span className="text-slate-400">Sun Distance:</span>
                    <span className="font-mono text-cyan-300">{getCelestialData(hoveredRelic).distanceFromSunAU} ({getCelestialData(hoveredRelic).distanceKm})</span>
                  </div>
                  <div className="flex justify-between gap-2 text-[10px]">
                    <span className="text-slate-400">Gravity:</span>
                    <span className="font-mono text-slate-200">{getCelestialData(hoveredRelic).gravity}</span>
                  </div>
                  <div className="flex justify-between gap-2 text-[10px]">
                    <span className="text-slate-400">Temperature:</span>
                    <span className="font-mono text-rose-300">{getCelestialData(hoveredRelic).temperatureRange}</span>
                  </div>
                </div>
                <div className="mt-2 text-[9px] text-cyan-400 bg-cyan-950/50 p-1 rounded text-center">
                  Click to inspect relics &amp; launch wormhole jump 🌀
                </div>
              </div>
            )}

            {hoveredEmptySlot && !hoveredRelic && (
              <div className="absolute top-4 right-4 z-40 p-3.5 rounded-xl bg-slate-950/95 border border-slate-700/80 backdrop-blur-md shadow-2xl max-w-xs text-left animate-fade-in pointer-events-none">
                <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2 mb-2">
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-slate-500" />
                    SLOT {hoveredEmptySlot.slotNumber} // EMPTY
                  </span>
                  <span className="font-bold text-xs text-slate-200">
                    {currentEra.years}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  No spacecraft has been assigned to this slot yet.
                </p>
                <div className="mt-2 text-[9px] text-cyan-400 bg-slate-900 p-1 rounded text-center">
                  Click to view slot status
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= MODE 2: OBSERVATORY HIGH-POWER TELESCOPE VIEW ================= */}
        {activeSystemView === 'observatory' && (
          <div className="relative w-full max-w-4xl bg-slate-950/90 border border-cyan-500/40 rounded-2xl p-6 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center gap-8 animate-fade-in">
            {/* Left: Giant Rotating Realistic 3D Globe with Lens Reticle */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 shrink-0 flex items-center justify-center">
              {/* Circular Telescope Outer Bezel */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] pointer-events-none" />
              <div className="absolute inset-4 rounded-full border border-dashed border-slate-700/80 pointer-events-none" />

              {/* Crosshair Optics Lines */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/20 pointer-events-none" />

              {observatoryTarget ? (
                <div
                  className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden shadow-2xl flex items-center justify-center transition-all duration-700"
                  style={{
                    boxShadow: `0 0 60px ${observatoryTarget.celestialBody.glowColor}`,
                  }}
                >
                  <img
                    src={getCelestialData(observatoryTarget).globeImage}
                    alt={observatoryTarget.celestialBody.arabicName}
                    width={240}
                    height={240}
                    sizes="(max-width: 640px) 192px, 240px"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover scale-110"
                  />
                  {/* Terminator 3D Physical Shadow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.35)_0%,_transparent_55%,_rgba(0,0,0,0.92)_90%)] pointer-events-none" />
                  {/* Atmospheric scattering edge */}
                  <div
                    className="absolute inset-0 rounded-full border-2 pointer-events-none"
                    style={{ borderColor: observatoryTarget.celestialBody.glowColor }}
                  />
                </div>
              ) : (
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-dashed border-slate-700 bg-slate-950/80 flex flex-col items-center justify-center text-center p-4">
                  <Radio className="w-8 h-8 text-slate-600 mb-2" />
                  <span className="text-xs font-bold text-slate-300">
                    Slot {activeObservatorySlot.slotNumber} Empty
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 mt-1">
                    No Target Assigned
                  </span>
                </div>
              )}

              {/* HUD Target Crosshair Lock */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-black/80 border border-slate-800 text-[10px] font-mono text-emerald-400">
                <Crosshair className="w-3.5 h-3.5 animate-spin" />
                <span>MAGNIFICATION 1200X</span>
              </div>
            </div>

            {/* Right: Detailed Scientific Planetary Telemetry Dossier */}
            <div className="flex-1 w-full text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-black text-white">
                    {observatoryTarget
                      ? observatoryTarget.celestialBody.arabicName
                      : `Slot ${activeObservatorySlot.slotNumber} — Empty Slot`}
                  </h3>
                  <span className="text-xs text-amber-400 font-semibold">
                    {observatoryTarget
                      ? isFlybyRelic(observatoryTarget)
                        ? `Associated Flyby Mission: ${observatoryTarget.name}`
                        : `Stationed Relic: ${observatoryTarget.arabicName}`
                      : `Era: ${currentEra.years} · Awaiting Spacecraft`}
                  </span>
                </div>
                <div className="flex gap-2">
                  {eraSlots.map((slot) => (
                    <button
                      key={slot.slotNumber}
                      onClick={() => {
                        soundEffects.playTelemetryPing(1900);
                        setObservatorySlotNumber(slot.slotNumber);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeObservatorySlot.slotNumber === slot.slotNumber
                          ? 'bg-cyan-500 text-slate-950 shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {slot.relic ? slot.relic.name : `Slot ${slot.slotNumber} (Empty)`}
                    </button>
                  ))}
                </div>
              </div>

              {observatoryTarget ? (
                <>
                  {/* Scientific Parameters Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Distance from Sun</span>
                      <span className="font-mono text-cyan-300 font-bold">{getCelestialData(observatoryTarget).distanceFromSunAU} ({getCelestialData(observatoryTarget).distanceKm})</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Surface Gravity</span>
                      <span className="font-mono text-emerald-300 font-bold">{getCelestialData(observatoryTarget).gravity}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Atmospheric Pressure</span>
                      <span className="font-mono text-amber-300 font-bold">{getCelestialData(observatoryTarget).atmPressure}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Temperature Range</span>
                      <span className="font-mono text-rose-300 font-bold">{getCelestialData(observatoryTarget).temperatureRange}</span>
                    </div>
                  </div>

                  {/* Atmosphere Details */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Atmospheric Composition:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {getCelestialData(observatoryTarget).atmosphereComposition}
                    </p>
                  </div>

                  {/* Open Full Inspection Button */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => handlePlanetClick(observatoryTarget)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>
                        {isFlybyRelic(observatoryTarget)
                          ? 'Open Relic Dossier & Flyby View 🪐'
                          : 'Open Relic Dossier & Land Now 🪐'}
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6 rounded-xl bg-slate-900/50 border border-dashed border-slate-800 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-200">
                    Empty Spacecraft Slot
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Slot {activeObservatorySlot.slotNumber} in the {currentEra.years} era does not have a spacecraft assigned yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= MODE 3: SPACE DEBRIS & RELIC ORBITAL RADAR ================= */}
        {activeSystemView === 'radar' && (
          <div className="relative w-full max-w-4xl bg-slate-950/95 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-black text-white">
                Orbital Debris &amp; Forgotten Space Relics Map
              </h3>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <Satellite className="w-4 h-4 text-emerald-400 animate-pulse" />
                Deep Space Network (DSN Radar Tracking)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
              {eraSlots.map((slot) => {
                if (!slot.relic) {
                  return (
                    <div
                      key={`radar-empty-${slot.eraId}-${slot.slotNumber}`}
                      onClick={() => handleEmptySlotClick(slot)}
                      className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-700/80 hover:border-cyan-400/70 cursor-pointer transition-all hover:bg-slate-900/60 group flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full border border-dashed border-slate-600 flex items-center justify-center shrink-0">
                            <Radio className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <span className="font-bold text-xs text-slate-300 group-hover:text-cyan-300">
                            Slot {slot.slotNumber} — Empty Slot
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-mono text-[10px] border border-slate-800">
                          {currentEra.years}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 bg-black/40 p-2.5 rounded border border-slate-800/80 leading-relaxed">
                        No spacecraft telemetry registered in Slot {slot.slotNumber} yet.
                      </div>
                    </div>
                  );
                }

                const relic = slot.relic;
                const sci = getCelestialData(relic);
                return (
                  <div
                    key={relic.id}
                    onClick={() => handlePlanetClick(relic)}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400 cursor-pointer transition-all hover:bg-slate-900 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-700 shrink-0">
                          <img
                            src={sci.globeImage}
                            alt={relic.arabicName}
                            width={28}
                            height={28}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-bold text-xs text-white group-hover:text-cyan-300">
                          {relic.arabicName}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
                        {relic.designation}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400 mb-2.5">
                      <div className="flex justify-between">
                        <span>Site Location:</span>
                        <span className="font-mono text-slate-200">{sci.landingSiteName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coordinates:</span>
                        <span className="font-mono text-amber-300">{sci.landingCoordinates}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Historical Frequency:</span>
                        <span className="font-mono text-cyan-400">{sci.signalFrequency}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-300 bg-black/50 p-2 rounded border border-slate-800/80 leading-relaxed">
                      {sci.spacecraftStatus}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Standing Companion Astronaut Helper on Command Deck */}
        <div className="absolute bottom-6 right-6 hidden lg:flex items-center gap-3 p-3 rounded-2xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-md z-20 shadow-xl">
          <CartoonAvatar customization={character} size="sm" isStanding={true} isFlying={false} />
          <div className="text-left text-xs">
            <span className="font-bold text-white block">{character.name} (Standing on Bridge)</span>
            <span className="text-[10px] text-cyan-300">
              {eraRelics.length > 0
                ? 'Select a planet to trigger a wormhole jump!'
                : 'Slots in this era are empty and ready to be filled!'}
            </span>
          </div>
        </div>
      </main>

      {/* ================= ULTRA-REALISTIC PLANET & FORGOTTEN ITEMS POPUP / MODAL ================= */}
      {selectedPlanetDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#070b15] border border-cyan-500/40 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900/70">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full overflow-hidden border border-white/40 shadow-md shrink-0"
                  style={{ boxShadow: `0 0 15px ${selectedPlanetDetail.celestialBody.glowColor}` }}
                >
                  <img
                    src={getCelestialData(selectedPlanetDetail).globeImage}
                    alt={selectedPlanetDetail.celestialBody.arabicName}
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {selectedPlanetDetail.celestialBody.arabicName}
                  </h3>
                  <span className="text-xs text-amber-400 font-semibold block">
                    {isFlybyRelic(selectedPlanetDetail)
                      ? `Associated Flyby Mission: ${selectedPlanetDetail.name}`
                      : `Stationed Spacecraft: ${selectedPlanetDetail.arabicName}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlanetDetail(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-left">
              {/* Photorealistic Viewport Stage (Globe vs Surface Panorama) */}
              <div className="relative w-full h-52 sm:h-60 rounded-xl overflow-hidden border border-slate-700 bg-black shadow-inner flex items-center justify-center group">
                {modalViewTab === 'globe' ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-[#010308] overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0a1832_0%,_#010308_100%)] opacity-80" />
                    {/* Realistic Spherical Globe */}
                    <div
                      className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl flex items-center justify-center"
                      style={{ boxShadow: `0 0 50px ${selectedPlanetDetail.celestialBody.glowColor}` }}
                    >
                      <img
                        src={getCelestialData(selectedPlanetDetail).globeImage}
                        alt="Planetary Globe"
                        width={192}
                        height={192}
                        sizes="(max-width: 640px) 160px, 192px"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover scale-110"
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.35)_0%,_transparent_55%,_rgba(0,0,0,0.92)_90%)] pointer-events-none" />
                      <div
                        className="absolute inset-0 rounded-full border-2 pointer-events-none"
                        style={{ borderColor: selectedPlanetDetail.celestialBody.glowColor }}
                      />
                    </div>
                  </div>
                ) : modalViewTab === 'surface' ? (
                  <div className="relative w-full h-full">
                    <img
                      src={getCelestialData(selectedPlanetDetail).surfaceImage}
                      alt="Planetary Surface"
                      sizes="(max-width: 640px) 92vw, 624px"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
                    {/* Landing Crosshair Target */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 border border-cyan-400/70 rounded-full flex items-center justify-center animate-ping duration-1000" />
                      <div className="w-8 h-8 border border-amber-400 rounded-full flex items-center justify-center" />
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 text-left font-mono text-[10px] text-slate-200 bg-black/80 p-1.5 rounded border border-slate-700">
                      <span className="text-amber-400 font-bold block">
                        {isFlybyRelic(selectedPlanetDetail)
                          ? 'Jupiter Flyby Encounter (No Landing)'
                          : 'Historic Landing Site'}
                      </span>
                      <span>{getCelestialData(selectedPlanetDetail).landingCoordinates}</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-black p-4 overflow-hidden">
                    {selectedPlanetDetail.image ? (
                      <>
                        <img
                          src={selectedPlanetDetail.image}
                          alt={selectedPlanetDetail.name}
                          sizes="(max-width: 640px) 92vw, 624px"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left pointer-events-none">
                          <h4 className="font-bold text-white text-xs">{selectedPlanetDetail.arabicName}</h4>
                          {selectedPlanetDetail.gallery?.length === 1 && selectedPlanetDetail.gallery[0].label && (
                            <div className="text-[10px] font-mono text-amber-300">
                              {selectedPlanetDetail.gallery[0].label}
                            </div>
                          )}
                          <div className="text-[10px] font-mono text-cyan-400">
                            {getCelestialData(selectedPlanetDetail).spacecraftStatus}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-2">
                        <span className="text-4xl block">🛰️</span>
                        <h4 className="font-bold text-white text-sm">{selectedPlanetDetail.arabicName}</h4>
                        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                          {selectedPlanetDetail.whyLaunched}
                        </p>
                        <div className="text-[10px] font-mono text-cyan-400">
                          {getCelestialData(selectedPlanetDetail).spacecraftStatus}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Viewport Mode Switcher Buttons */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/80 p-1 rounded-lg border border-slate-800 text-[10px] font-bold">
                  <button
                    onClick={() => { soundEffects.playClick(); setModalViewTab('globe'); }}
                    className={`px-2 py-0.5 rounded transition-all ${
                      modalViewTab === 'globe' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Orbital Globe 🌐
                  </button>
                  <button
                    onClick={() => { soundEffects.playClick(); setModalViewTab('surface'); }}
                    className={`px-2 py-0.5 rounded transition-all ${
                      modalViewTab === 'surface' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isFlybyRelic(selectedPlanetDetail) ? 'Jupiter Atmosphere 🪐' : 'Surface Terrain 🪐'}
                  </button>
                  <button
                    onClick={() => { soundEffects.playClick(); setModalViewTab('relic'); }}
                    className={`px-2 py-0.5 rounded transition-all ${
                      modalViewTab === 'relic' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Historic Relic 🛰️
                  </button>
                </div>
              </div>

              {/* Scientific Parameters Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Gravity</span>
                  <span className="font-mono text-emerald-300 font-bold">{getCelestialData(selectedPlanetDetail).gravity.split(' ')[0]}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Temperature</span>
                  <span className="font-mono text-rose-300 font-bold">{getCelestialData(selectedPlanetDetail).temperatureRange.split(' ')[0]}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Pressure</span>
                  <span className="font-mono text-amber-300 font-bold">{getCelestialData(selectedPlanetDetail).atmPressure.split(' ')[0]}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Distance</span>
                  <span className="font-mono text-cyan-300 font-bold">{getCelestialData(selectedPlanetDetail).distanceFromSunAU}</span>
                </div>
              </div>

              {/* Forgotten Items & Artifacts List */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2.5">
                  <Layers className="w-4 h-4" />
                  <h4>
                    {isFlybyRelic(selectedPlanetDetail)
                      ? 'Jupiter Flyby Mission Highlights:'
                      : 'Forgotten Hardware & Relics Preserved On Site:'}
                  </h4>
                </div>

                <div className="space-y-2">
                  {(RELIC_FORGOTTEN_ITEMS[selectedPlanetDetail.id] || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs"
                    >
                      <span className="text-base shrink-0">{item.icon}</span>
                      <div>
                        <div className="font-bold text-slate-100">{item.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standing Astronaut Callout */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs">
                <CartoonAvatar customization={character} size="sm" isExcited={true} isStanding={true} isFlying={false} />
                <div className="text-left">
                  <span className="font-bold text-white block">{character.name}:</span>
                  <span className="text-cyan-300 text-[11px]">
                    Ready for launch? We will enter the wormhole and travel straight to this iconic space relic!
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-900/70">
              <button
                onClick={() => setSelectedPlanetDetail(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>

              <button
                onClick={handleLaunchWormhole}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Board Spacecraft &amp; Launch to Planet 🚀</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EMPTY SPACECRAFT SLOT MODAL ================= */}
      {selectedEmptySlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#070b15] border border-cyan-500/40 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-dashed border-slate-600 bg-slate-950 flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Slot {selectedEmptySlot.slotNumber} — Empty Slot
                  </h3>
                  <span className="text-xs text-cyan-400 font-semibold block">
                    {currentEra.years} · {currentEra.arabicTitle}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmptySlot(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-left space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                This spacecraft slot is currently empty. No spacecraft or celestial target has been assigned to Slot {selectedEmptySlot.slotNumber} in the {currentEra.years} era yet.
              </p>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400 font-mono">
                Status: Empty · Ready for spacecraft data
              </div>
            </div>

            <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-800 bg-slate-900/70">
              <button
                onClick={() => setSelectedEmptySlot(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
