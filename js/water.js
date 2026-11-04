// water.js - Simulación 3D moderna de agua, cáusticas celulares, relieve batimétrico de Fúquene y ondas interactivas
class WaterEnvironment {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.ripples = [];
    this.maxRipples = 14;
    this.time = 0;
    this.mouseWake = { x: 0, y: 0, active: false };

    this.createLagoonFloor();
    this.createWaterSurface();
    this.createGodRays();
    this.createFloatingSpecks();
  }

  // Fondo lacustre moderno con estilo cartográfico batimétrico de la Laguna de Fúquene
  createLagoonFloor() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    // 1. Degradado base profundo y moderno (Andino lacustre)
    const bgGrad = ctx.createRadialGradient(512, 512, 80, 512, 512, 720);
    bgGrad.addColorStop(0.0, "#134e5e");
    bgGrad.addColorStop(0.45, "#0d3b4a");
    bgGrad.addColorStop(0.85, "#082935");
    bgGrad.addColorStop(1.0, "#051c24");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Cuadrícula cartográfica sutil de navegación
    ctx.strokeStyle = "rgba(74, 224, 200, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1024; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // 3. Curvas batimétricas y orillas de la Laguna de Fúquene con brillo neón cian
    ctx.save();

    // Capa exterior de orilla (aguas someras y totorales)
    ctx.fillStyle = "rgba(42, 175, 160, 0.18)";
    ctx.strokeStyle = "rgba(74, 224, 200, 0.45)";
    ctx.lineWidth = 2.5;

    // Bahía norte (Fúquene)
    ctx.beginPath();
    ctx.moveTo(280, 0);
    ctx.bezierCurveTo(320, 160, 480, 200, 600, 120);
    ctx.bezierCurveTo(680, 60, 740, 100, 780, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ribera occidental (Guachetá y totorales)
    ctx.beginPath();
    ctx.moveTo(0, 220);
    ctx.bezierCurveTo(170, 260, 210, 420, 130, 580);
    ctx.bezierCurveTo(50, 680, 150, 820, 0, 880);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ribera oriental (Sector Ubaté - Simijaca)
    ctx.beginPath();
    ctx.moveTo(1024, 280);
    ctx.bezierCurveTo(840, 340, 860, 520, 940, 640);
    ctx.bezierCurveTo(990, 700, 890, 810, 1024, 860);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Isla del Santuario / Banco central
    ctx.beginPath();
    ctx.ellipse(512, 850, 280, 150, 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Curvas interiores de mayor profundidad (estilo topográfico moderno)
    ctx.strokeStyle = "rgba(95, 245, 225, 0.65)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(512, 850, 200, 100, 0.08, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(512, 850, 120, 55, 0.08, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    this.floorTexture = new THREE.CanvasTexture(canvas);
    this.floorTexture.wrapS = THREE.ClampToEdgeWrapping;
    this.floorTexture.wrapT = THREE.ClampToEdgeWrapping;

    const floorGeom = new THREE.PlaneGeometry(96, 75);
    this.floorMaterial = new THREE.MeshStandardMaterial({
      map: this.floorTexture,
      roughness: 0.6,
      metalness: 0.15,
      bumpScale: 0.1
    });

    this.floorMesh = new THREE.Mesh(floorGeom, this.floorMaterial);
    this.floorMesh.position.set(0, 0, -18);
    this.floorMesh.receiveShadow = true;
    this.scene.add(this.floorMesh);
  }

  // Superficie de agua moderna con textura de cáusticas celulares dinámicas
  createWaterSurface() {
    this.waterGeom = new THREE.PlaneGeometry(96, 75, 90, 70);
    this.waterOriginalVerts = this.waterGeom.attributes.position.array.slice();

    // Canvas de cáusticas celulares Voronoi procedurales
    const causticsCanvas = document.createElement("canvas");
    causticsCanvas.width = 512;
    causticsCanvas.height = 512;
    this.causticsCtx = causticsCanvas.getContext("2d");
    this.causticsTexture = new THREE.CanvasTexture(causticsCanvas);
    this.causticsTexture.wrapS = THREE.RepeatWrapping;
    this.causticsTexture.wrapT = THREE.RepeatWrapping;
    this.causticsTexture.repeat.set(3.5, 3.0);

    // Material de agua moderno: turquesa cristalino, profundidad y destellos especulares
    this.waterMat = new THREE.MeshStandardMaterial({
      color: 0x3cd6c6,
      map: this.causticsTexture,
      transparent: true,
      opacity: 0.44,
      roughness: 0.1,
      metalness: 0.22,
      depthWrite: false, // Garantiza que los peces siempre sean visibles sin oclusión
      side: THREE.DoubleSide
    });

    this.waterMesh = new THREE.Mesh(this.waterGeom, this.waterMat);
    this.waterMesh.position.set(0, 0, 3.5);
    this.scene.add(this.waterMesh);
  }

  // Rayos solares volumétricos modernos (shimmering god rays)
  createGodRays() {
    const rayGroup = new THREE.Group();
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0x8ef5e8,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    for (let i = 0; i < 7; i++) {
      const wTop = 1.4 + Math.random() * 2.2;
      const wBottom = 5.0 + Math.random() * 7.5;

      const rayGeom = new THREE.BufferGeometry();
      const xOffset = -28 + i * 9.5 + Math.random() * 3.5;
      const verts = new Float32Array([
        xOffset - wTop / 2, 32, -6,
        xOffset + wTop / 2, 32, -6,
        xOffset - wBottom / 2 + 12, -32, 6,

        xOffset + wTop / 2, 32, -6,
        xOffset + wBottom / 2 + 12, -32, 6,
        xOffset - wBottom / 2 + 12, -32, 6
      ]);
      rayGeom.setAttribute("position", new THREE.BufferAttribute(verts, 3));
      const rayMesh = new THREE.Mesh(rayGeom, rayMat);
      rayGroup.add(rayMesh);
    }

    this.scene.add(rayGroup);
    this.godRays = rayGroup;
  }

  // Micropartículas bioluminiscentes suspendidas en la columna de agua
  createFloatingSpecks() {
    const count = 320;
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(0x5bf7d3);
    const c2 = new THREE.Color(0x73e2ff);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 85;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 65;
      pos[i * 3 + 2] = -16 + Math.random() * 24;

      const mix = Math.random();
      const finalC = c1.clone().lerp(c2, mix);
      colors[i * 3] = finalC.r;
      colors[i * 3 + 1] = finalC.g;
      colors[i * 3 + 2] = finalC.b;
    }
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.55,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.specks = new THREE.Points(geom, mat);
    this.scene.add(this.specks);
  }

  // Dispara una perturbación/onda interactiva de agua
  addRipple(x, y, strength = 1.0) {
    this.ripples.push({
      x,
      y,
      time: 0,
      maxTime: 2.6,
      strength: strength * 1.1,
      frequency: 2.4,
      decay: 1.5
    });

    if (this.ripples.length > this.maxRipples) {
      this.ripples.shift();
    }
  }

  // Actualiza el mapa dinámico de cáusticas en tiempo real
  updateCaustics(time) {
    if (!this.causticsCtx) return;
    const ctx = this.causticsCtx;
    ctx.clearRect(0, 0, 512, 512);

    // Red orgánica de luz cáustica
    ctx.strokeStyle = "rgba(180, 255, 245, 0.25)";
    ctx.fillStyle = "rgba(140, 245, 235, 0.12)";
    ctx.lineWidth = 2.5;

    const count = 22;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const cx = 256 + Math.sin(angle * 2 + time * 1.4) * 120 + Math.cos(time * 0.8 + i) * 30;
      const cy = 256 + Math.cos(angle * 3 + time * 1.1) * 120 + Math.sin(time * 0.9 + i) * 30;
      const radius = 35 + Math.sin(time * 2.2 + i * 1.3) * 16;

      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(4, radius), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Intersecciones de luz
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    for (let j = 0; j < 12; j++) {
      const px = 256 + Math.sin(time * 1.6 + j * 2) * 180;
      const py = 256 + Math.cos(time * 1.3 + j * 1.7) * 180;
      ctx.beginPath();
      ctx.arc(px, py, 6 + Math.sin(time * 3 + j) * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    this.causticsTexture.needsUpdate = true;
  }

  update(delta) {
    this.time += delta;

    // Actualizar ondas de la malla de agua
    const posAttr = this.waterGeom.attributes.position;
    const pos = posAttr.array;
    const orig = this.waterOriginalVerts;
    const count = pos.length / 3;

    for (let i = 0; i < count; i++) {
      const ox = orig[i * 3];
      const oy = orig[i * 3 + 1];

      // Ondulación natural de fondo (olas suaves andinas)
      let wave =
        Math.sin(ox * 0.25 + this.time * 2.0) * 0.35 +
        Math.cos(oy * 0.3 + this.time * 1.6) * 0.3 +
        Math.sin((ox + oy) * 0.18 + this.time * 2.4) * 0.18;

      // Sumar ondas provocadas por la interacción del ratón
      for (let r of this.ripples) {
        const dx = ox - r.x;
        const dy = oy - r.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Frente de onda circular que se propaga
        const waveFront = r.time * 15.0;
        const waveDist = Math.abs(dist - waveFront);

        if (waveDist < 5.5) {
          const factor = Math.exp(-r.time * r.decay) * Math.exp(-waveDist * 0.75);
          wave += Math.sin(dist * r.frequency - r.time * 11.0) * r.strength * factor;
        }
      }

      pos[i * 3 + 2] = orig[i * 3 + 2] + wave;
    }
    posAttr.needsUpdate = true;
    this.waterGeom.computeVertexNormals();

    // Actualizar edad de las ondas
    for (let j = this.ripples.length - 1; j >= 0; j--) {
      this.ripples[j].time += delta;
      if (this.ripples[j].time > this.ripples[j].maxTime) {
        this.ripples.splice(j, 1);
      }
    }

    // Balanceo suave de rayos solares
    if (this.godRays) {
      this.godRays.rotation.z = Math.sin(this.time * 0.4) * 0.05;
      this.godRays.position.x = Math.sin(this.time * 0.25) * 1.5;
    }

    // Deriva y oscilación de partículas suspendidas
    if (this.specks) {
      const spPos = this.specks.geometry.attributes.position.array;
      for (let k = 0; k < spPos.length / 3; k++) {
        spPos[k * 3] += Math.sin(this.time * 0.6 + k) * 0.018;
        spPos[k * 3 + 1] += 0.022;
        if (spPos[k * 3 + 1] > 34) spPos[k * 3 + 1] = -34;
      }
      this.specks.geometry.attributes.position.needsUpdate = true;
    }

    // Actualizar textura de cáusticas periódicamente
    this.updateCaustics(this.time);
  }
}
