// characters.js - Generador de personajes 3D para la Laguna de Fúquene
// Personajes: Doña Luz Mery, Don Pescador / Álvaro, Perla y Alejo
class Character3DViewer {
  constructor(containerId, characterType = 'dona_luz') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.characterType = characterType;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.characterGroup = null;
    this.isRotating = true;
    this.time = 0;

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    const w = this.container.clientWidth || 240;
    const h = this.container.clientHeight || 280;
    this.camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    this.camera.position.set(0, 1.8, 5.5);
    this.camera.lookAt(0, 1.2, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // Iluminación cálida de estudio
    const ambient = new THREE.AmbientLight(0xfff7ee, 0.9);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffecd2, 1.2);
    dirLight.position.set(3, 6, 4);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x4be1cb, 0.6);
    rimLight.position.set(-3, 2, -3);
    this.scene.add(rimLight);

    this.characterGroup = this.createCharacter(this.characterType);
    this.scene.add(this.characterGroup);

    // Eventos de arrastre para rotación táctil / ratón
    this.setupInteraction();
    this.animate();
  }

  createCharacter(type) {
    const root = new THREE.Group();

    // Materiales comunes
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xdfa57e, roughness: 0.5 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1f2421 });

    if (type === 'dona_luz') {
      // DOÑA LUZ MERY: Cocinera tradicional de Fúquene con pañolón y delantal
      // 1. Falda amplia tradicional
      const skirtGeom = new THREE.CylinderGeometry(0.55, 0.95, 1.1, 16);
      const skirtMat = new THREE.MeshStandardMaterial({ color: 0x22495d, roughness: 0.7 });
      const skirt = new THREE.Mesh(skirtGeom, skirtMat);
      skirt.position.y = 0.55;
      root.add(skirt);

      // 2. Torso con blusa campesina y pañolón
      const torsoGeom = new THREE.CylinderGeometry(0.48, 0.55, 0.9, 14);
      const torsoMat = new THREE.MeshStandardMaterial({ color: 0xeae6dc, roughness: 0.6 });
      const torso = new THREE.Mesh(torsoGeom, torsoMat);
      torso.position.y = 1.45;
      root.add(torso);

      // Pañolón / chal andino sobre los hombros
      const shawlGeom = new THREE.ConeGeometry(0.68, 0.7, 14, 1, true);
      const shawlMat = new THREE.MeshStandardMaterial({ color: 0x8a3324, roughness: 0.8 });
      const shawl = new THREE.Mesh(shawlGeom, shawlMat);
      shawl.position.set(0, 1.55, 0);
      root.add(shawl);

      // Delantal blanco de cocina con bolsillo
      const apronGeom = new THREE.BoxGeometry(0.5, 0.75, 0.08);
      const apronMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.5 });
      const apron = new THREE.Mesh(apronGeom, apronMat);
      apron.position.set(0, 1.05, 0.45);
      root.add(apron);

      // 3. Cabeza
      const headGeom = new THREE.SphereGeometry(0.35, 14, 14);
      headGeom.scale(0.95, 1.05, 0.95);
      const head = new THREE.Mesh(headGeom, skinMat);
      head.position.y = 2.15;
      root.add(head);

      // Cabello y moño tradicional
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x382c28, roughness: 0.9 });
      const hairGeom = new THREE.SphereGeometry(0.37, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.55);
      const hair = new THREE.Mesh(hairGeom, hairMat);
      hair.position.set(0, 2.2, -0.02);
      root.add(hair);

      const bunGeom = new THREE.SphereGeometry(0.18, 10, 10);
      const bun = new THREE.Mesh(bunGeom, hairMat);
      bun.position.set(0, 2.25, -0.35);
      root.add(bun);

      // Ojos y sonrisa
      [-0.12, 0.12].forEach((x) => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
        eye.position.set(x, 2.18, 0.32);
        root.add(eye);
      });

      // Cuchara de palo tradicional en mano
      const spoonGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.6);
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x9b673c });
      const spoon = new THREE.Mesh(spoonGeom, woodMat);
      spoon.position.set(0.48, 1.4, 0.25);
      spoon.rotation.z = -Math.PI / 4;
      spoon.rotation.x = Math.PI / 6;
      root.add(spoon);

      const scoopGeom = new THREE.SphereGeometry(0.07, 8, 8);
      scoopGeom.scale(1, 1.4, 0.5);
      const scoop = new THREE.Mesh(scoopGeom, woodMat);
      scoop.position.set(0.68, 1.6, 0.38);
      root.add(scoop);

    } else if (type === 'pescador') {
      // DON ALVARO / EL PESCADOR: Con ruana boyacense de lana, sombrero campesino y remo
      // Piernas con botas de pantano
      [-0.2, 0.2].forEach((x) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.8), new THREE.MeshStandardMaterial({ color: 0x242e38 }));
        leg.position.set(x, 0.4, 0);
        root.add(leg);

        const boot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 0.32), new THREE.MeshStandardMaterial({ color: 0x11161a, roughness: 0.3 }));
        boot.position.set(x, 0.12, 0.06);
        root.add(boot);
      });

      // Ruana campesina tradicional (forma poncho de 4 lados)
      const ruanaGeom = new THREE.ConeGeometry(0.85, 1.1, 4);
      ruanaGeom.rotateY(Math.PI / 4);
      const ruanaMat = new THREE.MeshStandardMaterial({ color: 0xd2c7b5, roughness: 0.9 });
      const ruana = new THREE.Mesh(ruanaGeom, ruanaMat);
      ruana.position.y = 1.35;
      root.add(ruana);

      // Franjas cafés de la ruana tradicional de Fúquene
      const stripeGeom = new THREE.BoxGeometry(0.88, 0.06, 0.88);
      const stripeMat = new THREE.MeshStandardMaterial({ color: 0x5a4231 });
      const stripe = new THREE.Mesh(stripeGeom, stripeMat);
      stripe.position.set(0, 1.0, 0);
      root.add(stripe);

      // Cabeza
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 14, 14), skinMat);
      head.position.y = 2.05;
      root.add(head);

      // Bigote campesino
      const stache = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.08), new THREE.MeshStandardMaterial({ color: 0x3d322c }));
      stache.position.set(0, 1.96, 0.31);
      root.add(stache);

      [-0.11, 0.11].forEach((x) => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
        eye.position.set(x, 2.08, 0.3);
        root.add(eye);
      });

      // Sombrero campesino de jipa/iraca
      const brimGeom = new THREE.CylinderGeometry(0.72, 0.72, 0.05, 16);
      const hatMat = new THREE.MeshStandardMaterial({ color: 0xded2b6, roughness: 0.7 });
      const brim = new THREE.Mesh(brimGeom, hatMat);
      brim.position.y = 2.25;
      root.add(brim);

      const crownGeom = new THREE.CylinderGeometry(0.34, 0.38, 0.32, 14);
      const crown = new THREE.Mesh(crownGeom, hatMat);
      crown.position.y = 2.42;
      root.add(crown);

      // Remo de madera de aliso
      const oarShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.2), new THREE.MeshStandardMaterial({ color: 0x82542e }));
      oarShaft.position.set(0.65, 1.1, 0.2);
      oarShaft.rotation.z = -0.15;
      root.add(oarShaft);

      const oarBlade = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.5, 0.04), new THREE.MeshStandardMaterial({ color: 0x6e4321 }));
      oarBlade.position.set(0.8, 2.1, 0.2);
      oarBlade.rotation.z = -0.15;
      root.add(oarBlade);

    } else if (type === 'perla') {
      // PERLA: Joven cliente/exploradora con chaqueta turquesa y morral
      [-0.18, 0.18].forEach((x) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.8), new THREE.MeshStandardMaterial({ color: 0x1f344d }));
        leg.position.set(x, 0.4, 0);
        root.add(leg);
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.28), new THREE.MeshStandardMaterial({ color: 0xf5f5f5 }));
        shoe.position.set(x, 0.09, 0.05);
        root.add(shoe);
      });

      // Chaqueta moderna turquesa laguna
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.9, 14), new THREE.MeshStandardMaterial({ color: 0x22b2a6, roughness: 0.4 }));
      torso.position.y = 1.25;
      root.add(torso);

      // Mochila/morral amarillo en la espalda
      const bag = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.55, 0.25), new THREE.MeshStandardMaterial({ color: 0xdf9926 }));
      bag.position.set(0, 1.3, -0.32);
      root.add(bag);

      // Cabeza
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.33, 14, 14), skinMat);
      head.position.y = 1.95;
      root.add(head);

      // Cabello largo castaño recogido en coleta
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x482d1f });
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.36, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.6), hairMat);
      hair.position.set(0, 2.0, -0.02);
      root.add(hair);

      const ponytail = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.15, 0.5), hairMat);
      ponytail.position.set(0, 1.8, -0.38);
      ponytail.rotation.x = -0.3;
      root.add(ponytail);

      [-0.1, 0.1].forEach((x) => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
        eye.position.set(x, 1.98, 0.29);
        root.add(eye);
      });

    } else if (type === 'alejo') {
      // ALEJO: Joven estudiante/investigador con libreta de campo y gorra
      [-0.18, 0.18].forEach((x) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.8), new THREE.MeshStandardMaterial({ color: 0x3d4b3b }));
        leg.position.set(x, 0.4, 0);
        root.add(leg);
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.28), new THREE.MeshStandardMaterial({ color: 0xb5633a }));
        shoe.position.set(x, 0.09, 0.05);
        root.add(shoe);
      });

      // Suéter mostaza andino
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.48, 0.9, 14), new THREE.MeshStandardMaterial({ color: 0xd48f2b, roughness: 0.6 }));
      torso.position.y = 1.25;
      root.add(torso);

      // Libreta de campo en manos
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.36, 0.05), new THREE.MeshStandardMaterial({ color: 0x235a8a }));
      book.position.set(0.1, 1.25, 0.42);
      book.rotation.y = -0.2;
      book.rotation.x = 0.3;
      root.add(book);

      // Cabeza
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.33, 14, 14), skinMat);
      head.position.y = 1.95;
      root.add(head);

      // Gorra deportiva azul
      const capMat = new THREE.MeshStandardMaterial({ color: 0x1f476b });
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.35, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), capMat);
      cap.position.set(0, 2.02, 0);
      root.add(cap);

      const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.04, 14, 1, false, 0, Math.PI * 0.65), capMat);
      visor.position.set(0, 2.05, 0.22);
      visor.rotation.y = -Math.PI * 0.32;
      root.add(visor);

      [-0.1, 0.1].forEach((x) => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
        eye.position.set(x, 1.97, 0.29);
        root.add(eye);
      });
    }

    return root;
  }

  setupInteraction() {
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
      if (this.characterGroup) {
        this.characterGroup.rotation.y += dx * 0.02;
      }
    };

    const onPointerUp = () => {
      isDown = false;
      setTimeout(() => { this.isRotating = true; }, 1800);
    };

    this.container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    this.container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.time += 0.03;

    if (this.characterGroup) {
      if (this.isRotating) {
        this.characterGroup.rotation.y += 0.012;
      }
      // Animación suave de respiración / balanceo
      this.characterGroup.position.y = Math.sin(this.time) * 0.04;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.Character3DViewer = Character3DViewer;
