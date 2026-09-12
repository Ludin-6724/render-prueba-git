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

`dist/` incluye HTML de las 7 rutas, `contacto.php`, `thank-you-page/`, `videos/camera-360.mp4` y `.htaccess`.

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

El hero usa los 20 PNG originales de `public/assets/camera/segments/` para
abrir y cerrar las piezas durante el primer 22% del recorrido. Sus posiciones
están en `src/content/camera-parts.json`. Las imágenes de fondo actúan como máscara
y pantalla; los recortes contenidos se separan sin duplicar sus capas.

El resto del recorrido controla `public/videos/camera-360.mp4`, convertido del
«Video 360.mp4» aportado por Ludin a H.264, sin audio y con keyframes frecuentes.
El video contiene el giro con despiece y montaje. Un único seek pendiente sigue
la posición más reciente del scroll. Se conserva un poster, alternativa por
capas ante fallo del video y cámara estática con movimiento reducido.

`Portfolio.tsx` presenta dos carruseles: ONG (18) y Comercial (5), con avance
cada 6,5 segundos. Dar play detiene ambos mientras permanece ese reproductor;
cambiar de proyecto desmonta el iframe y permite reanudar el avance. Admiten
arrastre, botones, flechas de teclado y pausa manual. Los testimonios avanzan
cada 10 segundos. La rotación se suspende fuera de vista, al ocultar la pestaña,
con foco, con el puntero encima o con movimiento reducido.

La escala de tipografía y espacios se encuentra en `src/index.css`, en el bloque
“Shared roles and rhythm”. Archivo es la familia de lectura y Archivo Black la de
los títulos. Inventario y verificación: `../docs/REVISION_UX_2026-09-12.md`.
