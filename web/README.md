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

`dist/` incluye HTML de las 7 rutas, `contacto.php`, `thank-you-page/`, `videos/Video1Render.mp4` y `.htaccess`.

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

El hero compone 181 posiciones de scroll usando seis PNG con transparencia de
`public/assets/camera/`, sin video ni chroma key en tiempo real. La imagen completa
permanece como alternativa durante carga o fallo. Con movimiento reducido se
muestra la cámara estática y se elimina el recorrido fijo del scroll.

`Portfolio.tsx` presenta dos carruseles independientes: ONG (18) y Comercial (5).
Admiten arrastre, botones y flechas de teclado. Al cambiar de proyecto se desmonta
el reproductor anterior. Los enlaces conservan `/ongs/` y `/comercial/`.

La escala de tipografía y espacios se encuentra en `src/index.css`, en el bloque
“Shared roles and rhythm”. Archivo es la familia de lectura y Archivo Black la de
los títulos. Inventario y verificación: `../docs/REVISION_UX_2026-09-12.md`.
