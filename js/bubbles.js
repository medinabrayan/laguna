// bubbles.js - Efecto de burbujas acuáticas activo ÚNICAMENTE dentro del estanque/juego de Guapuchas
class BubbleCursorSystem {
  constructor(container) {
    this.container = container || document.getElementById("three-canvas-container");
    if (!this.container) return;

    this.bubbles = [];
    this.mouse = { x: 0, y: 0 };
    this.prevMouse = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.speed = 0;
    this.isInside = false;
    this.lastSpawnTime = 0;

    this.createCanvas();
    this.initEvents();
  }

  // Lienzo 2D contenido estrictamente dentro del contenedor del lago
  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "lake-bubble-canvas";
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "5";
    this.canvas.style.borderRadius = "inherit";

    // Asegurar que el contenedor tenga position relative
    this.container.style.position = "relative";
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    if (!this.container || !this.canvas) return;
    this.width = this.container.clientWidth || 800;
    this.height = this.container.clientHeight || 460;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  initEvents() {
    if (!this.container) return;

    this.container.addEventListener("pointerenter", (e) => {
      this.isInside = true;
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.prevMouse.x = this.mouse.x;
      this.prevMouse.y = this.mouse.y;
    });

    this.container.addEventListener("pointerleave", () => {
      this.isInside = false;
    });

    this.container.addEventListener("pointermove", (e) => {
      const rect = this.container.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const dx = currentX - this.prevMouse.x;
      const dy = currentY - this.prevMouse.y;
      this.speed = Math.sqrt(dx * dx + dy * dy);
      this.velocity.x = dx;
      this.velocity.y = dy;

      this.mouse.x = currentX;
      this.mouse.y = currentY;
      this.prevMouse.x = currentX;
      this.prevMouse.y = currentY;

      // Generar pequeñas burbujas solo al mover dentro del agua
      const now = performance.now();
      if (this.speed > 8 && now - this.lastSpawnTime > 120) {
        this.spawnBubble(this.mouse.x, this.mouse.y, false);
        this.lastSpawnTime = now;
      }
    });

    this.container.addEventListener("pointerdown", (e) => {
      const rect = this.container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      // Estallido de burbujas al tocar el agua
      this.burst(clickX, clickY, 8);
    });
  }

  // Genera una burbuja individual con física ascendente en el agua
  spawnBubble(x, y, isBurst = false) {
    const angle = Math.random() * Math.PI * 2;
    const baseSpeed = isBurst ? 2 + Math.random() * 3.5 : 0.6 + Math.random() * 1.2;

    const size = isBurst ? 5 + Math.random() * 12 : 6 + Math.random() * 14;

    this.bubbles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      radius: size,
      vx: isBurst ? Math.cos(angle) * baseSpeed : -this.velocity.x * 0.1 + (Math.random() - 0.5) * 1.2,
      vy: isBurst ? Math.sin(angle) * baseSpeed - 1.0 : -1.5 - Math.random() * 1.8, // Ascenso natural hacia superficie
      wobbleSpeed: 0.05 + Math.random() * 0.08,
      wobbleAmp: 0.12 + Math.random() * 0.16,
      wobblePhase: Math.random() * Math.PI * 2,
      life: 1.0,
      decay: 0.012 + Math.random() * 0.018,
      opacity: 0.75 + Math.random() * 0.25
    });
  }

  // Explosión de micro-burbujas en el punto de contacto
  burst(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      this.spawnBubble(x, y, true);
    }
  }

  // Actualización en el bucle de renderizado
  update() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];

      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.96;
      b.vy -= 0.03; // Fuerza de flotabilidad
      b.wobblePhase += b.wobbleSpeed;
      b.life -= b.decay;

      // Desaparece si llega al borde superior o se extingue
      if (b.life <= 0 || b.y < -20 || b.x < -20 || b.x > this.width + 20) {
        this.bubbles.splice(i, 1);
        continue;
      }

      this.drawBubble(b);
    }
  }

  // Dibuja una burbuja con reflejos acuáticos sutiles
  drawBubble(b) {
    const ctx = this.ctx;
    const currentOpacity = Math.max(0, b.life * b.opacity);
    const scaleX = 1 + Math.sin(b.wobblePhase) * b.wobbleAmp;
    const scaleY = 1 - Math.sin(b.wobblePhase) * b.wobbleAmp;

    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.scale(scaleX, scaleY);

    const r = b.radius;

    // Cuerpo translúcido
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
    grad.addColorStop(0.0, `rgba(255, 255, 255, ${currentOpacity * 0.9})`);
    grad.addColorStop(0.4, `rgba(210, 245, 240, ${currentOpacity * 0.4})`);
    grad.addColorStop(0.8, `rgba(100, 215, 200, ${currentOpacity * 0.25})`);
    grad.addColorStop(1.0, `rgba(255, 255, 255, ${currentOpacity * 0.6})`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Borde brillante
    ctx.strokeStyle = `rgba(220, 255, 250, ${currentOpacity * 0.75})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Reflejo superior
    ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.85})`;
    ctx.beginPath();
    ctx.ellipse(-r * 0.35, -r * 0.4, r * 0.25, r * 0.14, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

window.BubbleCursorSystem = BubbleCursorSystem;
