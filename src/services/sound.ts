// Zero-dependency sound effects using Web Audio API + Speech Synthesis for natural voice

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private accent: 'en-US' | 'en-GB' = 'en-US';

  constructor() {
    // Load mute preference
    try {
      const saved = localStorage.getItem('wordpulse_sound_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
      const savedAccent = localStorage.getItem('wordpulse_accent');
      if (savedAccent === 'en-GB' || savedAccent === 'en-US') {
        this.accent = savedAccent;
      }
    } catch {
      // ignore localstorage error
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoice();
      };
      this.initVoice();
    }
  }

  private initAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private initVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prefer Google, Samantha, or native English voices
    const match = voices.find(
      (v) => v.lang.startsWith(this.accent) || (this.accent === 'en-US' && v.lang.startsWith('en'))
    );
    if (match) {
      this.selectedVoice = match;
    }
  }

  public setAccent(acc: 'en-US' | 'en-GB') {
    this.accent = acc;
    try {
      localStorage.setItem('wordpulse_accent', acc);
    } catch {}
    this.initVoice();
  }

  public getAccent(): 'en-US' | 'en-GB' {
    return this.accent;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('wordpulse_sound_muted', String(this.isMuted));
    } catch {}
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // --- Web Audio Synthesizer Effects ---

  public playSelect() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public playMatchSuccess(combo: number = 1) {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Base chord pitch scales with combo
      const baseFreq = 523.25 * Math.min(2.0, 1 + (combo - 1) * 0.1); // C5
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5]; // Major triad

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.15, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.3);
      });
    } catch {}
  }

  public playError() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.18);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.19);
    } catch {}
  }

  public playFlip() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  public playVictory() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Arpeggio fanfare: C5, E5, G5, C6
      const fanfare = [523.25, 659.25, 783.99, 1046.5];
      fanfare.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === fanfare.length - 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        const duration = idx === fanfare.length - 1 ? 0.6 : 0.2;
        gain.gain.setValueAtTime(0.18, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + duration + 0.05);
      });
    } catch {}
  }

  // --- Web Speech API Pronunciation ---

  public speak(text: string, rate: number = 0.95) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // cancel pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.accent;
      utterance.rate = rate;
      utterance.pitch = 1.0;

      if (!this.selectedVoice) {
        this.initVoice();
      }
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }
}

export const sound = new SoundService();
