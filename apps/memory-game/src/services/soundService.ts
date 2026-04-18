class SynthSoundService {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1, ramp: boolean = true) {
    if (this.isMuted) return;
    this.initContext();
    const ctx = this.audioContext!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    if (ramp) {
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    } else {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playFlip() {
    // Soft, filtered click
    this.playTone(150, 'sine', 0.05, 0.08);
    this.playTone(300, 'sine', 0.03, 0.04);
  }

  playMatch() {
    // Satisfying major triad with shimmer
    this.playTone(523.25, 'sine', 0.4, 0.08); // C5
    this.playTone(659.25, 'sine', 0.4, 0.06); // E5
    this.playTone(783.99, 'sine', 0.5, 0.05); // G5
    this.playTone(1046.50, 'sine', 0.6, 0.03); // C6
  }

  playError() {
    // Soft, low error buzz
    this.playTone(110, 'triangle', 0.2, 0.1);
    this.playTone(165, 'triangle', 0.15, 0.05);
  }

  playVictory() {
    // Celebratory ascending sequence
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; 
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 'sine', 0.4, 0.05), i * 100);
    });
  }
}

export const soundService = new SynthSoundService();
