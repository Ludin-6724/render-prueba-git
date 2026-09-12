# Estado del respaldo — restaurada localmente

**RESTAURADA LOCALMENTE, con dependencias externas bloqueadas.** Verificación realizada el 7 de septiembre de 2026 (Guatemala), 8 de septiembre UTC.

Sitio: http://localhost:8087/ · Administración: http://localhost:8087/wp-admin/ · Mailpit: http://localhost:8027/

## Originales conservados

| Componente | Ubicación | Comprobación |
| --- | --- | --- |
| ZIP recibido | `backups/2026-09-08/cgi-bin.zip` | 617439340 bytes, 24324 entradas; CRC y SHA-256 verificados |
| Extracción original | `backups/2026-09-08/archivos-zip/` | 19765 archivos cotejados contra manifiesto, sin diferencias antes de restaurar |
| SQL | `backups/2026-09-08/base-datos/rendermultimedia_wp698.sql.gz` | 275438 bytes comprimidos; gzip válido; 38 tablas con estructura y datos |
| Lectura original de .htaccess | `backups/2026-09-08/archivos/.htaccess` | Preservada sin cambios; es una lectura de texto UAPI, no una descarga binaria certificada |
| XML histórico | `insumos/rendermultimedia.WordPress.2026-09-05.xml` | Complemento de contenido; no sustituye archivos ni SQL |

El ZIP no incluye el `.htaccess` de la raíz. Se utilizó la lectura anterior por API para crear la versión local, retirando únicamente el handler PHP específico de cPanel. La carpeta `pati/` permanece en el ZIP, sin extraer ni ejecutar por alcance no confirmado.

Los originales de Descargas no se movieron. ZIP, SQL y `.htaccess` del respaldo se cotejaron de nuevo al terminar. No se modificó el alojamiento.

## Copia de trabajo y base

Archivos en `sitio-local/wordpress/`, separados del respaldo. Base importada en MariaDB local `render_local`, con credenciales nuevas; no se usa el acceso de producción. Se generaron salts nuevos y un administrador exclusivamente local.

No se copiaron a la carpeta ejecutable las configuraciones de producción, registros antiguos ni `.wpress` históricos. Se conservaron los originales. Cachés de Divi y Autoptimize se regeneraron en la copia porque referenciaban fuentes del dominio público.

La sustitución de URL se hizo con WP-CLI, con simulación previa para cada variante, limitada a tablas `wp5k_`, respetando serialización y sin tocar GUID. No se actualizaron núcleo, tema o plugins. 3349 archivos del núcleo cotejados contra respaldo: sin diferencias.

## Pruebas realizadas

- Siete páginas publicadas: HTTP 200, secciones Divi presentes, imágenes HTML cargadas y sin errores JavaScript en la pasada final.
- 39 adjuntos registrados: archivos presentes; 293 archivos bajo uploads incluyendo derivados/auxiliares.
- Video MP4 de portada: datos cargados y reproducción comprobada.
- Navegación de escritorio, desplegable Portfolio y menú móvil: clics comprobados.
- Inicio en escritorio y móvil (1440 px / 390 px); sin desbordamiento horizontal observado en móvil.
- Inicio de sesión con administrador local y acceso al escritorio.
- Cuatro formularios: validación de vacíos, POST local, captura en Mailpit y redirección a agradecimiento. No se enviaron mensajes a destinatarios reales.
- Bloqueo de API HTTP y conexión TCP externa desde WordPress.
- Detención/inicio con los scripts del proyecto y conservación de datos locales.

## Límites y diferencias

YouTube, Maps, Google Fonts, WhatsApp y servicios sociales externos no se ejecutan como en producción. El navegador bloquea sus solicitudes o navegación. No se afirma reproducción visual idéntica, disponibilidad actual de los videos externos ni equivalencia funcional de esas integraciones.

Solid Security se omite al cargar esta copia para no reproducir el ocultamiento del login ni tareas de producción. Sus archivos y la lista original de plugins activos se conservan. Se añadieron exclusivamente controles locales de aislamiento y captura de correo.

Hay avisos PHP de obsolescencia del plugin de migración antiguo y avisos esperados por bloqueo de servicios externos. No hubo errores fatales en las pruebas. No se contrastó recursivamente todo el ZIP con el servidor en vivo ni se garantiza que archivos y SQL sean una instantánea simultánea.

## Evidencia y siguiente paso

Manifiestos: `manifest-zip.json`, `verificacion-pre-restauracion.json` y `base-datos/verificacion.json` bajo el respaldo. Evidencia de ejecución: `private/local-evidence/`, incluidos inventario, pruebas de navegador/formularios, capturas e integridad del núcleo.

Instrucciones: [ENTORNO_LOCAL.md](ENTORNO_LOCAL.md). Contenidos: [INVENTARIO_SITIO.md](INVENTARIO_SITIO.md). Decisión de plataforma: [RECOMENDACION_RECONSTRUCCION.md](RECOMENDACION_RECONSTRUCCION.md).

La restauración de referencia está lista. El siguiente paso de proyecto es acordar quién mantendrá los contenidos y seleccionar la alternativa de reconstrucción. No se ha implementado el rediseño ni preparado una publicación.
