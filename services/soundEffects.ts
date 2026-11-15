/**
 * Web Audio API synthesized sound effects
 * Provides realistic space warp, chime, telemetry clicks, and fanfare.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Lazily init AudioContext on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  // Soft UI click
  public playClick() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio fallback silent
    }
  }

  // Gentle, warm, and soothing cabin comms chime (non-piercing)
  public playRadioChirp() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Soft dual warm sine wave chime (520 Hz & 650 Hz) with gentle bell decay
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(520, now);
      osc2.frequency.setValueAtTime(650, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.28);
      osc2.stop(now + 0.28);
    } catch {
      // Audio error ignored
    }
  }

  // Cosmic Wormhole gravitational warp sound effect
  public playWarp() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // Low rumble sub-bass
      const rumble = this.ctx.createOscillator();
      const rumbleGain = this.ctx.createGain();
      rumble.type = 'sawtooth';
      rumble.frequency.setValueAtTime(45, now);
      rumble.frequency.linearRampToValueAtTime(140, now + 1.2);
      rumble.frequency.exponentialRampToValueAtTime(20, now + 2.4);

      rumbleGain.gain.setValueAtTime(0.01, now);
      rumbleGain.gain.linearRampToValueAtTime(0.18, now + 0.8);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      // Filter for space vortex sweep
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 1.2);
      filter.frequency.exponentialRampToValueAtTime(100, now + 2.4);

      rumble.connect(filter);
      filter.connect(rumbleGain);
      rumbleGain.connect(this.ctx.destination);

      rumble.start(now);
      rumble.stop(now + 2.5);

      // High-pitched warp shimmer
      const shimmer = this.ctx.createOscillator();
      const shimmerGain = this.ctx.createGain();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(400, now);
      shimmer.frequency.exponentialRampToValueAtTime(2400, now + 1.0);
      shimmer.frequency.exponentialRampToValueAtTime(600, now + 2.2);

      shimmerGain.gain.setValueAtTime(0.001, now);
      shimmerGain.gain.linearRampToValueAtTime(0.08, now + 0.7);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 2.3);

      shimmer.connect(shimmerGain);
      shimmerGain.connect(this.ctx.destination);

      shimmer.start(now);
      shimmer.stop(now + 2.3);
    } catch {
      // Audio error ignored
    }
  }

  // Intense realistic gravitational singularity pull sound effect
  public playIntenseWarpPull() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Ultra deep sub-bass gravitational rumble
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(32, now);
      subOsc.frequency.linearRampToValueAtTime(75, now + 1.2);
      subOsc.frequency.exponentialRampToValueAtTime(15, now + 3.0);

      subGain.gain.setValueAtTime(0.01, now);
      subGain.gain.linearRampToValueAtTime(0.25, now + 1.0);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 3.2);

      // 2. Accretion plasma roar (pink/filtered noise)
      const bufferSize = this.ctx.sampleRate * 3;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(120, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(1200, now + 1.5);
      noiseFilter.frequency.exponentialRampToValueAtTime(80, now + 3.0);
      noiseFilter.Q.setValueAtTime(3, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.12, now + 1.2);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 3.1);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      whiteNoise.start(now);
      whiteNoise.stop(now + 3.1);

      // 3. Relativistic Doppler Singularity Whistle
      const whistle = this.ctx.createOscillator();
      const whistleGain = this.ctx.createGain();
      whistle.type = 'triangle';
      whistle.frequency.setValueAtTime(300, now);
      whistle.frequency.exponentialRampToValueAtTime(2800, now + 1.3);
      whistle.frequency.exponentialRampToValueAtTime(120, now + 2.8);

      whistleGain.gain.setValueAtTime(0.001, now);
      whistleGain.gain.linearRampToValueAtTime(0.09, now + 1.1);
      whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.9);

      whistle.connect(whistleGain);
      whistleGain.connect(this.ctx.destination);
      whistle.start(now);
      whistle.stop(now + 2.9);
    } catch {
      // Audio error ignored
    }
  }

  // Badge award triumphant chime
  public playBadgeAward() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.7);
      });
    } catch {
      // Audio fallback
    }
  }

  // Quiz success
  public playSuccess() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 880.0]; // D5, A5
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.1, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.35);
      });
    } catch {
      // Audio fallback
    }
  }

  // Quiz wrong answer
  public playError() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.25);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio fallback
    }
  }

  // Grand explorer fanfare
  public playFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chords = [
        { freqs: [392, 523, 659], time: 0.0, dur: 0.3 },      // C major
        { freqs: [440, 587, 698], time: 0.32, dur: 0.3 },     // D minor
        { freqs: [523, 659, 783], time: 0.64, dur: 0.4 },     // C major higher
        { freqs: [523, 783, 1046.5], time: 1.05, dur: 0.9 },  // C6 grand resolution
      ];

      chords.forEach(({ freqs, time, dur }) => {
        freqs.forEach(freq => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + time);
          gain.gain.setValueAtTime(0.001, now + time);
          gain.gain.linearRampToValueAtTime(0.08, now + time + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + time);
          osc.stop(now + time + dur);
        });
      });
    } catch {
      // Audio fallback
    }
  }

  // Realistic astronomy observatory telemetry ping
  public playTelemetryPing(frequency: number = 1800) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio fallback
    }
  }

  // Deep space radar sweep tone
  public playRadarSweep() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio fallback
    }
  }

  // 1. Welcoming Celestial Chime for Home Screen
  public playHomeScreenWelcome() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Warm chord: G4 (392Hz), C5 (523Hz), E5 (659Hz)
      const notes = [392.0, 523.25, 659.25];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.035, now + i * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.55);
      });
    } catch {
      // Audio fallback
    }
  }

  // 2. Cosmic Radar & Deep Space Observatory Ping for Galaxy / Planet System View
  public playGalaxyWelcomeRadar() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Radar acoustic sweep (850Hz -> 420Hz)
      const sweep = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();
      sweep.type = 'triangle';
      sweep.frequency.setValueAtTime(850, now);
      sweep.frequency.exponentialRampToValueAtTime(420, now + 0.25);

      sweepGain.gain.setValueAtTime(0.001, now);
      sweepGain.gain.linearRampToValueAtTime(0.03, now + 0.03);
      sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      sweep.connect(sweepGain);
      sweepGain.connect(this.ctx.destination);
      sweep.start(now);
      sweep.stop(now + 0.28);

      // Resonant harmonic radar echo ping at 660Hz (starts slightly after sweep)
      const echo = this.ctx.createOscillator();
      const echoGain = this.ctx.createGain();
      echo.type = 'sine';
      echo.frequency.setValueAtTime(660, now + 0.18);
      echo.frequency.exponentialRampToValueAtTime(880, now + 0.45);

      echoGain.gain.setValueAtTime(0.001, now + 0.18);
      echoGain.gain.linearRampToValueAtTime(0.025, now + 0.22);
      echoGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      echo.connect(echoGain);
      echoGain.connect(this.ctx.destination);
      echo.start(now + 0.18);
      echo.stop(now + 0.65);
    } catch {
      // Audio fallback
    }
  }

  // 3. Soft Plasma Engine Hum & Atmospheric Landing Tone for Planet Surface Exploration
  public playPlanetArrivalHum() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Gentle sub-bass engine hum (warm 70Hz -> 55Hz)
      const hum = this.ctx.createOscillator();
      const humGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      hum.type = 'triangle';
      hum.frequency.setValueAtTime(70, now);
      hum.frequency.linearRampToValueAtTime(95, now + 0.35);
      hum.frequency.exponentialRampToValueAtTime(55, now + 0.85);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);

      humGain.gain.setValueAtTime(0.001, now);
      humGain.gain.linearRampToValueAtTime(0.045, now + 0.15);
      humGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      hum.connect(filter);
      filter.connect(humGain);
      humGain.connect(this.ctx.destination);

      hum.start(now);
      hum.stop(now + 0.85);

      // Atmospheric surface landing resonance tone (440Hz -> 528Hz peaceful fifth)
      const tone = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();
      tone.type = 'sine';
      tone.frequency.setValueAtTime(440, now + 0.15);
      tone.frequency.exponentialRampToValueAtTime(528, now + 0.45);

      toneGain.gain.setValueAtTime(0.001, now + 0.15);
      toneGain.gain.linearRampToValueAtTime(0.03, now + 0.22);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

      tone.connect(toneGain);
      toneGain.connect(this.ctx.destination);
      tone.start(now + 0.15);
      tone.stop(now + 0.75);
    } catch {
      // Audio fallback
    }
  }

  // 4. Soft Holographic Shimmer for Modals (Trophy Room, Customizer, Era Selector)
  public playModalWelcome() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(1160, now + 0.16);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch {
      // Audio fallback
    }
  }
}

export const soundEffects = new SoundService();
