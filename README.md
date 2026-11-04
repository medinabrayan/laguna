# GUAPUCHAS: Un sabor que nace debajo del agua
### Experiencia Interactiva 3D Moderna de la Laguna de Fúquene con Three.js

Este proyecto es una recreación interactiva tridimensional basada en la infografía etnográfica y gastronómica de la **Laguna de Fúquene** y la **Guapucha (*Grundulus bogotensis*)**, especie nativa y endémica del altiplano cundiboyacense en Colombia.

---

## 🌊 Características Principales y Novedades

1. **Cursor del Mouse Convertido en Burbujas Interactivas (`js/bubbles.js`)**:
   - **Cursor Burbuja Nácar:** Sustituye el cursor convencional por una burbuja líquida reactiva con brillo especular, iridiscencia y deformación dinámica según la velocidad de movimiento.
   - **Estela Continua de Burbujas:** Al mover el mouse, se desprende una estela de burbujas flotantes con física de flotabilidad (suben hacia la superficie), oscilación sinusoidal (*wobble*) y fricción en agua.
   - **Explosión al Clic:** Al hacer clic en cualquier parte de la laguna, estalla una ráfaga de micro-burbujas con efecto sonoro de chasquido acuático sintetizado.
   - **Interacción con los Peces:** Las Guapuchas detectan el flujo de burbujas del cursor y reaccionan a su paso.

2. **Fondo Lacustre 3D Moderno y Batimétrico (`js/water.js`)**:
   - **Relieve Cartográfico de Fúquene:** Mapa de fondo con curvas batimétricas en neón cian (`#38e8cb`), cuadrícula cartográfica sutil y delimitación de las riberas de Guachetá, Fúquene y la Isla del Santuario.
   - **Cáusticas Celulares Voronoi:** Simulación procedural de redes de luz solar proyectadas sobre el lecho del lago y la superficie del agua en tiempo real.
   - **Efecto God Rays y Plancton Bioluminiscente:** Rayos de sol volumétricos y más de 300 micropartículas que flotan y brillan en tonos cian y esmeralda.
   - **Ondas Dinámicas al Mover y Clic:** Desplazamiento de vértices en tiempo real en la malla de agua ante la trayectoria del ratón.

3. **Cardumen de Guapuchas 3D (`js/guapucha.js`)**:
   - Modelado anatómico 3D de la *Grundulus bogotensis* con lomo oliva, flanco plateado nacarado, ojos con iris dorado y aletas traslúcidas.
   - Cinemática sinusoidal articulada para nado realista (cabeza orientada hacia el vector de velocidad).
   - Cardumen inteligente con algoritmo **Boids** (separación, cohesión y alineación).
   - Respuestas a toques directos (raycasting 3D) y modo para alimentar peces con pellets flotantes.

4. **Interfaz Hexagonal en Vidrio Esmerilado (*Glassmorphism*)**:
   - Estilo contemporáneo con bordes reactivos que se iluminan al pasar el cursor de burbuja.
   - Líneas de conexión dinámicas trazadas en SVG con corriente de flujo animada.
   - Modales informativos con contenido cultural, testimonios y recetas tradicionales.

5. **Paisaje Sonoro Procedural (`Web Audio API`)**:
   - Ondas de agua, gotas, estallidos de burbujas y brisa andina sintetizados en tiempo real sin dependencias externas.

---

## 🚀 Cómo Ejecutar el Proyecto

Puedes abrir directamente el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari o Brave):

```bash
# Opción 1: Abrir directamente con tu navegador
start index.html

# Opción 2: Usar un servidor local en Python
python -m http.server 8080
# Luego abrir en tu navegador: http://localhost:8080
```

---

## 📁 Estructura del Código

- `index.html`: Estructura HTML5, SVG de conexiones, HUD de herramientas y modales.
- `css/style.css`: Estética moderna acuática, glassmorphism, tipografía y cursor de burbuja.
- `js/bubbles.js`: Motor del cursor de burbuja, estela flotante, física de flotabilidad y estallidos.
- `js/water.js`: Entorno 3D moderno de la Laguna de Fúquene, cáusticas Voronoi, relieve batimétrico y ondas.
- `js/guapucha.js`: Modelo 3D de la Guapucha, cinemática de nado y cardumen Boids.
- `js/audio.js`: Sintetizador de audio procedural para agua, viento y chasquido de burbujas.
- `js/data.js`: Archivo etnográfico y biológico de los 24 nodos de la infografía.
- `js/app.js`: Controlador principal, bucle de renderizado 60 FPS e interacción de escena.
- `js/three.min.js`: Librería Three.js (r128) almacenada localmente para funcionamiento 100% offline.
