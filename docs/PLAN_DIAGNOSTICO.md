# Procedimiento técnico — Diagnóstico y copia de RENDER

Fecha de preparación: 2026-09-08. Ejecución real: pendiente.

## A. Comprobar acceso sin modificar producción

1. Revisar los campos de `.env.local` sin mostrarlos en pantalla.
2. Preparar un cliente HTTP local que lea esos campos explícitamente. Preferir pocas dependencias y una lista cerrada de operaciones de consulta.
3. Autenticar con el esquema de cPanel `Authorization: cpanel USUARIO:TOKEN`, sobre la URL HTTPS confirmada. Usar el patrón `/execute/Modulo/funcion` de UAPI. El puerto habitual es 2083; usar el confirmado por el proveedor [3].
4. Primera consulta sugerida: `DomainInfo/list_domains`. Guardar un resumen de la respuesta; no registrar cabeceras ni secretos. Confirmar también el estado de la operación dentro del JSON [5].
5. Consultar la raíz documental mediante una función de información del dominio documentada y habilitada, o leerla del apartado Dominios de cPanel. No deducirla únicamente por la existencia de `public_html`.
6. Inventariar únicamente la instalación objetivo con las operaciones Fileman disponibles. Consultar esquemas oficiales antes de implementarlas. No usar solicitudes de escritura para probar si el token tiene permiso [6].

Clasificación de resultados:

| Resultado | Interpretación y siguiente paso |
| --- | --- |
| Respuesta válida y operación exitosa | Capacidad comprobada para esa consulta concreta. |
| HTTP 200 con error UAPI | Falló la operación; revisar módulo, parámetros y permisos. |
| HTTP 401/403 | Revisar credenciales, expiración, restricciones y respuesta concreta; no asumir una única causa. |
| Tiempo agotado, DNS o puerto inaccesible | Puede ser red, firewall, endpoint o restricciones del entorno; no prueba que cPanel carezca de API. |
| Error de certificado | Confirmar hostname y certificado con el proveedor; conservar verificación TLS. |
| Función inexistente o deshabilitada | Registrar la limitación y usar otra función documentada o la descarga desde el panel. |

No volcar toda la cuenta en un informe. La API puede mostrar información de servicios que quedan fuera del proyecto.

## B. Inventariar WordPress y el entorno

Recuperar evidencia suficiente para registrar:

- Raíz de la instalación, estructura de carpetas y tamaño aproximado.
- Versión de WordPress y versiones de temas/plugins; distinguir instalado de activo.
- Tema activo, relación padre/hijo, versión de Divi y dependencia del constructor.
- Plugins de formularios, caché, optimización, seguridad y bloques personalizados.
- Imágenes y videos originales o externos, fuentes tipográficas y scripts de terceros.
- PHP efectivo para ese dominio, base de datos asociada y motor/versión cuando se pueda consultar.
- Versiones de Node.js/Python que el panel realmente ofrezca, método de arranque y recursos disponibles. Si la API no lo expone, dejarlo pendiente de una captura o del proveedor.
- Estado observado de caché y límites de CPU, RAM, I/O, procesos y almacenamiento, si están disponibles. No equiparar «caché activa» con «web rápida».

Una carpeta `wp-content/themes/Divi` no prueba por sí sola que Divi esté activo. Confirmar mediante configuración, base de datos o administración de WordPress.

## C. Recuperar la copia

### Archivos

Descargar a `backups/FECHA/archivos/` los archivos de la instalación identificada, incluyendo temas, plugins, uploads y configuración necesaria para restaurar. Proteger los archivos que contienen credenciales. No usar `get_file_content` como descargador universal de binarios: verificar la codificación y emplear un mecanismo documentado que conserve los bytes.

Para descargas por API, gestionar paginación si existe, tiempos de espera, límites de tamaño, reintentos acotados y errores por archivo. Validar que las rutas recibidas queden dentro de la raíz prevista; no seguir enlaces simbólicos fuera de ella. No ejecutar contenido descargado durante el inventario.

Registrar ruta, tamaño y hash local de los archivos recuperados. El hash local detecta cambios posteriores en la copia; no prueba coincidencia con el servidor salvo que exista un valor remoto comparable. Registrar exclusiones y archivos que cambiaron durante la descarga.

### Base de datos

Identificar en la configuración cuál corresponde a esa instalación, sin exponer usuario, contraseña ni salts. Listar bases de datos o leer páginas mediante WordPress REST API no equivale a exportar un SQL completo.

Intentar una exportación o descarga mediante una función documentada y permitida, si está disponible. Si requiere generar un archivo nuevo en producción, explicitar esa operación y su tamaño previsto antes de proceder. Si no hay una vía adecuada por API, indicar a Ludin:

1. En **Backup / Backup Wizard**, descargar la copia de la base de datos correspondiente, si aparece.
2. Como alternativa, seleccionar esa base en **phpMyAdmin** y exportar todas sus tablas, estructura y datos, en SQL.
3. Guardar la descarga en `backups/FECHA/base-datos/`.

Para muchos archivos o archivos grandes, un respaldo descargado desde cPanel o una transferencia SFTP habilitada puede ser más conveniente que llamadas individuales a la API. La limitación de un método no obliga a cambiar de hosting [4].

### Estado de la copia

Usar una de estas etiquetas en el informe:

- **Parcial:** faltan archivos, adjuntos, SQL o hay errores de transferencia.
- **Archivos y SQL obtenidos, restauración pendiente:** los componentes están disponibles, pero no se ha probado que funcionen juntos.
- **Restaurada localmente:** se importó el SQL y se comprobó la web en un entorno local, indicando las pruebas realizadas y limitaciones.

Registrar fecha y hora de archivos y SQL. Una copia tomada mientras la web cambia puede ser inconsistente; no prometer una instantánea exacta sin comprobarlo.

## D. Comprender Divi y preparar la copia local

El objetivo es distinguir código editable en el IDE de contenido administrado en WordPress.

| Elemento | Dónde buscar |
| --- | --- |
| Código del tema y tema hijo | `wp-content/themes/`. |
| Código de plugins | `wp-content/plugins/`, y `mu-plugins/` si existe. |
| Imágenes y archivos subidos | `wp-content/uploads/` y posibles servicios externos. |
| Páginas y shortcodes Divi | Tablas de contenido de WordPress, con el prefijo real. |
| Metadatos, estilos y opciones del constructor | Metadatos y opciones de la base; confirmar estructura según la versión. |
| Diseños reutilizables, cabecera y pie | Biblioteca de Divi / Theme Builder y sus registros asociados [7]. |

El export ya examinado contiene marcadores `et_pb_`; confirmar su correspondencia con la instalación actual. Inspeccionar el prefijo real de tablas y no asumir que es `wp_`. Si existe Multisite, registrarlo antes de plantear la restauración.

Preparar `sitio-local/` a partir de una copia del respaldo. Usar credenciales locales y una base local. Desactivar correo saliente, cron que llame a servicios externos, webhooks e integraciones reales antes de abrir la copia. Adaptar URLs solo en la base local con un procedimiento compatible con datos serializados; evitar reemplazos de texto indiscriminados en SQL.

Comprobar Inicio, Nosotros, Servicios, Contacto, navegación, imágenes y renderizado de Divi. Probar formularios con un receptor local o de pruebas, sin enviar mensajes al cliente. Documentar recursos externos que requieran conexión o licencia. No activar licencias nuevas ni cambiar las existentes como parte de esta inspección.

## E. Decidir cómo trabajar las modificaciones

Comparar estas rutas, con esfuerzo estimado y evidencia:

1. **Mantener WordPress/Divi y añadir código propio.** Evaluar primero por el alcance solicitado. Implementar animaciones o componentes mediante un tema hijo/plugin propio y conservar los contenidos editables.
2. **Portada o sección a medida dentro de WordPress.** Útil si el constructor dificulta la estructura de una escena; documentar cómo conservar navegación, formularios y edición.
3. **Frontend independiente o reconstrucción.** Considerar solo si se justifica por requisitos concretos. Definir edición de contenidos, SEO, formularios, despliegue y mantenimiento. No elegirla por la sola presencia de Node.js.

Las animaciones de scroll y las escenas Three.js se ejecutan en el navegador y pueden integrarse en WordPress [8][9]. El tipo de escena, sus modelos, peso y comportamiento móvil deben acordarse antes de estimar todo el trabajo.

El flujo posterior será: modificación local, control de versiones, prueba representativa, despliegue de pruebas y publicación cuando el trabajo concreto esté autorizado. Separar despliegue de código de cambios de contenido/base de datos; no sobrescribir la base de producción con una copia antigua.

## F. Entrega del diagnóstico

Los informes deben permitir responder, sin jerga innecesaria:

- ¿La conexión funciona desde este entorno? ¿Qué consultas se probaron?
- ¿Qué descargamos y qué falta? ¿Se restauró localmente?
- ¿Qué parte de la web se modifica con código y cuál con WordPress/Divi?
- ¿Qué puede ofrecer el alojamiento y qué requiere confirmación del proveedor?
- ¿Cuál es la intervención mínima para satisfacer al cliente?
- ¿Cuál es el siguiente paso concreto y qué insumo falta, si alguno?

No dar por probados permisos de escritura, compatibilidad completa con Next.js, propiedad del dominio ni rendimiento por haber obtenido respuestas de lectura.

Fuentes numeradas en `../FUENTES.md`.
