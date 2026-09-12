# Diagnóstico inicial de RENDER Multimedia

## Actualización final: copia restaurada localmente

El sitio ya funciona en http://localhost:8087/. Se verificaron páginas, adjuntos, administración, formularios con captura local y aislamiento de red. El estado vigente se encuentra en [ESTADO_RESPALDO.md](ESTADO_RESPALDO.md) y el inventario actualizado en [INVENTARIO_SITIO.md](INVENTARIO_SITIO.md). Los apartados siguientes conservan el historial de recuperación y sus pendientes ya resueltos.

## Estado actualizado — ZIP recibido el 7 de septiembre de 2026

**Archivos principales y SQL obtenidos; restauración pendiente.** Se importó `cgi-bin.zip` desde Descargas, conservando el original y una copia idéntica en `backups/2026-09-08/cgi-bin.zip`.

- ZIP: 617439340 bytes, 24324 entradas. Validación CRC de todas las entradas completada sin errores; SHA-256 de origen y copia coinciden.
- Extracción verificada: 19765 archivos en `backups/2026-09-08/archivos-zip/`, incluyendo wp-admin, wp-includes, wp-content y wp-config.php. Contiene 293 archivos bajo uploads.
- La configuración identifica la misma base que el SQL recibido. No se mostraron ni ejecutaron credenciales.
- `.htaccess` de la raíz falta en el ZIP; existe una lectura de texto previa por UAPI en `backups/2026-09-08/archivos/.htaccess`. Debe incorporarse de forma controlada al preparar la copia de trabajo. No se afirma identidad binaria de esa lectura con el archivo remoto.
- `pati/` permanece dentro del ZIP original, pero sus cuatro entradas no se extrajeron porque su relación con el sitio sigue pendiente.
- Evidencia y hashes individuales: `backups/2026-09-08/manifest-zip.json`. Originales y extracción excluidos de Git.

**Siguiente paso:** preparar una copia de trabajo aislada, importar el SQL con credenciales locales y desactivar correo, cron e integraciones externas antes de ejecutar WordPress. Aún no se probó restauración ni se comparó recursivamente todo el ZIP contra el servidor actual.

## Historial del diagnóstico anterior

Comprobación: 7 de septiembre de 2026 (Guatemala), 8 de septiembre UTC.
Estado: acceso UAPI confirmado; recuperación parcial; restauración pendiente.

## Hallazgos

- **Confirmado:** HTTPS con certificado verificado en `https://rendermultimedia.com:2083`. `/cpanel` sirve una página de redirección, no la base de UAPI.
- **Confirmado:** `DomainInfo/list_domains` y `DomainInfo/single_domain_data` respondieron con éxito funcional UAPI. Raíz del dominio: `/home/rendermultimedia/public_html`. PHP configurado: `ea-php82`; versión exacta de ejecución pendiente.
- **Confirmado:** funcionan `Fileman/list_files`, `Fileman/get_file_content` y `Backup/list_backups`. Este último enumera 2026-09-05 y 2026-08-29; no se verificó su contenido ni integridad.
- **Confirmado:** `/download` devolvió HTTP 403 usando el token. Una prueba con autenticación básica usando la contraseña suministrada devolvió HTTP 401. No demuestra que el Administrador de archivos del navegador no permita descargar, ni identifica por sí solo la causa de rechazo.
- **Confirmado:** se preparó `scripts/cpanel_read.py`, con lista cerrada de consultas, TLS verificado, bloqueo de redirecciones autenticadas y comprobación de estado UAPI. Configuración en `.env.local`, permisos 600, excluida de Git; contraseña no guardada.
- **Confirmado, actualización 19:39 Guatemala:** recibido `rendermultimedia_wp698.sql.gz`, gzip válido con 38 tablas y datos. Ver `ESTADO_RESPALDO.md`.
- **Pendiente:** archivos completos del sitio e importación de prueba del SQL. No hay copia local funcional.

Evidencia local privada: `private/connection-check.json`, `private/listing-*.json`, `private/diagnostic-summary.json`; textos recuperados y hashes en `backups/2026-09-08/manifest.json`.

## Límites y permisos

No se probaron operaciones de escritura ni se crearon respaldos en producción. La documentación ofrece operaciones de modificación y generación de copias, pero su existencia no acredita autorización ni permisos efectivos. No se modificaron DNS, correo, archivos ni base de datos remota.

No se ha medido rendimiento ni confirmado CPU, memoria, I/O, cuotas, versión de Node.js/Python o disponibilidad de SSH/SFTP. El cliente local Python sí realiza consultas HTTPS correctamente; los rechazos HTTP son respuestas del servicio, no una falta general de red local.

La carpeta `pati/` aparece en la raíz; no se recorrió porque su relación con esta instalación está pendiente. No se inspeccionaron buzones ni otros sitios.

## Próximo paso

El SQL ya está incorporado. Aportar los archivos de la instalación mediante una descarga autenticada del panel o una transferencia SFTP habilitada. Ver `ESTADO_RESPALDO.md`.

Documentación consultada: [UAPI y tokens](https://api.docs.cpanel.net/cpanel/tokens), [información del dominio](https://api.docs.cpanel.net/specifications/cpanel.openapi/domain-information), [archivos](https://api.docs.cpanel.net/specifications/cpanel.openapi/manage-files/list_files).

## Reintento de descarga por API

Se consultó `Fileman/getfileactions` de API2 para `wp-includes/version.php`. La consulta devolvió éxito y una acción de descarga; se probó la URL devuelta, conservando TLS verificado y el mismo origen. La descarga también devolvió HTTP 403. No se crearon archivos ni respaldos en el servidor. Evidencia: `private/download-retry.json`. Esta prueba no demuestra que falle una descarga desde una sesión válida del navegador.
