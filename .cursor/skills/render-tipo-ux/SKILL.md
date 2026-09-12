---
name: render-tipo-ux
description: Enforce RENDER Multimedia typography uniformity, letter-case rules, and UX quality when building or reviewing the public site. Use when creating pages, CSS, menus, forms, copy, components, or when the user mentions tipografía, letras, mayúsculas, UX, accesibilidad, or the new website.
---

# Tipografía y UX — RENDER Multimedia

Leer este skill antes de escribir HTML/CSS/JS de la web nueva. El brief visual gana: [docs/REQUISITOS_RECONSTRUCCION.md](../../../docs/REQUISITOS_RECONSTRUCCION.md). Diseño general: skill `frontend-design`. Tipografía: `impeccable` → `typeset`. UX/a11y: `web-design-guidelines` y `ui-ux-pro-max`.

## Letras: un sistema, no tamaños sueltos

Definir tokens y reutilizarlos. No inventar `font-size` por componente.

| Rol | Uso | Caja | Tracking |
| --- | --- | --- | --- |
| Display | Héroes, títulos de página | Title Case en ES o mayúsculas cortas | Ajustar en display; no en cuerpo |
| Título de sección | H2 | Sentence case | Normal |
| Cuerpo | Párrafos, descripciones | Sentence case | Normal; leading extra en fondo oscuro |
| Meta / cargo | Fechas, cargos, labels | Sentence case | Ligero si es uppercase de 1 línea |
| Navegación | Menú, overlay, breadcrumbs de sitio | **MAYÚSCULAS** vía CSS | +0.04–0.08em |
| CTA | Botones y envíos | Sentence case, mismo verbo en todo el flujo | — |

Reglas de uniformidad:

- Máximo **2 familias**: display con carácter + cuerpo legible. Una tercera solo para datos/código.
- El menú es siempre `text-transform: uppercase` (ya publicado en producción). No mezclar Title Case en un ítem y MAYÚSCULAS en otro.
- No quemar nombre, cargo ni titular dentro de PNG. El texto va en HTML.
- Cuerpo ≥ 1rem. Captions ≥ 12px. No `font-weight` 100–300 en texto pequeño.
- Medida de lectura 45–75ch. En dark, un paso más de peso y un poco más de leading/tracking.
- Español: comillas tipográficas, puntos suspensivos `…`, no mezclar EN/ES en UI.
- Un mismo rol = mismos tokens en las 7 rutas.

## Paleta (hasta que Ludin entregue otra)

- Fondo `#0B0B0B`, texto `#FFF4E9`, acento `#FFAD4A`.
- Contraste suficiente sobre negro. Hover/focus **más** contraste que el reposo.
- No copiar el lima de Lando Norris. No Lato/Inter/Roboto por inercia.

## UX que no se negocia

- Foco de teclado visible. Áreas táctiles ≥ 44×44px. Sin scroll horizontal a 390px ni a 1440px.
- Formulario de cotización: labels visibles (no solo placeholder), error junto al campo, mismo markup en Inicio / Servicios / Contacto.
- Acciones en voz activa: «Enviar cotización», no «Submit». El éxito dice lo mismo que el botón.
- `prefers-reduced-motion`: desactivar intro, pin y revelados no esenciales.
- YouTube y mapa: poster local + carga al interactuar. `lang="es"`. Rutas actuales sin cambiar.
- Verificar en navegador el flujo tocado (menú overlay, formulario, portafolio), no solo una captura.

## Orden de trabajo

1. Plan de tokens (color, type, espacio) alineado al brief.
2. Construir. Derivar cada letra de los tokens.
3. Autocrítica: si un título, botón o label se ve distinto entre páginas, unificar.
4. Si se pide revisión de UI, aplicar `web-design-guidelines`.
