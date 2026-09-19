# RENDER Multimedia

Versión de la home: morph de servicios, trabajos HD, proceso, equipo y navegación.

Código fuente reproducible en `web/`; entrega compilada en la raíz. Solo se incluyen fuentes importadas y assets usados. Fuente local: `12ca8f7`.

Para reconstruir: `cd web`, `npm ci`, `npm run build`; copiar el contenido de `web/dist/` a la raíz y conservar `.cpanel.yml`.

Publicación: rama `main` → actualización del repositorio Git en cPanel → Deploy HEAD Commit. `.cpanel.yml` copia la entrega a `public_html`, sin copiar `web/`. No se asume despliegue automático por push.
