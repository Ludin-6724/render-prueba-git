# Revisión de espacios, uso y movimiento — 12 de septiembre de 2026

## Dirección aplicada

Se conserva la identidad clara vigente (blanco, crema, Archivo y Archivo Black)
y la sección oscura de portafolio. Se aplicaron frontend-design, impeccable
(typeset y animate), ui-ux-pro-max, web-design-guidelines y render-tipo-ux.
Dos evaluaciones independientes de diseño y técnica precedieron los cambios.

## Hallazgos y correcciones

- **Confirmado:** Manifiesto tenía 176 px de padding por borde y Servicios
  otros 144 px superiores: 320 px acumulados. Se usa un ritmo compartido de
  56–88 px por sección y 28–40 px entre encabezado y contenido.
- **Confirmado:** el inicio mezclaba proyectos comerciales y ONG en una cuadrícula.
  Ahora hay dos secciones con carrusel propio, 18 proyectos ONG y 5 comerciales,
  contador, anterior/siguiente, teclado, arrastre y enlace a su categoría.
- **Confirmado:** el cierre del menú quedaba detrás del overlay. Se sustituyó por
  un dialog modal nativo, con cierre visible, Escape y retorno de foco. La
  navegación de escritorio ahora expone ambas categorías del portafolio.
- **Confirmado:** cambiar de ruta desde una zona baja conservaba el scroll de la
  página anterior. Se restaura el inicio en navegación sin fragmento.
- **Confirmado:** se mezclaban tres familias, cuerpo móvil de 14 px y metadatos
  de 10 px. Se centralizaron roles, cuerpo de 16 px y metadatos de 13 px en los
  bloques revisados. Nombres y cargos del equipo quedan apilados.
- Los testimonios conservan el texto y ganan una jerarquía más tranquila,
  controles de 48 px y cita legible. Se retiran las cintas repetidas del Inicio.

## Cámara: material y comportamiento

La carpeta `segments` contiene una vista completa y recortes, no una secuencia
multiángulo. Ludin confirmó el despiece con acercamientos. Se copiaron seis PNG
sin retocar: vista completa, monitor, cuerpo, batería, óptica y base.

El canvas compone 181 posiciones discretas a partir de esas capas: cámara armada,
separación, acercamiento a óptica y acercamiento a monitor. No son 181 fotografías
nuevas ni una rotación 3D real. No se solicita el MP4 de la cámara. El dibujo se
actualiza cuando cambia el fotograma, con escala de píxeles limitada a 2.

Origen de los archivos en `web/public/assets/camera/`:

| Archivo | Fuente en segments |
| --- | --- |
| assembled.png | camera-body/camera-body-2.png |
| monitor.png | camera-body/camera-body-1.png |
| battery.png | camera-body/camera-body-5.png |
| body.png | camera-body/camera-body-4.png |
| lens.png | lens.png |
| baseplate.png | baseplate.png |

La imagen completa funciona durante carga o fallo. `prefers-reduced-motion`
elimina el recorrido fijo y usa una cámara estática. La resolución queda limitada
por las imágenes aportadas: vista de 864 × 679 y recortes de menor tamaño.

## Verificación

- Compilación TypeScript/Vite correcta.
- ESLint de los archivos modificados correcto.
- Detector de diseño: sin hallazgos en los componentes modificados.
- Navegador en 1440 × 900 y 390 × 844: sin desbordamiento horizontal del documento.
- Verificados: salto al portafolio, cambio independiente de carruseles, teclado,
  vuelta del último al primer proyecto, carga de iframe al reproducir y desmontaje
  al cambiar de proyecto, apertura de menú, Escape y retorno de foco.
- El lint global conserva ocho errores anteriores en `src/components/ui/`
  (exports de Fast Refresh y Math.random en sidebar), ajenos a estos cambios.
- Movimiento reducido comprobado en la implementación; la herramienta del
  navegador no expone emulación de esa preferencia.

Criterios de revisión: [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).
