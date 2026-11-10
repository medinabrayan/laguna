// audio.js - Motor de audio procedural Web Audio API y controlador de pistas para la Laguna de Fúquene
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.initialized = false;
    this.currentMusicTimer = null;
    this.isPlayingMusic = false;
  }

  init() {
    if (this.initialized) {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.setupMaster();
      this.setupAmbientSoundscape();
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio API no soportada:", e);
    }
  }

  setupMaster() {
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Canal separado para efectos de sonido (gotas, peces, burbujas)
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    // Canal para música instrumental ("Soy colombiano")
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);
  }

  setupAmbientSoundscape() {
    // 1. Ruido rosa/marrón filtrado para simular el viento suave del páramo / laguna
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filtro pasa bajos para murmullo acuático
    const waterFilter = this.ctx.createBiquadFilter();
    waterFilter.type = "lowpass";
    waterFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

    // LFO para modular suavemente el vaivén del agua (oleaje sutil)
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);

    lfo.connect(waterFilter.frequency);
    whiteNoise.connect(waterFilter);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    waterFilter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();

    this.scheduleDroplets();
  }

  scheduleDroplets() {
    if (!this.initialized) return;
    const interval = 2400 + Math.random() * 3200;
    setTimeout(() => {
      if (!this.isMuted) {
        this.playWaterDrop(0.12, 420 + Math.random() * 450);
      }
      this.scheduleDroplets();
    }, interval);
  }

  // Sonido de gota u onda al hacer clic o mover el cursor
  playWaterDrop(volume = 0.25, freq = 550) {
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * 0.7, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + 0.14);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.masterGain);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // Sonido cuando un pez huye o salpica
  playFishSplash(intensity = 0.3) {
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(160 + Math.random() * 90, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(intensity * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain || this.masterGain);

      osc.start(now);
      osc.stop(now + 0.2);

      setTimeout(() => {
        this.playWaterDrop(intensity * 0.35, 600 + Math.random() * 300);
      }, 50);
    } catch (e) {}
  }

  // Sonido de burbuja / chasquido
  playBubblePop(freq = 700) {
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 2.2, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  // Sonido realista de fritura y chisporroteo en la paila de hierro
  playSizzle(duration = 2.5) {
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    try {
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.45;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(2200, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(1.1, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.12);
      gain.gain.setValueAtTime(0.20, now + duration - 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      whiteNoise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.sfxGain || this.masterGain);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
    } catch (e) {}
  }

  // Acorde triunfal campesino al completar una etapa
  playSuccessChime() {
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playWaterDrop(0.22, freq);
      }, i * 85);
    });
  }

  // Melodía instrumental tradicional colombiana por defecto ("Soy Colombiano" - bambuco andino)
  // Sintetizada proceduralmente para sonar sin necesidad de archivos externos
  playSoyColombianoInstrumental(onEndCallback = null) {
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    this.stopSoyColombiano();
    this.isPlayingMusic = true;

    // Notas de bambuco andino: Re, Fa#, Sol, La, Si, Do#, Re
    // Frecuencias principales de la melodía de "Soy colombiano"
    const notes = [
      { f: 293.66, d: 0.35 }, // D4
      { f: 369.99, d: 0.35 }, // F#4
      { f: 440.00, d: 0.45 }, // A4
      { f: 440.00, d: 0.35 }, // A4
      { f: 493.88, d: 0.55 }, // B4
      { f: 440.00, d: 0.40 }, // A4
      { f: 369.99, d: 0.35 }, // F#4
      { f: 293.66, d: 0.55 }, // D4
      { f: 329.63, d: 0.35 }, // E4
      { f: 369.99, d: 0.45 }, // F#4
      { f: 440.00, d: 0.40 }, // A4
      { f: 369.99, d: 0.35 }, // F#4
      { f: 329.63, d: 0.55 }, // E4
      { f: 293.66, d: 0.80 }, // D4
      // Frase 2
      { f: 440.00, d: 0.35 }, // A4
      { f: 493.88, d: 0.35 }, // B4
      { f: 587.33, d: 0.55 }, // D5
      { f: 587.33, d: 0.40 }, // D5
      { f: 554.37, d: 0.35 }, // C#5
      { f: 493.88, d: 0.45 }, // B4
      { f: 440.00, d: 0.70 }  // A4
    ];

    let timeCursor = this.ctx.currentTime + 0.1;
    const playNote = (freq, duration, t) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Timbre cálido de flauta/tiple andino (triángulo con armónicos suaves)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.95);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      osc.stop(t + duration);
    };

    notes.forEach((n) => {
      playNote(n.f, n.d, timeCursor);
      timeCursor += n.d * 1.05;
    });

    const totalDuration = (timeCursor - this.ctx.currentTime) * 1000;
    this.currentMusicTimer = setTimeout(() => {
      this.isPlayingMusic = false;
      if (onEndCallback) onEndCallback();
    }, totalDuration);
  }

  stopSoyColombiano() {
    if (this.currentMusicTimer) {
      clearTimeout(this.currentMusicTimer);
      this.currentMusicTimer = null;
    }
    this.isPlayingMusic = false;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      setTimeout(() => {
        if (this.musicGain && this.ctx) this.musicGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      }, 100);
    }
  }

  // Reproducción de audio por defecto para entrevistas (generador de tono ambiental y murmullo)
  playInterviewPlaceholder(type = 'pescador', onEnd = null) {
    if (!this.initialized) this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    const baseFreq = type === 'pescador' ? 140 : (type === 'luz_mery' ? 240 : 180);
    osc.frequency.setValueAtTime(baseFreq, now);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(450, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
    gain.gain.setValueAtTime(0.18, now + 3.8);
    gain.gain.linearRampToValueAtTime(0.001, now + 4.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 4.3);

    setTimeout(() => {
      if (onEnd) onEnd();
    }, 4300);
  }

  toggleMute() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.35;
      this.ambientGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
    }
    return !this.isMuted;
  }
}

window.soundEngine = new SoundEngine();
