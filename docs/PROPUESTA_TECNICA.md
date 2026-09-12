# Propuesta técnica preliminar

**Recomendación provisional:** conservar WordPress y evaluar las mejoras sobre Divi. La dependencia del constructor está confirmada en el XML y sus archivos están presentes. La decisión final requiere restaurar la copia y confirmar tema activo, personalizaciones y referencias del cliente.

| Alternativa | Esfuerzo relativo estimado | Cuándo conviene |
| --- | --- | --- |
| Mejorar Divi con tema hijo o plugin propio | Menor, pendiente de prototipo | Cambios de Inicio, fondo, fotos, textos y animaciones acotadas |
| Portada o sección a medida dentro de WordPress | Intermedio | Una escena o composición concreta exige mayor control del marcado |
| Reconstrucción parcial o total independiente | Mayor | Solo con requisitos que justifiquen migrar contenidos, SEO, formularios y mantenimiento |

Las estimaciones son comparativas, no horas, precios ni compromisos de entrega. No se seleccionó framework ni cambio de alojamiento.

## Dónde se harán las modificaciones

El código de temas y plugins vive en archivos; las páginas, metadatos y diseños Divi dependen de la base de datos. Las imágenes suelen estar en uploads, con posibles recursos externos. El XML sirve como evidencia histórica de contenido y diseños, pero no reproduce todas las opciones actuales.

Preparar cambios propios bajo control de versiones, sin editar directamente el tema padre Divi. Confirmar primero si existe un tema hijo activo o personalizaciones actuales. La portada pública carga Divi, pero falta comprobar las opciones de tema en SQL.

## Flujo propuesto

1. Completar archivos y SQL; restaurar con credenciales locales y salidas externas desactivadas.
2. Confirmar versiones activas, diseños de cabecera/pie, formularios y CSS/JavaScript personalizados.
3. Construir un prototipo representativo de Inicio y animación de logo; comprobar móvil, escritorio y movimiento reducido.
4. Validar referencias de scroll/3D, modelos y peso de recursos antes de ampliar animaciones.
5. Preparar un despliegue de pruebas y después una publicación concreta autorizada. Separar código de contenido; no sobrescribir producción con una base antigua.

## Pendientes del cliente

Fotos y descripciones definitivas del equipo, logotipos, animación del logo, referencias de scroll/3D y texto/ubicación de «Productoras de Video». Confirmar la cotización final antes de reutilizar precios o plazos.

No hay evidencia suficiente para recomendar una migración por rendimiento, Node.js o React. Tampoco se aprobaron cambios de dominio, hosting o correo.

Siguiente paso inmediato: SQL y ZIP de la instalación ya están incorporados. Preparar y validar la restauración aislada; atender el `.htaccess` faltante del ZIP según `ESTADO_RESPALDO.md`.
