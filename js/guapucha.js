// guapucha.js - Modelo 3D procedimental, física de nado ondulatorio y cardumen interactivo
class FishManager {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.fishes = [];
    this.foods = [];
    this.bubbles = [];
    this.mouseWorld = new THREE.Vector3(0, 0, 0);
    this.isFeedMode = false;
    this.selectedFish = null;

    // Límites del acuario en coordenadas del mundo 3D
    this.bounds = {
      x: 38,
      y: 26,
      zMin: -15,
      zMax: 15
    };

    this.createFishMaterials();
    this.createBubbleSystem();
  }

  createFishMaterials() {
    // Textura procedimental para la piel de la Guapucha (tonos oliva, plateado y franja lateral)
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    // Fondo degradado del cuerpo: lomo oliva oscuro -> flanco plateado iridiscente -> vientre blanco
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, "#3e5c4e"); // Lomo verde oliva oscuro
    grad.addColorStop(0.25, "#688c7b");
    grad.addColorStop(0.48, "#2d3e35"); // Franja lateral oscura distintiva
    grad.addColorStop(0.55, "#a6c5b8"); // Flanco plateado verdoso
    grad.addColorStop(0.75, "#d6e5df"); // Plata nacarado
    grad.addColorStop(1.0, "#f4f8f6"); // Vientre blanco perla
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Escamas sutiles y manchas tenues
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * 512;
      const ry = 80 + Math.random() * 140;
      ctx.beginPath();
      ctx.arc(rx, ry, 1.5 + Math.random() * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const fishTexture = new THREE.CanvasTexture(canvas);

    // Material del cuerpo con brillo especular nacarado
    this.bodyMaterial = new THREE.MeshStandardMaterial({
      map: fishTexture,
      roughness: 0.3,
      metalness: 0.4,
      bumpScale: 0.05
    });

    // Material para aletas traslúcidas
    this.finMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8ded4,
      transparent: true,
      opacity: 0.72,
      roughness: 0.25,
      metalness: 0.15,
      side: THREE.DoubleSide
    });

    // Ojo: iris dorado y pupila negra
    this.eyeIrisMat = new THREE.MeshStandardMaterial({
      color: 0xdfbe64,
      roughness: 0.15,
      metalness: 0.7
    });

    this.eyePupilMat = new THREE.MeshBasicMaterial({
      color: 0x050807
    });
  }

  // Genera la geometría 3D completa y articulada de una Guapucha
  createGuapuchaMesh(scale = 1.0) {
    const root = new THREE.Group();
    root.scale.set(scale, scale, scale);

    // 1. Cabeza y Tronco frontal (Cuerpo principal)
    // Usamos una geometría estilizada fusiforme
    const headGeom = new THREE.CylinderGeometry(0.35, 0.7, 1.6, 12);
    headGeom.rotateZ(Math.PI / 2);
    headGeom.scale(1.0, 1.3, 0.75); // Comprimir lateralmente
    const headMesh = new THREE.Mesh(headGeom, this.bodyMaterial);
    headMesh.castShadow = true;
    root.add(headMesh);

    // Hocico puntiagudo (Cono frontal)
    const snoutGeom = new THREE.ConeGeometry(0.42, 0.8, 12);
    snoutGeom.rotateZ(-Math.PI / 2);
    snoutGeom.scale(1.0, 1.2, 0.7);
    const snoutMesh = new THREE.Mesh(snoutGeom, this.bodyMaterial);
    snoutMesh.position.x = 1.15;
    root.add(snoutMesh);

    // Ojos laterales (derecho e izquierdo)
    const eyeRadius = 0.13;
    const irisGeom = new THREE.SphereGeometry(eyeRadius, 10, 10);
    const pupilGeom = new THREE.SphereGeometry(eyeRadius * 0.65, 8, 8);

    [-1, 1].forEach((side) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(0.9, 0.15, side * 0.38);

      const iris = new THREE.Mesh(irisGeom, this.eyeIrisMat);
      const pupil = new THREE.Mesh(pupilGeom, this.eyePupilMat);
      pupil.position.z = side * 0.05;

      eyeGroup.add(iris);
      eyeGroup.add(pupil);
      root.add(eyeGroup);
    });

    // Aleta dorsal superior (fija al torso)
    const dorsalGeom = new THREE.BufferGeometry();
    const dorsalVerts = new Float32Array([
      -0.4, 0.7, 0.0,
      -0.1, 1.35, 0.0,
      0.3, 0.65, 0.0
    ]);
    dorsalGeom.setAttribute("position", new THREE.BufferAttribute(dorsalVerts, 3));
    dorsalGeom.computeVertexNormals();
    const dorsalMesh = new THREE.Mesh(dorsalGeom, this.finMaterial);
    root.add(dorsalMesh);

    // Aletas pectorales (articuladas)
    const pectoralGeom = new THREE.BufferGeometry();
    const pectVerts = new Float32Array([
      0.0, 0.0, 0.0,
      -0.7, -0.35, 0.3,
      -0.6, -0.1, 0.25
    ]);
    pectoralGeom.setAttribute("position", new THREE.BufferAttribute(pectVerts, 3));
    pectoralGeom.computeVertexNormals();

    const leftPectoral = new THREE.Mesh(pectoralGeom, this.finMaterial);
    leftPectoral.position.set(0.4, -0.25, 0.4);
    root.add(leftPectoral);

    const rightPectoral = leftPectoral.clone();
    rightPectoral.position.set(0.4, -0.25, -0.4);
    rightPectoral.scale.set(1, 1, -1);
    root.add(rightPectoral);

    // 2. Articulación del Abdomen (Segmento medio)
    const midJoint = new THREE.Group();
    midJoint.position.set(-0.75, 0, 0);
    root.add(midJoint);

    const midGeom = new THREE.CylinderGeometry(0.7, 0.45, 1.4, 10);
    midGeom.rotateZ(Math.PI / 2);
    midGeom.scale(1.0, 1.25, 0.65);
    const midMesh = new THREE.Mesh(midGeom, this.bodyMaterial);
    midMesh.position.x = -0.7;
    midMesh.castShadow = true;
    midJoint.add(midMesh);

    // Aleta ventral y anal
    const analGeom = new THREE.BufferGeometry();
    const analVerts = new Float32Array([
      -0.2, -0.55, 0.0,
      -0.9, -1.0, 0.0,
      -0.6, -0.45, 0.0
    ]);
    analGeom.setAttribute("position", new THREE.BufferAttribute(analVerts, 3));
    analGeom.computeVertexNormals();
    const analMesh = new THREE.Mesh(analGeom, this.finMaterial);
    midMesh.add(analMesh);

    // 3. Articulación del Pedúnculo Caudal (Cola previa)
    const tailJoint = new THREE.Group();
    tailJoint.position.set(-1.4, 0, 0);
    midJoint.add(tailJoint);

    const tailPedGeom = new THREE.CylinderGeometry(0.45, 0.22, 1.1, 10);
    tailPedGeom.rotateZ(Math.PI / 2);
    tailPedGeom.scale(1.0, 1.1, 0.45);
    const tailPedMesh = new THREE.Mesh(tailPedGeom, this.bodyMaterial);
    tailPedMesh.position.x = -0.55;
    tailPedMesh.castShadow = true;
    tailJoint.add(tailPedMesh);

    // 4. Aleta Caudal (Cola bifurcada de Guapucha)
    const finJoint = new THREE.Group();
    finJoint.position.set(-1.05, 0, 0);
    tailJoint.add(finJoint);

    const caudalGeom = new THREE.BufferGeometry();
    const caudalVerts = new Float32Array([
      0.0, 0.0, 0.0,
      -1.2, 0.95, 0.0,
      -0.85, 0.0, 0.0,
      0.0, 0.0, 0.0,
      -0.85, 0.0, 0.0,
      -1.2, -0.95, 0.0
    ]);
    caudalGeom.setAttribute("position", new THREE.BufferAttribute(caudalVerts, 3));
    caudalGeom.computeVertexNormals();
    const caudalMesh = new THREE.Mesh(caudalGeom, this.finMaterial);
    finJoint.add(caudalMesh);

    return {
      root,
      midJoint,
      tailJoint,
      finJoint,
      leftPectoral,
      rightPectoral
    };
  }

  // Inicializa el cardumen de Guapuchas
  initSchool(count = 14) {
    for (let i = 0; i < count; i++) {
      this.addFish();
    }
  }

  addFish(customPos = null) {
    const scale = 1.15 + Math.random() * 0.45;
    const meshData = this.createGuapuchaMesh(scale);

    const fish = {
      meshData,
      root: meshData.root,
      pos: customPos
        ? customPos.clone()
        : new THREE.Vector3(
            (Math.random() - 0.5) * this.bounds.x * 1.3,
            (Math.random() - 0.5) * this.bounds.y * 1.1,
            (Math.random() - 0.5) * 6 - 1
          ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.05
      ),
      acc: new THREE.Vector3(0, 0, 0),
      maxSpeed: 0.18 + Math.random() * 0.1,
      maxForce: 0.012,
      swimPhase: Math.random() * Math.PI * 2,
      swimSpeed: 7 + Math.random() * 4,
      swimAmp: 0.28,
      burstTimer: 0,
      personality: Math.random(),
      depthPreference: (Math.random() - 0.5) * 12,
      hunger: Math.random()
    };

    fish.root.position.copy(fish.pos);
    this.scene.add(fish.root);
    this.fishes.push(fish);
    return fish;
  }

  // Sistema de partículas para burbujas interactivas
  createBubbleSystem() {
    const bubbleCount = 120;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(bubbleCount * 3);
    const scales = new Float32Array(bubbleCount);
    const velocities = [];

    for (let i = 0; i < bubbleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = -25 + Math.random() * 50;
      positions[i * 3 + 2] = -15 + Math.random() * 30;
      scales[i] = 0.15 + Math.random() * 0.4;
      velocities.push({
        y: 0.04 + Math.random() * 0.06,
        xWave: Math.random() * Math.PI * 2,
        speedX: 0.02 + Math.random() * 0.03
      });
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // Canvas circular suave para burbujas acuáticas
    const bubbleCanvas = document.createElement("canvas");
    bubbleCanvas.width = 64;
    bubbleCanvas.height = 64;
    const bCtx = bubbleCanvas.getContext("2d");
    const radGrad = bCtx.createRadialGradient(28, 28, 2, 32, 32, 30);
    radGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.95)");
    radGrad.addColorStop(0.4, "rgba(210, 245, 255, 0.6)");
    radGrad.addColorStop(0.85, "rgba(180, 230, 245, 0.35)");
    radGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
    bCtx.fillStyle = radGrad;
    bCtx.beginPath();
    bCtx.arc(32, 32, 30, 0, Math.PI * 2);
    bCtx.fill();

    const bubbleTexture = new THREE.CanvasTexture(bubbleCanvas);

    const mat = new THREE.PointsMaterial({
      size: 1.2,
      map: bubbleTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.bubbleParticles = new THREE.Points(geom, mat);
    this.bubbleVelocities = velocities;
    this.scene.add(this.bubbleParticles);
  }

  // Genera una ráfaga de burbujas en una posición (al asustar o mover un pez)
  emitBurstBubbles(pos, count = 8) {
    if (!this.bubbleParticles) return;
    const positions = this.bubbleParticles.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * (positions.length / 3));
      positions[idx * 3] = pos.x + (Math.random() - 0.5) * 1.5;
      positions[idx * 3 + 1] = pos.y + (Math.random() - 0.5) * 1.5;
      positions[idx * 3 + 2] = pos.z + (Math.random() - 0.5) * 1.5;
    }
    this.bubbleParticles.geometry.attributes.position.needsUpdate = true;
  }

  // Dejar caer alimento para peces
  dropFood(x, y) {
    const foodGeom = new THREE.DodecahedronGeometry(0.22, 1);
    const foodMat = new THREE.MeshStandardMaterial({
      color: 0x9b5d2b,
      roughness: 0.7,
      metalness: 0.1
    });

    for (let i = 0; i < 4; i++) {
      const food = new THREE.Mesh(foodGeom, foodMat);
      food.position.set(
        x + (Math.random() - 0.5) * 2,
        y + (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 6
      );
      this.scene.add(food);
      this.foods.push({
        mesh: food,
        velY: -0.04 - Math.random() * 0.03,
        rotSpeed: 0.03 + Math.random() * 0.05,
        life: 450
      });
    }

    if (window.soundEngine) {
      window.soundEngine.playBubblePop(780);
    }
  }

  // Interacción al mover o hacer clic con el mouse
  handlePointer(worldPos, isClick = false) {
    this.mouseWorld.copy(worldPos);

    if (isClick && this.isFeedMode) {
      this.dropFood(worldPos.x, worldPos.y);
      return;
    }

    // Si es clic normal o el puntero pasa cerca, asustar a los peces cercanos
    const scareRadius = isClick ? 14 : 7.5;
    let anyScared = false;

    this.fishes.forEach((fish) => {
      const dist = fish.pos.distanceTo(worldPos);
      if (dist < scareRadius) {
        anyScared = true;
        // Vector de escape rápido
        const escapeDir = new THREE.Vector3().subVectors(fish.pos, worldPos).normalize();
        escapeDir.z += (Math.random() - 0.5) * 0.5;
        escapeDir.normalize();

        const force = (1 - dist / scareRadius) * (isClick ? 0.35 : 0.18);
        fish.vel.addScaledVector(escapeDir, force);
        fish.burstTimer = 45; // Modo ráfaga rápida
        fish.swimSpeed = 22; // Aleteo frenético

        this.emitBurstBubbles(fish.pos, 3);
      }
    });

    if (anyScared && window.soundEngine && isClick) {
      window.soundEngine.playFishSplash(0.35);
    }
  }

  // Verifica si el usuario hizo clic directamente sobre una Guapucha 3D
  checkFishClick(raycaster) {
    const roots = this.fishes.map(f => f.root);
    const intersects = raycaster.intersectObjects(roots, true);

    if (intersects.length > 0) {
      // Encontrar el pez correspondiente al objeto impactado
      let hitObj = intersects[0].object;
      while (hitObj.parent && !roots.includes(hitObj)) {
        hitObj = hitObj.parent;
      }
      const fish = this.fishes.find(f => f.root === hitObj);
      if (fish) {
        // Giro acrobático y ráfaga de burbujas
        fish.burstTimer = 60;
        fish.swimSpeed = 26;
        fish.swimAmp = 0.45;
        this.emitBurstBubbles(fish.pos, 10);
        if (window.soundEngine) {
          window.soundEngine.playFishSplash(0.5);
        }
        return fish;
      }
    }
    return null;
  }

  // Reglas de cardumen Boids: Separación, Alineación y Cohesión
  applyFlocking(fish) {
    const sepDist = 3.2;
    const alignDist = 7.0;
    const cohDist = 9.0;

    let sepCount = 0;
    let alignCount = 0;
    let cohCount = 0;

    const sepForce = new THREE.Vector3();
    const alignForce = new THREE.Vector3();
    const cohCenter = new THREE.Vector3();

    for (let other of this.fishes) {
      if (other === fish) continue;
      const d = fish.pos.distanceTo(other.pos);

      // Separación
      if (d > 0 && d < sepDist) {
        const diff = new THREE.Vector3().subVectors(fish.pos, other.pos).normalize().divideScalar(d);
        sepForce.add(diff);
        sepCount++;
      }

      // Alineación
      if (d > 0 && d < alignDist) {
        alignForce.add(other.vel);
        alignCount++;
      }

      // Cohesión
      if (d > 0 && d < cohDist) {
        cohCenter.add(other.pos);
        cohCount++;
      }
    }

    if (sepCount > 0) {
      sepForce.divideScalar(sepCount).normalize().multiplyScalar(fish.maxSpeed * 1.5).sub(fish.vel).clampLength(0, fish.maxForce * 1.8);
      fish.acc.add(sepForce);
    }

    if (alignCount > 0) {
      alignForce.divideScalar(alignCount).normalize().multiplyScalar(fish.maxSpeed).sub(fish.vel).clampLength(0, fish.maxForce);
      fish.acc.add(alignForce);
    }

    if (cohCount > 0) {
      cohCenter.divideScalar(cohCount);
      const cohDir = new THREE.Vector3().subVectors(cohCenter, fish.pos).normalize().multiplyScalar(fish.maxSpeed).sub(fish.vel).clampLength(0, fish.maxForce * 0.9);
      fish.acc.add(cohDir);
    }

    // Atracción hacia el alimento si existe alguno
    if (this.foods.length > 0) {
      let closestFood = null;
      let minFoodDist = 18;

      for (let f of this.foods) {
        const dist = fish.pos.distanceTo(f.mesh.position);
        if (dist < minFoodDist) {
          minFoodDist = dist;
          closestFood = f;
        }
      }

      if (closestFood) {
        const foodDir = new THREE.Vector3().subVectors(closestFood.mesh.position, fish.pos).normalize().multiplyScalar(fish.maxSpeed * 1.4).sub(fish.vel).clampLength(0, fish.maxForce * 2.2);
        fish.acc.add(foodDir);

        // Si come el alimento
        if (minFoodDist < 1.0) {
          closestFood.life = 0; // Se extingue el alimento
          fish.swimSpeed = 16;
          this.emitBurstBubbles(fish.pos, 4);
          if (window.soundEngine) {
            window.soundEngine.playBubblePop(650 + Math.random() * 200);
          }
        }
      }
    }

    // Confinamiento suave dentro de la laguna
    const boundForce = new THREE.Vector3();
    const bx = this.bounds.x;
    const by = this.bounds.y;

    if (fish.pos.x < -bx) boundForce.x = 0.02;
    if (fish.pos.x > bx) boundForce.x = -0.02;
    if (fish.pos.y < -by) boundForce.y = 0.02;
    if (fish.pos.y > by) boundForce.y = -0.02;
    if (fish.pos.z < this.bounds.zMin) boundForce.z = 0.02;
    if (fish.pos.z > this.bounds.zMax) boundForce.z = -0.02;

    fish.acc.add(boundForce);

    // Movimiento serpenteante natural de búsqueda (vagar)
    const wander = new THREE.Vector3(
      Math.sin(fish.swimPhase * 0.4) * 0.003,
      Math.cos(fish.swimPhase * 0.5) * 0.002,
      Math.sin(fish.swimPhase * 0.3) * 0.002
    );
    fish.acc.add(wander);
  }

  update(delta, time) {
    // 1. Actualizar peces
    for (let fish of this.fishes) {
      this.applyFlocking(fish);

      // Integrar aceleración a velocidad
      fish.vel.add(fish.acc);

      let currentMaxSpeed = fish.maxSpeed;
      if (fish.burstTimer > 0) {
        fish.burstTimer--;
        currentMaxSpeed *= 2.2;
      } else {
        fish.swimSpeed = THREE.MathUtils.lerp(fish.swimSpeed, 8, 0.04);
      }

      fish.vel.clampLength(0.04, currentMaxSpeed);
      fish.pos.add(fish.vel);
      fish.root.position.copy(fish.pos);
      fish.acc.set(0, 0, 0);

      // Orientación del pez en la dirección de nado
      if (fish.vel.lengthSq() > 0.001) {
        const lookTarget = fish.pos.clone().add(fish.vel);
        fish.root.lookAt(lookTarget);
        // Rotar para que la cabeza coincida con el vector de avance
        fish.root.rotateY(-Math.PI / 2);
      }

      // Animación ondulatoria del nado (columna vertebral articulada)
      fish.swimPhase += fish.swimSpeed * delta;
      const wave = Math.sin(fish.swimPhase);
      const waveLag1 = Math.sin(fish.swimPhase - 0.7);
      const waveLag2 = Math.sin(fish.swimPhase - 1.4);

      // Articulaciones
      fish.meshData.midJoint.rotation.y = wave * fish.swimAmp * 0.6;
      fish.meshData.tailJoint.rotation.y = waveLag1 * fish.swimAmp * 1.1;
      fish.meshData.finJoint.rotation.y = waveLag2 * fish.swimAmp * 1.6;

      // Aletas pectorales baten de forma alternada y elegante
      const pectFlutter = Math.cos(fish.swimPhase * 1.3) * 0.35;
      fish.meshData.leftPectoral.rotation.y = pectFlutter;
      fish.meshData.rightPectoral.rotation.y = -pectFlutter;
    }

    // 2. Actualizar burbujas
    if (this.bubbleParticles) {
      const posAttr = this.bubbleParticles.geometry.attributes.position;
      const pos = posAttr.array;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const vel = this.bubbleVelocities[i];
        vel.xWave += vel.speedX;

        pos[i * 3 + 1] += vel.y;
        pos[i * 3] += Math.sin(vel.xWave) * 0.02;

        // Si suben demasiado, reaparecer en el fondo
        if (pos[i * 3 + 1] > 26) {
          pos[i * 3 + 1] = -26;
          pos[i * 3] = (Math.random() - 0.5) * 60;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 3. Actualizar alimento que cae
    for (let i = this.foods.length - 1; i >= 0; i--) {
      const f = this.foods[i];
      f.mesh.position.y += f.velY;
      f.mesh.rotation.x += f.rotSpeed;
      f.mesh.rotation.y += f.rotSpeed * 1.2;
      f.life--;

      if (f.life <= 0 || f.mesh.position.y < -25) {
        this.scene.remove(f.mesh);
        this.foods.splice(i, 1);
      }
    }
  }
}

// Visor e Inspector 3D interactivo de anatomía y escamas de la Guapucha (Página 3)
class GuapuchaInspector3D {
  constructor(containerId, infoDisplayId) {
    this.container = document.getElementById(containerId);
    this.infoDisplay = document.getElementById(infoDisplayId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.fishGroup = null;
    this.clickableParts = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isRotating = true;
    this.time = 0;

    this.partDetails = {
      scales: {
        title: "Escamas y Piel Plateada Iridiscente",
        desc: "Las escamas de la guapucha poseen un gradiente verde oliva dorsal y flancos plateados con reflejos dorados. Este patrón le permite mimetizarse perfectamente entre los tallos de totora y evitar depredadores aéreos.",
        icon: "✨🐟"
      },
      eyes: {
        title: "Ojos Grandes de Adaptación Andina",
        desc: "Ojos amplios y expresivos desarrollados para captar luz en aguas frías de alta montaña (2.540 msnm) y aguas con sedimentos orgánicos y limo.",
        icon: "👁️🌊"
      },
      dorsal: {
        title: "Aleta Dorsal y Ausencia de Aleta Adiposa",
        desc: "A diferencia de otros carácidos tropicales, la Grundulus bogotensis carece de aleta adiposa, una adaptación evolutiva milenaria única de los Andes colombianos.",
        icon: "🌊📐"
      },
      tail: {
        title: "Cola Caudal Bifurcada de Nado Ágil",
        desc: "Su aleta caudal proporciona arranques veloces y ráfagas de escape cuando es perseguida por garzas o tinguas de la laguna.",
        icon: "⚡💨"
      },
      belly: {
        title: "Vientre Plateado y Espinas Tiernas",
        desc: "Al carecer de espinas duras o punzantes, la guapucha se consume entera en la gastronomía de Fúquene, aportando una alta concentración de calcio, fósforo y omega natural.",
        icon: "🍲🌾"
      }
    };

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    const w = this.container.clientWidth || 360;
    const h = this.container.clientHeight || 320;
    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    this.camera.position.set(0, 0.5, 4.8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xdcf8f3, 0.95);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfffaea, 1.4);
    sun.position.set(4, 5, 4);
    this.scene.add(sun);

    const rim = new THREE.DirectionalLight(0x38e8cb, 0.8);
    rim.position.set(-4, -2, -2);
    this.scene.add(rim);

    this.createDetailedFish();
    this.setupEvents();
    this.animate();
  }

  createDetailedFish() {
    this.fishGroup = new THREE.Group();

    // Material de piel con escamas brillantes
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, "#2c4a3b");
    grad.addColorStop(0.3, "#4d735f");
    grad.addColorStop(0.48, "#1a2c22");
    grad.addColorStop(0.55, "#a8cfc0");
    grad.addColorStop(0.8, "#e6f2ec");
    grad.addColorStop(1.0, "#ffffff");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    for (let i = 0; i < 300; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, 60 + Math.random() * 140, 2 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    this.bodyMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.25,
      metalness: 0.35
    });

    this.finMat = new THREE.MeshStandardMaterial({
      color: 0x98e8d8,
      transparent: true,
      opacity: 0.85,
      roughness: 0.15,
      side: THREE.DoubleSide
    });

    // 1. Cuerpo principal (Escamas / Tronco)
    const bodyGeom = new THREE.CylinderGeometry(0.4, 0.8, 2.4, 16);
    bodyGeom.rotateZ(Math.PI / 2);
    bodyGeom.scale(1.0, 1.35, 0.7);
    const bodyMesh = new THREE.Mesh(bodyGeom, this.bodyMat);
    bodyMesh.userData = { partKey: 'scales' };
    this.fishGroup.add(bodyMesh);
    this.clickableParts.push(bodyMesh);

    // Hocico
    const snoutGeom = new THREE.ConeGeometry(0.48, 1.0, 14);
    snoutGeom.rotateZ(-Math.PI / 2);
    snoutGeom.scale(1.0, 1.25, 0.65);
    const snout = new THREE.Mesh(snoutGeom, this.bodyMat);
    snout.position.x = 1.6;
    snout.userData = { partKey: 'scales' };
    this.fishGroup.add(snout);
    this.clickableParts.push(snout);

    // Ojos interactivos
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xdfbe64, roughness: 0.2, metalness: 0.8 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050807 });
    [-1, 1].forEach((side) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(1.3, 0.2, side * 0.42);

      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), eyeMat);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), pupilMat);
      pupil.position.z = side * 0.08;

      eyeGroup.add(iris);
      eyeGroup.add(pupil);
      eyeGroup.userData = { partKey: 'eyes' };
      iris.userData = { partKey: 'eyes' };
      pupil.userData = { partKey: 'eyes' };
      this.fishGroup.add(eyeGroup);
      this.clickableParts.push(iris);
    });

    // Aleta Dorsal
    const dorsalGeom = new THREE.BufferGeometry();
    const dorsalVerts = new Float32Array([
      -0.6, 0.8, 0.0,
      -0.1, 1.6, 0.0,
      0.5, 0.75, 0.0
    ]);
    dorsalGeom.setAttribute("position", new THREE.BufferAttribute(dorsalVerts, 3));
    dorsalGeom.computeVertexNormals();
    const dorsal = new THREE.Mesh(dorsalGeom, this.finMat);
    dorsal.userData = { partKey: 'dorsal' };
    this.fishGroup.add(dorsal);
    this.clickableParts.push(dorsal);

    // Vientre
    const bellyGeom = new THREE.BufferGeometry();
    const bellyVerts = new Float32Array([
      -0.4, -0.65, 0.0,
      -1.1, -1.2, 0.0,
      -0.8, -0.5, 0.0
    ]);
    bellyGeom.setAttribute("position", new THREE.BufferAttribute(bellyVerts, 3));
    bellyGeom.computeVertexNormals();
    const belly = new THREE.Mesh(bellyGeom, this.finMat);
    belly.userData = { partKey: 'belly' };
    this.fishGroup.add(belly);
    this.clickableParts.push(belly);

    // Cola Caudal
    const caudalGeom = new THREE.BufferGeometry();
    const caudalVerts = new Float32Array([
      -1.2, 0.0, 0.0,
      -2.5, 1.15, 0.0,
      -2.0, 0.0, 0.0,
      -1.2, 0.0, 0.0,
      -2.0, 0.0, 0.0,
      -2.5, -1.15, 0.0
    ]);
    caudalGeom.setAttribute("position", new THREE.BufferAttribute(caudalVerts, 3));
    caudalGeom.computeVertexNormals();
    const caudal = new THREE.Mesh(caudalGeom, this.finMat);
    caudal.userData = { partKey: 'tail' };
    this.fishGroup.add(caudal);
    this.clickableParts.push(caudal);

    this.fishGroup.scale.set(0.9, 0.9, 0.9);
    this.scene.add(this.fishGroup);
  }

  setupEvents() {
    let isDown = false;
    let prevX = 0;

    const onPointerDown = (e) => {
      isDown = true;
      this.isRotating = false;
      prevX = e.clientX || (e.touches && e.touches[0].clientX);
    };

    const onPointerMove = (e) => {
      if (!isDown) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const dx = x - prevX;
      prevX = x;
      if (this.fishGroup) {
        this.fishGroup.rotation.y += dx * 0.02;
      }
    };

    const onPointerUp = () => {
      isDown = false;
      setTimeout(() => { this.isRotating = true; }, 2200);
    };

    this.container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    this.container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Clic en las escamas / partes de la Guapucha
    this.container.addEventListener('click', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.clickableParts, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const partKey = hit.userData.partKey || 'scales';
        this.selectPart(partKey);

        if (window.soundEngine) {
          window.soundEngine.playWaterDrop(0.22, 680);
        }
      }
    });
  }

  selectPart(partKey) {
    const data = this.partDetails[partKey];
    if (!data || !this.infoDisplay) return;

    this.infoDisplay.innerHTML = `
      <div class="anatomy-badge">${data.icon} ${data.title}</div>
      <p class="anatomy-text">${data.desc}</p>
    `;

    // Efecto de giro y salto reactivo
    if (this.fishGroup) {
      this.fishGroup.rotation.z = (Math.random() - 0.5) * 0.3;
      setTimeout(() => { if (this.fishGroup) this.fishGroup.rotation.z = 0; }, 350);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.time += 0.035;

    if (this.fishGroup) {
      if (this.isRotating) {
        this.fishGroup.rotation.y += 0.012;
      }
      this.fishGroup.position.y = Math.sin(this.time) * 0.08;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.GuapuchaInspector3D = GuapuchaInspector3D;

