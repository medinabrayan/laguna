# Guapuchas: Latidos de Fúquene
### Experiencia Interactiva y Biocultural con Three.js, Personajes 3D y Estética Natural de la Sabana Cundiboyacense

Plataforma interactiva, biocultural y gastronómica sobre la **Laguna de Fúquene** y la **Guapucha (*Grundulus bogotensis*)**, pez endémico y sagrado del altiplano cundiboyacense en Colombia.

---

## 🌾 Características Principales y Novedades

1. **Diseño Sobrio, Natural y Editorial**:
   - Ambientado en los colores y paisajes de la **Sabana Cundiboyacense**: tonos de neblina mañanera (`#f4f7f4`), verde frailejón y juncal (`#264a3b`), terracota campesino de paila y teja (`#b25634`), y azul agua andina (`#27526f`).
   - Cursors nativos convencionales: `cursor: pointer` en todos los botones y tarjetas para una navegación clara, inmediata y sin interferencias.

2. **El Lago de las Guapuchas (Cardumen 3D y Alimentación Confinado)**:
   - Las guapuchas nadando y el efecto 3D de agua **no están en el fondo general de la página**, sino confinados en una hermosa sección dedicada: **"El Lago de las Guapuchas"**.
   - **Controles interactivos del estanque**:
     - 🌾 **Alimentar Guapuchas:** Modo que permite hacer clic en el agua para lanzar alimento a los peces y verlos aproximarse a comer.
     - ➕ **+ Pez al cardumen:** Agrega nuevas guapuchas en tiempo real y actualiza el contador.
     - 🔊 **Paisaje Sonoro:** Activa el murmullo del viento andino y el oleaje lacustre.
   - **Efecto de burbujas exclusivo del estanque (`js/bubbles.js`):** El efecto de burbujas acuáticas vive **única y exclusivamente** dentro de este contenedor interactivo, sin interferir con el resto de la página.

3. **Personajes 3D Procedurales con Three.js (`js/characters.js`)**:
   - **Leo la Guapucha:** Nada en el estanque 3D e interactúa en el **Inspector Anatómico 3D** con botones para partes clicables (*Escamas, Ojos, Aleta dorsal, Vientre, Aleta caudal*).
   - **Doña Luz Mery:** Cocinera tradicional en 3D con pañolón andino, delantal y cuchara de aliso en mano.
   - **Don Álvaro (Pescador):** En la sección de testimonios, modelado en 3D con ruana boyacense de lana, sombrero de jipa y remo de madera.
   - **Perla y Alejo:** Personajes seleccionables para el minijuego de cocina tradicional *¡Arma tu plato!*.

4. **Audio con Síntesis por Defecto y Soporte MP3 (`js/audio.js`)**:
   - **"Soy colombiano" (versión instrumental):** Melodía andina en bambuco sintetizada con timbres de tiple y flauta mediante Web Audio API.
   - **Audios de testimonios (Don Álvaro, Doña Luz Mery y la Comunidad):** Transcripciones completas en pantalla y audios predeterminados activos al clic.
   - **Personalización sencilla:** Si deseas utilizar grabaciones propias en MP3, solo debes colocarlas en la carpeta `audio/`:
     - `audio/soy_colombiano.mp3`
     - `audio/testimonio_pescador.mp3`
     - `audio/historia_luz_mery.mp3`
     - `audio/vivencias_comunidad.mp3`

5. **Minijuego Interactivo "¡Arma tu plato tradicional!" (`js/game.js`)**:
   - **Selección de Personaje:** Elige cocinar con **Perla**, **Alejo** o **Doña Luz Mery**.
   - **Paso 1 (Lavado & Salmuera):** Lava una a una las guapuchas con agua fresca de manantial y limón en el cuenco interactivo.
   - **Paso 2 (Adobo Campesino):** Agrega sal marina de gema, ajo machacado en piedra y cebolla larga fresca en la batea de madera, y mezcla con la cuchara de palo de aliso.
   - **Paso 3 (Enharinado Ligero):** Pasa el pescado por harina fina de trigo y sacude el exceso para lograr la película crocante óptima.
   - **Paso 4 (Fritura en Paila de Hierro):** Sumerge las guapuchas en el aceite caliente con sonido real de chisporroteo (`playSizzle`), vigila el termómetro de leña viva y retíralas en la zona dorada ideal.
   - **Paso 5 (Emplatado Campesino):** Sirve en vajilla tradicional de barro y personaliza tus acompañamientos (papas criollas, limón, tajadas maduras, mazorca o ají casero).
   - **Evaluación & Calificación:** Desglose de 5 estrellas, modelo 3D de Doña Luz felicitando con su cuchara de palo y botón para copiar la receta completa.

6. **Muro de Fotos de la Comunidad**:
   - Permite subir imágenes reales desde tu ordenador (mediante `FileReader`) y publicarlas al instante en el muro comunitario.

7. **Red de Saberes de la Laguna**:
   - 24 nodos culturales y líneas de conexión SVG dinámicas situadas estrictamente detrás de los textos para garantizar perfecta legibilidad.

8. **Encuesta y Formulario de Ideas**:
   - Evaluación comunitaria y buzón *"Nos puedes dar una idea plis"*.

---

## 🚀 Cómo Ejecutar

Abre directamente el archivo [`index.html`](file:///c:/Users/braya/Documents/codigo/laguna/index.html) en tu navegador web:
```powershell
start index.html
```
O con un servidor local:
```powershell
python -m http.server 8080
```
