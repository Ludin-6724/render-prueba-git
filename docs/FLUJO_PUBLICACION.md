# Desarrollo y publicación sin WordPress

## Decisión y alcance

Ludin quiere una web propia mantenida desde el IDE, conservando el hosting, dominio y servicio de Google Workspace actuales. WordPress local será una referencia; su núcleo, plugins y SQL no forman parte del nuevo sitio a publicar.

El proveedor menciona PHP/MySQL y propone WordPress en el audio. Esto no acredita una restricción técnica exclusiva a WordPress. Los requisitos comerciales del descuento de Workspace los define el proveedor; no se ha confirmado que dependan del CMS. Se puede cumplir la petición de mantener el hosting preparando una web compatible con archivos estáticos y PHP.

## Primera publicación autorizada: menú en mayúsculas

Ludin autorizó expresamente el cambio en la web oficial y pidió commit y deploy para los cambios posteriores que solicite. Se publicó el commit `80a370055b8ef22158178b4ee0b89e06d5e2b624` de `Ludin-6724/render-prueba-git` mediante cPanel (despliegue 1, estado `succeeded`). El nombre del repositorio conserva «prueba», pero ahora incluye una tarea real de publicación: tratar sus cambios y despliegues como producción.

La entrega contiene `.cpanel.yml` y `render-menu-uppercase.php`. La tarea crea el directorio `wp-content/mu-plugins` si no existe e instala exclusivamente ese archivo con permisos 0644. La regla CSS aplica `text-transform: uppercase` al menú del encabezado Divi y a su versión móvil, incluidos los submenús. No cambia textos almacenados, URLs, base de datos ni archivos originales de Divi. Es un ajuste mínimo sobre el sitio actual; la reconstrucción futura continúa prevista con código independiente.

Antes de publicar se confirmó que el directorio remoto `mu-plugins` no existía: no hubo archivos originales sobrescritos. Se comprobó sintaxis PHP 8.2 y el menú en las siete páginas locales, también en móvil a 390 px, sin desbordamiento. Después del deploy se verificó la igualdad exacta del archivo remoto con la entrega. La caché NGINX mantuvo inicialmente el HTML anterior; se solicitó `NginxCaching/clear_cache` sin cambiar su configuración. Evidencia privada: `private/local-evidence/menu-*.json` y capturas asociadas.

Verificación pública: las siete páginas respondieron 200 y los siete enlaces del menú de escritorio (incluidos submenús) presentaron `text-transform: uppercase`. La carga móvil pública mostró un fallo intermitente de scripts: algunas visitas no generaron `.et_mobile_menu` y reportaron `mediaelementplayer is not a function`; otra visita con el ajuste activo generó el menú sin errores. Una comparación retirando únicamente nuestro estilo dentro del navegador de pruebas también reprodujo el error (sin modificar producción). Evidencia: `menu-mobile-script-diagnosis.json`. La prueba móvil local sí pasó. No se amplió el cambio solicitado para corregir scripts del sitio.

Reversión: preparar un nuevo commit que retire la regla CSS del archivo propio y desplegarlo con la misma tarea; limpiar caché y comprobar el menú. Revertir Git a un commit que no incluya el archivo no lo elimina automáticamente del servidor. No borrar el directorio `mu-plugins` ni otros archivos que se incorporen posteriormente.

Fuentes técnicas: [plugins de carga automática](https://developer.wordpress.org/advanced-administration/plugins/mu-plugins/), [tarea de despliegue cPanel](https://api.docs.cpanel.net/specifications/cpanel.openapi/deployment-settings/versioncontroldeployment-create), [limpieza de caché NGINX](https://api.docs.cpanel.net/specifications/cpanel.openapi/nginxcaching/clear_cache).

## Git: actualización de la prueba (histórica)

Prueba confirmada: GitHub → repositorio aislado de cPanel. Se conectó el plugin MCP de GitHub con la cuenta `Ludin-6724` y se verificaron permisos de escritura sobre `Ludin-6724/render-prueba-git`. Mediante MCP se crearon únicamente `README.md` y `prueba-git.txt`, sin contenidos privados del proyecto.

Se actualizó el repositorio `/home/rendermultimedia/repositories/render-prueba-github` mediante `VersionControl/update` con rama `main`. La consulta posterior confirma el mismo commit que GitHub: `a4df40306d155e1694ec1808944710290ff45793`, sin tareas pendientes. Se leyeron los dos archivos desde esa carpeta mediante API y se comprobó igualdad exacta con el contenido enviado. Evidencia sin secretos: `private/cpanel-github-update.json`.

Esto verifica escritura por MCP en GitHub y descarga/actualización desde GitHub hacia cPanel para un repositorio público. No verifica autenticación para repositorios privados, push directo hacia cPanel ni despliegue automático. `deployable=0`: no hay publicación configurada. No se modificó `public_html`, DNS ni correo.

Historia: el repositorio de GitHub estaba vacío al crearse la clonación inicial (`private/cpanel-github-clone.json`). La conexión anterior de la CLI tenía solo lectura; la nueva conexión MCP sí tiene escritura.

El usuario creó `/home/rendermultimedia/repositories/render-prueba-git`. La API confirma que existe, sin rama todavía (`branch=null`) y sin despliegue preparado (`deployable=0`). `clone_urls.read_only` y `clone_urls.read_write` están vacíos. No se pudo obtener desde cPanel una URL de clonación para comprobar clone/push. Esto no acredita falta de conectividad general ni un error del repositorio: debe confirmarse el acceso shell/SSH de la cuenta con el proveedor. No se ha probado autenticación SSH ni enviado código. Evidencia: `private/cpanel-git-test.json`.

## Git: comprobación inicial (histórica)

`VersionControl/retrieve` respondió con éxito funcional UAPI y devolvió una lista vacía. No existen repositorios registrados en la administración Git consultada. Esto no prueba que no haya repositorios creados fuera de cPanel.

El repositorio local existe, pero no tiene remoto configurado. No se creó un repositorio remoto, no se probaron permisos de escritura, no se configuró SSH y no se activó un despliegue. Evidencia sin credenciales: `private/cpanel-git-check.json`.

## Flujo recomendado

1. Desarrollar la nueva web en el proyecto local, con contenido estructurado y medios seleccionados. Conservar intacta la referencia WordPress.
2. Guardar código y contenido propio en Git. Excluir respaldos, SQL, credenciales, datos de pruebas y el WordPress completo.
3. Generar localmente los archivos que necesita el hosting: HTML/CSS/JS, imágenes y, si corresponde, un endpoint PHP de formularios. Si se utiliza una herramienta de compilación, no exige por sí sola instalar Node.js en el servidor.
4. Preparar un repositorio remoto privado y resolver su autenticación. cPanel admite repositorios Git, pero un repositorio privado y la modalidad elegida pueden requerir acceso SSH/shell o configuración adicional del proveedor.
5. En cPanel, mantener el repositorio fuera de la raíz pública. Configurar una tarea de despliegue que publique exclusivamente los artefactos de la web, primero en un destino de pruebas definido.
6. Comprobar rutas, medios y formularios en pruebas. Preparar el cambio de la web pública y una reversión antes de ejecutar la publicación autorizada.

cPanel documenta dos modalidades: push hacia un repositorio administrado por cPanel con despliegue automático configurado, o pull desde otro remoto y publicación mediante `Update from Remote` / `Deploy HEAD Commit`. La publicación utiliza tareas declaradas en `.cpanel.yml`. Tener Git disponible no significa que esas tareas estén ya configuradas ni autorizadas.

## Actualizaciones posteriores

La copia local y Git serán la fuente del desarrollo. No se vuelve a descargar toda la web para cambiar una foto o un texto. Se modifica localmente, se prueba, se guarda una nueva versión y se publica la entrega correspondiente.

Git transfiere cambios del repositorio; los archivos finales que se copian al sitio dependen de la tarea de despliegue. Una compilación puede regenerar varios archivos aunque el cambio original sea pequeño. No prometer que siempre basta con subir un único archivo.

Deben publicarse conjuntamente los artefactos relacionados. Las eliminaciones y cambios de nombre requieren manejo explícito para evitar archivos antiguos accesibles. No usar borrados generales sobre `public_html` sin delimitar exactamente qué archivos pertenecen al nuevo sitio. No mezclar el repositorio de código con secretos, correo, otras carpetas o datos recibidos mediante formularios.

Si alguien modifica archivos directamente en cPanel, esas modificaciones deben recuperarse y conciliarse con Git antes de publicar otra versión. Evitar ese flujo habitual reduce divergencias.

## Primera sustitución de WordPress

La primera publicación es una transición completa de la aplicación: recrear formularios, rutas, menú, portafolio, equipo y metadatos, además de instalar los archivos nuevos. No basta con sobrescribir unos archivos de Divi ni con subir `sitio-local/wordpress`.

Una vez probada y autorizada, el WordPress antiguo debe quedar respaldado fuera de la raíz pública según el plan de reversión; no dejar una instalación abandonada coexistiendo con la web nueva. El dominio y los registros de Google Workspace no necesitan cambiar por sustituir el código de la web en el mismo hosting.

## Alternativa si Git no permite desplegar

Usar una transferencia autenticada adecuada (SFTP/FTPS si está habilitada, Administrador de archivos o API de carga verificada) para publicar los artefactos nuevos/modificados y gestionar las bajas del mismo conjunto. Git sigue siendo útil localmente aunque la subida sea manual. La API de descarga devolvió 403 en pruebas previas; eso no demuestra que una operación de subida tenga el mismo resultado. La subida todavía no se ha probado.

## Paso siguiente concreto

Preparar el proyecto de código propio y su primera estructura de contenidos. Después definir repositorio remoto, autenticación y destino de pruebas, y verificar el despliegue sobre esa entrega concreta. No se creó un `.cpanel.yml` con destino a producción ni se publicaron archivos en esta revisión.

Fuentes: [Git en cPanel](https://docs.cpanel.net/cpanel/files/git-version-control/), [configuración de despliegue](https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-set-up-deployment/), [registros de correo de Google Workspace](https://support.google.com/a/answer/6156494).
