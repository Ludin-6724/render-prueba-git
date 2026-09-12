# Inventario del sitio de RENDER Multimedia

Fuente principal: SQL recibido y archivos del ZIP, restaurados localmente. El XML del 2026-09-05 es complementario. La lista de plugins activos procede de la base original antes de aplicar excepciones locales.

## Páginas y rutas

| Página publicada | Ruta que conviene conservar | Contenido reutilizable y funciones |
| --- | --- | --- |
| Inicio | `/` | Logo/cabecera; video local; diseño gráfico, producción audiovisual y marketing digital; proyectos destacados; testimonios; cotización; pie global |
| Servicios | `/servicios/` | Tres áreas de servicio, galería y 22 módulos descriptivos; formulario de cotización |
| Comercial | `/comercial/` | Cinco proyectos y cinco referencias de video YouTube, introducción y enlaces de contacto |
| ONG’s | `/ongs/` | Dieciocho referencias de video y textos de proyectos institucionales/sociales |
| Nosotros | `/nosotros/` | Presentación y seis láminas PNG del equipo |
| Contacto | `/contacto/` | Formulario de cotización y mapa Google embebido |
| Thank you page | `/thank-you-page/` | Confirmación de solicitud y retorno al sitio; destino de los formularios |

Existe además una política de privacidad en borrador, no una página publicada. No se la debe tratar como contenido definitivo aprobado.

Menú `Menu primario`: Inicio, Servicios, Portfolio (contenedor `#`) con Comercial y ONG’s, Nosotros, Contacto. El pie contiene información empresarial, enlaces del sitio e iconos sociales. Navegación de escritorio, submenú Portfolio y menú móvil comprobados mediante clics locales.

Las páginas no necesitan las fechas del patrón general `/%year%/%monthnum%/%day%/%postname%/`. Mantener las siete rutas y el destino de confirmación evita redirecciones innecesarias. Si se cambia `/ongs/` o `/thank-you-page/`, preparar redirecciones 301 y actualizar menús/formularios. No se implementaron redirecciones nuevas. Revisar variantes HTTP/HTTPS y www antes del despliegue según la configuración real del servidor.

## Contenidos y recursos

- 39 adjuntos registrados: 37 imágenes (36 PNG y 1 JPEG) y 2 MP4. Los 39 archivos originales referenciados están presentes.
- 293 archivos en uploads, incluyendo tamaños derivados y recursos auxiliares; este número no equivale a 293 imágenes distintas.
- Marca: `2024/10/render-4.png`, isotipo `2024/11/Isotipo-Render-200mpx-removebg-preview-1.png`, fondos y recursos gráficos de noviembre de 2024. Verificar la variante de logo deseada con el cliente.
- Equipo: seis archivos `2024/12/Render-Team_*.png`. Al menos la lámina inspeccionada incorpora nombre y cargo dentro de la imagen. Para el nuevo diseño conviene recuperar las fotos originales y separar nombre/cargo como texto editable.
- Videos locales: `2024/11/Diseno-sin-titulo-1.mp4` y `2024/12/Diseno-sin-titulo-1.mp4`. El primero está en la portada y se comprobó reproduciendo, sin error de medios. El segundo está presente en la biblioteca, pero su uso visible no se confirmó.
- YouTube: 4 referencias en Inicio, 5 en Comercial y 18 en ONG’s. Son referencias en el contenido; no se descargaron los videos de YouTube ni se confirmó su disponibilidad actual.
- No hay PDF u otros documentos registrados entre los 39 adjuntos. Esto no acredita la inexistencia de archivos no registrados en toda la cuenta.
- Google Fonts y Google Maps son dependencias externas. En el entorno local sus solicitudes se bloquean; se muestran tipografías alternativas y espacios de reproductores/mapas.

Textos extraídos por página en `private/local-evidence/contenidos/`. Contenidos Divi originales, rutas de recursos y adjuntos están en `private/local-evidence/inventory.json`. Se mantienen privados y fuera de Git; no se han editado comercialmente los textos ni actualizado fotos.

## Formularios e integraciones

Hay cuatro instancias de formulario Divi: dos en Inicio para distintos tamaños de pantalla, una en Servicios y una en Contacto. Campos: nombre, empresa, correo, servicio requerido y mensaje. Los cuatro tienen destino de correo explícito y redirección a `/thank-you-page/`; el CAPTCHA aritmético figura desactivado en sus atributos.

Se conservan los destinatarios originales en el respaldo y el inventario privado `forms-and-code.json`; no se publican direcciones privadas en este informe. La ejecución local sustituye cualquier destinatario por una dirección sintética y captura el mensaje en Mailpit. Las cuatro pruebas incluyeron rechazo de campos vacíos, envío válido, captura local y redirección de agradecimiento.

WhatsApp: botón flotante mediante Click to Chat. Hay enlaces sociales y mapa embebido. No se hicieron llamadas reales, aperturas de conversación ni publicaciones sociales. No se confirmó ninguna integración CRM, pago o comercio electrónico; no debe suponerse que existe por tener WordPress.

Bloom está activo, pero no se observó un formulario de suscripción en las páginas probadas. La activación no prueba que haya una lista de correo configurada o utilizada. Monarch sirve recursos en el frontend; sus contadores o servicios remotos no se comprobaron fuera de línea.

## Temas y plugins

Tema activo confirmado en SQL: `template=Divi`, `stylesheet=Divi`, versión 4.27.3. No se usa un tema hijo en este respaldo. Videomaker/Blockbase y los temas Twenty Twenty están instalados, pero no activos.

| Plugin instalado | Versión | Activo en respaldo |
| --- | --- | --- |
| Akismet Anti-spam: Spam Protection | 5.3.3 | No |
| All-in-One WP Migration | 6.77 | Sí |
| Autoptimize | 3.1.12 | Sí |
| Bloom | 1.3.12 | Sí |
| Click to Chat | 4.12 | Sí |
| Contact Form 7 | 5.9.8 | No |
| Elementor | 3.23.3 | No |
| Fullscreen Background | 2.0.1 | No |
| Hello Dolly | 1.7.2 | No |
| Image Optimizer by Elementor – Compress, Resize and Optimize Images | 1.5.2 | No |
| MetaSlider | 3.91.0 | No |
| Monarch Plugin | 1.4.14 | Sí |
| Social Chat | 7.4.5 | No |
| Solid Security Basic | 9.3.6 | Sí; omitido en ejecución local |
| W3 Total Cache | 2.8.0 | No |
| WP Fastest Cache | 1.3.2 | No |
| Yoast SEO | 23.4 | No |

Contact Form 7 y Elementor están instalados pero inactivos; los formularios verificados son de Divi. Los otros plugins de caché instalados tampoco equivalen a optimización activa. All-in-One WP Migration cumple una función administrativa; no es una función a trasladar al nuevo frontend.

## Divi y código personalizado

Se conservan 33 diseños `et_pb_layout`, 2 cabeceras, 1 pie y 2 plantillas del Theme Builder. El renderizado comprobado utiliza las referencias de cabecera 74 y pie 79. Las siete páginas publicadas dependen de shortcodes Divi, con módulos de textos, filas/columnas, imágenes, galerías, videos, sliders, botones y formularios.

En Servicios existe un módulo de código con un carrusel de diez logotipos, CSS y JavaScript, pero está desactivado en los tres tamaños de pantalla. Sus direcciones `tusitio.com/.../logo1.png` a `logo10.png` son ejemplos pendientes, no logos de clientes que funcionen hoy. En Contacto existe un módulo de código activo con el iframe de Google Maps.

No se detectó contenido no vacío en el registro `custom_css` del tema ni en las claves de integración global inspeccionadas. Esto no significa que no haya estilos: hay muchos parámetros de diseño dentro de los shortcodes, metadatos y cachés generadas. No se comparó íntegramente cada archivo del tema/plugin con una distribución del proveedor para detectar modificaciones manuales.

Para reutilizar contenido fuera de Divi hay que convertir textos, medios, proyectos, testimonios y personas en datos estructurados. Eliminar los shortcodes sin extraer sus atributos perdería imágenes, enlaces, destinos y configuración de formularios. Las cachés CSS/JS no deben utilizarse como fuente de diseño nueva.

## Verificación y diferencias

Las siete páginas devolvieron HTTP 200 y renderizaron secciones Divi; en la pasada final no hubo recursos locales HTTP fallidos, imágenes HTML rotas ni errores JavaScript. Se comprobó Inicio a 1440 px y 390 px, sin desbordamiento horizontal en móvil, y se inspeccionaron capturas de pantalla. El acceso administrativo local llegó al escritorio.

El MP4 de portada reproduce. YouTube, Maps, Google Fonts, enlaces de WhatsApp y servicios sociales están bloqueados deliberadamente. Por ello no se afirma equivalencia visual exacta ni reproducción completa de contenido externo. Se conservó una lectura GET de la portada pública para referencia estructural, sin enviar formularios de producción.

Persisten avisos PHP de obsolescencia en el plugin antiguo de migración; no hubo errores fatales. Las comprobaciones no sustituyen una auditoría completa de accesibilidad, SEO o rendimiento. Falta confirmar recursos externos y materiales nuevos del cliente antes de reconstruir.

Evidencia: `browser-verification.json`, `form-verification.json`, `interactions.json`, `core-integrity.json` y capturas en `private/local-evidence/`.
