import React from 'react';
import { CharacterCustomization } from '../types';

interface CartoonAvatarProps {
  customization: CharacterCustomization;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  isExcited?: boolean;
  isFlying?: boolean;
  isStanding?: boolean;
  isSpeaking?: boolean;
  unlockedBadgesCount?: number;
  className?: string;
}

export const CartoonAvatar: React.FC<CartoonAvatarProps> = ({
  customization,
  size = 'md',
  isExcited = false,
  isFlying = false,
  isStanding = false,
  isSpeaking = false,
  unlockedBadgesCount = 0,
  className = '',
}) => {
  const {
    suitColor,
    secondaryColor = '#1e293b',
    outfitStyle = 'classic_eva',
    helmetStyle = 'classic',
    visorTint,
    badgeSymbol,
    accessory,
  } = customization;

  // If standing, disable flying float animation so the astronaut stays firmly grounded
  const effectivelyFlying = (isFlying || accessory === 'quantum_wings') && !isStanding;

  const sizeDimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
    hero: 'w-52 h-52 md:w-64 md:h-64',
  }[size];

  // Tool evolution flags based on badge milestones or explicit selection
  const hasGoggles = accessory === 'goggles' || unlockedBadgesCount >= 2;
  const hasHeavyBackpack = accessory === 'backpack' || unlockedBadgesCount >= 4;
  const hasRadarScanner = accessory === 'scanner' || unlockedBadgesCount >= 6;
  const hasQuantumWings = accessory === 'quantum_wings' || unlockedBadgesCount >= 8;

  const gradIdSuffix = `${suitColor.replace('#', '')}-${secondaryColor.replace('#', '')}-${outfitStyle}-${helmetStyle}`;

  // Determine pants color depending on outfit style
  const legColor =
    outfitStyle === 'commander_jacket' || outfitStyle === 'nebula_hoodie'
      ? secondaryColor
      : suitColor;

  const isArmored = outfitStyle === 'stealth_armor';
  const isClassicOrApollo = outfitStyle === 'classic_eva' || outfitStyle === 'retro_apollo';

  // Helmet ear-pod & antenna coordinates tuned per helmet silhouette
  const earXLeft = helmetStyle === 'panoramic' ? 51 : 56;
  const earXRight = helmetStyle === 'panoramic' ? 149 : 144;
  const antennaTopY = helmetStyle === 'heritage_apollo' ? 17 : 18;

  return (
    <div
      className={`relative select-none inline-flex flex-col items-center justify-center ${sizeDimensions} ${
        effectivelyFlying ? 'animate-float-slow' : ''
      } ${className}`}
    >
      {/* Jetpack flames only if flying and has jetpack */}
      {accessory === 'jetpack' && effectivelyFlying && (
        <div className="absolute -bottom-2 flex gap-3 z-0">
          <div className="w-2.5 h-6 bg-gradient-to-b from-amber-300 via-orange-500 to-transparent rounded-full animate-pulse blur-[1px]" />
          <div className="w-2.5 h-6 bg-gradient-to-b from-amber-300 via-orange-500 to-transparent rounded-full animate-pulse blur-[1px]" />
        </div>
      )}

      {/* SVG Cartoon Astronaut Explorer */}
      <svg
        viewBox="0 0 200 230"
        className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <radialGradient id={`visor-grad-${gradIdSuffix}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="25%" stopColor={visorTint} stopOpacity="0.95" />
            <stop offset="85%" stopColor="#0f172a" stopOpacity="0.95" />
          </radialGradient>
          <linearGradient id={`suit-grad-${gradIdSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="45%" stopColor={suitColor} />
            <stop offset="100%" stopColor="#090d16" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id={`cape-grad-${gradIdSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="65%" stopColor={suitColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="ground-pad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="wings-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Standing Platform / Dock Base when isStanding is true */}
        {isStanding && (
          <g>
            <ellipse cx="100" cy="222" rx="65" ry="7" fill="#000000" opacity="0.6" />
            <ellipse cx="100" cy="220" rx="55" ry="6" fill="url(#ground-pad)" stroke="#38bdf8" strokeWidth="1.5" />
            <ellipse cx="100" cy="219" rx="38" ry="4" fill="none" stroke="#67e8f9" strokeWidth="1" strokeDasharray="4 3" />
          </g>
        )}

        {/* ================= ROYAL GALACTIC CAPE (Behind Body) ================= */}
        {outfitStyle === 'galactic_cape' && (
          <g>
            <path
              d="M 65 98 L 28 197 Q 100 214 172 197 L 135 98 Z"
              fill={`url(#cape-grad-${gradIdSuffix})`}
              stroke="#fbbf24"
              strokeWidth="2.5"
              opacity="0.95"
            />
            {/* Tiny constellation stars on cape */}
            <circle cx="50" cy="175" r="1.8" fill="#fde047" opacity="0.9" />
            <circle cx="150" cy="172" r="1.8" fill="#fde047" opacity="0.9" />
            <circle cx="158" cy="146" r="1.4" fill="#ffffff" opacity="0.75" />
            <circle cx="42" cy="148" r="1.4" fill="#ffffff" opacity="0.75" />
          </g>
        )}

        {/* ================= BACK ACCESSORY: QUANTUM WINGS (8+ BADGES) ================= */}
        {hasQuantumWings && (
          <g className="animate-pulse">
            <path
              d="M 52 110 Q 10 90 4 75 Q 16 125 50 142 Z"
              fill="url(#wings-grad)"
              opacity="0.85"
              stroke="#67e8f9"
              strokeWidth="1.5"
            />
            <path
              d="M 148 110 Q 190 90 196 75 Q 184 125 150 142 Z"
              fill="url(#wings-grad)"
              opacity="0.85"
              stroke="#67e8f9"
              strokeWidth="1.5"
            />
            <line x1="26" y1="88" x2="36" y2="128" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
            <line x1="174" y1="88" x2="164" y2="128" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
          </g>
        )}

        {/* ================= BACK ACCESSORY: HEAVY EXPLORER BACKPACK (4+ BADGES) ================= */}
        {hasHeavyBackpack ? (
          <g>
            <rect x="42" y="98" width="116" height="66" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <rect x="46" y="104" width="20" height="52" rx="8" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
            <rect x="50" y="112" width="12" height="4" rx="2" fill="#22c55e" className="animate-pulse" />
            <rect x="134" y="104" width="20" height="52" rx="8" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="144" cy="122" r="4" fill="#f59e0b" />
            <rect x="74" y="94" width="52" height="10" rx="3" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
          </g>
        ) : (
          <g>
            <rect x="52" y="105" width="22" height="54" rx="10" fill="#334155" stroke="#475569" strokeWidth="2" />
            <rect x="126" y="105" width="22" height="54" rx="10" fill="#334155" stroke="#475569" strokeWidth="2" />
          </g>
        )}

        {/* Antenna accessory */}
        {(accessory === 'antenna' || unlockedBadgesCount >= 1) && (
          <g>
            <line x1="100" y1={antennaTopY + 10} x2="100" y2="6" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="5" r="4.5" fill="#38bdf8" className="animate-pulse" />
            <path d="M 94 3 Q 100 -1 106 3" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
          </g>
        )}

        {/* ================= LEGS & BOOTS (STANDING VS FLOATING) ================= */}
        {isStanding ? (
          <g>
            {/* Left Leg */}
            <rect x="64" y="156" width="28" height="48" rx={isArmored ? '4' : '8'} fill={legColor} stroke="#1e293b" strokeWidth="3" />
            {/* EVA corrugated leg rings */}
            {outfitStyle === 'classic_eva' && (
              <g stroke="#334155" strokeWidth="1.5" opacity="0.7">
                <line x1="66" y1="168" x2="90" y2="168" />
                <line x1="66" y1="191" x2="90" y2="191" />
              </g>
            )}
            {/* Side stripe for Retro Apollo or Hoodie */}
            {outfitStyle === 'retro_apollo' && (
              <line x1="68" y1="162" x2="68" y2="198" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            )}
            {outfitStyle === 'nebula_hoodie' && (
              <line x1="69" y1="162" x2="69" y2="198" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            )}
            {/* Knee Guard */}
            <rect
              x="62"
              y="176"
              width="32"
              height={isArmored ? '10' : '6'}
              rx={isArmored ? '2' : '3'}
              fill={isArmored ? secondaryColor : '#334155'}
              stroke={isArmored ? '#38bdf8' : '#1e293b'}
              strokeWidth="1.5"
            />
            {/* Left Boot */}
            <path
              d="M 58 202 L 96 202 L 96 218 C 96 220, 56 220, 56 218 L 56 204 Z"
              fill={outfitStyle === 'galactic_cape' ? '#78350f' : outfitStyle === 'retro_apollo' ? '#cbd5e1' : '#1e293b'}
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <line
              x1="60"
              y1="216"
              x2="92"
              y2="216"
              stroke={outfitStyle === 'nebula_hoodie' || isArmored ? '#38bdf8' : outfitStyle === 'galactic_cape' ? '#fbbf24' : '#475569'}
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Right Leg */}
            <rect x="108" y="156" width="28" height="48" rx={isArmored ? '4' : '8'} fill={legColor} stroke="#1e293b" strokeWidth="3" />
            {outfitStyle === 'classic_eva' && (
              <g stroke="#334155" strokeWidth="1.5" opacity="0.7">
                <line x1="110" y1="168" x2="134" y2="168" />
                <line x1="110" y1="191" x2="134" y2="191" />
              </g>
            )}
            {outfitStyle === 'retro_apollo' && (
              <line x1="132" y1="162" x2="132" y2="198" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
            )}
            {outfitStyle === 'nebula_hoodie' && (
              <line x1="131" y1="162" x2="131" y2="198" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            )}
            <rect
              x="106"
              y="176"
              width="32"
              height={isArmored ? '10' : '6'}
              rx={isArmored ? '2' : '3'}
              fill={isArmored ? secondaryColor : '#334155'}
              stroke={isArmored ? '#38bdf8' : '#1e293b'}
              strokeWidth="1.5"
            />
            {/* Right Boot */}
            <path
              d="M 104 202 L 142 202 L 142 218 C 142 220, 102 220, 102 218 L 102 204 Z"
              fill={outfitStyle === 'galactic_cape' ? '#78350f' : outfitStyle === 'retro_apollo' ? '#cbd5e1' : '#1e293b'}
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <line
              x1="106"
              y1="216"
              x2="138"
              y2="216"
              stroke={outfitStyle === 'nebula_hoodie' || isArmored ? '#38bdf8' : outfitStyle === 'galactic_cape' ? '#fbbf24' : '#475569'}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        ) : (
          <g>
            <path
              d="M 72 158 Q 62 186 68 204 Q 82 208 86 196 Q 84 178 86 158 Z"
              fill={legColor}
              stroke="#1e293b"
              strokeWidth="3"
            />
            <ellipse cx="68" cy="204" rx="14" ry="8" fill={outfitStyle === 'galactic_cape' ? '#78350f' : '#1e293b'} stroke="#0f172a" strokeWidth="2" />
            <path
              d="M 114 158 Q 116 182 128 200 Q 142 198 138 184 Q 130 172 128 158 Z"
              fill={legColor}
              stroke="#1e293b"
              strokeWidth="3"
            />
            <ellipse cx="132" cy="198" rx="14" ry="8" fill={outfitStyle === 'galactic_cape' ? '#78350f' : '#1e293b'} stroke="#0f172a" strokeWidth="2" />
          </g>
        )}

        {/* ================= TORSO & SUIT SILHOUETTES ================= */}
        {/* Distinct outer torso silhouette per suit design */}
        {outfitStyle === 'stealth_armor' ? (
          <path
            d="M 60 105 L 140 105 L 144 134 L 136 164 L 64 164 L 56 134 Z"
            fill={`url(#suit-grad-${gradIdSuffix})`}
            stroke="#0f172a"
            strokeWidth="3.5"
          />
        ) : outfitStyle === 'retro_apollo' ? (
          <rect
            x="59"
            y="98"
            width="82"
            height="68"
            rx="16"
            fill={`url(#suit-grad-${gradIdSuffix})`}
            stroke="#1e293b"
            strokeWidth="3.5"
          />
        ) : outfitStyle === 'commander_jacket' ? (
          <path
            d="M 65 104 C 65 95, 135 95, 135 104 L 142 163 C 142 169, 58 169, 58 163 Z"
            fill={`url(#suit-grad-${gradIdSuffix})`}
            stroke="#1e293b"
            strokeWidth="3.5"
          />
        ) : (
          <path
            d="M 64 108 C 64 94, 136 94, 136 108 L 140 162 C 140 170, 60 170, 60 162 Z"
            fill={`url(#suit-grad-${gradIdSuffix})`}
            stroke="#1e293b"
            strokeWidth="3.5"
          />
        )}

        {/* 0. CLASSIC EVA SPACESUIT DETAILS (Ribbed pressure collar + oxygen hoses) */}
        {outfitStyle === 'classic_eva' && (
          <g>
            {/* Pressurized Collar Ring */}
            <ellipse cx="100" cy="102" rx="34" ry="5.5" fill={secondaryColor} stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Twin EVA Oxygen Hose Connectors */}
            <path d="M 73 114 Q 67 132 76 144" fill="none" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 127 114 Q 133 132 124 144" fill="none" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="72" cy="114" r="3.5" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1" />
            <circle cx="128" cy="114" r="3.5" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1" />
          </g>
        )}

        {/* 1. COMMANDER FLIGHT JACKET */}
        {outfitStyle === 'commander_jacket' && (
          <g>
            {/* Jacket inner dark vest / zipper line */}
            <rect x="92" y="102" width="16" height="58" fill={secondaryColor} />
            <line x1="100" y1="102" x2="100" y2="160" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 2" />
            {/* Jacket Lapels / Collar */}
            <polygon points="75,100 92,102 86,122" fill={secondaryColor} stroke="#0f172a" strokeWidth="1.5" />
            <polygon points="125,100 108,102 114,122" fill={secondaryColor} stroke="#0f172a" strokeWidth="1.5" />
            {/* Gold Commander Shoulder Epaulets */}
            <rect x="63" y="99" width="17" height="6.5" rx="2" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
            <rect x="120" y="99" width="17" height="6.5" rx="2" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
            {/* Tactical Jacket Pockets */}
            <rect x="66" y="135" width="19" height="14" rx="2.5" fill={secondaryColor} stroke="#0f172a" strokeWidth="1.2" />
            <rect x="115" y="135" width="19" height="14" rx="2.5" fill={secondaryColor} stroke="#0f172a" strokeWidth="1.2" />
          </g>
        )}

        {/* 2. STEALTH CYBER ARMOR */}
        {outfitStyle === 'stealth_armor' && (
          <g>
            {/* Armored shoulder pauldrons */}
            <path d="M 50 108 Q 60 89 80 101 L 74 119 Q 55 119 50 108 Z" fill={secondaryColor} stroke="#38bdf8" strokeWidth="1.8" />
            <path d="M 150 108 Q 140 89 120 101 L 126 119 Q 145 119 150 108 Z" fill={secondaryColor} stroke="#38bdf8" strokeWidth="1.8" />
            {/* Geometric Cyber Chest Plates */}
            <polygon points="70,108 130,108 124,146 100,154 76,146" fill={secondaryColor} stroke="#38bdf8" strokeWidth="1.8" />
            {/* Glowing Reactor Core */}
            <circle cx="100" cy="126" r="9.5" fill="#083344" stroke="#22d3ee" strokeWidth="2" />
            <circle cx="100" cy="126" r="4.5" fill="#67e8f9" className="animate-pulse" />
          </g>
        )}

        {/* 3. GALACTIC ROYAL CAPE OUTFIT TRIM */}
        {outfitStyle === 'galactic_cape' && (
          <g>
            {/* Ornamental Royal Tunic Trim */}
            <path d="M 76 102 L 100 116 L 124 102" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
            {/* Diagonal Royal Explorer Sash */}
            <path d="M 68 102 L 135 156 L 122 158 L 61 111 Z" fill="#fbbf24" opacity="0.92" stroke="#92400e" strokeWidth="1.2" />
            {/* Golden Cape Clasp Studs */}
            <circle cx="71" cy="106" r="5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="129" cy="106" r="5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
            {/* Chest Medallion Backing */}
            <circle cx="100" cy="136" r="12" fill={secondaryColor} stroke="#fbbf24" strokeWidth="2" />
          </g>
        )}

        {/* 4. RETRO APOLLO HERITAGE SUIT */}
        {outfitStyle === 'retro_apollo' && (
          <g>
            {/* Protruding Bellows Shoulder Pads */}
            <ellipse cx="62" cy="112" rx="7" ry="12" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
            <ellipse cx="138" cy="112" rx="7" ry="12" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
            {/* Classic Mission Red & Blue Vertical Stripes */}
            <rect x="69" y="103" width="5" height="52" rx="2" fill="#ef4444" />
            <rect x="126" y="103" width="5" height="52" rx="2" fill="#3b82f6" />
            {/* Ribbed Collar Ring */}
            <ellipse cx="100" cy="100" rx="36" ry="6" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
          </g>
        )}

        {/* 5. NEBULA MODERN HOODIE */}
        {outfitStyle === 'nebula_hoodie' && (
          <g>
            {/* Cozy Padded Hood Collar around neck */}
            <path d="M 60 101 Q 100 119 140 101 Q 128 91 100 94 Q 72 91 60 101 Z" fill={secondaryColor} stroke="#0f172a" strokeWidth="2" />
            {/* Hoodie Drawstrings */}
            <line x1="89" y1="109" x2="87" y2="129" stroke="#f8fafc" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="111" y1="109" x2="113" y2="129" stroke="#f8fafc" strokeWidth="2.2" strokeLinecap="round" />
            {/* Diagonal Neon Chest Stripe */}
            <path d="M 62 130 L 138 118 L 139 128 L 62 140 Z" fill={secondaryColor} opacity="0.88" />
            {/* Kangaroo Pocket */}
            <path d="M 75 141 L 125 141 L 131 156 L 69 156 Z" fill={secondaryColor} opacity="0.75" stroke="#0f172a" strokeWidth="1.5" />
          </g>
        )}

        {/* Waist Utility Belt with Clip Buckle */}
        <rect
          x="61"
          y="152"
          width="78"
          height="12"
          rx={isArmored ? '2' : '4'}
          fill={outfitStyle === 'galactic_cape' ? '#78350f' : '#1e293b'}
          stroke={isArmored ? '#38bdf8' : '#334155'}
          strokeWidth="1.5"
        />
        <rect
          x="94"
          y="150"
          width="12"
          height="16"
          rx="2"
          fill={outfitStyle === 'galactic_cape' || outfitStyle === 'commander_jacket' ? '#fbbf24' : '#e2e8f0'}
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Chest Utility Plate (shown on classic_eva and retro_apollo) */}
        {isClassicOrApollo && (
          <g>
            <rect x="76" y="114" width="48" height="32" rx={outfitStyle === 'retro_apollo' ? '3' : '7'} fill="#0f172a" stroke={outfitStyle === 'retro_apollo' ? '#94a3b8' : '#334155'} strokeWidth="2" />
            <circle cx="86" cy="123" r="3.5" fill="#34d399" className="animate-pulse" />
            <circle cx="98" cy="123" r="3.5" fill="#38bdf8" />
            <circle cx="110" cy="123" r="3.5" fill="#f43f5e" />
          </g>
        )}

        {/* Badge Symbol on Chest */}
        <g
          transform={
            isArmored
              ? 'translate(93, 134)'
              : outfitStyle === 'commander_jacket' || outfitStyle === 'nebula_hoodie'
              ? 'translate(110, 114)'
              : outfitStyle === 'galactic_cape'
              ? 'translate(93, 129)'
              : 'translate(93, 132)'
          }
        >
          {badgeSymbol === 'star' && (
            <path d="M 7 0 L 9 5 L 14 5 L 10 8 L 12 13 L 7 10 L 2 13 L 4 8 L 0 5 L 5 5 Z" fill="#fbbf24" />
          )}
          {badgeSymbol === 'rocket' && (
            <path d="M 7 1 C 10 3, 10 9, 7 12 C 4 9, 4 3, 7 1 Z M 4 9 L 2 13 L 5 11 Z M 10 9 L 12 13 L 9 11 Z" fill="#38bdf8" />
          )}
          {badgeSymbol === 'planet' && (
            <g>
              <circle cx="7" cy="7" r="5" fill="#a78bfa" />
              <ellipse cx="7" cy="7" rx="8" ry="2" fill="none" stroke="#fbbf24" strokeWidth="1.2" transform="rotate(-20 7 7)" />
            </g>
          )}
          {badgeSymbol === 'shield' && (
            <path d="M 2 2 L 12 2 L 12 7 C 12 11, 7 13, 7 13 C 7 13, 2 11, 2 7 Z" fill="#34d399" />
          )}
          {badgeSymbol === 'atom' && (
            <g>
              <circle cx="7" cy="7" r="2.5" fill="#38bdf8" />
              <ellipse cx="7" cy="7" rx="7" ry="2.2" fill="none" stroke="#e2e8f0" strokeWidth="1" transform="rotate(30 7 7)" />
              <ellipse cx="7" cy="7" rx="7" ry="2.2" fill="none" stroke="#e2e8f0" strokeWidth="1" transform="rotate(-30 7 7)" />
            </g>
          )}
        </g>

        {/* ================= ARMS & HELD TOOLS ================= */}
        {isStanding && isSpeaking ? (
          <g>
            <path d="M 64 114 Q 38 128 32 144" fill="none" stroke={suitColor} strokeWidth="15" strokeLinecap="round" />
            <circle cx="30" cy="146" r="9" fill={isArmored ? secondaryColor : '#ffffff'} stroke="#1e293b" strokeWidth="2.5" />
            <path d="M 136 114 Q 158 98 148 68" fill="none" stroke={suitColor} strokeWidth="15" strokeLinecap="round" />
            <circle cx="147" cy="65" r="9" fill={isArmored ? secondaryColor : '#ffffff'} stroke="#1e293b" strokeWidth="2.5" />
          </g>
        ) : isExcited ? (
          <g>
            <path d="M 64 112 Q 40 88 32 72" fill="none" stroke={suitColor} strokeWidth="16" strokeLinecap="round" />
            <circle cx="30" cy="70" r="10" fill={isArmored ? secondaryColor : '#ffffff'} stroke="#1e293b" strokeWidth="2.5" />
            <path d="M 136 112 Q 160 88 168 72" fill="none" stroke={suitColor} strokeWidth="16" strokeLinecap="round" />
            <circle cx="170" cy="70" r="10" fill={isArmored ? secondaryColor : '#ffffff'} stroke="#1e293b" strokeWidth="2.5" />
          </g>
        ) : (
          <g>
            <path d="M 64 114 Q 42 132 46 148" fill="none" stroke={suitColor} strokeWidth="15" strokeLinecap="round" />
            <circle cx="48" cy="152" r="9" fill={isArmored ? secondaryColor : '#ffffff'} stroke="#1e293b" strokeWidth="2.5" />
            <path d="M 136 114 Q 158 132 154 148" fill="none" stroke={suitColor} strokeWidth="15" strokeLinecap="round" />
            <circle cx="152" cy="152" r="9" fill={isArmored ? secondaryColor : '#ffffff'} stroke="#1e293b" strokeWidth="2.5" />
          </g>
        )}

        {/* Suit-specific wrist/sleeve accent rings (in resting pose) */}
        {!isExcited && !(isStanding && isSpeaking) && outfitStyle === 'classic_eva' && (
          <g stroke="#475569" strokeWidth="2">
            <line x1="40" y1="138" x2="54" y2="140" />
            <line x1="146" y1="140" x2="160" y2="138" />
          </g>
        )}
        {!isExcited && !(isStanding && isSpeaking) && isArmored && (
          <g>
            <rect x="40" y="136" width="14" height="6" rx="1.5" fill={secondaryColor} stroke="#38bdf8" strokeWidth="1" />
            <rect x="146" y="136" width="14" height="6" rx="1.5" fill={secondaryColor} stroke="#38bdf8" strokeWidth="1" />
          </g>
        )}

        {/* HELD EXPLORATION TOOL: RADAR SCANNER (6+ BADGES) */}
        {hasRadarScanner && (
          <g transform="translate(142, 134)" className="animate-pulse">
            <rect x="0" y="0" width="18" height="26" rx="4" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.5" />
            <rect x="3" y="3" width="12" height="12" rx="2" fill="#083344" />
            <circle cx="9" cy="9" r="4" fill="none" stroke="#22d3ee" strokeWidth="1" />
            <line x1="9" y1="5" x2="9" y2="13" stroke="#22d3ee" strokeWidth="0.8" />
            <polygon points="9,-2 4,-10 14,-10" fill="#38bdf8" opacity="0.75" />
          </g>
        )}

        {/* ================= HELMET SILHOUETTES & VISOR SHAPES ================= */}
        {/* 1. CLASSIC BUBBLE HELMET */}
        {helmetStyle === 'classic' && (
          <g>
            <circle
              cx="100"
              cy="60"
              r="43"
              fill="#f8fafc"
              stroke="#1e293b"
              strokeWidth="4"
            />
            {/* Silver Neck Disconnect Ring */}
            <path d="M 68 96 Q 100 105 132 96" fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            {/* Classic Rounded Oval Visor */}
            <ellipse
              cx="100"
              cy="60"
              rx="33"
              ry="27"
              fill={`url(#visor-grad-${gradIdSuffix})`}
              stroke="#0f172a"
              strokeWidth="3"
            />
          </g>
        )}

        {/* 2. TACTICAL RECON HELMET (Angular Faceted Shell + Hexagonal Split Visor) */}
        {helmetStyle === 'tactical' && (
          <g>
            {/* Angular Faceted Armor Shell */}
            <path
              d="M 100 15 L 136 28 L 146 58 L 139 90 L 118 102 L 82 102 L 61 90 L 54 58 L 64 28 Z"
              fill={secondaryColor}
              stroke="#38bdf8"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Top Glowing Tactical Ridge Fin */}
            <polygon points="95,14 105,14 103,33 97,33" fill="#0284c7" stroke="#67e8f9" strokeWidth="1.2" />
            {/* Side Cheek Vents */}
            <line x1="60" y1="74" x2="68" y2="82" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="140" y1="74" x2="132" y2="82" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            {/* Angular Hexagonal HUD Visor */}
            <polygon
              points="66,44 92,38 100,42 108,38 134,44 137,65 123,82 77,82 63,65"
              fill={`url(#visor-grad-${gradIdSuffix})`}
              stroke="#0f172a"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* 3. PANORAMIC OBSERVATORY DOME (Extra-Wide Bubble + Brow Floodlights + Wide-Arc Visor) */}
        {helmetStyle === 'panoramic' && (
          <g>
            {/* Extra-Wide Observatory Shell */}
            <ellipse
              cx="100"
              cy="59"
              rx="48"
              ry="43"
              fill="#f1f5f9"
              stroke="#0284c7"
              strokeWidth="3.5"
            />
            {/* Twin Upper Brow Exploration Lamps */}
            <rect x="70" y="18" width="12" height="7" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
            <circle cx="76" cy="21.5" r="2" fill="#fde047" className="animate-pulse" />
            <rect x="118" y="18" width="12" height="7" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
            <circle cx="124" cy="21.5" r="2" fill="#fde047" className="animate-pulse" />
            {/* Expansive Panoramic Wrap-Around Visor */}
            <ellipse
              cx="100"
              cy="61"
              rx="41"
              ry="32"
              fill={`url(#visor-grad-${gradIdSuffix})`}
              stroke="#0f172a"
              strokeWidth="2.8"
            />
          </g>
        )}

        {/* 4. HERITAGE APOLLO BOXY HELMET (Tall Shell + Sun-Shield Brow + Rectangular Viewport) */}
        {helmetStyle === 'heritage_apollo' && (
          <g>
            {/* Tall Rounded-Rectangular Heritage Shell */}
            <rect
              x="57"
              y="16"
              width="86"
              height="86"
              rx="28"
              fill="#f8fafc"
              stroke="#1e293b"
              strokeWidth="4"
            />
            {/* Protruding Upper Sun-Shield Visor Brow */}
            <path
              d="M 60 36 Q 100 22 140 36 L 136 43 Q 100 31 64 43 Z"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Sun-Shield Rivets */}
            <circle cx="68" cy="37" r="1.8" fill="#fbbf24" />
            <circle cx="132" cy="37" r="1.8" fill="#fbbf24" />
            {/* Boxy Rectangular Viewport Window with Gasket Frame */}
            <rect
              x="66"
              y="38"
              width="68"
              height="48"
              rx="12"
              fill={`url(#visor-grad-${gradIdSuffix})`}
              stroke="#475569"
              strokeWidth="3.5"
            />
            {/* Heavy Lower Pressure Collar Ring */}
            <rect x="68" y="94" width="64" height="7" rx="3" fill="#94a3b8" stroke="#1e293b" strokeWidth="1.5" />
          </g>
        )}

        {/* Inside visor: Friendly cartoon eyes & smile */}
        <g opacity="0.95">
          <ellipse cx="88" cy="56" rx="4.5" ry="5.5" fill="#0f172a" />
          <circle cx="89.5" cy="54" r="1.8" fill="#ffffff" />
          <ellipse cx="112" cy="56" rx="4.5" ry="5.5" fill="#0f172a" />
          <circle cx="113.5" cy="54" r="1.8" fill="#ffffff" />

          <circle cx="82" cy="63" r="3" fill="#f43f5e" opacity="0.4" />
          <circle cx="118" cy="63" r="3" fill="#f43f5e" opacity="0.4" />

          {isSpeaking ? (
            <g>
              <ellipse cx="100" cy="65" rx="6" ry="4" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.5">
                <animate attributeName="ry" values="1.5; 5; 2; 4.5; 1.5" dur="0.28s" repeatCount="indefinite" />
                <animate attributeName="rx" values="5; 7; 4; 6.5; 5" dur="0.28s" repeatCount="indefinite" />
              </ellipse>
              <path d="M 97 63 Q 100 65 103 63" fill="#ffffff" />
            </g>
          ) : isExcited ? (
            <path d="M 92 64 Q 100 72 108 64 Z" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.5" />
          ) : (
            <path d="M 94 63 Q 100 69 106 63" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          )}
        </g>

        {/* Visor Glare / Curved reflection */}
        <path
          d={helmetStyle === 'heritage_apollo' ? 'M 75 45 L 122 45' : 'M 75 46 C 85 38, 115 38, 125 46'}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* ================= HEAD ACCESSORY: ADVANCED EXPLORER GOGGLES (2+ BADGES) ================= */}
        {hasGoggles && (
          <g>
            <path d={`M ${earXLeft + 4} 52 C 80 44, 120 44, ${earXRight - 4} 52`} fill="none" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
            <path d={`M ${earXLeft + 4} 52 C 80 44, 120 44, ${earXRight - 4} 52`} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <rect x="76" y="44" width="22" height="15" rx="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <ellipse cx="87" cy="51" rx="8" ry="5" fill="#38bdf8" opacity="0.7" />
            <rect x="102" y="44" width="22" height="15" rx="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <ellipse cx="113" cy="51" rx="8" ry="5" fill="#38bdf8" opacity="0.7" />
            <line x1="98" y1="51" x2="102" y2="51" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="80" cy="46" r="1.5" fill="#ef4444" className="animate-ping" />
          </g>
        )}

        {/* Helmet side ear pods / Radio comms link */}
        {helmetStyle === 'tactical' ? (
          <g>
            <polygon points="50,55 58,50 58,72 50,67" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.8" />
            <polygon points="150,55 142,50 142,72 150,67" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.8" />
          </g>
        ) : (
          <g>
            <ellipse cx={earXLeft} cy="62" rx="5" ry="9" fill="#0284c7" stroke="#1e293b" strokeWidth="2" />
            <ellipse cx={earXRight} cy="62" rx="5" ry="9" fill="#0284c7" stroke="#1e293b" strokeWidth="2" />
          </g>
        )}

        {/* Radio Comms Microphone Boom */}
        <path d={`M ${earXRight} 64 Q 130 82 108 76`} fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="107" cy="76" r="3" fill={isSpeaking ? '#ef4444' : '#64748b'} className={isSpeaking ? 'animate-ping' : ''} />
      </svg>
    </div>
  );
};
