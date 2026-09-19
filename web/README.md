# RENDER Multimedia

Web propia con React, Vite y TypeScript. Archivo / Archivo Black y assets locales.

## Desarrollo y build

```sh
npm ci
npm run dev -- --port 7101
npm run build
```

El build genera `dist/`, con HTML para las rutas, assets y formulario PHP. No requiere Node en el hosting. Para probar el formulario localmente: `php -S 127.0.0.1:8088 -t public`; Vite proxifica `contacto.php`.

## Home y contenido

Orden: Scroll Morph → Nuestro trabajo (Comerciales / ONG) → El proceso → Manifiesto → Testimonios → Equipo → Contacto.

- Hero: `src/components/hero/scroll-morph-hero.tsx`. Intro R → RENDER, cámara original explode/assemble en Audiovisuales y fotos que avanzan con el scroll. Marketing empieza por Pauta digital; Audiovisuales por Julio y Kenny. Datos: `src/content/scroll-morph-images.json`. Los rangos se calculan según las fotos.
- Trabajos: `src/content/projects.ts`, carrusel adaptado en `src/components/portfolio/`. Posters HD con fallback y video al abrir modal; autoplay 3 s, pausa con video abierto.
- Proceso: `src/sections/Proceso.tsx`. Seis pasos vinculados al scroll y permanencia final; modo estático con movimiento reducido.
- Equipo: `team` en `src/content/site.ts`, fotos locales y marquee con pausa. Kenny, Julio, Andrés y César.
- Testimonios: objetos `testimonios` en `src/content/site.ts`, con autor y fuente. No se inventan cargos o fotos.
- Menú: `src/sections/Navbar.tsx`; anclas `#audiovisuales`, `#marketing`, `#diseno`, `#proceso`, `#trabajo`, `#nosotros`. `/servicios/` redirige al morph.
- Contacto: `public/contacto.php` y `src/sections/Contacto.tsx`.

## Publicación

Repositorio de entrega: https://github.com/Ludin-6724/render-prueba-git, rama `main`.

La raíz del repositorio de entrega contiene el build público y `.cpanel.yml`. El código fuente seleccionado está en `web/`, fuera de las rutas que copia cPanel a `public_html`. No publicar `.env`, respaldos, WordPress local, dependencias, capturas ni versiones descartadas.

cPanel: actualizar desde `origin/main` el repositorio `/home/rendermultimedia/repositories/render-prueba-github`, luego desplegar HEAD. `.cpanel.yml` copia únicamente los archivos de la entrega al dominio. No se asume que un push a GitHub active por sí solo un despliegue. No cambiar DNS, correo ni configuración de Google Workspace.
