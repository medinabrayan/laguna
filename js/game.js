// game.js - Minijuego interactivo completo "¡Arma tu plato tradicional!" de Doña Luz Mery
class GuapuchaGame {
  constructor() {
    this.selectedCharacter = 'perla';
    this.currentStep = 1;
    this.totalSteps = 5;
    this.isPlaying = false;
    this.donaLuzWinnerViewer = null;

    // Estado interactivo de cada paso
    this.stepState = {
      // Paso 1: Limpieza
      washedFish: [false, false, false],
      // Paso 2: Adobo
      seasoning: { salt: false, garlic: false, onion: false },
      seasoningMixed: false,
      // Paso 3: Enharinado
      floured: false,
      flourExcessShaken: false,
      // Paso 4: Fritura
      fryingActive: false,
      fryProgress: 0,
      fryInterval: null,
      fryQuality: 'perfect', // 'under', 'perfect', 'over'
      // Paso 5: Acompañamientos
      sides: {
        papas: true,
        limon: true,
        platano: false,
        mazorca: false,
        aji: false
      }
    };

    this.characterNames = {
      perla: "Perla la Exploradora",
      alejo: "Alejo el Joven Pescador",
      dona_luz: "Doña Luz Mery"
    };

    this.characterDialogues = {
      perla: {
        step1: "«Muy bien, Perla. Las guapuchas se lavan con agua fría de manantial, una por una, con respeto.»",
        step2: "«El ajo machacado en piedra de río y la sal marina son el secreto de mi madre para despertar el sabor.»",
        step3: "«Solo un velo suave de harina, mijita. Si le pones mucha queda pesada; si le pones la justa, queda como hojuela dorada.»",
        step4: "«¡Atenta al chisporroteo de la paila! Cuando la paila cante y el lomo tome tono oro viejo, se voltea una sola vez.»",
        step5: "«Las papas criollas con su piel dorada y el limón recién cortado son la compañía perfecta de la laguna.»",
        win: "«¡Qué orgullo, Perla! Has cocinado con el alma y con el sazón de nuestros antepasados. Este plato es digno de una fiesta en Fúquene.»"
      },
      alejo: {
        step1: "«Alejo, tú que conoces el agua fría: lávalas despacio, cuidando que queden frescas y firmes.»",
        step2: "«El pescador que sabe comer sabe adobar: cebolla larga bien picada y sal pura del altiplano.»",
        step3: "«Enharinar parejo y sacudir con cariño, Alejo. Ni un grano de más para que la piel quede crocante.»",
        step4: "«¡La leña de aliso está en su punto! Tres minutos parejos y ese pescado queda como galleta crujiente.»",
        step5: "«Sírvelo en el plato hondo de barro con papitas criollas y tajadas. ¡Ese es el verdadero almuerzo campesino!»",
        win: "«¡Extraordinario, Alejo! De la atarraya al fogón, has demostrado que la juventud de Fúquene sabe cuidar y honrar sus tradiciones.»"
      },
      dona_luz: {
        step1: "«El primer secreto de la cocina campesina: el agua limpia y el respeto por el don sagrado de la laguna.»",
        step2: "«En mi fogón no entran químicos ni sazonadores raros: sal marina, ajo campesino y cebolla de la huerta.»",
        step3: "«Un velo sutil de harina de trigo y maíz para proteger los jugos sin tapar la nobleza del pez.»",
        step4: "«En la paila de hierro curada por años, el aceite caliente dora la guapucha como oro bendito.»",
        step5: "«Emplatamos con papas criollas al vapor, tajadas doradas y limón andino en hoja de chisgua.»",
        win: "«¡El fogón de Fúquene sigue más vivo que nunca! Este sabor lleva siglos en nuestra sangre y hoy tú lo has celebrado.»"
      }
    };

    this.initEvents();
  }

  initEvents() {
    // 1. Selector de Personaje
    const charCards = document.querySelectorAll(".character-select-card");
    charCards.forEach((card) => {
      card.addEventListener("click", () => {
        charCards.forEach((c) => {
          c.classList.remove("selected");
          const label = c.querySelector(".select-btn-label");
          if (label) label.textContent = "Seleccionar";
        });
        card.classList.add("selected");
        const activeLabel = card.querySelector(".select-btn-label");
        if (activeLabel) activeLabel.textContent = "Seleccionada";

        this.selectedCharacter = card.getAttribute("data-char") || "perla";
        if (window.soundEngine) {
          window.soundEngine.playWaterDrop(0.2, 700);
        }
      });
    });

    // 2. Botón Iniciar Cocina
    const playBtn = document.getElementById("game-play-btn");
    if (playBtn) {
      playBtn.addEventListener("click", () => this.startGame());
    }

    // 3. Botón Reiniciar
    const restartBtn = document.getElementById("game-restart-btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => this.resetGame());
    }

    // 4. Botón Copiar Receta
    const copyBtn = document.getElementById("game-copy-recipe-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => this.copyRecipeToClipboard());
    }
  }

  startGame() {
    this.isPlaying = true;
    this.currentStep = 1;
    this.resetStepStates();

    const introScreen = document.getElementById("game-intro-screen");
    const kitchenScreen = document.getElementById("game-kitchen-screen");
    const resultScreen = document.getElementById("game-result-screen");

    if (introScreen) introScreen.style.display = "none";
    if (resultScreen) resultScreen.style.display = "none";
    if (kitchenScreen) kitchenScreen.style.display = "block";

    const playerLabel = document.getElementById("game-player-name");
    if (playerLabel) {
      playerLabel.textContent = `Cocinero/a: ${this.characterNames[this.selectedCharacter] || 'Perla'}`;
    }

    this.renderStep();
  }

  resetStepStates() {
    if (this.stepState.fryInterval) {
      clearInterval(this.stepState.fryInterval);
      this.stepState.fryInterval = null;
    }
    this.stepState = {
      washedFish: [false, false, false],
      seasoning: { salt: false, garlic: false, onion: false },
      seasoningMixed: false,
      floured: false,
      flourExcessShaken: false,
      fryingActive: false,
      fryProgress: 0,
      fryInterval: null,
      fryQuality: 'perfect',
      sides: {
        papas: true,
        limon: true,
        platano: false,
        mazorca: false,
        aji: false
      }
    };
  }

  // Renderiza la pantalla según el paso actual
  renderStep() {
    const fillEl = document.getElementById("game-progress-fill");
    if (fillEl) {
      const pct = (this.currentStep / this.totalSteps) * 100;
      fillEl.style.width = `${pct}%`;
    }

    const dialogues = this.characterDialogues[this.selectedCharacter] || this.characterDialogues.perla;
    const dialogEl = document.getElementById("game-luz-dialog");
    const dialogKey = `step${this.currentStep}`;
    if (dialogEl && dialogues[dialogKey]) {
      dialogEl.textContent = dialogues[dialogKey];
    }

    const workspace = document.getElementById("kitchen-interactive-workspace");
    if (!workspace) return;

    if (this.currentStep === 1) {
      this.renderStep1(workspace);
    } else if (this.currentStep === 2) {
      this.renderStep2(workspace);
    } else if (this.currentStep === 3) {
      this.renderStep3(workspace);
    } else if (this.currentStep === 4) {
      this.renderStep4(workspace);
    } else if (this.currentStep === 5) {
      this.renderStep5(workspace);
    }
  }

  // ==========================================
  // PASO 1: LAVADO EN AGUA FRESCA Y SALMUERA
  // ==========================================
  renderStep1(container) {
    container.innerHTML = `
      <div class="step-activity-box">
        <div class="activity-header">
          <span class="step-badge-round">Paso 1 de 5</span>
          <h4 class="activity-title">Lavado y salmuera suave</h4>
          <p class="activity-instruction">Toca cada una de las 3 guapuchas en el cuenco para lavarlas con agua fría de manantial y unas gotas de limón.</p>
        </div>

        <div class="fish-wash-bowl">
          <div class="bowl-water-surface">
            <span class="water-ripple-deco">💧 Manantial Frío</span>
            <div class="fish-items-row">
              ${[0, 1, 2].map((idx) => `
                <button type="button" class="fish-wash-btn ${this.stepState.washedFish[idx] ? 'washed' : ''}" data-fish="${idx}" title="Lavar guapucha">
                  <span class="fish-icon">${this.stepState.washedFish[idx] ? '✨🐟' : '🐟'}</span>
                  <span class="fish-state-label">${this.stepState.washedFish[idx] ? '¡Limpia!' : 'Tocar para lavar'}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="activity-footer">
          <div class="counter-label">
            Guapuchas limpias: <strong id="washed-counter">${this.stepState.washedFish.filter(Boolean).length} / 3</strong>
          </div>
          <button id="btn-next-step1" class="btn-cooking-action" ${this.stepState.washedFish.every(Boolean) ? '' : 'disabled'}>
            ¡Secar y pasar al adobo! &rarr;
          </button>
        </div>
      </div>
    `;

    // Eventos de lavado de cada pez
    const fishBtns = container.querySelectorAll(".fish-wash-btn");
    fishBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-fish"), 10);
        if (this.stepState.washedFish[idx]) return;

        this.stepState.washedFish[idx] = true;
        btn.classList.add("washed");
        btn.querySelector(".fish-icon").textContent = "✨🐟";
        btn.querySelector(".fish-state-label").textContent = "¡Limpia!";

        const count = this.stepState.washedFish.filter(Boolean).length;
        const counterEl = document.getElementById("washed-counter");
        if (counterEl) counterEl.textContent = `${count} / 3`;

        if (window.soundEngine) {
          window.soundEngine.playWaterDrop(0.28, 520 + count * 100);
          window.soundEngine.playBubblePop(800 + count * 80);
        }

        if (this.stepState.washedFish.every(Boolean)) {
          const nextBtn = document.getElementById("btn-next-step1");
          if (nextBtn) {
            nextBtn.removeAttribute("disabled");
            nextBtn.classList.add("pulse-btn");
          }
          if (window.soundEngine) {
            window.soundEngine.playSuccessChime();
          }
        }
      });
    });

    const nextBtn = document.getElementById("btn-next-step1");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.currentStep = 2;
        this.renderStep();
      });
    }
  }

  // ==========================================
  // PASO 2: EL ADOBO CAMPESINO
  // ==========================================
  renderStep2(container) {
    const s = this.stepState.seasoning;
    const allAdded = s.salt && s.garlic && s.onion;

    container.innerHTML = `
      <div class="step-activity-box">
        <div class="activity-header">
          <span class="step-badge-round">Paso 2 de 5</span>
          <h4 class="activity-title">El adobo tradicional campesino</h4>
          <p class="activity-instruction">Agrega los tres condimentos autóctonos a la batea de madera y luego revuelve con la cuchara de palo de aliso.</p>
        </div>

        <div class="seasoning-tray-area">
          <div class="seasoning-wooden-batea">
            <div class="batea-fish-display">
              <span class="batea-fish-art">🐟 🐟 🐟</span>
              <div class="seasoning-tags-list">
                ${s.salt ? '<span class="seasoning-pill">🧂 Sal marina</span>' : ''}
                ${s.garlic ? '<span class="seasoning-pill">🧄 Ajo machacado</span>' : ''}
                ${s.onion ? '<span class="seasoning-pill">🧅 Cebolla larga</span>' : ''}
                ${!s.salt && !s.garlic && !s.onion ? '<span class="seasoning-hint">Esperando condimentos...</span>' : ''}
              </div>
            </div>
          </div>

          <div class="seasoning-ingredients-picker">
            <button type="button" class="ingredient-pick-btn ${s.salt ? 'added' : ''}" data-ing="salt">
              <span class="pick-emoji">🧂</span>
              <span class="pick-name">Sal marina pura</span>
              <span class="pick-status">${s.salt ? '✓ Agregada' : '+ Agregar'}</span>
            </button>

            <button type="button" class="ingredient-pick-btn ${s.garlic ? 'added' : ''}" data-ing="garlic">
              <span class="pick-emoji">🧄</span>
              <span class="pick-name">Ajo machacado</span>
              <span class="pick-status">${s.garlic ? '✓ Agregado' : '+ Agregar'}</span>
            </button>

            <button type="button" class="ingredient-pick-btn ${s.onion ? 'added' : ''}" data-ing="onion">
              <span class="pick-emoji">🧅</span>
              <span class="pick-name">Cebolla larga</span>
              <span class="pick-status">${s.onion ? '✓ Agregada' : '+ Agregar'}</span>
            </button>
          </div>
        </div>

        <div class="activity-footer">
          <button id="btn-mix-seasoning" class="btn-cooking-action" ${allAdded ? '' : 'disabled'}>
            ${this.stepState.seasoningMixed ? '¡Adobo perfumado! Pasar al enharinado &rarr;' : '🥣 Mezclar con cuchara de palo'}
          </button>
        </div>
      </div>
    `;

    // Eventos de selección de ingredientes
    const ingBtns = container.querySelectorAll(".ingredient-pick-btn");
    ingBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-ing");
        if (this.stepState.seasoning[key]) return;

        this.stepState.seasoning[key] = true;
        if (window.soundEngine) {
          window.soundEngine.playWaterDrop(0.25, 600 + Math.random() * 200);
        }
        this.renderStep2(container);
      });
    });

    const mixBtn = document.getElementById("btn-mix-seasoning");
    if (mixBtn) {
      mixBtn.addEventListener("click", () => {
        if (!this.stepState.seasoningMixed) {
          this.stepState.seasoningMixed = true;
          mixBtn.textContent = "¡Adobo perfecto! Pasar al enharinado →";
          if (window.soundEngine) {
            window.soundEngine.playSuccessChime();
          }
          setTimeout(() => {
            this.currentStep = 3;
            this.renderStep();
          }, 350);
        } else {
          this.currentStep = 3;
          this.renderStep();
        }
      });
    }
  }

  // ==========================================
  // PASO 3: EL ENHARINADO CROCANTE
  // ==========================================
  renderStep3(container) {
    const isFloured = this.stepState.floured;
    const isShaken = this.stepState.flourExcessShaken;

    container.innerHTML = `
      <div class="step-activity-box">
        <div class="activity-header">
          <span class="step-badge-round">Paso 3 de 5</span>
          <h4 class="activity-title">El enharinado ligero de Fúquene</h4>
          <p class="activity-instruction">Pasa las guapuchas por la harina fina de trigo y sacude el exceso para que al freír queden crocantes como hojuelas.</p>
        </div>

        <div class="flour-board-area">
          <div class="flour-dish ${isFloured ? 'coated' : ''} ${isShaken ? 'perfect-crust' : ''}">
            <div class="flour-fish-visual">
              <span class="flour-fish-icon">${isShaken ? '✨🐟🌾🐟✨' : isFloured ? '🌾🐟🌾' : '🐟 🐟 🐟'}</span>
              <span class="flour-status-text">
                ${isShaken
                  ? '¡Crocancia asegurada! Capa ligera y uniforme'
                  : isFloured
                  ? '¡Enharinadas! Ahora sacude el exceso'
                  : 'Bandeja con harina fina lista'}
              </span>
            </div>
          </div>

          <div class="flour-actions-row">
            <button type="button" id="btn-flour-fish" class="btn-cooking-action" ${isFloured ? 'disabled' : ''}>
              🌾 Enharinar ligeramente
            </button>
            <button type="button" id="btn-shake-flour" class="btn-cooking-action" ${isFloured && !isShaken ? '' : 'disabled'}>
              ✨ Sacudir exceso de harina
            </button>
          </div>
        </div>

        <div class="activity-footer">
          <button id="btn-next-step3" class="btn-cooking-action" ${isShaken ? '' : 'disabled'}>
            ¡Listas para la paila caliente! &rarr;
          </button>
        </div>
      </div>
    `;

    const flourBtn = document.getElementById("btn-flour-fish");
    const shakeBtn = document.getElementById("btn-shake-flour");
    const nextBtn = document.getElementById("btn-next-step3");

    if (flourBtn) {
      flourBtn.addEventListener("click", () => {
        this.stepState.floured = true;
        if (window.soundEngine) {
          window.soundEngine.playWaterDrop(0.2, 580);
        }
        this.renderStep3(container);
      });
    }

    if (shakeBtn) {
      shakeBtn.addEventListener("click", () => {
        this.stepState.flourExcessShaken = true;
        if (window.soundEngine) {
          window.soundEngine.playSuccessChime();
        }
        this.renderStep3(container);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.currentStep = 4;
        this.renderStep();
      });
    }
  }

  // ==========================================
  // PASO 4: FRITURA EN PAILA DE HIERRO
  // ==========================================
  renderStep4(container) {
    const isFrying = this.stepState.fryingActive;
    const progress = this.stepState.fryProgress;

    let heatLabel = "Paila caliente lista en el fogón de leña";
    let panFishState = "🐟 🐟 🐟";
    if (isFrying) {
      if (progress < 40) {
        heatLabel = "Fritura inicial: El aceite chisporrotea alegremente...";
        panFishState = "🫧 🐟 🫧 🐟 🫧";
      } else if (progress <= 85) {
        heatLabel = "🔥 ¡DORADO PERFECTO! Retira ahora para la crocancia exacta";
        panFishState = "✨ 🐟🥇🐟🥇🐟 ✨";
      } else {
        heatLabel = "⚠️ ¡Fuego muy alto! Retira pronto para no quemarlas";
        panFishState = "🔥 🐟 🐟 🔥";
      }
    } else if (progress > 0) {
      heatLabel = "¡Fritura completada! Guapuchas tostadas y doradas";
      panFishState = "✨ 🐟🥇🐟🥇🐟 ✨";
    }

    container.innerHTML = `
      <div class="step-activity-box">
        <div class="activity-header">
          <span class="step-badge-round">Paso 4 de 5</span>
          <h4 class="activity-title">Fritura en paila de hierro con leña caliente</h4>
          <p class="activity-instruction">Sumerge las guapuchas en el aceite bien caliente. Presta atención al chisporroteo y retíralas cuando alcancen la zona de dorado óptimo.</p>
        </div>

        <div class="frying-pan-station">
          <div class="cast-iron-pan ${isFrying ? 'sizzling' : ''}">
            <div class="pan-oil-bubble">
              <span class="pan-fire-deco">🪵 Leña de aliso viva</span>
              <div class="pan-fish-bubble-row">
                <span class="pan-fish-art">${panFishState}</span>
              </div>
              <div class="pan-oil-sparks">${isFrying ? '✨ ✨ ✨' : ''}</div>
            </div>
          </div>

          <div class="fry-temperature-gauge">
            <div class="gauge-labels">
              <span>Crudo</span>
              <strong class="optimal-target">🎯 Zona Dorada Ideal</strong>
              <span>Muy Tostado</span>
            </div>
            <div class="gauge-track">
              <div class="gauge-fill" style="width: ${progress}%;"></div>
              <div class="gauge-target-zone"></div>
            </div>
            <span class="gauge-status-desc">${heatLabel}</span>
          </div>

          <div class="fry-action-buttons">
            <button type="button" id="btn-start-fry" class="btn-cooking-action" ${isFrying || progress > 0 ? 'disabled' : ''}>
              🔥 Sumergir en la paila caliente
            </button>
            <button type="button" id="btn-pull-fry" class="btn-cooking-action" ${isFrying ? '' : 'disabled'}>
              ✨ ¡Voltear y retirar crujientes!
            </button>
          </div>
        </div>

        <div class="activity-footer">
          <button id="btn-next-step4" class="btn-cooking-action" ${!isFrying && progress > 0 ? '' : 'disabled'}>
            ¡Pasar al emplatado tradicional! &rarr;
          </button>
        </div>
      </div>
    `;

    const startBtn = document.getElementById("btn-start-fry");
    const pullBtn = document.getElementById("btn-pull-fry");
    const nextBtn = document.getElementById("btn-next-step4");

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        this.stepState.fryingActive = true;
        this.stepState.fryProgress = 10;

        if (window.soundEngine) {
          window.soundEngine.playSizzle(6.0);
        }

        // Bucle de cocción interactivo
        this.stepState.fryInterval = setInterval(() => {
          this.stepState.fryProgress += 5;
          if (this.stepState.fryProgress >= 100) {
            this.stepState.fryProgress = 100;
            this.finishFrying(false);
          } else {
            this.renderStep4(container);
          }
        }, 320);

        this.renderStep4(container);
      });
    }

    if (pullBtn) {
      pullBtn.addEventListener("click", () => {
        this.finishFrying(true);
        this.renderStep4(container);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.currentStep = 5;
        this.renderStep();
      });
    }
  }

  finishFrying(manualPull) {
    if (this.stepState.fryInterval) {
      clearInterval(this.stepState.fryInterval);
      this.stepState.fryInterval = null;
    }
    this.stepState.fryingActive = false;

    const p = this.stepState.fryProgress;
    if (p >= 40 && p <= 85) {
      this.stepState.fryQuality = 'perfect';
      if (window.soundEngine) {
        window.soundEngine.playSuccessChime();
      }
    } else {
      this.stepState.fryQuality = p < 40 ? 'under' : 'over';
      if (window.soundEngine) {
        window.soundEngine.playWaterDrop(0.3, 400);
      }
    }
  }

  // ==========================================
  // PASO 5: EMPLATADO Y ACOMPAÑAMIENTOS
  // ==========================================
  renderStep5(container) {
    const s = this.stepState.sides;

    container.innerHTML = `
      <div class="step-activity-box">
        <div class="activity-header">
          <span class="step-badge-round">Paso 5 de 5</span>
          <h4 class="activity-title">Emplatado campesino y acompañamientos</h4>
          <p class="activity-instruction">Selecciona los acompañamientos tradicionales para completar tu plato en vajilla de barro o canastillo.</p>
        </div>

        <div class="plating-workspace">
          <!-- Plato visual interactivo -->
          <div class="clay-plate-display">
            <div class="plate-inner-rim">
              <div class="plate-center-fish">
                <span class="fried-fish-trio">✨🐟🥇🐟🥇🐟✨</span>
              </div>
              <div class="plate-sides-arranged">
                ${s.papas ? '<span class="arranged-item">🥔 Papitas criollas</span>' : ''}
                ${s.limon ? '<span class="arranged-item">🍋 Rodajas de limón</span>' : ''}
                ${s.platano ? '<span class="arranged-item">🍌 Tajadas maduras</span>' : ''}
                ${s.mazorca ? '<span class="arranged-item">🌽 Mazorca tierna</span>' : ''}
                ${s.aji ? '<span class="arranged-item">🌶️ Ají campesino</span>' : ''}
              </div>
            </div>
          </div>

          <!-- Selector de Guarniciones -->
          <div class="sides-selector-grid">
            <button type="button" class="side-toggle-btn ${s.papas ? 'active' : ''}" data-side="papas">
              <span class="side-icon">🥔</span>
              <span class="side-name">Papas criollas doradas</span>
              <span class="side-tag">${s.papas ? '✓ En el plato' : '+ Agregar'}</span>
            </button>

            <button type="button" class="side-toggle-btn ${s.limon ? 'active' : ''}" data-side="limon">
              <span class="side-icon">🍋</span>
              <span class="side-name">Rodajas de limón fresco</span>
              <span class="side-tag">${s.limon ? '✓ En el plato' : '+ Agregar'}</span>
            </button>

            <button type="button" class="side-toggle-btn ${s.platano ? 'active' : ''}" data-side="platano">
              <span class="side-icon">🍌</span>
              <span class="side-name">Tajadas de plátano frito</span>
              <span class="side-tag">${s.platano ? '✓ En el plato' : '+ Agregar'}</span>
            </button>

            <button type="button" class="side-toggle-btn ${s.mazorca ? 'active' : ''}" data-side="mazorca">
              <span class="side-icon">🌽</span>
              <span class="side-name">Mazorca tierna desgranada</span>
              <span class="side-tag">${s.mazorca ? '✓ En el plato' : '+ Agregar'}</span>
            </button>

            <button type="button" class="side-toggle-btn ${s.aji ? 'active' : ''}" data-side="aji">
              <span class="side-icon">🌶️</span>
              <span class="side-name">Ají casero de la sabana</span>
              <span class="side-tag">${s.aji ? '✓ En el plato' : '+ Agregar'}</span>
            </button>
          </div>
        </div>

        <div class="activity-footer">
          <button id="btn-finish-dish" class="btn-primary">
            🍽️ ¡Servir plato tradicional a Doña Luz!
          </button>
        </div>
      </div>
    `;

    const sideBtns = container.querySelectorAll(".side-toggle-btn");
    sideBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const sideKey = btn.getAttribute("data-side");
        this.stepState.sides[sideKey] = !this.stepState.sides[sideKey];

        if (window.soundEngine) {
          window.soundEngine.playWaterDrop(0.2, 700 + Math.random() * 200);
        }
        this.renderStep5(container);
      });
    });

    const finishBtn = document.getElementById("btn-finish-dish");
    if (finishBtn) {
      finishBtn.addEventListener("click", () => {
        this.completeGame();
      });
    }
  }

  // ==========================================
  // PANTALLA DE VICTORIA Y DEGUSTACIÓN
  // ==========================================
  completeGame() {
    const kitchenScreen = document.getElementById("game-kitchen-screen");
    const resultScreen = document.getElementById("game-result-screen");

    if (kitchenScreen) kitchenScreen.style.display = "none";
    if (resultScreen) resultScreen.style.display = "block";

    // Sonido de victoria y aplauso campesino
    if (window.soundEngine) {
      window.soundEngine.playSuccessChime();
      setTimeout(() => window.soundEngine.playFishSplash(0.4), 250);
    }

    // Instanciar visor 3D de Doña Luz felicitando
    if (!this.donaLuzWinnerViewer && document.getElementById("dona-luz-winner-3d") && window.Character3DViewer) {
      this.donaLuzWinnerViewer = new Character3DViewer("dona-luz-winner-3d", "dona_luz");
    }

    // Mostrar acompañamientos elegidos en el plato de victoria
    const sidesArr = [];
    if (this.stepState.sides.papas) sidesArr.push("🥔");
    if (this.stepState.sides.limon) sidesArr.push("🍋");
    if (this.stepState.sides.platano) sidesArr.push("🍌");
    if (this.stepState.sides.mazorca) sidesArr.push("🌽");
    if (this.stepState.sides.aji) sidesArr.push("🌶️");

    const dishVisual = document.getElementById("victory-dish-emojis");
    if (dishVisual) {
      dishVisual.textContent = `🐟 ${sidesArr.join(' ')} 🐟`;
    }

    // Mensaje de Doña Luz según personaje
    const dialogues = this.characterDialogues[this.selectedCharacter] || this.characterDialogues.perla;
    const reviewEl = document.getElementById("victory-luz-review");
    if (reviewEl && dialogues.win) {
      reviewEl.textContent = dialogues.win;
    }
  }

  copyRecipeToClipboard() {
    const recipeText = `RECETA TRADICIONAL DE GUAPUCHAS FRITAS - LAGUNA DE FÚQUENE
(Custodiada por Doña Luz Mery)

INGREDIENTES:
• Guapuchas frescas de Fúquene (Grundulus bogotensis)
• Sal marina pura y ajo machacado en piedra de río
• Cebolla larga fresca picadita
• Harina de trigo fina y fécula de maíz
• Manteca tradicional o aceite vegetal para fritura
• Papas criollas doradas cocidas y rodajas de limón fresco

PREPARACIÓN:
1. Lavado y salmuera: Lavar cuidadosamente las guapuchas con agua fría de manantial y unas gotas de limón.
2. Adobo campesino: Mezclar sal marina, ajo machacado y cebolla larga con cuchara de palo de aliso.
3. Enharinado ligero: Pasar por una película fina de harina sacudiendo el exceso.
4. Fritura en paila de hierro: Dorar en aceite bien caliente durante 3-4 minutos hasta que tomen tono oro viejo. Voltear una sola vez cuando la paila avise con su crujido.
5. Emplatado: Servir en plato de barro acompañadas de papas criollas y limón.

¡Buen provecho con el sabor vivo de la Laguna de Fúquene!`;

    navigator.clipboard.writeText(recipeText).then(() => {
      if (window.lagunaApp && window.lagunaApp.showToast) {
        window.lagunaApp.showToast("📋 ¡Receta tradicional copiada al portapapeles!");
      }
      if (window.soundEngine) {
        window.soundEngine.playBubblePop(850);
      }
    }).catch(() => {
      alert("Receta copiada en la memoria viva de Fúquene.");
    });
  }

  resetGame() {
    this.currentStep = 1;
    this.resetStepStates();

    const introScreen = document.getElementById("game-intro-screen");
    const kitchenScreen = document.getElementById("game-kitchen-screen");
    const resultScreen = document.getElementById("game-result-screen");

    if (introScreen) introScreen.style.display = "block";
    if (kitchenScreen) kitchenScreen.style.display = "none";
    if (resultScreen) resultScreen.style.display = "none";
  }
}

window.GuapuchaGame = GuapuchaGame;
