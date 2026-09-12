# Inventario inicial — parcial

Evidencia obtenida el 7 de septiembre de 2026 (Guatemala).

## Instalación

| Elemento | Estado | Evidencia |
| --- | --- | --- |
| Raíz `/home/rendermultimedia/public_html` | Confirmado | DomainInfo/single_domain_data |
| WordPress 7.1 declarado en archivos | Confirmado | `wp-includes/version.php`; no se verificó integridad contra la distribución oficial |
| PHP configurado 8.2 | Confirmado | `phpversion=ea-php82`; versión efectiva exacta pendiente |
| Base `rendermultimedia_wp698` | Confirmado como configuración | `wp-config.php`, sin publicar credenciales |
| Prefijo `wp5k_` | Confirmado como configuración | `wp-config.php` |
| Multisite | Pendiente de verificación completa | No se detectó declaración literal `MULTISITE=true` en el archivo leído |
| Divi 4.27.3 instalado | Confirmado | Cabecera de `wp-content/themes/Divi/style.css` |
| Divi utilizado por la portada | Inferido | El HTML público referencia recursos del tema Divi; configuración activa de la base pendiente |
| Tema hijo de Divi | Pendiente | No identificado en esta revisión; no confundir con Videomaker |
| Videomaker 1.0.25, hijo de Blockbase | Confirmado instalado | `Template: blockbase` en su CSS |
| Blockbase 3.1.17 | Confirmado instalado | Cabecera del CSS |

También están instalados Twenty Twenty-Two, Twenty Twenty-Three, Twenty Twenty-Four y Twenty Twenty-Five. Su presencia no demuestra activación.

## Plugins

Directorios confirmados: akismet, all-in-one-wp-migration, autoptimize, better-wp-security, bloom, click-to-chat-for-whatsapp, contact-form-7, elementor, fullscreen-background, image-optimization, ml-slider, monarch, w3-total-cache, wordpress-seo, wp-fastest-cache y wp-whatsapp-chat. También existe `hello.php`.

La portada pública referencia recursos de Autoptimize, Click to Chat y Monarch. Esto es evidencia de recursos servidos, no una lista definitiva de plugins activos. La coexistencia de varios plugins de caché instalados no prueba un conflicto activo. Confirmar `active_plugins` y opciones al obtener el SQL.

## Contenido y Divi

**Confirmado en el XML histórico del 2026-09-05:** 104 registros, 39 adjuntos referenciados, 8 páginas de las cuales 7 publicadas: Inicio, Contacto, Servicios, ONG's, Comercial, Thank you page y Nosotros. Las siete contienen marcadores Divi.

Incluye 33 registros `et_pb_layout`, 2 `et_header_layout`, 1 `et_footer_layout`, 2 `et_template` y 1 `custom_css`. Existen metadatos de Theme Builder, CSS personalizado, uso del constructor y referencias de cabecera/pie. No equivalen a toda la configuración de `wp_options` actual.

Se identificaron módulos de video, galerías, sliders, menú, imágenes, texto, 5 formularios Divi y 2 módulos de código en el conjunto exportado; pueden incluir diseños guardados y no necesariamente páginas activas. Receptores de formularios e integraciones no se ejecutaron.

**Confirmado en archivos:** `wp-content/uploads` contiene carpetas 2024, 2025, 2026, fonts, elementor, ao_ccss, ithemes-security y wpcf7_uploads. Hay `cache`, `et-cache`, `languages` y `ai1wm-backups`.

**Pendiente:** inventario recursivo completo, tamaño de la instalación, imágenes y videos originales, recursos externos/licencias, configuración actual de formularios, diseños activos, CSS/JavaScript globales y opciones completas del constructor.

Fuentes locales: `private/xml-analysis.json`, `private/home.html`, `private/listing-*.json`, `private/diagnostic-summary.json` y `insumos/rendermultimedia.WordPress.2026-09-05.xml`.

## Actualización: SQL recibido

El 7 de septiembre de 2026, a las 19:39 Guatemala, se verificó el volcado recibido: gzip válido, 38 tablas con el prefijo esperado, estructura y datos presentes. Las comprobaciones pendientes sobre opciones activas y contenido actual pueden realizarse ahora sobre este SQL. Todavía no se importó ni se verificó funcionalmente. Véase `ESTADO_RESPALDO.md`.

## Estado actualizado — ZIP recibido el 7 de septiembre de 2026

**Archivos principales y SQL obtenidos; restauración pendiente.** Se importó `cgi-bin.zip` desde Descargas, conservando el original y una copia idéntica en `backups/2026-09-08/cgi-bin.zip`.

- ZIP: 617439340 bytes, 24324 entradas. Validación CRC de todas las entradas completada sin errores; SHA-256 de origen y copia coinciden.
- Extracción verificada: 19765 archivos en `backups/2026-09-08/archivos-zip/`, incluyendo wp-admin, wp-includes, wp-content y wp-config.php. Contiene 293 archivos bajo uploads.
- La configuración identifica la misma base que el SQL recibido. No se mostraron ni ejecutaron credenciales.
- `.htaccess` de la raíz falta en el ZIP; existe una lectura de texto previa por UAPI en `backups/2026-09-08/archivos/.htaccess`. Debe incorporarse de forma controlada al preparar la copia de trabajo. No se afirma identidad binaria de esa lectura con el archivo remoto.
- `pati/` permanece dentro del ZIP original, pero sus cuatro entradas no se extrajeron porque su relación con el sitio sigue pendiente.
- Evidencia y hashes individuales: `backups/2026-09-08/manifest-zip.json`. Originales y extracción excluidos de Git.

**Siguiente paso:** preparar una copia de trabajo aislada, importar el SQL con credenciales locales y desactivar correo, cron e integraciones externas antes de ejecutar WordPress. Aún no se probó restauración ni se comparó recursivamente todo el ZIP contra el servidor actual.

