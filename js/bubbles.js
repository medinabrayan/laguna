// bubbles.js - Sistema interactivo de burbujas en el cursor del mouse (2D Canvas + 3D Three.js)
class BubbleCursorSystem {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.bubbles = [];
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.prevMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.velocity = { x: 0, y: 0 };
    this.speed = 0;
    this.isMouseDown = false;
    this.lastSpawnTime = 0;

    this.createCanvas();
    this.initEvents();
  }

  // Lienzo 2D dedicado para renderizado ultra-nítido a 60 FPS de burbujas y cursor translúcido
  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "bubble-cursor-canvas";
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100vw";
    this.canvas.style.height = "100vh";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "999";
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * Math.min(window.devicePixelRatio, 2);
    this.canvas.height = this.height * Math.min(window.devicePixelRatio, 2);
    this.ctx.scale(Math.min(window.devicePixelRatio, 2), Math.min(window.devicePixelRatio, 2));
  }

  initEvents() {
    window.addEventListener("pointermove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Calcular velocidad del mouse
      const dx = this.mouse.x - this.prevMouse.x;
      const dy = this.mouse.y - this.prevMouse.y;
      this.speed = Math.sqrt(dx * dx + dy * dy);
      this.velocity.x = dx;
      this.velocity.y = dy;

      this.prevMouse.x = this.mouse.x;
      this.prevMouse.y = this.mouse.y;

      // Generar estela continua de burbujas al mover el ratón
      const now = performance.now();
      const spawnInterval = Math.max(25, 90 - this.speed * 2);
      if (now - this.lastSpawnTime > spawnInterval) {
        this.spawnBubble(this.mouse.x, this.mouse.y, false);
        this.lastSpawnTime = now;
      }
    });

    window.addEventListener("pointerdown", (e) => {
      this.isMouseDown = true;
      // Explosión de burbujas al hacer clic
      this.burst(e.clientX, e.clientY, 12);
      if (window.soundEngine) {
        window.soundEngine.playBubblePop(750 + Math.random() * 250);
      }
    });

    window.addEventListener("pointerup", () => {
      this.isMouseDown = false;
    });
  }

  // Genera una burbuja individual con física acuática
  spawnBubble(x, y, isBurst = false) {
    const angle = Math.random() * Math.PI * 2;
    const baseSpeed = isBurst ? 2.5 + Math.random() * 4.5 : 0.8 + Math.random() * 1.5;

    const size = isBurst
      ? 6 + Math.random() * 16
      : 8 + Math.random() * 18 + Math.min(this.speed * 0.25, 12);

    this.bubbles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      radius: size,
      targetRadius: size,
      vx: isBurst ? Math.cos(angle) * baseSpeed : -this.velocity.x * 0.15 + (Math.random() - 0.5) * 1.5,
      vy: isBurst ? Math.sin(angle) * baseSpeed - 1.2 : -1.8 - Math.random() * 2.2, // Tienden a flotar hacia arriba
      wobbleSpeed: 0.05 + Math.random() * 0.08,
      wobbleAmp: 0.12 + Math.random() * 0.18,
      wobblePhase: Math.random() * Math.PI * 2,
      opacity: 0.85,
      life: 1.0,
      decay: 0.008 + Math.random() * 0.012,
      colorHue: 175 + Math.random() * 30, // Tonos turquesa y aguamarina iridiscente
      popProgress: 0,
      isPopping: false
    });

    // Limitar máximo de burbujas en pantalla para rendimiento óptimo
    if (this.bubbles.length > 90) {
      this.bubbles.shift();
    }
  }

  // Ráfaga múltiple de burbujas
  burst(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      this.spawnBubble(x, y, true);
    }
  }

  // Actualiza la física y renderiza las burbujas
  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Dibujar el cursor principal tipo burbuja flotante
    this.drawCursorBubble();

    // 2. Actualizar y dibujar cada burbuja de la estela
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];

      b.wobblePhase += b.wobbleSpeed;
      b.x += b.vx + Math.sin(b.wobblePhase) * 0.8;
      b.y += b.vy;
      b.vy -= 0.035; // Aceleración de flotabilidad (sube a la superficie)
      b.vx *= 0.96; // Fricción del agua
      b.life -= b.decay;

      // Si llega muy arriba o expira su vida, desaparece
      if (b.life <= 0 || b.y < -30) {
        this.bubbles.splice(i, 1);
        continue;
      }

      this.drawBubble(b);
    }
  }

  // Dibuja una burbuja con reflejos esféricos, gradiente nacarado e iridiscencia
  drawBubble(b) {
    const ctx = this.ctx;
    const currentOpacity = Math.max(0, b.life * b.opacity);
    const scaleX = 1 + Math.sin(b.wobblePhase) * b.wobbleAmp;
    const scaleY = 1 - Math.sin(b.wobblePhase) * b.wobbleAmp;

    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.scale(scaleX, scaleY);

    const r = b.radius;

    // Cuerpo translúcido de la burbuja
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
    grad.addColorStop(0.0, `rgba(255, 255, 255, ${currentOpacity * 0.95})`);
    grad.addColorStop(0.35, `rgba(200, 245, 255, ${currentOpacity * 0.45})`);
    grad.addColorStop(0.7, `rgba(130, 225, 215, ${currentOpacity * 0.25})`);
    grad.addColorStop(0.92, `rgba(70, 185, 210, ${currentOpacity * 0.55})`);
    grad.addColorStop(1.0, `rgba(255, 255, 255, ${currentOpacity * 0.75})`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Borde brillante con destello turquesa
    ctx.strokeStyle = `rgba(195, 250, 245, ${currentOpacity * 0.8})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Destello de luz especular superior (brillo primario)
    ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.9})`;
    ctx.beginPath();
    ctx.ellipse(-r * 0.35, -r * 0.4, r * 0.28, r * 0.16, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Pequeño reflejo secundario inferior
    ctx.fillStyle = `rgba(220, 255, 250, ${currentOpacity * 0.5})`;
    ctx.beginPath();
    ctx.ellipse(r * 0.3, r * 0.35, r * 0.14, r * 0.08, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Dibuja el cursor interactivo en forma de burbuja luminosa
  drawCursorBubble() {
    const ctx = this.ctx;
    const x = this.mouse.x;
    const y = this.mouse.y;

    // Tamaño reactivo según la velocidad y el clic
    const baseR = this.isMouseDown ? 15 : 18 + Math.min(this.speed * 0.3, 10);
    const pulse = Math.sin(performance.now() * 0.006) * 2;
    const r = baseR + pulse;

    ctx.save();
    ctx.translate(x, y);

    // Resplandor exterior (Aura bioluminiscente de agua)
    const glow = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2.2);
    glow.addColorStop(0.0, "rgba(74, 224, 200, 0.45)");
    glow.addColorStop(0.5, "rgba(52, 175, 215, 0.2)");
    glow.addColorStop(1.0, "rgba(74, 224, 200, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo de la burbuja cursor
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
    grad.addColorStop(0.0, "rgba(255, 255, 255, 0.95)");
    grad.addColorStop(0.4, "rgba(215, 250, 255, 0.5)");
    grad.addColorStop(0.8, "rgba(95, 225, 215, 0.3)");
    grad.addColorStop(1.0, "rgba(255, 255, 255, 0.85)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Destello blanco superior
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath();
    ctx.ellipse(-r * 0.32, -r * 0.36, r * 0.26, r * 0.15, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Punto central de mira suave
    ctx.fillStyle = "rgba(40, 140, 180, 0.8)";
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
