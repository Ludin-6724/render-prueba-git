# Investigación y corrección del scroll de cámara

Ludin reportó lentitud y pixelación en móvil y pidió mejorar ambas vistas.
Se preservan el blanco, el título RENDER Multimedia y la secuencia del video
aportado, con cámara armada al principio y al final.

## Hallazgos

- **Confirmado:** el MP4 anterior tiene 241 frames H.264, 1280 × 720, 24 fps,
  10,04 segundos y un único fotograma clave a tiempo 0 (`ffprobe -skip_frame nokey`).
  El hero modificaba `currentTime` continuamente. Buscar un tiempo inicia un seek
  ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime));
  FFmpeg documenta que una búsqueda precisa puede requerir decodificar desde
  un punto anterior ([FFmpeg](https://www.ffmpeg.org/ffmpeg.html)). Es una fuente
  de trabajo repetido que aumenta con la distancia al fotograma clave.
- **Medido en este ordenador:** doce saltos alternados, esperando
  `requestVideoFrameCallback`, dieron mediana de 39,85 ms y máximo de 77,7 ms.
  El evento `seeked` solo resultó engañosamente rápido; se descartó como medida
  de presentación visual. La prueba se hizo en navegador local con material
  precargado: no representa el rendimiento de un teléfono físico ni de su red.
- **Confirmado:** el encuadre móvil aplicaba `scale(1.28)` en los extremos,
  ampliando la textura y acentuando defectos de la fuente. También se usaba
  `innerHeight` para calcular el final del pin, aunque el bloque mide `100svh`.
  En navegadores móviles esos valores pueden diferir al cambiar la barra del
  navegador. Se elimina esa dependencia y la ampliación.
- **Límite del material:** la fuente es 720p. Extraer fotogramas conserva su
  detalle disponible; no inventa detalle de una captura de mayor resolución.

## Corrección

- Sustitución del video por 121 WebP independientes, correspondientes a frames
  pares 0–240. El primer fotograma sirve también de poster prioritario.
- Dos variantes, 960 × 540 (4.982.118 bytes) y 1280 × 720 (7.563.990 bytes).
  El ancho y densidad de pantalla deciden una sola variante. Móviles con más de
  960 píxeles físicos de ancho reciben la variante completa. Calidad WebP 88,
  sin filtros de nitidez, interpolación ni escalado por encima del original.
- Prioridad al objetivo actual y sus vecinos; cuatro descargas simultáneas,
  dos decodificaciones y diez bitmaps retenidos como máximo. Caché de archivos
  comprimidos y `force-cache` sobre una ruta versionada. El tamaño completo de
  la variante de escritorio supera al MP4 anterior; se acepta a cambio del
  acceso independiente y carga priorizada. No se solicita el MP4 en la página.
- Canvas opaco a resolución de la fuente, sin repintado continuo en reposo.
  Dibujo en `requestAnimationFrame`; el título permanece en HTML. Se aplican
  las recomendaciones de [MDN sobre canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas).
- Se detiene la precarga fuera de vista o al ocultar la pestaña. Al desmontar
  se cancelan solicitudes y se cierran bitmaps. Un decode antiguo no desplaza
  el dibujo lejos del objetivo nuevo.
- Giro de 90 svh móvil (antes 160; reducción del 43,75 %) y 120 svh escritorio
  (antes 180; reducción del 33,33 %). Scroll nativo, sin interceptar rueda/touch.
  El rango se calcula con la altura real del bloque sticky mediante ResizeObserver.
- Poster sin pin para movimiento reducido, ahorro de datos y orientación con
  altura ≤500 px. Los fallos de assets conservan la imagen y liberan el recorrido.

## Verificación

- Misma prueba local de doce saltos con la nueva secuencia móvil: mediana
  16,7 ms, máximo 19,6 ms. Se espera un frame de presentación después del dibujo.
  Mediana un 58 % menor; resultado controlado, no una promesa de FPS en dispositivos.
- Tres pruebas del cargador pasan: objetivo más reciente y retroceso, límites
  de solicitudes/memoria y limpieza, pausa fuera de vista, fallback de fallos.
- TypeScript/Vite, ESLint de los dos módulos tocados, diff sin errores y detector
  de tipografía sin hallazgos. Se conservan Archivo / Archivo Black, sus roles,
  contraste y título opaco; no se cambia la identidad visual.
- Navegador: escritorio 1440 × 900, inicio 0 y giro 55; móvil 390 × 844, inicio 0,
  giro 53, retroceso 27, final 120. En cada muestra target y rendered coinciden.
  Sin overflow horizontal. Título móvil termina a 190,5 px y escenario empieza
  a 210 px. Rango móvil 760 px. Las piezas quedan dentro del encuadre.
- El final deja visible la sección siguiente; «Ver nuestro trabajo» navega a
  `#portfolio`. Fixture de movimiento reducido: `data-static=true`, posición
  relativa y sin reproductor. No se dispuso de un teléfono físico para esta prueba.
- Revisión de interacción basada también en las
  [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

Evidencia de medición y publicación: `private/local-evidence/camera-perf-*.json`.

## Publicación verificada

- Código: `c2f1d062524d356f29a0346966144348440fe92b`.
- Artefacto: `99e8858b41b453d930e3c2d7d4ea4b47eb074dad` en GitHub `main`.
- cPanel: despliegue 7 `succeeded`; caché NGINX limpiada correctamente.
- 259 comprobaciones HTTP correctas: 252 archivos publicados y siete rutas.
  Todos los contenidos coinciden por SHA-256 con el build local.
- Navegador público: script `index-Cy61fF5s.js`, sin elemento video en el hero.
  Escritorio: target/rendered 40 a scroll 367 px; título con opacidad 1.
  Móvil 390 px: target/rendered 53 a scroll 337,5 px, variante móvil lista,
  documento de 390 px y título con opacidad 1. Se restauró el tamaño del navegador.
- Las dependencias y archivos experimentales previos no forman parte del commit
  ni del artefacto publicado. La versión anterior permanece disponible en Git
  para reversión.
