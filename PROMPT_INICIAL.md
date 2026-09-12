Leé `AGENTS.md`, `README.md` y `docs/PLAN_DIAGNOSTICO.md`. Este proyecto se llama Render y corresponde a mi cliente RENDER Multimedia. Soy Ludin Guerra, de VISCODE.

Quiero modificar su sitio WordPress/Divi desde mi entorno de desarrollo. Tengo acceso a cPanel y prepararé el token API en `.env.local`; no me pidas pegarlo en el chat. Todavía no sé qué parte del sitio está en archivos y qué parte depende del constructor o de la base de datos.

Realizá la primera etapa completa: conexión, diagnóstico y recuperación de una copia local cuando sea posible. No publiques modificaciones en el servidor.

1. Revisá el entorno local y los insumos disponibles. Si falta un dato de conexión, indicá únicamente el campo que debo completar y avanzá con el análisis local posible.
2. Prepará un cliente pequeño para consultar UAPI de cPanel con operaciones explícitas de lectura. Cargá los secretos desde `.env.local`, verificá TLS, evitá imprimir credenciales y comprobá el resultado funcional de cada respuesta. No hace falta crear un MCP.
3. Probá la conexión con una consulta de información del dominio. Identificá la raíz real de `rendermultimedia.com`, los archivos de WordPress, las versiones que puedas confirmar y los límites visibles. No supongas que los iconos de Node.js y Python garantizan versiones o permisos.
4. Elaborá un inventario y descargá los archivos accesibles de la instalación, preservando su estructura y registrando faltantes. Usá métodos de transferencia adecuados para binarios y archivos grandes. No presentes una descarga de texto como copia íntegra de imágenes o archivos comprimidos.
5. Identificá la base de datos correspondiente sin revelar sus credenciales. Determiná si podés obtener un SQL completo mediante un método autorizado y documentado. Si no, indicame el paso exacto de Backup Wizard o phpMyAdmin para descargarlo. Diferenciá descargar una copia existente de generar un respaldo nuevo en el servidor.
6. Analizá cómo utiliza Divi el sitio: tema padre/hijo, plugins activos cuando haya evidencia, contenido de páginas, metadatos, diseños guardados, cabecera, pie, formularios, CSS y JavaScript personalizados. Si encontrás el XML exportado, usalo como fuente complementaria y fechada.
7. Cuando estén disponibles archivos y SQL, prepará una copia local aislada con credenciales locales y sin envíos externos. Verificá si reproduce la portada, navegación, imágenes y formularios. No envíes formularios reales al cliente.
8. Entregá los cuatro informes definidos en `AGENTS.md`. Explicá qué podés leer, descargar o inferir, qué capacidades de escritura constan en la documentación pero no se probaron, qué falta y cuál sería el flujo de desarrollo y publicación recomendado.

Evaluá primero conservar WordPress y agregar las mejoras con código. Quiero una web minimalista, actualizada, con animaciones de scroll y elementos 3D según las referencias del cliente. No elijas un framework ni reconstruyas todo antes de justificarlo con el diagnóstico.

Avanzá autónomamente con las lecturas y el trabajo local autorizados. Si una vía falla, documentá la causa concreta y completá lo que sea posible por otra vía autorizada. Terminá con el siguiente paso que debo realizar, no solamente con un plan.
