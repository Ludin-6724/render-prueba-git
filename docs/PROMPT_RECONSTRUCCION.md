# Prompt para reconstruir RENDER Multimedia (pegar en el IDE)

Copiar desde “Actúa como…” hasta el final. Completar las rutas locales si el repo de la web nueva no es esta carpeta.

---

Actúa como dirección de arte + front-end senior. Vas a reconstruir el sitio de **RENDER Multimedia** (productora audiovisual en Chiquimula, Guatemala) como web propia, sin WordPress.

Sitio actual (solo referencia de contenido y rutas): https://rendermultimedia.com/
Copia local WordPress (no publicar): http://localhost:8087/ — archivos en `sitio-local/wordpress/`, textos extraídos en `private/local-evidence/contenidos/`, inventario en `docs/INVENTARIO_SITIO.md` y `docs/REQUISITOS_RECONSTRUCCION.md`.
Referencia visual obligatoria: https://landonorris.com/

## Intención

El cliente ya tiene páginas, textos, videos, equipo y formularios en WordPress/Divi/cPanel. Nosotros **no seguimos en WordPress**. Extraemos ese contenido y lo vestimos de nuevo. El resultado se trabaja en local, se versiona en GitHub y se publica en `rendermultimedia.com` (hosting actual, PHP + archivos estáticos, sin Node en producción).

Esto es un rediseño visual y de entrega, no un producto nuevo. No inventes servicios, proyectos ni testimonios. Usa lo que ya está.

## Qué tomar de landonorris.com

Tomar el lenguaje, no la marca:

- Oscuro, cinematográfico, una sola atmósfera de punta a punta.
- Tipografía enorme, editorial, títulos que llenan el viewport.
- Video/foto a sangre (full-bleed), no cards con sombra.
- Menú overlay a pantalla completa; al pasar por Portfolio/Servicios, imagen de apoyo.
- Scroll con intención: revelados, secciones que se quedan, galerías que se desplazan en horizontal.
- Cinta infinita de logos de clientes.
- Intro con animación del logo.
- Footer con peso, no plantilla.

No copies: lima `#D2FF00`, McLaren, F1, blobs, cascos, Webflow, tienda, “rotate your device”.

Paleta RENDER (hasta que el cliente mande otra): fondo `#0B0B0B`, texto `#FFF4E9`, acento `#FFAD4A`. Menú en MAYÚSCULAS.

## Stack y publicación

- Desarrollo local: el que haga falta (Vite está bien).
- Entrega de producción: HTML/CSS/JS + medios + **un** endpoint PHP para el formulario. Compilar en local; el servidor no corre Node.
- Contenido en `content/` (JSON o Markdown): páginas, servicios, proyectos, personas, testimonios, videos.
- Medios en `public/` copiados/optimizados desde el respaldo WP (`wp-content/uploads/`), no sirvas WordPress.
- Logos de clientes: Ludin los va a soltar en el IDE. Deja el marquee listo; no uses `tusitio.com/logo1.png`.
- `.cpanel.yml` que publique solo el build a la raíz pública. Nada de `wp-admin`, SQL, `.env`, backups.
- Repo de la web nueva, limpio. Este proyecto de diagnóstico es referencia, no el artefacto.

## Rutas (no cambiar)

`/` `/servicios/` `/comercial/` `/ongs/` `/nosotros/` `/contacto/` `/thank-you-page/`

Menú: INICIO, SERVICIOS, PORTFOLIO → Comercial y ONG’s, NOSOTROS, CONTACTO.

## Contenido a migrar (ya existe)

**Inicio — 3 servicios:** diseño gráfico, producción audiovisual, marketing digital (textos en `contenidos/inicio.md`).

**Testimonios:** los 5 párrafos de Inicio. No inventes nombres si no están.

**Comercial (5) + YouTube:**
Oasis `tbNvsvHHFlQ` · Centro Gastrointestinal `Ow_KpI904Bw` · Centro Médico Zacapa `_XBxWdjQ6m8` · Chiquimuljá `QWx5tgc4Ts0` · El Cisne `OJ8pltqImsE`

**ONG’s (18) + YouTube:**
`22DlOGutQu0` `x1Z7rZsvcgA` `h4GhTiTASIA` `6SmPa6q6pVE` `AKf5ntYWooo` `XFoLg5SorJA` `fn3t7nj_QVo` `xK_KWaBJcac` `5NiXyBwFUS8` `NPzlBTvHZXQ` `09uhw4rRLDg` `U35iLovrvXA` `5jEEfa3eBd8` `cBeho3llp5E` `k5X0mx8yyeA` `bJoBOQ2wbmM` `nPdhs2Hpksk` `YuxgE4VJKho`
Títulos y copys en `contenidos/ongs.md`.

**Inicio videos:** `dGZlUmXZwA8` `sfKvk-ciQ-g` `4AwXj6mRUZg` `xzurNLvOF2w`

**Hero video local:** `uploads/2024/11/Diseno-sin-titulo-1.mp4`

**Equipo:** 6 PNG `uploads/2024/12/Render-Team_*.png`. Nombre y cargo van quemados en la foto: en la web nueva, foto + nombre + cargo en HTML. Placeholder si no hay recortes.

**Formulario único** (Inicio, Servicios, Contacto): Nombre, Empresa, Email, Servicio (Audiovisual / Diseño / Marketing), Mensaje. POST al PHP. Redirect `/thank-you-page/`. “¡GRACIAS! Muy pronto nos comunicaremos contigo.” Honeypot + validación server-side. Destinatario por env, no hardcodeado en el repo si es público. WhatsApp flotante. Mapa en Contacto con lazy embed.

**Pie:** Render Multimedia · 10 avenida 4-40, Chiquimula 20001, Guatemala · redes del sitio actual.

Servicios: usar la lista larga de `contenidos/servicios.md` (tipos de producción, diseño, marketing y los 6 pasos de “cómo trabajamos”).

## Calidad

- Desktop 1440 y móvil 390, sin scroll horizontal.
- `prefers-reduced-motion`.
- YouTube: poster + carga al clic, no 20 iframes de entrada.
- SEO básico, `lang="es"`, 404, conservar URLs.
- Contraste del crema/ámbar sobre negro.
- No jQuery, no Bootstrap, no plantilla “agency dark” genérica, no gradientes púrpura, no cards idénticas a Lando con lima.

## Orden de trabajo

1. Extraer contenido a `content/` y copiar medios necesarios.
2. Design tokens + layout shell (header overlay, footer, tipografía).
3. Inicio completo (intro logo, hero video, servicios, destacados, logos, testimonios, form).
4. Servicios, Comercial, ONG’s, Nosotros, Contacto, Gracias.
5. PHP del form + `.cpanel.yml`.
6. Pase de QA visual vs landonorris.com (atmósfera, no clon) y vs contenidos reales.

Empieza por el paso 1 y la portada. No dejes lorem. No publiques a producción hasta que yo lo pida.

---

## Cómo usarlo

1. Abre el repo de la web nueva (o esta carpeta si vas a crear `web/` aquí).
2. Pega el bloque de arriba como primer mensaje.
3. Suelta en el proyecto los logos de clientes y, si los tienes, logo/animación y fotos de equipo.
4. El agente debe leer `docs/REQUISITOS_RECONSTRUCCION.md` y `docs/INVENTARIO_SITIO.md` antes de codear.
