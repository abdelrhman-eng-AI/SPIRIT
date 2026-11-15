/**
 * Ambient Space Music Service using Web Audio API
 * Generates an ethereal, majestic, cinematic space exploration anthem
 * inspired by Interstellar (Hans Zimmer) with rich arpeggiated melodic motifs,
 * warm analog synth choir pads, pulsing sub-bass, and celestial bell harmonics.
 */

class AmbientMusicService {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private activeNodes: Array<{ stop?: () => void; disconnect: () => void }> = [];
  private sequenceTimer: number | null = null;
  private volume: number = 0.65;
  private isMuted: boolean = false;
  private noteStep: number = 0;

  // Interstellar / Space Exploration melodic chord progression:
  // Dm -> Bb -> F -> C -> Am -> Gm -> Bb -> A
  private readonly CHORD_PROGRESSION = [
    { baseFreq: 146.83, name: 'Dm', notes: [146.83, 220.0, 261.63, 293.66, 349.23, 440.0, 523.25] },
    { baseFreq: 116.54, name: 'Bb', notes: [116.54, 174.61, 233.08, 293.66, 349.23, 466.16, 587.33] },
    { baseFreq: 130.81, name: 'F',  notes: [130.81, 174.61, 220.0, 261.63, 349.23, 440.0, 523.25] },
    { baseFreq: 130.81, name: 'C',  notes: [130.81, 164.81, 196.0, 261.63, 329.63, 392.0, 523.25] },
    { baseFreq: 110.0,  name: 'Am', notes: [110.0, 164.81, 220.0, 261.63, 329.63, 440.0, 523.25] },
    { baseFreq: 98.0,   name: 'Gm', notes: [98.0, 146.83, 196.0, 233.08, 293.66, 392.0, 466.16] },
    { baseFreq: 116.54, name: 'Bb', notes: [116.54, 174.61, 233.08, 293.66, 349.23, 466.16, 587.33] },
    { baseFreq: 110.0,  name: 'A',  notes: [110.0, 164.81, 220.0, 277.18, 329.63, 440.0, 554.37] },
  ];

  public initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public startMusic() {
    if (this.isPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;

    // Master volume gain with smooth fade in
    const master = this.ctx.createGain();
    const targetVol = this.isMuted ? 0 : this.volume;
    master.gain.setValueAtTime(0.01, this.ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(Math.max(targetVol, 0.01), this.ctx.currentTime + 1.2);
    master.connect(this.ctx.destination);
    this.masterGain = master;

    // 1. Continuous Warm Sub-Bass Drone
    this.startWarmDrone(master);

    // 2. Deep Cosmic Air / Reverb Ambience
    this.startCosmicAir(master);

    // 3. Clockwork Melodic Arpeggio & Choir Engine (Interstellar style)
    let chordIdx = 0;
    this.playChordSwell(this.CHORD_PROGRESSION[chordIdx], master);

    // Sequence loop (125ms per 16th note arpeggio step)
    const stepDuration = 180; // ms per note
    let stepInChord = 0;

    this.sequenceTimer = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const currentChord = this.CHORD_PROGRESSION[chordIdx];
      // Pick arpeggio note
      const noteIdx = (stepInChord % currentChord.notes.length);
      const freq = currentChord.notes[noteIdx];

      // Play bright cosmic bell / synth arpeggio pulse
      this.playArpeggioNote(freq, this.masterGain);

      stepInChord++;
      // Every 16 steps (approx 3 seconds), shift chord
      if (stepInChord >= 16) {
        stepInChord = 0;
        chordIdx = (chordIdx + 1) % this.CHORD_PROGRESSION.length;
        this.playChordSwell(this.CHORD_PROGRESSION[chordIdx], this.masterGain);
      }
    }, stepDuration);
  }

  private startWarmDrone(destination: GainNode) {
    if (!this.ctx) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(73.42, this.ctx.currentTime); // D2
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(36.71, this.ctx.currentTime); // D1 sub

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.32, this.ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      osc1.start();
      osc2.start();
      this.activeNodes.push(osc1, osc2, filter, gain);
    } catch {
      // Audio fallback
    }
  }

  private startCosmicAir(destination: GainNode) {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(420, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.045, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      whiteNoise.start();
      this.activeNodes.push(whiteNoise, filter, gain);
    } catch {
      // Audio fallback
    }
  }

  private playChordSwell(
    chord: { baseFreq: number; name: string; notes: number[] },
    destination: GainNode
  ) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const duration = 2.8;

      // Create warm choir pad with 3 harmonics
      [chord.notes[0], chord.notes[2], chord.notes[4]].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(idx * 5 - 5, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, now);
        filter.frequency.linearRampToValueAtTime(1400, now + 1.2);
        filter.frequency.exponentialRampToValueAtTime(600, now + duration);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(destination);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch {
      // Audio fallback
    }
  }

  private playArpeggioNote(freq: number, destination: GainNode) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.5, now);
      filter.Q.setValueAtTime(1.8, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch {
      // Audio fallback
    }
  }

  public stopMusic() {
    if (!this.isPlaying) return;
    if (this.sequenceTimer !== null) {
      clearInterval(this.sequenceTimer);
      this.sequenceTimer = null;
    }

    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
      } catch {
        // Ignored
      }
    }

    setTimeout(() => {
      this.activeNodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
          node.disconnect();
        } catch {
          // Ignored
        }
      });
      this.activeNodes = [];
      this.isPlaying = false;
    }, 850);
  }

  public toggleMusic(): boolean {
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientMusicService = new AmbientMusicService();
