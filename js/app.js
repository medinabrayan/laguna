// app.js - Orquestador principal: Three.js, interacción con peces, ondas de agua y navegación
class App {
  constructor() {
    this.container = document.getElementById("three-canvas-container");
    this.svgContainer = document.getElementById("connections-svg");
    this.board = document.getElementById("infographic-board");

    // Variables de Three.js
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Módulos
    this.water = null;
    this.fishManager = null;
    this.bubbleSystem = null;

    // Estado del puntero e interacción
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseWorld = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
    this.interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.isMouseDown = false;
    this.isAquariumMode = false;
    this.lastRippleTime = 0;

    // Inicialización
    this.initThree();
    this.initWaterAndFish();
    this.initUI();
    this.drawConnections();
    this.animate();

    // Notificación inicial amigable
    setTimeout(() => {
      this.showToast("¡Explora los hexágonos o interactúa con las Guapuchas en el agua!");
    }, 1200);
  }

  // Configuración del motor 3D Three.js
  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a2f3d);
    this.scene.fog = new THREE.FogExp2(0x0a2f3d, 0.015);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 36);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Iluminación acuática andina moderna y vibrante
    const ambientLight = new THREE.AmbientLight(0xb2f8f0, 0.95);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaea, 1.3);
    sunLight.position.set(15, 25, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    this.scene.add(sunLight);

    const depthLight = new THREE.DirectionalLight(0x2ce0cb, 0.75);
    depthLight.position.set(-20, -15, 10);
    this.scene.add(depthLight);

    // Eventos de ventana
    window.addEventListener("resize", () => this.onWindowResize());
  }

  // Inicializa el entorno de agua, el cardumen de Guapuchas y el cursor de burbujas
  initWaterAndFish() {
    this.water = new WaterEnvironment(this.scene, this.camera);
    this.fishManager = new FishManager(this.scene, this.camera);
    this.fishManager.initSchool(15);
    this.bubbleSystem = new BubbleCursorSystem(this.scene, this.camera);
  }

  // Conversión de coordenadas de pantalla a espacio de mundo 3D sobre el plano del agua
  getPointerWorldPos(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.mouse.set(x, y);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const target = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.interactionPlane, target);
    return target;
  }

  // Interacción UI, eventos y atajos
  initUI() {
    // Desbloqueo inicial del sistema de audio al primer clic/tecla (política de navegadores modernos)
    const unlockAudio = () => {
      if (window.soundEngine) {
        window.soundEngine.init();
        if (window.soundEngine.ctx && window.soundEngine.ctx.state === "suspended") {
          window.soundEngine.ctx.resume();
        }
      }
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
    window.addEventListener("pointerdown", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    // 1. Eventos del mouse sobre la laguna para ondas y peces
    window.addEventListener("pointermove", (e) => {
      const worldPos = this.getPointerWorldPos(e);
      this.mouseWorld.copy(worldPos);

      // Efecto sutil de paralaje en la cámara
      const targetCamX = this.mouse.x * 2.5;
      const targetCamY = this.mouse.y * 1.8;
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetCamX, 0.05);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetCamY, 0.05);
      this.camera.lookAt(0, 0, 0);

      // Notificar a los peces para evasión suave y generar burbujas acuáticas
      this.fishManager.handlePointer(worldPos, false);
      if (this.bubbleSystem && this.bubbleSystem.speed > 10) {
        this.fishManager.emitBurstBubbles(worldPos, 1);
      }

      // Generar pequeñas estelas de agua al mover el cursor rápidamente
      const now = performance.now();
      if (now - this.lastRippleTime > 140) {
        this.water.addRipple(worldPos.x, worldPos.y, 0.35);
        this.lastRippleTime = now;
      }
    });

    window.addEventListener("pointerdown", (e) => {
      // Ignorar si se hace clic dentro del modal o botones de control
      if (e.target.closest(".modal-card") || e.target.closest(".hud-controls")) return;

      // Verificar si se hizo clic directamente en una Guapucha 3D
      const clickedFish = this.fishManager.checkFishClick(this.raycaster);
      if (clickedFish) {
        this.showToast("¡Has tocado una Guapucha (Grundulus bogotensis)! Pez nativo de Fúquene.");
        const worldPos = clickedFish.pos;
        this.water.addRipple(worldPos.x, worldPos.y, 1.6);
        return;
      }

      const worldPos = this.getPointerWorldPos(e);
      this.fishManager.handlePointer(worldPos, true);
      this.water.addRipple(worldPos.x, worldPos.y, 1.2);

      if (window.soundEngine && !this.fishManager.isFeedMode) {
        window.soundEngine.playWaterDrop(0.28, 480 + Math.random() * 220);
      }
    });

    // 2. Clics sobre los hexágonos informativos
    const nodes = document.querySelectorAll(".hex-node");
    nodes.forEach((node) => {
      node.addEventListener("mouseenter", () => {
        if (this.isAquariumMode) return;
        if (window.soundEngine) {
          window.soundEngine.playWaterDrop(0.08, 700 + Math.random() * 200);
        }
        this.highlightConnectedLines(node.id, true);
      });

      node.addEventListener("mouseleave", () => {
        if (this.isAquariumMode) return;
        this.highlightConnectedLines(node.id, false);
      });

      node.addEventListener("click", (e) => {
        if (this.isAquariumMode) return;
        e.stopPropagation();
        const id = node.getAttribute("data-id");
        this.openModal(id);

        // Perturbar el agua en la posición del nodo
        const rect = node.getBoundingClientRect();
        const fakeEvt = { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
        const nodeWorld = this.getPointerWorldPos(fakeEvt);
        this.water.addRipple(nodeWorld.x, nodeWorld.y, 1.4);
        this.fishManager.handlePointer(nodeWorld, true);
      });
    });

    // 3. Botones del HUD
    const btnAudio = document.getElementById("btn-audio");
    const audioLabel = document.getElementById("audio-label");
    btnAudio.addEventListener("click", () => {
      const isSoundOn = window.soundEngine.toggleMute();
      btnAudio.classList.toggle("active", isSoundOn);
      audioLabel.textContent = isSoundOn ? "Sonido: Laguna Activa" : "Sonido: Silenciado";
      this.showToast(isSoundOn ? "Paisaje sonoro de Fúquene activado" : "Audio silenciado");
    });

    const btnFeed = document.getElementById("btn-feed");
    const feedLabel = document.getElementById("feed-label");
    btnFeed.addEventListener("click", () => {
      this.fishManager.isFeedMode = !this.fishManager.isFeedMode;
      btnFeed.classList.toggle("active", this.fishManager.isFeedMode);
      if (this.fishManager.isFeedMode) {
        feedLabel.textContent = "Alimentando (Haz clic)";
        this.showToast("Modo Alimento: Haz clic en el agua para lanzar comida a las Guapuchas");
      } else {
        feedLabel.textContent = "Alimentar Peces";
      }
    });

    const btnAddFish = document.getElementById("btn-add-fish");
    btnAddFish.addEventListener("click", () => {
      this.fishManager.addFish();
      const count = this.fishManager.fishes.length;
      this.showToast(`¡Nueva Guapucha añadida a la laguna! Total: ${count}`);
      if (window.soundEngine) {
        window.soundEngine.playBubblePop(600);
      }
    });

    const btnViewMode = document.getElementById("btn-view-mode");
    const viewLabel = document.getElementById("view-mode-label");
    btnViewMode.addEventListener("click", () => {
      this.isAquariumMode = !this.isAquariumMode;
      document.body.classList.toggle("aquarium-mode", this.isAquariumMode);
      btnViewMode.classList.toggle("active", this.isAquariumMode);
      viewLabel.textContent = this.isAquariumMode ? "Modo Infografía" : "Acuario 3D";
      this.showToast(this.isAquariumMode ? "Modo Acuario 3D: Disfruta las Guapuchas nadando libremente" : "Modo Infografía restaurado");
    });

    // Enlace de cabecera a Fúquene
    const linkFuquene = document.getElementById("link-fuquene");
    if (linkFuquene) {
      linkFuquene.addEventListener("click", () => this.openModal("donde-estamos"));
    }

    // Modal cerrar
    const modalClose = document.getElementById("modal-close");
    const modal = document.getElementById("content-modal");
    modalClose.addEventListener("click", () => this.closeModal());
    modal.addEventListener("click", (e) => {
      if (e.target === modal) this.closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
    });

    // Botón de audio dentro del modal para "Escucha el territorio"
    const modalAudioBtn = document.getElementById("modal-audio-btn");
    modalAudioBtn.addEventListener("click", () => {
      const isSoundOn = window.soundEngine.toggleMute();
      btnAudio.classList.toggle("active", isSoundOn);
      audioLabel.textContent = isSoundOn ? "Sonido: Laguna Activa" : "Sonido: Silenciado";
      modalAudioBtn.innerHTML = isSoundOn
        ? `<svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pausar</span>`
        : `<svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><span>Escuchar</span>`;
    });
  }

  // Dibuja las líneas de conexión entre nodos hexagonales
  drawConnections() {
    if (!this.svgContainer || !this.board) return;
    this.svgContainer.innerHTML = "";

    const boardW = this.board.offsetWidth || 1300;
    const boardH = this.board.offsetHeight || 1050;
    this.svgContainer.setAttribute("viewBox", `0 0 ${boardW} ${boardH}`);
    this.svgContainer.setAttribute("width", `${boardW}`);
    this.svgContainer.setAttribute("height", `${boardH}`);

    const CONNECTIONS = [
      ["node-inicio", "node-donde-estamos"],
      ["node-donde-estamos", "node-que-es-guapucha"],
      ["node-donde-estamos", "node-escucha-el-territorio"],
      ["node-donde-estamos", "node-agua"],
      ["node-donde-estamos", "node-que-es"],
      ["node-que-es-guapucha", "node-que-es"],
      ["node-que-es-guapucha", "node-del-agua-al-plato"],
      ["node-del-agua-al-plato", "node-no-esta-en-un-libro"],
      ["node-del-agua-al-plato", "node-preparacion"],
      ["node-escucha-el-territorio", "node-agua"],
      ["node-agua", "node-territorio-comunidad"],
      ["node-territorio-comunidad", "node-cocina"],
      ["node-cocina", "node-guapucha"],
      ["node-guapucha", "node-maiz"],
      ["node-que-es", "node-importancia"],
      ["node-importancia", "node-historia"],
      ["node-historia", "node-tradicion"],
      ["node-preparacion", "node-saberes"],
      ["node-saberes", "node-receta-tradicional"],
      ["node-no-esta-en-un-libro", "node-cronica"],
      ["node-cronica", "node-el-encuentro-con-la-guapucha"],
      ["node-el-encuentro-con-la-guapucha", "node-voces-del-territorio"],
      ["node-voces-del-territorio", "node-de-la-pesca-a-la-mesa"],
      ["node-de-la-pesca-a-la-mesa", "node-sabores-y-tradicion"],
      ["node-sabores-y-tradicion", "node-una-tradicion-que-permanece"]
    ];

    CONNECTIONS.forEach(([fromId, toId]) => {
      const elFrom = document.getElementById(fromId);
      const elTo = document.getElementById(toId);

      if (!elFrom || !elTo) return;

      const x1 = elFrom.offsetLeft + elFrom.offsetWidth / 2;
      const y1 = elFrom.offsetTop + elFrom.offsetHeight / 2;
      const x2 = elTo.offsetLeft + elTo.offsetWidth / 2;
      const y2 = elTo.offsetTop + elTo.offsetHeight / 2;

      // Crear línea con curvatura natural
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

      path.setAttribute("d", d);
      path.setAttribute("class", "flow-line");
      path.setAttribute("data-from", fromId);
      path.setAttribute("data-to", toId);

      this.svgContainer.appendChild(path);
    });
  }

  // Resalta las líneas conectadas al pasar el cursor sobre un hexágono
  highlightConnectedLines(nodeId, highlight) {
    const lines = this.svgContainer.querySelectorAll(".flow-line");
    lines.forEach((line) => {
      const from = line.getAttribute("data-from");
      const to = line.getAttribute("data-to");
      if (from === nodeId || to === nodeId) {
        line.classList.toggle("pulse", highlight);
      }
    });
  }

  // Despliega el modal informativo con los datos del nodo
  openModal(id) {
    const data = NODES_DATA[id];
    if (!data) return;

    document.getElementById("modal-badge").textContent = data.badge || data.category;
    document.getElementById("modal-title").textContent = data.title;
    document.getElementById("modal-subtitle").textContent = data.subtitle;
    document.getElementById("modal-text").innerHTML = data.text;
    document.getElementById("modal-quote").textContent = data.quote;

    // Estadísticas
    const statsContainer = document.getElementById("modal-stats");
    statsContainer.innerHTML = "";
    if (data.stats && data.stats.length > 0) {
      data.stats.forEach((s) => {
        const item = document.createElement("div");
        item.className = "stat-item";
        item.innerHTML = `<span class="stat-label">${s.label}</span><span class="stat-value">${s.value}</span>`;
        statsContainer.appendChild(item);
      });
      statsContainer.style.display = "grid";
    } else {
      statsContainer.style.display = "none";
    }

    // Audio personalizado si es el nodo de escucha
    const audioBox = document.getElementById("modal-custom-audio");
    audioBox.style.display = data.isAudioNode ? "block" : "none";

    const modal = document.getElementById("content-modal");
    modal.classList.add("open");

    // Marcar nodo activo
    document.querySelectorAll(".hex-node").forEach((n) => n.classList.remove("active-node"));
    const activeEl = document.querySelector(`[data-id="${id}"]`);
    if (activeEl) activeEl.classList.add("active-node");
  }

  closeModal() {
    const modal = document.getElementById("content-modal");
    modal.classList.remove("open");
    document.querySelectorAll(".hex-node").forEach((n) => n.classList.remove("active-node"));
  }

  // Notificación flotante (toast)
  showToast(message, duration = 3800) {
    const toast = document.getElementById("fish-toast");
    const toastText = document.getElementById("toast-text");
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add("show");

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.drawConnections();
  }

  // Bucle de renderizado 60 FPS
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    if (this.water) this.water.update(delta);
    if (this.fishManager) this.fishManager.update(delta, time);
    if (this.bubbleSystem) this.bubbleSystem.update();

    this.renderer.render(this.scene, this.camera);
  }
}

// Inicializar la aplicación una vez cargado el DOM
window.addEventListener("DOMContentLoaded", () => {
  window.lagunaApp = new App();
});
