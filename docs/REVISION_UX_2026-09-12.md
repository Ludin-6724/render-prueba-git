# Revisión de espacios, uso y movimiento — 12 de septiembre de 2026

## Dirección aplicada

Se conserva la identidad clara vigente (blanco, crema, Archivo y Archivo Black)
y la sección oscura de portafolio. Se aplicaron frontend-design, impeccable
(typeset y animate), ui-ux-pro-max, web-design-guidelines y render-tipo-ux.
Dos evaluaciones independientes de diseño y técnica precedieron los cambios.

## Hallazgos y correcciones

- **Confirmado:** Manifiesto tenía 176 px de padding por borde y Servicios
  otros 144 px superiores: 320 px acumulados. Se usa un ritmo compartido de
  56–88 px por sección y 28–40 px entre encabezado y contenido.
- **Confirmado:** el inicio mezclaba proyectos comerciales y ONG en una cuadrícula.
  Ahora hay dos secciones con carrusel propio, 18 proyectos ONG y 5 comerciales,
  contador, anterior/siguiente, teclado, arrastre y enlace a su categoría.
- **Confirmado:** el cierre del menú quedaba detrás del overlay. Se sustituyó por
  un dialog modal nativo, con cierre visible, Escape y retorno de foco. La
  navegación de escritorio ahora expone ambas categorías del portafolio.
- **Confirmado:** cambiar de ruta desde una zona baja conservaba el scroll de la
  página anterior. Se restaura el inicio en navegación sin fragmento.
- **Confirmado:** se mezclaban tres familias, cuerpo móvil de 14 px y metadatos
  de 10 px. Se centralizaron roles, cuerpo de 16 px y metadatos de 13 px en los
  bloques revisados. Nombres y cargos del equipo quedan apilados.
- Los testimonios conservan el texto y ganan una jerarquía más tranquila,
  controles de 48 px y cita legible. Se retiran las cintas repetidas del Inicio.

## Primera versión de cámara: material y comportamiento (sustituida)

La carpeta `segments` contiene una vista completa y recortes, no una secuencia
multiángulo. Ludin confirmó el despiece con acercamientos. Se copiaron seis PNG
sin retocar: vista completa, monitor, cuerpo, batería, óptica y base.

El canvas compone 181 posiciones discretas a partir de esas capas: cámara armada,
separación, acercamiento a óptica y acercamiento a monitor. No son 181 fotografías
nuevas ni una rotación 3D real. No se solicita el MP4 de la cámara. El dibujo se
actualiza cuando cambia el fotograma, con escala de píxeles limitada a 2.

Origen de los archivos en `web/public/assets/camera/`:

| Archivo | Fuente en segments |
| --- | --- |
| assembled.png | camera-body/camera-body-2.png |
| monitor.png | camera-body/camera-body-1.png |
| battery.png | camera-body/camera-body-5.png |
| body.png | camera-body/camera-body-4.png |
| lens.png | lens.png |
| baseplate.png | baseplate.png |

La imagen completa funciona durante carga o fallo. `prefers-reduced-motion`
elimina el recorrido fijo y usa una cámara estática. La resolución queda limitada
por las imágenes aportadas: vista de 864 × 679 y recortes de menor tamaño.

## Verificación

- Compilación TypeScript/Vite correcta.
- ESLint de los archivos modificados correcto.
- Detector de diseño: sin hallazgos en los componentes modificados.
- Navegador en 1440 × 900 y 390 × 844: sin desbordamiento horizontal del documento.
- Verificados: salto al portafolio, cambio independiente de carruseles, teclado,
  vuelta del último al primer proyecto, carga de iframe al reproducir y desmontaje
  al cambiar de proyecto, apertura de menú, Escape y retorno de foco.
- El lint global conserva ocho errores anteriores en `src/components/ui/`
  (exports de Fast Refresh y Math.random en sidebar), ajenos a estos cambios.
- Movimiento reducido comprobado en la implementación; la herramienta del
  navegador no expone emulación de esa preferencia.

Criterios de revisión: [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

## Primera publicación confirmada

- Código local: `a78a5442855da906b0fe759049a2f8ef86000797`.
- Entrega GitHub: `1ce68198e850c24fac31da835f7dfeec879d5d9d` en
  `Ludin-6724/render-prueba-git`, rama `main`.
- cPanel: despliegue 4, estado `succeeded`. Se limpió caché NGINX después.
- 21 comprobaciones HTTP (archivos y rutas) devolvieron 200 y coincidencia SHA-256
  exacta con el build. Evidencia local: `private/local-evidence/ux-public-check.json`.
- En producción: cámara lista, ningún elemento video en Inicio; carruseles ONG y
  Comercial independientes; menú móvil abre/cierra y devuelve foco; ancho del
  documento 390 px en viewport de 390 px.
- Se mantienen los artefactos anteriores para facilitar la reversión por Git.
  No se incluyeron los MP4 experimentales locales en esta publicación.

## Actualización: cámara 360 y avance automático

Petición posterior de Ludin: usar su «Video 360.mp4», todos los componentes de
`segments`, desarmar y volver a armar con scroll, y sliders automáticos que se
detengan al reproducir. Esta actualización sustituye la primera versión de
cámara sin video descrita arriba.

- Los 20 PNG se copian íntegros, con sus rutas originales, a
  `web/public/assets/camera/segments/`. La composición usa 17 recortes, una base,
  la cámara completa y la máscara de espacio negativo. Los recortes anidados
  se sustraen de sus padres antes de moverlos.
- El primer 22% del scroll abre y cierra las piezas; después se funde con el
  video aportado, que ya contiene el giro, despiece y montaje. El desplazamiento
  controla su tiempo en ambos sentidos, hasta los 10 segundos finales.
- El original VP9/Opus se convierte a H.264 1280 × 720, 24 fps, sin audio,
  keyframes cada seis cuadros y faststart: 5.408.984 bytes. El original de
  Descargas se conserva intacto. El inicio usa un escenario oscuro para integrar
  la fotografía; se mantiene el ritmo de espacios del resto de la web.
- ONG y Comercial avanzan cada 6,5 segundos. Dar play bloquea ambos; elegir otro
  proyecto desmonta el iframe y libera la rotación. Testimonios usa 10 segundos.
  Cada carrusel tiene pausa manual y se detiene fuera de vista, con foco, hover,
  pestaña oculta o preferencia de movimiento reducido.
- Verificado en navegador: avance automático, bloqueo estable al reproducir y
  reanudación al cambiar de proyecto. Cámara con 20 componentes cargados y video
  llegando a 10 s/frame de control 300; captura del giro y del montaje final.
  Se revisan escritorio 1440 × 900 y móvil 390 × 844 sin desbordamiento horizontal.
- TypeScript/Vite y ESLint de los archivos modificados pasan. El detector de
  diseño no reporta hallazgos. Continúan los ocho errores de lint anteriores en
  componentes UI ajenos al cambio.

La entrega conserva las versiones públicas anteriores para reversión por Git.
Los archivos locales experimentales `blackmagic-rig.*`, `verify.tmp.mjs` y los
cambios previos de dependencias no forman parte de esta publicación.
