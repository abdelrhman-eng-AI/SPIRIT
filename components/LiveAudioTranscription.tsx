import React, { useState, useEffect, useRef } from 'react';
import { soundEffects } from '../services/soundEffects';
import {
  FileText,
  Copy,
  Check,
  Download,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Radio,
  Volume2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface LiveAudioTranscriptionProps {
  sentences: string[];
  currentSentenceIndex: number;
  activeWord?: string;
  isBroadcasting: boolean;
  speakerName?: string;
  className?: string;
}

export const LiveAudioTranscription: React.FC<LiveAudioTranscriptionProps> = ({
  sentences,
  currentSentenceIndex,
  activeWord = '',
  isBroadcasting,
  speakerName = 'Space Station Broadcast - SPIRIT EL TEAM',
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copied, setCopied] = useState(false);
  const [isMicListening, setIsMicListening] = useState(false);
  const [micTranscript, setMicTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll transcript to active sentence
  useEffect(() => {
    if (transcriptContainerRef.current) {
      const activeEl = transcriptContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentSentenceIndex]);

  // Speech Recognition for live mic dictation
  const toggleMicListening = () => {
    soundEffects.playClick();
    if (isMicListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsMicListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Your browser does not support live microphone speech recognition.');
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'en-US';
      rec.continuous = true;
      rec.interimResults = true;

      rec.onstart = () => {
        setIsMicListening(true);
      };

      rec.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setMicTranscript((prev) => `${prev} ${event.results[i][0].transcript}`);
          } else {
            interim += event.results[i][0].transcript;
          }
        }
      };

      rec.onerror = () => {
        setIsMicListening(false);
      };

      rec.onend = () => {
        setIsMicListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch {
      setIsMicListening(false);
    }
  };

  const handleCopy = () => {
    soundEffects.playClick();
    const fullText = sentences.join('\n');
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    soundEffects.playClick();
    const fullText = `=== Live Audio Transcript - SPIRIT EL TEAM ===\n${sentences.join('\n\n')}`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `space_audio_transcript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fontSizeClasses = {
    sm: 'text-xs leading-relaxed',
    base: 'text-sm leading-relaxed',
    lg: 'text-base leading-loose',
  }[fontSize];

  return (
    <div
      className={`rounded-2xl bg-gradient-to-b from-[#090e1a]/95 to-[#060a14]/95 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] overflow-hidden backdrop-blur-md transition-all ${className}`}
    >
      {/* Top Telemetry & Controls Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-slate-800 text-xs">
        {/* Live Broadcast Status & Spectrum EQ */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 p-1 rounded-md bg-cyan-500/10 text-cyan-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider">LIVE CC</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-300 font-semibold">
            <span>Live Transcript:</span>
            <span className="text-cyan-400 font-mono text-[10px]">{speakerName}</span>
          </div>

          {/* Equalizer Frequency bars animation when broadcasting */}
          {isBroadcasting && (
            <div className="flex items-end gap-0.5 h-3.5 px-1.5 py-0.5 rounded bg-slate-950/70 border border-cyan-500/30">
              <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-2" />
              <span className="w-1 bg-cyan-300 rounded-full animate-pulse [animation-delay:150ms] h-3.5" />
              <span className="w-1 bg-cyan-400 rounded-full animate-pulse [animation-delay:300ms] h-1.5" />
              <span className="w-1 bg-sky-300 rounded-full animate-pulse [animation-delay:75ms] h-3" />
            </div>
          )}
        </div>

        {/* Toolbar Tools */}
        <div className="flex items-center gap-1.5">
          {/* Font Scale Switcher */}
          <div className="hidden md:flex items-center gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
            <button
              onClick={() => { soundEffects.playClick(); setFontSize('sm'); }}
              className={`px-1.5 py-0.5 rounded ${fontSize === 'sm' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              A-
            </button>
            <button
              onClick={() => { soundEffects.playClick(); setFontSize('base'); }}
              className={`px-1.5 py-0.5 rounded ${fontSize === 'base' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              A
            </button>
            <button
              onClick={() => { soundEffects.playClick(); setFontSize('lg'); }}
              className={`px-1.5 py-0.5 rounded ${fontSize === 'lg' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              A+
            </button>
          </div>

          {/* Live Mic Recognition Toggle */}
          <button
            onClick={toggleMicListening}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border ${
              isMicListening
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle live microphone voice recognition"
          >
            {isMicListening ? <Mic className="w-3.5 h-3.5 text-rose-400" /> : <MicOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMicListening ? 'Listening...' : 'Mic'}</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
            title="Copy full transcript"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Download TXT */}
          <button
            onClick={handleDownload}
            className="p-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Download transcript as TXT"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Expand / Collapse toggle */}
          <button
            onClick={() => { soundEffects.playClick(); setIsExpanded(!isExpanded); }}
            className="p-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isExpanded ? 'Collapse transcript' : 'Expand full transcript'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Real-time Subtitles / Teleprompter Display */}
      <div
        ref={transcriptContainerRef}
        className={`p-4 overflow-y-auto space-y-3 transition-all ${
          isExpanded ? 'max-h-[320px]' : 'max-h-[140px]'
        }`}
      >
        {sentences.map((sentence, idx) => {
          const isActive = idx === currentSentenceIndex;
          const isPassed = idx < currentSentenceIndex;

          return (
            <div
              key={idx}
              data-active={isActive}
              className={`p-2.5 rounded-xl border transition-all text-left flex items-start gap-3 ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : isPassed
                  ? 'bg-slate-950/30 border-slate-800/60 opacity-60'
                  : 'bg-slate-950/20 border-transparent opacity-40'
              }`}
            >
              {/* Timestamp label */}
              <span className="text-[10px] font-mono text-cyan-400/80 pt-0.5 shrink-0 select-none">
                {`[00:${String((idx + 1) * 4).padStart(2, '0')}]`}
              </span>

              {/* Text */}
              <div className="flex-1">
                <p className={`${fontSizeClasses} ${isActive ? 'text-white font-semibold' : 'text-slate-300'}`}>
                  {sentence}
                </p>

                {/* Real-time active word marker */}
                {isActive && activeWord && (
                  <span className="inline-block mt-1 text-[10px] text-cyan-300 font-mono bg-cyan-900/60 px-2 py-0.5 rounded-full border border-cyan-500/40 animate-pulse">
                    Current word: {activeWord}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Microphone speech recognition feed if user speaks */}
        {isMicListening && (
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-200">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Your Live Microphone Dictation:</span>
            </div>
            <p className="leading-relaxed">
              {micTranscript || 'Speak clearly in English and your words will appear here...'}
            </p>
          </div>
        )}
      </div>

      {/* Footer Info line */}
      <div className="px-4 py-2 bg-slate-950/50 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Real-time English transcription synced with narration</span>
        </div>
        <span className="font-mono text-cyan-400">
          Sentence {currentSentenceIndex + 1} of {sentences.length}
        </span>
      </div>
    </div>
  );
};
