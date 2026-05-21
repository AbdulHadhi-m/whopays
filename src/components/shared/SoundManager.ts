class SoundManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // AudioContext is initialized lazily on the first user interaction
    // to comply with strict modern browser autoplay restrictions.
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    // Resume context if suspended
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMute(isMuted: boolean) {
    this.muted = isMuted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  // Play a quick, satisfying mechanical/casino tick sound
  public playTick() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      // Short click/woodblock style sound
      osc.type = "sine";
      osc.frequency.setValueAtTime(350, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Web Audio failed to play tick:", e);
    }
  }

  // Play a beautiful, futuristic neon game arpeggio reveal sound
  public playReveal() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // We will play a rapid 3-note synth arpeggio (C5 -> E5 -> G5 -> C6)
      const playTone = (freq: number, start: number, duration: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.start(start);
        osc.stop(start + duration);
      };

      // Play major neon swell chimes
      playTone(523.25, now, 0.4);        // C5
      playTone(659.25, now + 0.1, 0.4);  // E5
      playTone(783.99, now + 0.2, 0.4);  // G5
      playTone(1046.50, now + 0.3, 0.6); // C6
    } catch (e) {
      console.warn("Web Audio failed to play reveal:", e);
    }
  }
}

// Export a singleton instance of the Sound Manager
export const soundManager = new SoundManager();
