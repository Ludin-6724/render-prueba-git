# Entorno local de referencia — RENDER Multimedia

Verificado el 7 de septiembre de 2026 (Guatemala), 8 de septiembre UTC.

## Abrir, iniciar y detener

- Sitio: http://localhost:8087/
- Administración local: http://localhost:8087/wp-admin/
- Captura de correo Mailpit: http://localhost:8027/
- Usuario administrativo exclusivo de esta copia: `render_local_admin`.
- Contraseña: archivo local `private/local-secrets/admin_password`. Abrirlo en el editor; no pegarlo en mensajes ni registrarlo en Git.

Desde la raíz del proyecto, con Docker Desktop abierto:

```sh
./scripts/local-site start
./scripts/local-site status
./scripts/local-site stop
```

Detener conserva los archivos y los volúmenes de base de datos y correo. No usar `docker compose down -v` salvo que se quiera eliminar deliberadamente esos datos locales. Esta etapa no configura arranque automático al iniciar macOS.

## Entorno utilizado

Se reutilizó Docker Desktop ya instalado. WordPress ejecuta el código del respaldo, versión 7.1; PHP 8.2.33, Apache y MariaDB 10.6.27. Divi permanece en 4.27.3. El SQL declara MariaDB 10.6.27, por lo que se eligió la misma versión.

La imagen oficial de WordPress proporciona PHP/Apache y extensiones, pero su instalador automático está sustituido por `apache2-foreground`: no descarga, instala ni sustituye el núcleo respaldado. Se cotejaron 3349 archivos del núcleo con el manifiesto original: cero diferencias. WP-CLI se toma de la imagen oficial `wordpress:cli-php8.2`. Los identificadores de imágenes están registrados en `runtime/images.lock.json`.

- Archivos de trabajo: `sitio-local/wordpress/`.
- Base exclusiva: `render_local`, usuario local del mismo nombre, host interno `db`.
- Configuración reproducible: `runtime/compose.yaml`, `runtime/Dockerfile`, configuraciones de Apache/PHP y `runtime/tools/`.
- Base persistente: volumen Docker `render-reference_render_db`.
- Correo persistente: volumen Docker `render-reference_render_mail`.
- Credenciales generadas localmente: `private/local-secrets/`; directorio con permisos 700, fuera de Git. Los archivos deben ser legibles por el proceso dentro del contenedor y están protegidos en el equipo por ese directorio.

## Aislamiento antes del primer arranque

Los contenedores web, base y correo pertenecen únicamente a la red Docker `internal: true`. Un proxy separado publica solo `127.0.0.1:8087` y `127.0.0.1:8027`; no ejecuta los archivos de WordPress y no admite proxy directo. La base no tiene puerto publicado.

La red impide conexiones externas incluso si un plugin intenta omitir la API HTTP de WordPress. Además, el plugin obligatorio `render-local-safety.php` bloquea `wp_remote_*`, impide programación de tareas y dirige `wp_mail` a Mailpit. Se redirigen destinatarios a `captura@render.invalid` y se eliminan CC/BCC/Reply-To. PHP tiene `sendmail_path=/bin/false` y funciones de ejecución de procesos deshabilitadas.

`DISABLE_WP_CRON`, `WP_HTTP_BLOCK_EXTERNAL`, `AUTOMATIC_UPDATER_DISABLED`, `DISALLOW_FILE_MODS` y `DISALLOW_FILE_EDIT` están habilitados. Apache bloquea `/wp-cron.php`, `/xmlrpc.php` y respaldos web. No hay cron del sistema configurado.

En el navegador, CSP restringe conexiones, formularios, recursos y marcos al origen local. Se permiten scripts `data:` porque Autoptimize los utiliza para código interno. El guardián de navegación local bloquea clics en enlaces a otros dominios, correo y teléfono. No se deben desactivar estas barreras para hacer pruebas de formularios.

Pruebas: API HTTP devolvió `render_local_offline`; conexión TCP directa a un destino externo fue bloqueada; los cuatro formularios probados se capturaron en Mailpit. No se enviaron mensajes reales.

## Restauración realizada

1. Verificación SHA-256 de ZIP, SQL y 19765 archivos extraídos, sin diferencias.
2. Copia separada de archivos; exclusión del wp-config original, registros antiguos y archivos históricos `.wpress` de la copia ejecutable. Todos permanecen en los respaldos.
3. Nuevo wp-config con credenciales locales y salts nuevos. No se usa `.env.local` de cPanel en Docker.
4. Importación de las 38 tablas en `render_local`. El SQL no incluía sentencias USE/CREATE DATABASE ni rutinas que cambiaran de base.
5. WP-CLI `search-replace` para variantes HTTP/HTTPS y con/sin www, primero con `--dry-run`, luego aplicación, usando `--all-tables-with-prefix --skip-columns=guid --precise`. Prefijo exclusivo: `wp5k_`. Resultados en `private/local-evidence/url-*-dry-run.txt` y `url-*-applied.txt`.
6. `.htaccess` de trabajo tomado de la lectura original: solo se retiró el handler `ea-php82` de cPanel, incompatible con Apache local. Se conservaron reescrituras WordPress y protecciones de archivos.
7. Regeneración de cachés Divi/Autoptimize exclusivamente locales: las copiadas contenían direcciones del dominio público para las fuentes de iconos.
8. Creación de administrador exclusivo local y pruebas de navegador.

## Ajustes y límites de reproducción

Solid Security estaba activo y ocultaba `/wp-login.php`. Se omite solo al cargar plugins en esta copia mediante el plugin obligatorio local; su archivo y la opción original de plugins activos se conservan. Así se evita reproducir bloqueos de acceso y tareas de seguridad de producción. Los otros cinco plugins activos se mantienen.

Se desactiva la confirmación periódica del correo administrativo solo localmente. El remitente sintético evita que WordPress rechace `wordpress@localhost` antes de conectar con Mailpit.

Google Fonts, YouTube, Maps y servicios sociales permanecen bloqueados: hay diferencias tipográficas y reproductores/mapas externos sin contenido. El MP4 local de portada sí reproduce. No se actualizaron WordPress, Divi ni plugins. Se registran avisos de obsolescencia de All-in-One WP Migration bajo PHP 8.2 y avisos esperados al bloquear servicios de traducción; no se observaron errores PHP fatales.

Esta copia es un entorno de referencia, no un paquete para publicar: no subir el wp-config local, el plugin obligatorio de aislamiento, ni las configuraciones Docker a producción.

Fuentes: [redes internas Docker](https://docs.docker.com/reference/compose-file/networks/), [WP-CLI search-replace](https://developer.wordpress.org/cli/commands/search-replace/), [captura mediante phpmailer_init](https://developer.wordpress.org/reference/hooks/phpmailer_init/).
