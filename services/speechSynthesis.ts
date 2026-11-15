/**
 * Browser Web Speech API manager for spoken audio narration
 * Calibrated with zero latency, immediate playback, and warm soothing tone
 */

export interface SpeechStatusListener {
  onStart?: () => void;
  onSentenceChange?: (index: number) => void;
  onWordBoundary?: (word: string, charIndex: number, sentenceIndex: number) => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

export type VoiceToneProfile = 'soothing' | 'warm' | 'friendly';

class SpeechNarrationService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private isPausedState: boolean = false;
  
  // Soothing, calm default parameters (comfortable, clear, immediate)
  private speechRate: number = 0.90; // Crisp and natural cadence
  private speechPitch: number = 0.92; // Warm, lower, relaxed pitch
  private speechVolume: number = 0.88; // Comfortable listening volume
  private toneProfile: VoiceToneProfile = 'soothing';

  private sentences: string[] = [];
  private currentSentenceIdx: number = 0;
  private listeners: SpeechStatusListener = {};
  private cachedBestVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      // Pre-cache best voice once available
      this.findBestEnglishVoice();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => {
          this.findBestEnglishVoice();
        };
      }
    }
  }

  public isSupported(): boolean {
    return !!this.synth;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public isPaused(): boolean {
    return this.isPausedState;
  }

  public setToneProfile(profile: VoiceToneProfile) {
    this.toneProfile = profile;
    switch (profile) {
      case 'soothing':
        this.speechPitch = 0.90;
        this.speechRate = 0.88;
        this.speechVolume = 0.85;
        break;
      case 'warm':
        this.speechPitch = 0.92;
        this.speechRate = 0.90;
        this.speechVolume = 0.88;
        break;
      case 'friendly':
        this.speechPitch = 0.96;
        this.speechRate = 0.93;
        this.speechVolume = 0.90;
        break;
    }
  }

  public getToneProfile(): VoiceToneProfile {
    return this.toneProfile;
  }

  public setRate(rate: number) {
    this.speechRate = Math.max(0.7, Math.min(1.2, rate));
  }

  public getRate(): number {
    return this.speechRate;
  }

  public setPitch(pitch: number) {
    this.speechPitch = Math.max(0.75, Math.min(1.2, pitch));
  }

  public getPitch(): number {
    return this.speechPitch;
  }

  /**
   * Intelligently select the most soothing and natural sounding English voice available.
   * Returns from memory cache if already resolved for zero latency.
   */
  private findBestEnglishVoice(): SpeechSynthesisVoice | null {
    if (this.cachedBestVoice) return this.cachedBestVoice;
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // Filter English voices
    const englishVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('en') ||
        v.name.includes('English')
    );

    if (englishVoices.length === 0) {
      return voices.find((v) => v.default) || voices[0] || null;
    }

    // Rank voices prioritizing warm, neural, and human-quality voices
    const sorted = [...englishVoices].sort((a, b) => {
      const score = (v: SpeechSynthesisVoice) => {
        let s = 0;
        const name = (v.name + ' ' + v.voiceURI).toLowerCase();
        if (name.includes('natural') || name.includes('neural')) s += 50;
        if (name.includes('google')) s += 40;
        if (name.includes('premium') || name.includes('enhanced') || name.includes('online')) s += 30;
        if (name.includes('samantha') || name.includes('aria') || name.includes('jenny') || name.includes('guy') || name.includes('daniel')) s += 20;
        if (v.lang === 'en-US' || v.lang === 'en-GB') s += 10;
        if (name.includes('espeak') || name.includes('compact')) s -= 40;
        return s;
      };
      return score(b) - score(a);
    });

    this.cachedBestVoice = sorted[0];
    return sorted[0];
  }

  public startStoryNarration(sentences: string[], listeners?: SpeechStatusListener) {
    if (!this.synth) {
      listeners?.onError?.('Speech synthesis not supported');
      return;
    }

    // Cancel previous audio immediately and unpause synthesis engine to eliminate startup lag
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
    if (this.synth.paused) {
      this.synth.resume();
    }

    this.sentences = sentences;
    this.currentSentenceIdx = 0;
    this.listeners = listeners || {};
    this.isSpeakingState = true;
    this.isPausedState = false;

    // Speak instantly with zero delay
    this.speakCurrentSentence();
  }

  private speakCurrentSentence() {
    if (!this.synth || !this.isSpeakingState) return;

    if (this.currentSentenceIdx >= this.sentences.length) {
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.listeners.onEnd?.();
      return;
    }

    const textToSpeak = this.sentences[this.currentSentenceIdx];
    this.listeners.onSentenceChange?.(this.currentSentenceIdx);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = this.speechRate;
    utterance.pitch = this.speechPitch;
    utterance.volume = this.speechVolume;

    const bestVoice = this.findBestEnglishVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onstart = () => {
      if (this.currentSentenceIdx === 0) {
        this.listeners.onStart?.();
      }
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word' || typeof event.charIndex === 'number') {
        const text = textToSpeak;
        const charIdx = event.charIndex;
        const remaining = text.substring(charIdx);
        const nextSpace = remaining.search(/\s/);
        const currentWord = nextSpace > -1 ? remaining.substring(0, nextSpace) : remaining;
        this.listeners.onWordBoundary?.(currentWord, charIdx, this.currentSentenceIdx);
      }
    };

    utterance.onend = () => {
      if (!this.isSpeakingState) return;
      this.currentSentenceIdx += 1;
      // Seamless tiny breath gap (100ms) between sentences so the narration keeps flowing immediately
      setTimeout(() => {
        if (this.isSpeakingState && !this.isPausedState) {
          this.speakCurrentSentence();
        }
      }, 100);
    };

    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      this.listeners.onError?.(e);
      this.currentSentenceIdx += 1;
      this.speakCurrentSentence();
    };

    this.currentUtterance = utterance;

    // Wake up audio engine instantly before speak
    if (this.synth.paused) {
      this.synth.resume();
    }
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeakingState) {
      this.synth.pause();
      this.isPausedState = true;
    }
  }

  public resume() {
    if (this.synth && this.isPausedState) {
      this.synth.resume();
      this.isPausedState = false;
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeakingState = false;
    this.isPausedState = false;
    this.currentSentenceIdx = 0;
    this.currentUtterance = null;
  }
}

export const speechService = new SpeechNarrationService();
