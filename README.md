# GUAPUCHAS: Un sabor que nace debajo del agua
### Experiencia Interactiva 3D de la Laguna de Fúquene con Three.js

Este proyecto es una recreación interactiva tridimensional basada en la infografía etnográfica y gastronómica de la **Laguna de Fúquene** y la **Guapucha (*Grundulus bogotensis*)**, especie nativa y endémica del altiplano cundiboyacense en Colombia.

---

## 🌊 Características Principales

1. **Cardumen Interactivo de Guapuchas 3D (`Three.js`)**:
   - Modelado 3D anatómico y procedural de la *Grundulus bogotensis* (lomo oliva, flanco plateado iridiscente, aletas pectorales móviles y cola bifurcada).
   - Animación de nado orgánico con columna vertebral articulada y física ondulatoria sinusoidal.
   - Algoritmo de cardumen **Boids** (Separación, Alineación y Cohesión de grupo).
   - **Interacción directa**:
     - Al pasar el ratón cerca, los peces aceleran y esquivan el cursor.
     - Al hacer clic en el agua, se asustan generando una ráfaga de burbujas y salpicaduras.
     - **Modo Alimentar**: permite soltar alimento en el agua con clics para que las Guapuchas se acerquen a comerlo.
     - **Clic directo en un pez**: selecciona la Guapucha y activa un giro acrobático con burbujas.
     - Botón para agregar más peces a la laguna en tiempo real.

2. **Simulación de Agua y Relieve Lacustre**:
   - Malla de agua con relieve dinámico y ondas sinusoidales continuas.
   - Generación de ondas y perturbaciones concéntricas en tiempo real al interactuar con el ratón o hacer clic.
   - Texturas dinámicas de **cáusticas solares** proyectadas sobre el lecho del lago.
   - Fondo lacustre con la batimetría, islas y totorales característicos de la **Laguna de Fúquene**.
   - Rayos solares volumétricos (*God rays*) y micropartículas en suspensión (plancton/polen lacustre).

3. **Infografía Hexagonal Fiel a la Imagen**:
   - Reproducción de la cuadrícula hexagonal con estilos idénticos (nodos principales en azul `#2a5f97` y secundarios en blanco con borde azul).
   - Efecto de cursor interactivo en *"Escucha el territorio"*.
   - Líneas de conexión dinámicas trazadas con **SVG reactivo** entre los centros de cada nodo.
   - Resaltado y pulsación luminosa de las rutas al pasar el cursor sobre cualquier nodo.

4. **Paisaje Sonoro Procedural (`Web Audio API`)**:
   - Sonido ambiental sintetizado en tiempo real (murmullo de agua, oleaje suave, brisa de páramo y gotas).
   - Efectos sonoros de salpicaduras de pez y estallido de burbujas.
   - Reproductor sonoro especial en el nodo *"Escucha el territorio"*.

5. **Modal Cultural, Biológico y Gastronómico**:
   - 24 nodos interactivos con textos documentados sobre la historia Muisca, ecología, bioindicadores, técnicas de pesca artesanal, testimonios de campesinos y la receta tradicional de guapucha con papa criolla y maíz tostado.

6. **Modo Acuario 3D**:
   - Permite atenuar la infografía con un solo clic para contemplar la laguna y el cardumen en vista limpia.

---

## 🚀 Cómo Ejecutar el Proyecto

Puedes abrir directamente el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari o Brave):

```bash
# Opción 1: Abrir directamente con tu navegador
start index.html

# Opción 2: Usar un servidor local en Python
python -m http.server 8080
# Luego abrir en tu navegador: http://localhost:8080
```

---

## 📁 Estructura del Código

- `index.html`: Estructura semántica, nodos hexagonales SVG, HUD de controles y modal.
- `css/style.css`: Estilos visuales, tipografías (Montserrat, Caveat, Playfair), efecto vidrio y responsive design.
- `js/data.js`: Base de datos de contenido etnográfico, científico y gastronómico de los 24 nodos.
- `js/audio.js`: Sintetizador de audio procedural con Web Audio API (cero dependencias de archivos de sonido externos).
- `js/guapucha.js`: Motor 3D del pez Guapucha, cinemática de nado, cardumen Boids y partículas de burbujas.
- `js/water.js`: Entorno 3D de la Laguna de Fúquene, cáusticas, relieve y propagación de ondas.
- `js/app.js`: Controlador principal, render loop de Three.js a 60 FPS, raycasting e interacción.
