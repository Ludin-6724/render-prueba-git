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
| Video de cámara (scroll) | `public/videos/Video1Render.mp4` + poster |
| Logo / isotipo | `public/brand/` |
| Fotos de equipo | `public/assets/team/` |
| Destinatario del formulario | `public/contacto.php` |

Luego `npm run build`. No hace falta WordPress.

## Publicación

`.cpanel.yml` apunta a `public_html/nuevo/` (pruebas). No desplegar sobre la raíz de WordPress sin autorización expresa.

## Video de cámara

`Video1Render.mp4`: H.264, ~10 s, 1168×784, **sin canal alfa**. El hero lo recorre con el scroll (`currentTime`). Silenciado. Con `prefers-reduced-motion` se queda en el poster.
