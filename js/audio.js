// audio.js - Motor de audio procedural Web Audio API para la Laguna de Fúquene
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientGain = null;
    this.sfxGain = null;
    this.initialized = false;
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
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Canal separado para efectos de sonido (gotas, peces, burbujas)
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);
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
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // Oleaje cada 5 segundos

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);

    lfo.connect(waterFilter.frequency);
    whiteNoise.connect(waterFilter);

    this.ambientGain = this.ctx.createGain();
    // Inicia en silencio si isMuted = true
    this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    waterFilter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();

    // 2. Tintineo sutil de gotas y pequeñas ondas periódicas
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

  // Sonido de comer / interactuar con alimento
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
