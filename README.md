# Render — Inicio del proyecto en Codex

## Copia local lista

Abrir http://localhost:8087/. Con Docker Desktop abierto, ejecutar `./scripts/local-site start`; para detener, `./scripts/local-site stop`. Administración y credenciales locales: [docs/ENTORNO_LOCAL.md](docs/ENTORNO_LOCAL.md).

- [Inventario del sitio](docs/INVENTARIO_SITIO.md)
- [Recomendación de reconstrucción](docs/RECOMENDACION_RECONSTRUCCION.md)
- [Estado de respaldo y verificación](docs/ESTADO_RESPALDO.md)

## Paquete inicial de instrucciones (histórico)

VISCODE · RENDER Multimedia · Preparado el 8 de septiembre de 2026

## Resultado de esta primera etapa

Obtener una copia local verificable del sitio existente y un diagnóstico que permita decidir cómo modificarlo con código. La primera tarea termina con evidencia de los accesos disponibles, lo descargado, lo que falta y una recomendación técnica. El rediseño y la publicación vienen después.

Este paquete contiene instrucciones de trabajo. No contiene el sitio de RENDER, un respaldo, credenciales ni una conexión ya configurada.

## 1. Abrí el proyecto Render

1. Descomprimí el paquete: obtendrás una carpeta `Render`.
2. Guardala en tu computadora donde administrás tus proyectos.
3. Abrí esa carpeta como proyecto en tu aplicación de Codex o en tu IDE con Codex, y usá el nombre **Render**. La ubicación exacta del botón depende de la aplicación que uses.
4. Comprobá que `AGENTS.md` esté en la raíz de la carpeta que abriste. Ese archivo contiene el contexto y las instrucciones para el agente [1].

Para este flujo es práctico trabajar sobre una carpeta local. Un proyecto alojado en la nube necesitará su propia configuración de secretos y acceso de red; los archivos de tu computadora no aparecen allí automáticamente.

## 2. Agregá lo que ya tenés

Creá una carpeta `insumos/` y colocá allí:

- El export `rendermultimedia.WordPress.2026-09-05.xml` que ya descargaste.
- Las capturas de cPanel y, cuando los recibas, fotos, logotipos y textos del cliente.
- Uno o dos enlaces de referencia que muestren las animaciones que quiere Julio.

El XML sirve para entender los contenidos y la estructura de Divi. **No es una copia completa de WordPress**: no incluye todos los archivos, imágenes originales, temas, plugins ni la base de datos completa.

## 3. Prepará el acceso API

En cPanel, abrí **Manage API Tokens**. Creá un token llamado `viscode-render-dev`, con una fecha de vencimiento adecuada al trabajo, y guardalo cuando se muestre. Esa pantalla permite un token con acceso amplio a las funciones API de tu cuenta; no lo limita a una sola carpeta [2].

En tu computadora:

1. Copiá `.env.example` como `.env.local`.
2. Completá la URL HTTPS real de cPanel, el usuario y el token.
3. Usá el hostname confirmado por el proveedor. La URL base no debe incluir rutas de sesión como `/cpsess...`.
4. Conservá `.env.local` fuera de Git y de los mensajes. El paquete incluye un `.gitignore` para ello.

Un archivo `.env.local` no conecta nada por sí solo: el cliente API que prepare Codex deberá leerlo explícitamente. Esta integración utiliza el token de **cPanel**, no una clave API de OpenAI [3].

## 4. Dale a Codex la tarea inicial

Abrí `PROMPT_INICIAL.md`, copiá su texto y pegalo en el primer mensaje del proyecto.

Codex deberá preparar un cliente API pequeño, probar consultas de lectura y documentar resultados. No hace falta crear un MCP para comenzar. Si falta un dato de conexión, debe identificarlo sin pedir que pegues el token en el chat.

## 5. Conseguí una copia útil

Codex intentará obtener los archivos del sitio por los métodos de lectura y descarga disponibles. Además, deberá identificar y obtener una exportación SQL de la base de datos de esa instalación.

Si la API no permite descargar el respaldo completo, completá lo faltante desde **Backup / Backup Wizard** o **phpMyAdmin** en cPanel, según el diagnóstico. Para WordPress se necesitan archivos y base de datos. Descargar solo código o solo el XML no permite reproducir todo el sitio.

Un respaldo completo de cPanel puede incluir servicios ajenos a la web y su restauración automática requiere WHM o al proveedor. Para trabajar localmente interesa separar los archivos de WordPress y su base de datos [4].

Guardá los originales en `backups/` y la copia de trabajo en `sitio-local/`. El inventario de descarga debe indicar faltantes, errores y fecha; una descarga parcial se etiqueta como parcial.

## 6. Revisá el diagnóstico

Al finalizar esta etapa, Codex deberá entregarte:

| Archivo que generará | Qué debe responder |
| --- | --- |
| `docs/DIAGNOSTICO.md` | ¿Qué acceso funciona? ¿Qué se comprobó y qué sigue pendiente? |
| `docs/INVENTARIO.md` | ¿Dónde está WordPress? ¿Qué temas, plugins, versiones y recursos utiliza? |
| `docs/ESTADO_RESPALDO.md` | ¿Qué archivos y base de datos se obtuvieron? ¿Se pudo restaurar una copia local? |
| `docs/PROPUESTA_TECNICA.md` | ¿Conviene modificar Divi, hacer una sección propia o reconstruir alguna parte? |

Estos informes no vienen rellenados porque todavía no se ha probado la conexión.

## 7. Pasá al desarrollo

La primera opción que evaluaremos es conservar WordPress y desarrollar las mejoras con código donde haga falta. Una portada a medida o una animación no obliga a reemplazar toda la web.

Con la copia local funcionando, se puede construir una sección representativa, probarla en móvil y escritorio y definir el resto del alcance. Los cambios se guardan en Git; posteriormente se prepara su despliegue a pruebas y, cuando corresponda, al sitio público.

Las opciones Node.js y Python que aparecen en cPanel amplían las posibilidades. Sus iconos no demuestran que una versión concreta, un framework o los recursos necesarios estén disponibles.

## Archivos del paquete

- `AGENTS.md`: contexto y reglas del proyecto para Codex.
- `PROMPT_INICIAL.md`: primer mensaje listo para copiar.
- `docs/PLAN_DIAGNOSTICO.md`: procedimiento técnico y criterios de verificación.
- `.env.example`: campos de conexión vacíos.
- `.gitignore`: exclusiones de secretos, respaldos e insumos privados.
- `FUENTES.md`: documentación oficial y procedencia de los datos.

Referencias [1]–[4] y fuentes técnicas: ver `FUENTES.md`.

## Diagnóstico ejecutado — 7 de septiembre de 2026

La conexión UAPI ya fue comprobada. Consultar los resultados en:

- [Diagnóstico](docs/DIAGNOSTICO.md)
- [Inventario](docs/INVENTARIO.md)
- [Estado de la copia](docs/ESTADO_RESPALDO.md)
- [Propuesta técnica](docs/PROPUESTA_TECNICA.md)

Para repetir la consulta de conexión: `python3 scripts/cpanel_read.py`. El cliente lee `.env.local` y solo muestra el estado. Ya se recibieron el SQL y el ZIP del sitio. La restauración sigue pendiente; véase el estado actualizado y la salvedad sobre `.htaccess` en `docs/ESTADO_RESPALDO.md`.
