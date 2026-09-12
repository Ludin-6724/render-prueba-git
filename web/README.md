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

El hero empieza con la cámara armada sobre blanco. Un único recorrido de scroll
controla todo el giro del video, del tiempo cero al montaje final; después el
bloque sticky se libera y continúa el contenido. No existe una fase de despiece
adicional antes del giro.

`public/videos/camera-360-studio.mp4` reutiliza la pista H.264 del «Video en
blanco.mp4» aportado por Ludin, sin recomprimirla: solo se retira el audio y se
activa faststart. El poster WebP sin pérdida procede de su primer fotograma.
La imagen y la tipografía mantienen su nitidez; el título permanece opaco y
separado del área de movimiento. El blanco del hero coincide con el blanco
#fdfdfd del material original para evitar el borde del rectángulo del video.
Durante carga, fallo o preferencia de movimiento reducido se conserva el poster.

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
