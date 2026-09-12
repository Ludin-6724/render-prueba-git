# Requisitos — reconstrucción visual de RENDER Multimedia

Sitio público de destino: `https://rendermultimedia.com/`
Referencia visual pedida por el cliente: `https://landonorris.com/`
Fuente de contenidos: copia WordPress ya descargada en este proyecto (páginas, textos, videos, fotos). No se publica WordPress.

## 1. Qué se está haciendo

Rehacer **solo lo visual y la entrega técnica**. El contenido, las páginas, los videos, los servicios y los formularios ya existen. Se extraen de WordPress y se presentan en una web nueva, más cinematográfica, mantenida desde el IDE y publicada por GitHub hacia el hosting actual.

No se cambia de dominio, no se cambia de proveedor, no se toca Google Workspace ni el correo.

## 2. Decisiones ya tomadas

| Tema | Decisión |
| --- | --- |
| CMS | Sin WordPress. Sin Divi. Sin plugins. |
| Dónde se trabaja | Local, en este repositorio / un repositorio de la web nueva. |
| Cómo se publica | GitHub → cPanel (pull + `.cpanel.yml`). Destino: `rendermultimedia.com`. |
| Hosting de producción | Archivos estáticos (HTML/CSS/JS/medios) + PHP para formularios. No asumir Node.js en el servidor. |
| Qué se reutiliza | Textos, páginas, rutas, videos de YouTube, video de portada, fotos, testimonios, datos de contacto. Logos nuevos los aporta Ludin al IDE. |
| Qué se tira | Tema Divi, shortcodes, Autoptimize, Bloom, Solid Security, All-in-One WP Migration, cachés de WordPress. |
| WordPress local | Solo referencia. No se publica `sitio-local/wordpress`. |

## 3. Qué se toma de landonorris.com (y qué no)

Tomar el **lenguaje**, no la marca.

**Sí copiar de la referencia**

- Fondo oscuro, continuo, de una sola atmósfera. No bloques blancos sueltos.
- Tipografía enorme, editorial, con títulos que ocupan la pantalla.
- Medios a sangre: foto/video full-bleed, no tarjetas pequeñas con sombra.
- Menú overlay a pantalla completa, con imágenes al hover (Comercial / ONG’s / Servicios).
- Scroll cinematográfico: revelados, pin de secciones, galerías horizontales.
- Cinta infinita de logos de clientes (equivalente a “partners”).
- Hero de entrada con marca: animación del logo RENDER al cargar.
- Pie con presencia: logo grande, redes, datos, no un footer de plantilla.
- Sensación de estudio audiovisual / productora, no de brochure corporativo Divi.

**No copiar**

- Verde lima `#D2FF00`, paleta McLaren, blobs, cascos, F1, “LN4”.
- Webflow, Rive obligatorio, ni WebGL pesado como requisito de v1.
- Tienda, calendario de carreras, merch.
- Inglés de marca personal. Esta web es de una productora guatemalteca.

**Adaptación de marca RENDER (colores ya usados en el sitio actual)**

- Fondo: negro / carbón cercano a `#0B0B0B`.
- Texto: crema `#FFF4E9`.
- Acento: naranja/ámbar `#FFAD4A` (el color de RENDER, no el lima de Lando).
- Superficies: un tono más claro que el fondo, no gris Bootstrap.
- Tipografía de display con carácter (no Lato por inercia). Cuerpo legible. Menú en mayúsculas, como ya se publicó.

Si Ludin entrega otra paleta o logo, esa entrega gana sobre estos hex.

## 4. Páginas y rutas (conservar)

Las URLs públicas no cambian. Evita redirecciones.

| Página | Ruta | Qué debe mostrar |
| --- | --- | --- |
| Inicio | `/` | Hero con logo/video, 3 servicios, trabajos destacados, testimonios, logos, cotización |
| Servicios | `/servicios/` | Audiovisual, diseño gráfico, marketing digital + proceso de trabajo + formulario |
| Comercial | `/comercial/` | 5 proyectos comerciales con video YouTube |
| ONG’s | `/ongs/` | 18 proyectos institucionales/sociales con video YouTube |
| Nosotros | `/nosotros/` | Equipo: foto + nombre + cargo como texto, no quemado en el PNG |
| Contacto | `/contacto/` | Formulario + mapa + datos |
| Gracias | `/thank-you-page/` | Confirmación corta y vuelta al sitio |

Menú: **INICIO · SERVICIOS · PORTFOLIO (Comercial, ONG’s) · NOSOTROS · CONTACTO**. Mayúsculas.

## 5. Contenido que ya existe y hay que reutilizar

Fuente local: `private/local-evidence/contenidos/`, `private/local-evidence/inventory.json`, medios en `sitio-local/wordpress/wp-content/uploads/` (solo para copiar, no para publicar el WP).

### Inicio — tres servicios

1. **Diseño gráfico.** Materiales visuales, branding, redes.
2. **Producción audiovisual.** Videos que inspiran y elevan la marca.
3. **Marketing digital.** Redes, campañas, visibilidad.

### Inicio — testimonios (textos actuales)

- “Trabajar con Render Media ha sido una excelente experiencia…”
- “Los recomiendo, tanto su equipo como personal es muy profesional.”
- “Podcasts, Videos Corporativos, Pre-Roll's… Profesionalismo, Creatividad, Compromiso…”
- “El mejor proveedor de servicios Multimedia…”
- “Un proveedor con excelente atención, puntualidad y profesionalismo…”

### Comercial (5)

1. Supermercados Oasis
2. Centro Gastrointestinal de Oriente
3. Centro Médico Zacapa
4. Video musical — Chiquimuljá
5. Tiendas El Cisne

YouTube: `tbNvsvHHFlQ`, `Ow_KpI904Bw`, `_XBxWdjQ6m8`, `QWx5tgc4Ts0`, `OJ8pltqImsE`.

### ONG’s (18, títulos actuales)

World Vision (institucional), CATIE cosecha de agua, World Vision Canadá, Animación Cajas Rurales CATIE, World Vision Japón, Proyecto de agua Comapa Jutiapa, Campaña “Suficiente”, Inclusión social ASORECH, ASA 2 CRS, ASA 2 Cáritas, Visita de campo World Vision Guatemala, Los Colores de IXIM, Empleo digno Plan Internacional, Nuevas masculinidades, Proyecto ESCALAR CATIE, Autoayuda Plan, Proyecto ACCER, El valor del agua.

YouTube: `22DlOGutQu0`, `x1Z7rZsvcgA`, `h4GhTiTASIA`, `6SmPa6q6pVE`, `AKf5ntYWooo`, `XFoLg5SorJA`, `fn3t7nj_QVo`, `xK_KWaBJcac`, `5NiXyBwFUS8`, `NPzlBTvHZXQ`, `09uhw4rRLDg`, `U35iLovrvXA`, `5jEEfa3eBd8`, `cBeho3llp5E`, `k5X0mx8yyeA`, `bJoBOQ2wbmM`, `nPdhs2Hpksk`, `YuxgE4VJKho`.

Inicio también tiene 4 videos: `dGZlUmXZwA8`, `sfKvk-ciQ-g`, `4AwXj6mRUZg`, `xzurNLvOF2w`.

### Equipo

Seis láminas actuales: `uploads/2024/12/Render-Team_*.png`. El nombre y el cargo están **dentro de la imagen**. En la web nueva: foto recortada + nombre + cargo en HTML. Si aún no hay fotos limpias, usar las láminas como placeholder y dejar campos de texto editables.

### Medios locales

- Video de portada: `uploads/2024/11/Diseno-sin-titulo-1.mp4` (comprobado).
- Marca: `uploads/2024/10/render-4.png`, isotipo `uploads/2024/11/Isotipo-Render-200mpx-removebg-preview-1.png`.
- Fondo actual (no obligatorio en el rediseño): `uploads/2024/11/Patron@300x.png`.
- Logos de clientes: Ludin los pone en el IDE. Hay un carrusel viejo con `logo1.png`…`logo10.png` de ejemplo; **no usar esas URLs**.

### Contacto y pie

- Render Multimedia
- 10 avenida 4-40, Chiquimula 20001, Guatemala
- Correo de cotización: el del inventario de formularios (no imprimirlo en chats ni en Git público si el repo es público; configurarlo en el PHP / env de producción).
- WhatsApp flotante (Click to Chat actual).
- Redes: conservar iconos/enlaces del pie actual.
- Mapa embebido en Contacto (carga perezosa).

### Formulario (una sola implementación, 3 sitios)

Título: **Quiero cotizar un trabajo**.

| Campo | Tipo |
| --- | --- |
| Nombre | texto, obligatorio |
| Nombre de su empresa | texto, obligatorio |
| Correo electrónico | email, obligatorio |
| Servicio requerido | select: Producción audiovisual / Diseño gráfico / Marketing digital |
| Escribe aquí tu mensaje | textarea, obligatorio |

Éxito → `/thank-you-page/`. Texto: “¡GRACIAS! Muy pronto nos comunicaremos contigo.” Validación cliente y servidor. Protección antispam (honeypot + rate limit; CAPTCHA solo si hace falta). Envío por PHP `mail()` o equivalente del hosting. No WordPress, no Divi, no CF7.

## 6. Requisitos de cada superficie

### Inicio

1. Intro: animación del logo RENDER (2–4 s, se puede saltar). Luego hero a pantalla completa con el MP4 de portada (muted, loop, overlay). Un titular fuerte, no tres párrafos de Divi.
2. Tres líneas de servicio como bloques grandes, no iconitos.
3. Trabajos destacados: recortes de Comercial + ONG’s, con hover que sienta a reel.
4. Cinta de logos de clientes (cuando existan archivos).
5. Testimonios con peso tipográfico, no slider genérico.
6. Formulario de cotización, una sola versión responsive (hoy hay dos copias Divi para desktop/móvil: no repetir eso).

### Servicios

Tres capítulos. Dentro de audiovisual: videos cortos, corporativos, documentales, animación, radio, streaming, podcast, producción de podcast. Diseño: redes, editorial, ilustración, identidad. Marketing: planificación, pauta, medición, contenido. Cerrar con el proceso de 6 pasos que ya está en el sitio.

### Portafolios

Cada proyecto: título, texto, video (YouTube con poster local, iframe al interactuar). Ritmo de scroll, no lista WordPress. Botón a Contacto.

### Nosotros

Pregunta actual: “¿Quién está detrás de RENDER?”. Grid de personas. Sin texto incrustado en la foto.

### Contacto / gracias

Formulario + mapa + dirección. Página de gracias mínima, misma atmósfera.

## 7. Movimiento

Prioridad (v1, viable en hosting estático):

1. Animación de logo al entrar.
2. Revelados al scroll (GSAP ScrollTrigger o equivalente ligero).
3. Menú overlay.
4. Cinta de logos.
5. Hover cinematográfico en proyectos.

Fuera de v1 salvo que se pida después: escenas 3D/WebGL pesadas. `prefers-reduced-motion` desactiva lo no esencial. Móvil a 390 px sin desbordes; no clonar el “rotate your device” de Lando.

## 8. Técnica

- Stack de desarrollo local libre (Vite u otro). El **artefacto publicado** es HTML/CSS/JS + medios + 1 PHP de formulario.
- Contenido en JSON/Markdown del repo (`content/`), no en el marcado a mano en 7 HTML sueltos si se puede evitar.
- Medios optimizados (WebP/AVIF donde aplique, video comprimido). YouTube no se descarga.
- SEO: título, descripción, OG, sitemap, 404, `lang="es"`. Conservar rutas.
- Accesibilidad: foco visible, contraste sobre fondo oscuro, alt en imágenes, formulario etiquetado.
- No secretos en Git. Destinatario del correo y claves en env / archivo fuera del repo público.
- `.cpanel.yml` publica solo el build, no WordPress, no `backups/`, no `.env.local`.
- Repositorio de código ≠ respaldo de WordPress. El WP se queda en este proyecto de diagnóstico como referencia.

## 9. Fuera de alcance (v1)

- Panel de administración para el cliente.
- Blog, tienda, pagos, cuentas de usuario.
- Cambiar DNS, correo o proveedor.
- Recrear Bloom / suscripciones (no hay formulario de newsletter visto).
- Corregir scripts viejos de Divi en producción.
- Copiar el carrusel de logos con URLs `tusitio.com`.

## 10. Entregables

1. Sitio local navegable con las 7 rutas.
2. Contenido extraído a archivos del repo.
3. Formulario PHP funcionando en local (Mailpit o equivalente) y listo para el hosting.
4. Build estático + `.cpanel.yml`.
5. Verificación desktop 1440 y móvil 390.
6. Cuando Ludin autorice: commit, deploy a `rendermultimedia.com`, limpieza de caché NGINX, y WordPress antiguo fuera de `public_html` con plan de reversión.

## 11. Material que Ludin pone en el IDE

- Logos de clientes (PNG/SVG fondo transparente).
- Logo / isotipo / animación de marca si hay versión nueva.
- Fotos de equipo sin texto quemado, si ya las tiene.
- Referencias extra de scroll/3D, si las hay.
- Texto o ubicación de «Productoras de Video», si el cliente lo confirma.

Hasta que lleguen, usar los archivos del respaldo WordPress como placeholder y dejar el hueco de logos vacío-listo.
