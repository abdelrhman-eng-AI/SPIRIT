export type EraId = '1960-1980' | '1980-2000' | '2000-2020';

export type OutfitStyle =
  | 'classic_eva'
  | 'commander_jacket'
  | 'stealth_armor'
  | 'galactic_cape'
  | 'retro_apollo'
  | 'nebula_hoodie';

export type HelmetStyle = 'classic' | 'tactical' | 'panoramic' | 'heritage_apollo';

export interface CharacterCustomization {
  name: string;
  suitColor: string; // e.g. '#06b6d4' | '#f59e0b' | '#ec4899' | '#10b981' | '#ffffff'
  secondaryColor?: string; // Pants, trim, cape & accent color
  outfitStyle?: OutfitStyle; // Clothing / suit architecture
  helmetStyle?: HelmetStyle; // Helmet visor & shell variant
  visorTint: string; // e.g. '#fbbf24' | '#38bdf8' | '#a855f7' | '#34d399'
  badgeSymbol: 'star' | 'rocket' | 'planet' | 'shield' | 'atom';
  companionTitle: string; // e.g. 'Cosmic Explorer' | 'Star Navigator' | 'Relic Hunter'
  accessory:
    | 'antenna'
    | 'jetpack'
    | 'goggles'
    | 'backpack'
    | 'scanner'
    | 'camera'
    | 'quantum_wings'
    | 'none';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExternalReference {
  label: string;
  url: string;
  source: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  arabicName: string;
  type: 'planet' | 'moon' | 'comet' | 'asteroid' | 'orbit';
  color: string;
  glowColor: string;
  size: number; // in relative pixels
  distanceLabel: string;
  coordinates: { x: number; y: number }; // Percentage 0 - 100 for orbital placement
  textureType: 'craters' | 'gas_bands' | 'acid_clouds' | 'ice_cracks' | 'dusty_red' | 'deep_space';
}

export interface SpacecraftRelic {
  id: string;
  eraId: EraId;
  slotNumber?: 1 | 2;
  name: string;
  arabicName: string;
  designation: string;
  operator: string;
  mass?: string;
  launchDate: string;
  endOfService?: string;
  shortFact?: string;
  launchSite: string;
  launchVehicle: string;
  image?: string;
  gallery?: Array<{
    src: string;
    label: string;
    tabLabel?: string;
    isEarthTest?: boolean;
  }>;
  celestialBody: CelestialBody;
  
  // 4 Core required questions:
  launchTimeline: string;      // When did it launch into space?
  whyLaunched: string;         // Why was it launched and what was its goal?
  whyAbandoned: string;        // Why was it left behind in space?
  achievements: string[];      // Key scientific breakthroughs and milestones
  currentLocationAndStatus: string; // Current location and status
  
  // Story & Narration
  storyTitle?: string;
  storySubtitle?: string;
  narrationScript: string[];   // Sentences/paragraphs for story display & Web Speech API
  
  // Deep dive & quiz
  externalLinks: ExternalReference[];
  quiz: QuizQuestion[];
  badge: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
}

export interface EraInfo {
  id: EraId;
  title: string;
  arabicTitle: string;
  subtitle: string;
  years: string;
  description: string;
  colorTheme: string;
  relicsCount: number;
  slotsCount: number;
}

export interface UserProgress {
  unlockedBadges: string[]; // Relic IDs whose badge was won
  visitedRelics: string[];
  quizzesCompleted: Record<string, number>; // relicId -> score
  customCharacter: CharacterCustomization;
  grandBadgeClaimed: boolean;
}
