import React, { useState } from 'react';
import { soundEffects } from '../services/soundEffects';
import { Radio, Compass, ExternalLink, X, Info } from 'lucide-react';

interface RealisticFloatingRelic {
  id: string;
  name: string;
  arabicName: string;
  subtitle: string;
  category: string;
  distance: string;
  status: string;
  imageSrc?: string;
  positionClass: string;
  floatClass: string;
  description: string;
}

interface FloatingSpacecraftsProps {
  onSelectRelic?: (relicId: string) => void;
}

export const FloatingSpacecrafts: React.FC<FloatingSpacecraftsProps> = ({ onSelectRelic }) => {
  const [inspectedRelic, setInspectedRelic] = useState<RealisticFloatingRelic | null>(null);

  const relicsList: RealisticFloatingRelic[] = [
    {
      id: 'voyager-1',
      name: 'Voyager 1 & Golden Record',
      arabicName: 'Voyager 1 & The Golden Record',
      subtitle: 'Interstellar Space',
      category: 'Farthest Human-Made Object',
      distance: '24.3 billion km from Earth',
      status: 'Cruising solo through interstellar space at 61,000 km/h',
      imageSrc: '/assets/images/voyager_golden_probe_1792424019026.jpg',
      positionClass: 'top-[7%] left-[6%] sm:top-[10%] sm:left-[10%]',
      floatClass: 'animate-float-slow',
      description: 'Launched in 1977 carrying the copper-gold Golden Record filled with Earth greetings and music for any cosmic civilization that might encounter it.',
    },
    {
      id: 'sputnik-1',
      name: 'Sputnik 1',
      arabicName: 'Sputnik 1 (The Silver Sphere)',
      subtitle: 'Low Earth Orbit - 1957',
      category: 'First Artificial Satellite',
      distance: 'Historic Earth orbit',
      status: 'First human-made radio beep ever broadcast from space',
      imageSrc: '/assets/images/sputnik_satellite_relic_1792424019774.jpg',
      positionClass: 'top-[8%] right-[6%] sm:top-[12%] sm:right-[12%]',
      floatClass: 'animate-float-reverse',
      description: 'A polished aluminum sphere with four long whip antennas launched in 1957, officially opening the human Space Age.',
    },
    {
      id: 'apollo-snoopy',
      name: 'Apollo 10 "Snoopy" LM',
      arabicName: 'Apollo 10 "Snoopy" Capsule',
      subtitle: 'Abandoned Solar Orbit - 1969',
      category: 'Lost Lunar Module',
      distance: 'Drifting in heliocentric orbit',
      status: 'The only Apollo lunar ascent stage still orbiting the Sun',
      imageSrc: '/assets/images/apollo_lost_lunar_stage_1792424037410.jpg',
      positionClass: 'bottom-[12%] left-[6%] sm:bottom-[16%] sm:left-[12%]',
      floatClass: 'animate-float-reverse',
      description: 'Separated from Apollo 10 after its 1969 lunar dress rehearsal and fired its engines into an eternal heliocentric orbit.',
    },
    {
      id: 'spirit-rover',
      name: 'Spirit Rover (MER-A)',
      arabicName: 'Spirit Rover - Spirit of Mars',
      subtitle: 'Gusev Crater - Mars',
      category: 'SPIRIT EL TEAM Namesake Icon',
      distance: '225 million km from Earth',
      status: 'Resting proudly at Troy after a 6-year epic mission',
      imageSrc: '/assets/images/spirit_el_team_emblem_1792422933263.jpg',
      positionClass: 'bottom-[10%] right-[6%] sm:bottom-[14%] sm:right-[12%]',
      floatClass: 'animate-float-slow',
      description: 'The legendary Mars rover that climbed Martian hills, uncovered ancient hot-spring silica deposits, and inspired our team emblem.',
    },
    {
      id: 'lost-tool-bag',
      name: 'Lost Astronaut Tool Bag (STS-126)',
      arabicName: 'Lost Astronaut Tool Bag',
      subtitle: 'Drifting Earth Orbit - 2008',
      category: 'Lost EVA Hardware',
      distance: '400 km above Earth',
      status: 'The most famous tool bag to escape during a spacewalk',
      positionClass: 'top-[42%] left-[2%] sm:left-[5%]',
      floatClass: 'animate-float-slow',
      description: 'In 2008, during an ISS spacewalk to repair solar arrays, astronaut Heidemarie Stefanyshyn-Piper lost grip of her tool bag, which orbited Earth for months!',
    },
    {
      id: 'tesla-starman',
      name: 'Tesla Roadster & Starman',
      arabicName: 'Tesla Roadster & Starman',
      subtitle: 'Elliptical Mars-Crossing Orbit',
      category: 'Most Unusual Cosmic Relic',
      distance: 'Over 300 million km across the Solar System',
      status: 'Cruising endlessly across deep-space orbital paths',
      positionClass: 'top-[42%] right-[2%] sm:right-[5%]',
      floatClass: 'animate-float-reverse',
      description: 'Launched aboard Falcon Heavy in 2018 with a spacesuit-clad mannequin named Starman, looping forever between Earth and Mars.',
    },
  ];

  return (
    <>
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {relicsList.map((relic) => (
          <div
            key={relic.id}
            className={`absolute ${relic.positionClass} ${relic.floatClass} pointer-events-auto z-20 group`}
          >
            <button
              onClick={() => {
                soundEffects.playClick();
                setInspectedRelic(relic);
              }}
              className="relative flex flex-col items-center p-2 rounded-2xl bg-slate-950/70 hover:bg-slate-950/90 border border-slate-700/60 hover:border-cyan-400/90 shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 group-hover:scale-110 cursor-pointer"
            >
              {/* Realistic Circular Image Token or Icon */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-slate-500/50 group-hover:border-cyan-400 shadow-lg bg-slate-900 flex items-center justify-center">
                {relic.imageSrc ? (
                  <img
                    src={relic.imageSrc}
                    alt={relic.name}
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115"
                  />
                ) : relic.id === 'lost-tool-bag' ? (
                  <div className="flex flex-col items-center justify-center text-xl">
                    🎒
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-xl">
                    🚗
                  </div>
                )}

                {/* Subtle radial sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />
              </div>

              {/* Ping antenna beacon */}
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-md">
                <Radio className="w-2 h-2 animate-pulse" />
              </div>

              {/* Title label */}
              <div className="mt-1.5 text-center max-w-[110px]">
                <span className="text-[11px] font-bold text-slate-100 block truncate group-hover:text-cyan-300 transition-colors">
                  {relic.arabicName.split(' (')[0]}
                </span>
                <span className="text-[9px] text-cyan-400 font-mono block truncate">
                  {relic.subtitle.split(' - ')[0]}
                </span>
              </div>

              {/* Hover Quick Telemetry Tooltip */}
              <div className="absolute top-full mt-2 hidden group-hover:flex flex-col items-start w-52 p-2.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-[10px] text-slate-300 shadow-2xl z-30 pointer-events-none text-left">
                <span className="font-extrabold text-cyan-300 block">{relic.name}</span>
                <span className="text-amber-400 font-mono text-[9px] mt-0.5 block">{relic.distance}</span>
                <p className="text-[9px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {relic.description}
                </p>
                <span className="text-[9px] text-cyan-400 font-semibold mt-1">
                  Click for detailed inspection 🔍
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* ================= DETAILED REALISTIC RELIC INSPECTION POPUP ================= */}
      {inspectedRelic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
          <div className="relative w-full max-w-lg bg-[#080d19] border-2 border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {inspectedRelic.arabicName}
                  </h3>
                  <span className="text-xs text-amber-400 font-mono">
                    {inspectedRelic.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectedRelic(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with photorealistic photo & facts */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Photo Display Card */}
              {inspectedRelic.imageSrc && (
                <div className="relative w-full h-52 rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
                  <img
                    src={inspectedRelic.imageSrc}
                    alt={inspectedRelic.name}
                    sizes="(max-width: 640px) 92vw, 464px"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-left">
                    <span className="text-xs font-mono text-cyan-400 font-bold block">
                      Current Distance: {inspectedRelic.distance}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Status: {inspectedRelic.status}
                    </span>
                  </div>
                </div>
              )}

              {/* Realistic Telemetry Strip */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Space Location</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{inspectedRelic.subtitle}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Historic Class</span>
                  <span className="font-semibold text-cyan-400 mt-0.5 block">{inspectedRelic.category}</span>
                </div>
              </div>

              {/* Story & Historical Significance */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed text-left">
                <div className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>Historical Story of the Forgotten Relic:</span>
                </div>
                <p>{inspectedRelic.description}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/50">
              <button
                onClick={() => setInspectedRelic(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close Preview
              </button>

              <button
                onClick={() => {
                  setInspectedRelic(null);
                  if (onSelectRelic) {
                    onSelectRelic(inspectedRelic.id === 'spirit-rover' ? 'spirit-rover' : 'surveyor-3');
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <span>Explore Cosmic Eras 🚀</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
