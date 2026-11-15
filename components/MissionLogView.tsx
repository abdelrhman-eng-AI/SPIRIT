import React, { useState } from 'react';
import { SpacecraftRelic, CharacterCustomization } from '../types';
import { soundEffects } from '../services/soundEffects';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  ClipboardCheck,
  Zap,
  Activity,
  Play,
  RotateCcw,
  ShieldCheck,
  Compass,
  X,
} from 'lucide-react';

interface Checkpoint {
  id: string;
  title: string;
  description: string;
  category: 'safety' | 'survey' | 'diagnostic' | 'sampling' | 'archive';
  durationSeconds: number;
}

interface MissionLogViewProps {
  relic: SpacecraftRelic;
  character: CharacterCustomization;
  onClose?: () => void;
}

export const MissionLogView: React.FC<MissionLogViewProps> = ({ relic, character, onClose }) => {
  // Checkpoints specific to planetary exploration and the relic
  const checkpoints: Checkpoint[] = React.useMemo(() => {
    const body = relic.celestialBody.arabicName;
    return [
      {
        id: 'cp_landing',
        title: `Calibrate astronaut suit & verify landing stability on ${body}`,
        description: 'Confirm internal suit pressure balance, life-support units, and radiation shielding integrity.',
        category: 'safety',
        durationSeconds: 2,
      },
      {
        id: 'cp_radiation',
        title: `Atmospheric spectral scan & cosmic radiation check on ${body}`,
        description: 'Measure solar wind density, trace gases, and surface environmental stability metrics.',
        category: 'survey',
        durationSeconds: 3,
      },
      {
        id: 'cp_coordinates',
        title: `Lock guidance radar & triangulate exact coordinates of ${relic.arabicName}`,
        description: `Pinpoint coordinates (${relic.celestialBody.coordinates.x.toFixed(1)}°E, ${relic.celestialBody.coordinates.y.toFixed(1)}°N) and align comms antenna with mission control.`,
        category: 'survey',
        durationSeconds: 2,
      },
      {
        id: 'cp_inspection',
        title: `Field inspection of outer hull & power panels on ${relic.arabicName}`,
        description: 'Document weathering, dust accumulation, thermal insulation shields, and solar panels or RTG units.',
        category: 'diagnostic',
        durationSeconds: 4,
      },
      {
        id: 'cp_sampling',
        title: `Collect surrounding soil & sedimentary rock samples`,
        description: 'Seal geological specimens in vacuum-isolated containers for spectral analysis.',
        category: 'sampling',
        durationSeconds: 3,
      },
      {
        id: 'cp_data_recovery',
        title: `Extract digital logs & scientific memory from ${relic.arabicName}`,
        description: 'Retrieve final telemetry packets and historical mission transmissions stored in onboard solid-state memory.',
        category: 'archive',
        durationSeconds: 3,
      },
    ];
  }, [relic]);

  const [completedSteps, setCompletedSteps] = useState<string[]>([checkpoints[0].id]);
  const [activeGlowingStep, setActiveGlowingStep] = useState<string | null>(null);
  const [isAutoScanning, setIsAutoScanning] = useState(false);

  const toggleCheckpoint = (id: string) => {
    const isCurrentlyDone = completedSteps.includes(id);

    if (isCurrentlyDone) {
      soundEffects.playClick();
      setCompletedSteps((prev) => prev.filter((item) => item !== id));
      setActiveGlowingStep(null);
    } else {
      // Complete step with dazzling light glow effect
      soundEffects.playSuccess();
      setCompletedSteps((prev) => [...prev, id]);
      setActiveGlowingStep(id);

      // Light effect pulse duration
      setTimeout(() => {
        setActiveGlowingStep((curr) => (curr === id ? null : curr));
      }, 2500);
    }
  };

  // Run automated inspection scan through all checkpoints
  const runAutoScan = () => {
    if (isAutoScanning) return;
    setIsAutoScanning(true);
    soundEffects.playTelemetryPing(1400);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < checkpoints.length) {
        const stepId = checkpoints[currentIndex].id;
        setCompletedSteps((prev) => (prev.includes(stepId) ? prev : [...prev, stepId]));
        setActiveGlowingStep(stepId);
        soundEffects.playSuccess();

        currentIndex++;
      } else {
        clearInterval(interval);
        setIsAutoScanning(false);
        setTimeout(() => setActiveGlowingStep(null), 2500);
      }
    }, 1100);
  };

  const resetLog = () => {
    soundEffects.playClick();
    setCompletedSteps([]);
    setActiveGlowingStep(null);
    setIsAutoScanning(false);
  };

  const progressPercent = Math.round((completedSteps.length / checkpoints.length) * 100);

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#091122]/95 via-[#060c18]/95 to-[#02050b]/98 border border-slate-700/80 p-5 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>Mission Log &amp; Field Checkpoints</span>
                <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
                  MISSION LOG
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Logging field steps by Astronaut {character.name} on {relic.celestialBody.arabicName}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={runAutoScan}
            disabled={isAutoScanning || completedSteps.length === checkpoints.length}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              completedSteps.length === checkpoints.length
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-cyan-500/25 active:scale-95'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isAutoScanning ? 'animate-spin' : ''}`} />
            <span>{isAutoScanning ? 'Scanning...' : 'Full Auto-Scan'}</span>
          </button>

          <button
            onClick={resetLog}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            title="Reset Mission Log"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {onClose && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
              title="Close Mission Log"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Real-time Stats */}
      <div className="mt-3.5 mb-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Field Documentation Progress:</span>
          </span>
          <span className="font-bold text-cyan-300">
            {completedSteps.length} / {checkpoints.length} ({progressPercent}%)
          </span>
        </div>

        {/* Progress track */}
        <div className="relative w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {progressPercent === 100 && (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold justify-center pt-1 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>All checkpoints verified! You are ready for the Space Knowledge Quiz.</span>
          </div>
        )}
      </div>

      {/* Checkpoint List with Glowing Light Effect */}
      <div className="space-y-2.5">
        {checkpoints.map((step, idx) => {
          const isDone = completedSteps.includes(step.id);
          const isGlowing = activeGlowingStep === step.id;

          return (
            <div
              key={step.id}
              onClick={() => toggleCheckpoint(step.id)}
              className={`relative flex items-start gap-3.5 p-3 sm:p-3.5 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                isGlowing
                  ? 'bg-gradient-to-r from-cyan-950/90 via-sky-900/60 to-slate-950/90 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.8)] scale-[1.01]'
                  : isDone
                  ? 'bg-slate-950/70 border-emerald-500/50 hover:border-emerald-400/80 shadow-md'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              {/* Dazzling Optical Flare & Glowing Light Beam Effect */}
              {isGlowing && (
                <>
                  {/* Radiant laser beam sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none animate-pulse" />
                  {/* Expanding light aura */}
                  <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-cyan-400/40 blur-xl pointer-events-none animate-ping" />
                  {/* Subtle top edge neon line */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#38bdf8]" />
                </>
              )}

              {/* Checkbox Icon with glowing indicator */}
              <div className="relative pt-0.5 shrink-0">
                {isDone ? (
                  <div className="relative">
                    <CheckCircle2
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isGlowing
                          ? 'text-cyan-300 scale-125 drop-shadow-[0_0_12px_rgba(56,189,248,1)]'
                          : 'text-emerald-400'
                      }`}
                    />
                    {isGlowing && (
                      <span className="absolute inset-0 rounded-full bg-cyan-400/60 animate-ping" />
                    )}
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400 transition-colors" />
                )}
              </div>

              {/* Content Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-xs sm:text-sm font-bold transition-colors ${
                      isGlowing
                        ? 'text-cyan-200'
                        : isDone
                        ? 'text-emerald-300 line-through/none'
                        : 'text-slate-200'
                    }`}
                  >
                    {idx + 1}. {step.title}
                  </h4>

                  {/* Badge */}
                  {isDone && (
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full shrink-0 font-bold transition-all ${
                        isGlowing
                          ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_#38bdf8] animate-bounce'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {isGlowing ? 'Logged & Verified! ✨' : 'Completed ✓'}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
