# RENDER Multimedia — web nueva

Sitio a medida (React + Vite). Sin WordPress. El contenido editable está en `src/content/site.ts`.

## Local

Node 20. En esta carpeta:

```sh
npm ci
npm run dev
```

Abre http://localhost:3000/

El formulario POST va a `contacto.php`. En desarrollo, levantá PHP aparte:

```sh
php -S 127.0.0.1:8088 -t public
```

Vite ya proxifica `/contacto.php` a ese puerto. `mail()` del PHP local no entrega al buzón real; el redirect de éxito/error sí se puede ver.

## Build

```sh
npm run build
npm run preview
```

`dist/` incluye HTML de las 7 rutas, `contacto.php`, `thank-you-page/`, `videos/camera-360-studio.mp4` y `.htaccess`.

## Cómo actualizar

| Qué | Dónde |
| --- | --- |
| Textos, proyectos, YouTube, equipo, contactos | `src/content/site.ts` |
| Cámara por piezas (scroll) | `public/assets/camera/` y `src/sections/Hero.tsx` |
| Logo / isotipo | `public/brand/` |
| Fotos de equipo | `public/assets/team/` |
| Destinatario del formulario | `public/contacto.php` |

Luego `npm run build`. No hace falta WordPress.

## Publicación

`.cpanel.yml` publica el artefacto en el dominio oficial. Aplicar el flujo autorizado de `../docs/FLUJO_PUBLICACION.md`. El repositorio de entrega contiene solo archivos públicos.

## Cámara y portafolio

El hero empieza con la cámara armada sobre blanco. El scroll dibuja 121
fotogramas independientes extraídos de «Video en blanco.mp4» en un canvas;
no busca posiciones dentro de un MP4. El recorrido termina en el montaje final
y continúa hacia el contenido: 90 svh de giro en móvil y 120 svh en escritorio.

`src/lib/cameraSequence.ts` prioriza el fotograma pedido y sus vecinos, descarga
como máximo cuatro archivos a la vez y conserva como máximo diez imágenes
decodificadas (más dos trabajos en curso). Las imágenes comprimidas se reutilizan
en memoria y en la caché del navegador. Se pausa la precarga fuera de vista y
se liberan recursos al desmontar. Un cambio de dirección sustituye el objetivo.

`public/assets/camera/turn-v1/` tiene dos tamaños: 960 × 540 (4,98 MB) y
1280 × 720 (7,56 MB). Solo se carga uno, según el ancho y densidad de la pantalla;
los móviles que necesitan más de 960 píxeles físicos usan la versión completa.
El canvas conserva la resolución del material, sin ampliación por transform.
Para regenerar: `python3 scripts/prepare-camera-frames.py` desde la raíz
(requiere ffmpeg y Pillow). Si cambia el material, usar una nueva ruta versionada
para invalidar la caché. El MP4 original se conserva como fuente.

El título permanece opaco y separado del área de movimiento. El blanco #fdfdfd
coincide con el material original. Durante la carga se muestra el primer frame.
Con movimiento reducido, ahorro de datos o una pantalla de menos de 501 px de
alto se ofrece una imagen estática, sin recorrido fijo. Si los archivos fallan,
se conserva el poster y se libera el sticky.

Pruebas del cargador: `node --test web/tests/cameraSequence.test.mjs` desde la raíz,
con Node 22.18 o superior (soporte nativo para eliminar tipos de TypeScript).

Los PNG originales de `public/assets/camera/segments/` se conservan como material
fuente; la secuencia anterior por capas queda sustituida por el giro continuo.

`Portfolio.tsx` presenta dos carruseles: ONG (18) y Comercial (5), con avance
cada 6,5 segundos. Dar play detiene ambos mientras permanece ese reproductor;
cambiar de proyecto desmonta el iframe y permite reanudar el avance. Admiten
arrastre, botones, flechas de teclado y pausa manual. Los testimonios avanzan
cada 10 segundos. La rotación se suspende fuera de vista, al ocultar la pestaña,
con foco, con el puntero encima o con movimiento reducido.

La escala de tipografía y espacios se encuentra en `src/index.css`, en el bloque
“Shared roles and rhythm”. Archivo es la familia de lectura y Archivo Black la de
los títulos. Inventario y verificación: `../docs/REVISION_UX_2026-09-12.md`.
