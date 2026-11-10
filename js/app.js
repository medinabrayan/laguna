// app.js - Orquestador principal: Three.js para el Lago de Guapuchas, personajes 3D, audios y navegación
class App {
  constructor() {
    this.container = document.getElementById("three-canvas-container");
    this.svgContainer = document.getElementById("connections-svg");
    this.board = document.getElementById("infographic-board");

    // Variables de Three.js para el lago interactivo
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Módulos
    this.water = null;
    this.fishManager = null;
    this.bubbleSystem = null;
    this.inspector3D = null;
    this.donaLuzViewer = null;
    this.pescadorViewer = null;
    this.game = null;

    // Estado de interacción
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseWorld = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
    this.interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.lastRippleTime = 0;

    // Inicializaciones
    this.initLakeThree();
    this.initUI();
    this.init3DInspectors();
    this.initAudioPlayers();
    this.initPhotoWall();
    this.initForms();
    this.initGame();
    this.drawConnections();
    this.animate();

    setTimeout(() => {
      this.showToast("🌿 Bienvenido a Guapuchas: Latidos de Fúquene");
    }, 1000);
  }

  // Inicializa el motor Three.js confinado dentro del contenedor del Lago de Guapuchas
  initLakeThree() {
    if (!this.container) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x133844);
    this.scene.fog = new THREE.FogExp2(0x133844, 0.015);

    const w = this.container.clientWidth || 980;
    const h = this.container.clientHeight || 460;
    const aspect = w / h;

    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 34);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Iluminación natural andina
    const ambientLight = new THREE.AmbientLight(0xcdeee8, 0.95);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaea, 1.3);
    sunLight.position.set(15, 25, 20);
    sunLight.castShadow = true;
    this.scene.add(sunLight);

    const depthLight = new THREE.DirectionalLight(0x38e8cb, 0.7);
    depthLight.position.set(-20, -15, 10);
    this.scene.add(depthLight);

    // Entorno de agua y peces
    this.water = new WaterEnvironment(this.scene, this.camera);
    this.fishManager = new FishManager(this.scene, this.camera);
    this.fishManager.initSchool(16);

    // Burbujas confinadas solo dentro del lago
    this.bubbleSystem = new BubbleCursorSystem(this.container);

    // Eventos del mouse circunscritos estrictamente al contenedor del lago
    this.setupLakeEvents();

    window.addEventListener("resize", () => this.onWindowResize());
  }

  // Conversión de coordenadas relativas al contenedor del lago
  getPointerWorldPos(event) {
    if (!this.container) return new THREE.Vector3(0, 0, 0);
    const rect = this.container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.mouse.set(x, y);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const target = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.interactionPlane, target);
    return target;
  }

  setupLakeEvents() {
    if (!this.container) return;

    this.container.addEventListener("pointermove", (e) => {
      const worldPos = this.getPointerWorldPos(e);
      this.mouseWorld.copy(worldPos);

      // Desplazamiento suave de peces
      if (this.fishManager) {
        this.fishManager.handlePointer(worldPos, false);
      }

      // Ondas al deslizar sobre el agua
      const now = performance.now();
      if (now - this.lastRippleTime > 140 && this.water) {
        this.water.addRipple(worldPos.x, worldPos.y, 0.35);
        this.lastRippleTime = now;
      }
    });

    this.container.addEventListener("pointerdown", (e) => {
      // Ignorar clics sobre los botones de control dentro del lago
      if (e.target.closest(".lake-controls-bar") || e.target.closest(".hud-btn") || e.target.closest("button")) return;

      const clickedFish = this.fishManager ? this.fishManager.checkFishClick(this.raycaster) : null;
      if (clickedFish) {
        this.showToast("🐟 ¡Tocaste una Guapucha (Grundulus bogotensis)!");
        const worldPos = clickedFish.pos;
        if (this.water) this.water.addRipple(worldPos.x, worldPos.y, 1.6);
        return;
      }

      const worldPos = this.getPointerWorldPos(e);
      if (this.fishManager) this.fishManager.handlePointer(worldPos, true);
      if (this.water) this.water.addRipple(worldPos.x, worldPos.y, 1.2);

      if (window.soundEngine && !this.fishManager.isFeedMode) {
        window.soundEngine.playWaterDrop(0.28, 480 + Math.random() * 220);
      }
    });
  }

  // Inicializa visores 3D de personajes y anatomía
  init3DInspectors() {
    // 1. Inspector Anatómico 3D de la Guapucha
    const inspectorContainer = document.getElementById("guapucha-3d-inspector");
    if (inspectorContainer && window.GuapuchaInspector3D) {
      this.inspector3D = new GuapuchaInspector3D("guapucha-3d-inspector", "guapucha-anatomy-info");

      // Botones de acceso directo a partes anatómicas
      const partBtns = document.querySelectorAll(".part-btn");
      partBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          partBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const partKey = btn.getAttribute("data-part");
          if (this.inspector3D) {
            this.inspector3D.selectPart(partKey);
          }
          if (window.soundEngine) {
            window.soundEngine.playWaterDrop(0.2, 650);
          }
        });
      });
    }

    // 2. Visor 3D de Doña Luz Mery
    const donaLuzContainer = document.getElementById("dona-luz-3d-main");
    if (donaLuzContainer && window.Character3DViewer) {
      this.donaLuzViewer = new Character3DViewer("dona-luz-3d-main", "dona_luz");
    }

    // 3. Visor 3D de Don Álvaro Pescador
    const pescadorContainer = document.getElementById("pescador-3d-preview");
    if (pescadorContainer && window.Character3DViewer) {
      this.pescadorViewer = new Character3DViewer("pescador-3d-preview", "pescador");
    }
  }

  // Inicializa el minijuego de cocina tradicional
  initGame() {
    if (window.GuapuchaGame) {
      this.game = new GuapuchaGame();
    }
  }

  // Inicializa los reproductores de audio con sintetizador por defecto y soporte para MP3
  initAudioPlayers() {
    // 1. Tema musical de fondo: Soy colombiano (versión instrumental)
    const btnSoyColombiano = document.getElementById("btn-play-soy-colombiano");
    const soyWave = document.querySelector('[data-audio-player="soy-colombiano"] .sound-wave-bars');
    let isSoyPlaying = false;

    if (btnSoyColombiano) {
      btnSoyColombiano.addEventListener("click", () => {
        isSoyPlaying = !isSoyPlaying;
        if (isSoyPlaying) {
          btnSoyColombiano.innerHTML = `<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pausar tema musical</span>`;
          if (soyWave) soyWave.classList.add("playing");
          if (window.soundEngine) {
            window.soundEngine.playSoyColombianoInstrumental(() => {
              isSoyPlaying = false;
              btnSoyColombiano.innerHTML = `<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M8 5v14l11-7z"/></svg><span>Escuchar tema instrumental</span>`;
              if (soyWave) soyWave.classList.remove("playing");
            });
          }
          this.showToast("🎶 Reproduciendo «Soy colombiano» (versión instrumental)");
        } else {
          btnSoyColombiano.innerHTML = `<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M8 5v14l11-7z"/></svg><span>Escuchar tema instrumental</span>`;
          if (soyWave) soyWave.classList.remove("playing");
          if (window.soundEngine) {
            window.soundEngine.stopSoyColombiano();
          }
        }
      });
    }

    // 2. Audios de testimonios (Don Álvaro, Doña Luz, Comunidad)
    const interviewBtns = document.querySelectorAll("[data-interview]");
    interviewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const interviewType = btn.getAttribute("data-interview");
        const parentControl = btn.closest(".audio-player-control");
        const wave = parentControl ? parentControl.querySelector(".sound-wave-bars") : null;

        const isCurrentlyPlaying = btn.classList.contains("playing");

        // Detener cualquier audio previo
        interviewBtns.forEach((b) => {
          b.classList.remove("playing");
          const span = b.querySelector("span");
          if (span) {
            span.textContent = b.getAttribute("data-interview") === "pescador"
              ? "Escuchar relato de Don Álvaro"
              : b.getAttribute("data-interview") === "luz_mery"
              ? "Escuchar historia de Doña Luz"
              : "Escuchar vivencias comunitarias";
          }
        });
        document.querySelectorAll(".sound-wave-bars").forEach((w) => w.classList.remove("playing"));

        if (!isCurrentlyPlaying) {
          btn.classList.add("playing");
          const span = btn.querySelector("span");
          if (span) span.textContent = "Pausar testimonio";
          if (wave) wave.classList.add("playing");

          if (window.soundEngine) {
            window.soundEngine.playInterviewPlaceholder(interviewType, () => {
              btn.classList.remove("playing");
              if (span) {
                span.textContent = btn.getAttribute("data-interview") === "pescador"
                  ? "Escuchar relato de Don Álvaro"
                  : btn.getAttribute("data-interview") === "luz_mery"
                  ? "Escuchar historia de Doña Luz"
                  : "Escuchar vivencias comunitarias";
              }
              if (wave) wave.classList.remove("playing");
            });
          }

          this.showToast(`🎙️ Reproduciendo testimonio de ${interviewType === 'pescador' ? 'Don Álvaro' : interviewType === 'luz_mery' ? 'Doña Luz Mery' : 'la comunidad'}`);
        }
      });
    });
  }

  // Muro de fotos interactivo y subida de imágenes con FileReader
  initPhotoWall() {
    const btnToggleUpload = document.getElementById("btn-toggle-upload");
    const uploadBox = document.getElementById("upload-memory-box");
    const btnCancelUpload = document.getElementById("btn-cancel-upload");
    const memoryForm = document.getElementById("memory-form");
    const memoryGrid = document.getElementById("memory-grid");

    if (btnToggleUpload && uploadBox) {
      btnToggleUpload.addEventListener("click", (e) => {
        e.preventDefault();
        const isHidden = uploadBox.style.display === "none";
        uploadBox.style.display = isHidden ? "block" : "none";
        btnToggleUpload.textContent = isHidden ? "✕ Cerrar formulario" : "+ Sube tu foto o recuerdo";
      });
    }

    if (btnCancelUpload && uploadBox) {
      btnCancelUpload.addEventListener("click", (e) => {
        e.preventDefault();
        uploadBox.style.display = "none";
        if (btnToggleUpload) btnToggleUpload.textContent = "+ Sube tu foto o recuerdo";
      });
    }

    if (memoryForm && memoryGrid) {
      memoryForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const author = document.getElementById("mem-author").value.trim() || "Amigo/a de la laguna";
        const title = document.getElementById("mem-title").value.trim() || "Recuerdo de Fúquene";
        const desc = document.getElementById("mem-desc").value.trim() || "Un hermoso momento vivido en la ribera.";
        const fileInput = document.getElementById("mem-file");

        const createCard = (imgSrc = null) => {
          const card = document.createElement("div");
          card.className = "memory-card";
          card.innerHTML = `
            ${imgSrc ? `<img src="${imgSrc}" alt="${title}" class="memory-card-img">` : ''}
            <div class="memory-tag" style="background: #2d5547;">Memoria Comunitaria</div>
            <div class="memory-card-body">
              <h4 class="memory-item-title">${title}</h4>
              <p class="memory-item-text">${desc}</p>
              <div class="memory-meta">
                <span>Por ${author}</span>
                <time>Recién publicado</time>
              </div>
            </div>
          `;
          memoryGrid.prepend(card);
          memoryForm.reset();
          if (uploadBox) uploadBox.style.display = "none";
          if (btnToggleUpload) btnToggleUpload.textContent = "+ Sube tu foto o recuerdo";
          this.showToast("📷 ¡Tu recuerdo ha sido agregado al Muro de la Comunidad!");

          if (window.soundEngine) {
            window.soundEngine.playBubblePop(750);
          }
        };

        if (fileInput && fileInput.files && fileInput.files[0]) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            createCard(evt.target.result);
          };
          reader.readAsDataURL(fileInput.files[0]);
        } else {
          createCard(null);
        }
      });
    }
  }

  // Inicializa formularios interactivos de encuesta y sugerencias
  initForms() {
    // Encuesta
    const surveyForm = document.getElementById("survey-form");
    const surveyFeedback = document.getElementById("survey-feedback");
    if (surveyForm) {
      surveyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (surveyFeedback) surveyFeedback.style.display = "block";
        const btn = surveyForm.querySelector('button[type="submit"]');
        if (btn) {
          btn.disabled = true;
          btn.textContent = "✓ ¡Encuesta enviada con éxito!";
        }
        this.showToast("✅ ¡Gracias por responder la encuesta de Guapuchas!");
        if (window.soundEngine) {
          window.soundEngine.playFishSplash(0.3);
        }
      });
    }

    // Formulario "Nos puedes dar una idea plis"
    const ideaForm = document.getElementById("idea-form");
    const ideaFeedback = document.getElementById("idea-feedback");
    if (ideaForm) {
      ideaForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (ideaFeedback) ideaFeedback.style.display = "block";
        ideaForm.reset();
        this.showToast("💌 ¡Recibimos tu idea con cariño! Gracias por aportar.");
        if (window.soundEngine) {
          window.soundEngine.playBubblePop(880);
        }
      });
    }
  }

  // Interacción UI, botones y controles
  initUI() {
    // Desbloqueo de Web Audio al primer toque
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

    // 1. Botones del Lago de Guapuchas
    const btnFeed = document.getElementById("btn-feed");
    const feedLabel = document.getElementById("feed-label");
    if (btnFeed) {
      btnFeed.addEventListener("click", () => {
        if (!this.fishManager) return;
        this.fishManager.isFeedMode = !this.fishManager.isFeedMode;
        btnFeed.classList.toggle("active", this.fishManager.isFeedMode);
        if (this.fishManager.isFeedMode) {
          if (feedLabel) feedLabel.textContent = "🌾 Alimentando (Clic en el agua)";
          this.showToast("🌾 Modo Alimento activo: Haz clic en el estanque para alimentar a las guapuchas");
        } else {
          if (feedLabel) feedLabel.textContent = "🌾 Alimentar Guapuchas";
        }
      });
    }

    const btnAddFish = document.getElementById("btn-add-fish");
    const fishCountEl = document.getElementById("lake-fish-count");
    if (btnAddFish) {
      btnAddFish.addEventListener("click", () => {
        if (!this.fishManager) return;
        this.fishManager.addFish();
        const count = this.fishManager.fishes.length;
        if (fishCountEl) fishCountEl.textContent = count;
        this.showToast(`🐟 ¡Nueva Guapucha añadida al estanque! Total: ${count}`);
        if (window.soundEngine) {
          window.soundEngine.playBubblePop(600);
        }
      });
    }

    const btnAudio = document.getElementById("btn-audio");
    const btnLakeAudio = document.getElementById("btn-lake-audio");
    const audioLabel = document.getElementById("audio-label");
    const handleAudioToggle = () => {
      if (!window.soundEngine) return;
      const isSoundOn = window.soundEngine.toggleMute();
      if (btnAudio) btnAudio.classList.toggle("active", isSoundOn);
      if (btnLakeAudio) btnLakeAudio.classList.toggle("active", isSoundOn);
      if (audioLabel) audioLabel.textContent = isSoundOn ? "Sonido: Activo" : "Sonido: Silenciado";
      this.showToast(isSoundOn ? "🌊 Paisaje sonoro de Fúquene activado" : "🔇 Audio silenciado");
    };

    if (btnAudio) btnAudio.addEventListener("click", handleAudioToggle);
    if (btnLakeAudio) btnLakeAudio.addEventListener("click", handleAudioToggle);

    // 2. Clics sobre los hexágonos informativos de la Red de Saberes
    const nodes = document.querySelectorAll(".hex-node");
    nodes.forEach((node) => {
      node.addEventListener("mouseenter", () => {
        if (window.soundEngine) {
          window.soundEngine.playWaterDrop(0.08, 700 + Math.random() * 200);
        }
        this.highlightConnectedLines(node.id, true);
      });

      node.addEventListener("mouseleave", () => {
        this.highlightConnectedLines(node.id, false);
      });

      node.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = node.getAttribute("data-id");
        this.openModal(id);
      });
    });

    // Modal cerrar
    const modalClose = document.getElementById("modal-close");
    const modal = document.getElementById("content-modal");
    if (modalClose) {
      modalClose.addEventListener("click", () => this.closeModal());
    }
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeModal();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
    });

    // Botón de audio dentro del modal
    const modalAudioBtn = document.getElementById("modal-audio-btn");
    if (modalAudioBtn) {
      modalAudioBtn.addEventListener("click", handleAudioToggle);
    }
  }

  // Dibuja las líneas de conexión entre nodos hexagonales
  drawConnections() {
    if (!this.svgContainer || !this.board) return;
    this.svgContainer.innerHTML = "";

    const boardW = this.board.offsetWidth || 1300;
    const boardH = this.board.offsetHeight || 980;
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
    if (!this.svgContainer) return;
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
    if (typeof NODES_DATA === "undefined") return;
    const data = NODES_DATA[id];
    if (!data) return;

    const badgeEl = document.getElementById("modal-badge");
    const titleEl = document.getElementById("modal-title");
    const subEl = document.getElementById("modal-subtitle");
    const textEl = document.getElementById("modal-text");
    const quoteEl = document.getElementById("modal-quote");
    const statsContainer = document.getElementById("modal-stats");

    if (badgeEl) badgeEl.textContent = data.badge || data.category;
    if (titleEl) titleEl.textContent = data.title;
    if (subEl) subEl.textContent = data.subtitle;
    if (textEl) textEl.innerHTML = data.text;
    if (quoteEl) quoteEl.textContent = data.quote;

    if (statsContainer) {
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
    }

    const modal = document.getElementById("content-modal");
    if (modal) modal.classList.add("open");

    document.querySelectorAll(".hex-node").forEach((n) => n.classList.remove("active-node"));
    const activeEl = document.querySelector(`[data-id="${id}"]`);
    if (activeEl) activeEl.classList.add("active-node");
  }

  closeModal() {
    const modal = document.getElementById("content-modal");
    if (modal) modal.classList.remove("open");
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
    if (this.container && this.camera && this.renderer) {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w && h) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    }
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

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Inicializar la aplicación una vez cargado el DOM
window.addEventListener("DOMContentLoaded", () => {
  window.lagunaApp = new App();
});
