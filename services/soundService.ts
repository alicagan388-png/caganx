
class SoundService {
  private audioCtx: AudioContext | null = null;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playSend() {
    this.playTone(880, 'sine', 0.1, 0.05);
    setTimeout(() => this.playTone(1760, 'sine', 0.05, 0.03), 50);
  }

  playReceive() {
    this.playTone(440, 'square', 0.05, 0.02);
    setTimeout(() => this.playTone(660, 'square', 0.05, 0.02), 40);
  }

  playClick() {
    this.playTone(1200, 'sine', 0.02, 0.02);
  }

  playError() {
    this.playTone(220, 'sawtooth', 0.3, 0.05);
    this.playTone(110, 'sawtooth', 0.3, 0.05);
  }

  playHologram() {
    this.playTone(100, 'sine', 0.5, 0.02);
    let now = this.audioCtx?.currentTime || 0;
    for(let i=0; i<5; i++) {
        setTimeout(() => this.playTone(200 + i*100, 'sine', 0.1, 0.01), i*100);
    }
  }
}

export const soundService = new SoundService();
