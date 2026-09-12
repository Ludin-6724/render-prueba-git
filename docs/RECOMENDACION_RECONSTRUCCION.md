# Decisión sobre la reconstrucción de RENDER

## Decisión posterior del responsable

Ludin decidió expresamente desarrollar una web independiente, sin WordPress, y mantenerla con código desde el IDE. WordPress local se conserva únicamente como referencia. Se mantienen hosting, dominio y Google Workspace. La comparación siguiente conserva el análisis previo; la elección de plataforma ya no está pendiente. El flujo de publicación propuesto está en [FLUJO_PUBLICACION.md](FLUJO_PUBLICACION.md).

La referencia local ya permite separar contenido de presentación. La web publicada en el respaldo tiene siete páginas, dos portafolios, formularios de cotización, medios, testimonios y enlaces a servicios externos. No se encontró una necesidad confirmada de tienda, pagos, cuentas de clientes o lógica transaccional.

La preferencia de Ludin es trabajar con código propio desde el IDE. La decisión pendiente es quién actualizará proyectos, textos y equipo después de la entrega. Esa necesidad determina si conviene conservar la administración de WordPress; no la disponibilidad de un framework en cPanel.

## Alternativas

| Aspecto | Web independiente mantenida con código | WordPress con tema propio |
| --- | --- | --- |
| Edición | Ludin actualiza archivos de contenido y medios desde el IDE | Cliente puede editar contenido en un panel preparado para ese uso |
| Diseño | Componentes propios con control total de HTML/CSS/JS | Tema propio y componentes con control equivalente del diseño |
| Contenido | Extraer páginas/proyectos/personas/testimonios a JSON, Markdown u otro formato del proyecto | Migrar contenido Divi a campos o bloques propios y tipos de contenido claros |
| Formularios | Crear endpoint de servidor con validación, protección antispam, correo y confirmación | Plugin pequeño o solución de formularios mantenida, sin dependencia de Divi |
| Mantenimiento | Despliegue de archivos y del servicio de formularios; dependencias según implementación | Mantener WordPress, PHP y plugins mínimos, además del tema |
| Alojamiento | Un sitio estático con endpoint PHP podría aprovechar el hosting existente; verificar ejecución/despliegue | Compatible conceptualmente con la instalación PHP/MariaDB ya utilizada |
| Edición futura del cliente | Requiere un flujo adicional o recurrir a Ludin | Puede proporcionarse desde WordPress |

Ninguna alternativa obliga a cambiar de dominio o de proveedor. Una web independiente no requiere necesariamente Node.js en producción: puede entregarse como archivos generados y un endpoint compatible con el alojamiento. No se eligió framework ni se probaron permisos de publicación.

## Recomendación

**Si Ludin mantendrá las actualizaciones**, una web independiente con contenido estructurado es una opción razonable para este alcance: páginas corporativas y portafolios, sin una función transaccional confirmada. El costo funcional que no debe omitirse es reconstruir y operar correctamente los formularios, además de SEO, rutas y medios.

**Si el cliente necesita editar su equipo y portafolio**, conviene WordPress con un tema propio y un modelo de contenido definido. Se conserva el panel y se elimina la dependencia de Divi de forma planificada. Un tema nuevo por sí solo no transforma los shortcodes existentes: hay que migrar esos contenidos antes de desactivar Divi.

No propongo retocar la plantilla actual como destino final, dado el objetivo expresado. La instalación local servirá como referencia verificable de contenidos y comportamiento para cualquiera de las dos rutas.

## Funcionalidades a reconstruir en ambas

1. Cabecera, menú con Portfolio desplegable, navegación móvil y pie.
2. Inicio con tres líneas de servicios, video/animación, proyectos destacados y testimonios.
3. Portafolios Comercial y ONG’s con títulos, descripciones y referencias de video.
4. Equipo con foto, nombre y cargo como datos separados; las láminas actuales incorporan texto en imágenes.
5. Formulario reutilizable de cotización: cinco campos, validación cliente/servidor, antispam, envío y página de confirmación. Las cuatro instancias actuales pueden compartir una sola implementación responsive.
6. Enlaces de WhatsApp y redes, mapa y reproductores externos con carga controlada.
7. Títulos, metadatos, sitemap, estados 404 y preservación de rutas; redirecciones solo donde cambien.
8. Tratamiento de fotos, tamaños de imagen, video de portada y comportamiento de movimiento reducido.

Autoptimize, cachés Divi y All-in-One WP Migration son herramientas de la plataforma actual, no funcionalidades de negocio que deban copiarse. Bloom solo debe reconstruirse si se confirma una necesidad real de suscripciones. Solid Security aporta medidas de seguridad que se reevaluarán según la plataforma elegida.

## Material pendiente antes del diseño

Confirmar quién editará los contenidos, fotos y cargos actuales, variante final de logo, animación de entrada, referencias concretas de scroll/3D, textos de «Productoras de Video» y alcance comercial final. Sustituir las referencias de ejemplo del carrusel desactivado solo si se desea incorporar esa sección.

También falta comprobar la disponibilidad actual de videos externos y definir fuentes tipográficas para la nueva web. No se han descargado videos de terceros ni implementado cambios de diseño.

**Próximo paso:** decidir el responsable de las futuras actualizaciones y definir un modelo pequeño de contenido (servicio, proyecto, persona y testimonio). Luego se puede construir una portada representativa con código propio, manteniendo esta copia como referencia. La publicación queda fuera de esta etapa.
