export const site = {
  name: 'RENDER Multimedia',
  url: 'https://rendermultimedia.com',
  tagline: 'Productora audiovisual',
  city: 'Chiquimula · Guatemala',
  address: '10 avenida 4-40, Chiquimula 20001, Guatemala',
  email: 'info@rendermultimedia.com',
  phone: '+502 3342 1115',
  phoneTel: '+50233421115',
  whatsapp:
    'https://wa.me/50233421115?text=%C2%A1Hola!%20En%20que%20te%20podemos%20ayudar?',
  instagram: 'https://www.instagram.com/render.gt/',
  linkedin: 'https://www.linkedin.com/company/render-multimedia/',
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6873.274070864329!2d-89.54506234344!3d14.797463791805844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f62307d632a3cdf%3A0xb4639964843c7acd!2s10a%20Avenida%20440%2C%20Chiquimula%2C%20Guatemala!5e0!3m2!1ses-419!2sar!4v1730570302343!5m2!1ses-419!2sar',
  formAction: '/contacto.php',
  formServices: [
    'Audiovisuales',
    'Marketing digital',
    'Diseño gráfico',
    'Otro',
  ],
} as const

export const nav = [
  { label: 'INICIO', href: '/' },
  { label: 'SERVICIOS', href: '/#audiovisuales' },
  { label: 'PROCESO', href: '/#proceso' },
  { label: 'PORTAFOLIO', href: '/#trabajo' },
  { label: 'NOSOTROS', href: '/#nosotros' },
  { label: 'CONTACTO', href: '/#contacto' },
] as const

export const servicios = [
  {
    n: '01',
    slug: 'audiovisual',
    titulo: 'Producción audiovisual',
    desc: 'Capturamos la esencia de tu mensaje mediante producción audiovisual profesional. Creamos videos que inspiran, comunican y elevan la identidad de tu marca, con un enfoque en calidad y creatividad.',
    tags: ['Comerciales', 'Documental', 'Eventos', 'Reels'],
    items: [
      'Videos breves para productos o servicios en redes, televisión y plataformas digitales',
      'Producciones corporativas que reflejan misión, visión y valores',
      'Historias documentales con testimonios en temas sociales, educativos y empresariales',
      'Animaciones que explican conceptos complejos',
      'Anuncios de audio para radio',
      'Transmisiones en vivo con múltiples cámaras',
      'Estudio para grabación de podcast',
      'Planificación, grabación, edición y publicación de podcasts',
    ],
  },
  {
    n: '02',
    slug: 'diseno',
    titulo: 'Diseño gráfico',
    desc: 'Diseñamos materiales visuales que destacan. Desde branding hasta contenido para redes sociales, nuestro diseño gráfico refleja la esencia de tu marca, conectando visualmente con tu audiencia.',
    tags: ['Branding', 'Editorial', 'Campañas', 'Social media'],
    items: [
      'Piezas creativas para redes sociales',
      'Diseño y maquetación de libros, revistas y material impreso',
      'Ilustraciones personalizadas',
      'Identidad visual: logotipos y manuales de marca',
    ],
  },
  {
    n: '03',
    slug: 'marketing',
    titulo: 'Marketing digital',
    desc: 'Impulsamos tu negocio en el mundo digital con estrategias de marketing innovadoras. Gestionamos redes sociales, campañas publicitarias y contenido visual que aumenta tu visibilidad y conexión con el público.',
    tags: ['Estrategia', 'Pauta digital', 'Contenidos', 'Analítica'],
    items: [
      'Análisis de objetivos y plan de acción basado en datos',
      'Campañas pagadas en Facebook, Instagram, Google Ads y otras plataformas',
      'Seguimiento de rendimiento y ajuste para maximizar el retorno',
      'Publicaciones visuales y video con programación en plataformas digitales',
    ],
  },
] as const

export const proceso = [
  'Reunión para entender necesidades y objetivos',
  'Esquema de ideas y presupuesto detallado',
  'Planificación de cada etapa con cronograma',
  'Desarrollo del proyecto, con el cliente informado',
  'Avances compartidos para ajustes y conformidad',
  'Entrega final, con calidad y cumplimiento de expectativas',
] as const

export type Proyecto = {
  titulo: string
  desc: string
  youtube: string
  categoria: 'comercial' | 'ongs'
}

export const comercial: Proyecto[] = [
  {
    titulo: 'Supermercados Oasis',
    desc: 'Supermercados Oasis tiene una fuerte presencia en la región oriente del país. Se grabó y editó un spot publicitario para promocionar las nuevas y amplias instalaciones en Chiquimula.',
    youtube: 'tbNvsvHHFlQ',
    categoria: 'comercial',
  },
  {
    titulo: 'Centro Gastrointestinal de Oriente',
    desc: 'Producción multimedia que busca resaltar la calidad del servicio del Centro Gastrointestinal de Oriente.',
    youtube: 'Ow_KpI904Bw',
    categoria: 'comercial',
  },
  {
    titulo: 'Centro Médico Zacapa',
    desc: 'Video institucional para el Centro Médico Zacapa, para promocionar las cualidades que lo destacan.',
    youtube: '_XBxWdjQ6m8',
    categoria: 'comercial',
  },
  {
    titulo: 'Video musical — Chiquimuljá',
    desc: 'La Cooperativa Chiquimuljá, parte de MICOOPE, ofrece servicios financieros en Chiquimula. Este video musical se grabó para destacar su impacto positivo en la región.',
    youtube: 'QWx5tgc4Ts0',
    categoria: 'comercial',
  },
  {
    titulo: 'Tiendas El Cisne',
    desc: 'Acompañamos a Tiendas El Cisne en la inauguración de una de sus tiendas en San Luis Jilotepeque con una producción audiovisual.',
    youtube: 'OJ8pltqImsE',
    categoria: 'comercial',
  },
]

export const ongs: Proyecto[] = [
  {
    titulo: 'Video institucional — World Vision',
    desc: 'World Vision trabaja en Guatemala para mejorar la calidad de vida de las comunidades vulnerables mediante programas de desarrollo sostenible, con un enfoque principal en la educación.',
    youtube: '22DlOGutQu0',
    categoria: 'ongs',
  },
  {
    titulo: 'Proyecto de cosecha de agua — CATIE',
    desc: 'Cómo se ayuda a ganaderos y agricultores del corredor seco en Guatemala, Honduras y El Salvador a mitigar los efectos del cambio climático, mejorando la disponibilidad de agua.',
    youtube: 'x1Z7rZsvcgA',
    categoria: 'ongs',
  },
  {
    titulo: 'World Vision Canadá',
    desc: 'Visita de World Vision Canada en Guatemala: recorrieron comunidades para conocer el impacto del trabajo de World Vision Guatemala.',
    youtube: 'h4GhTiTASIA',
    categoria: 'ongs',
  },
  {
    titulo: 'Animación: cajas rurales — CATIE',
    desc: 'El Proyecto Escalar y CATIE, con el apoyo de la Embajada de Suecia, promueven cajas rurales para la inclusión financiera en comunidades rurales.',
    youtube: '6SmPa6q6pVE',
    categoria: 'ongs',
  },
  {
    titulo: 'World Vision Japón',
    desc: 'Documental de la visita de World Vision Japón a Alta Verapaz: cultura, paisaje y proyectos de desarrollo comunitario.',
    youtube: 'AKf5ntYWooo',
    categoria: 'ongs',
  },
  {
    titulo: 'Proyecto de agua Comapa, Jutiapa — World Vision Guatemala',
    desc: 'El impacto del proyecto en las comunidades seleccionadas, con testimonios sobre el acceso al agua antes y después.',
    youtube: 'XFoLg5SorJA',
    categoria: 'ongs',
  },
  {
    titulo: 'Campaña «Suficiente» — World Vision',
    desc: 'Iniciativa de recaudación y concienciación para combatir la pobreza y mejorar el acceso a agua, educación, salud y alimentación.',
    youtube: 'fn3t7nj_QVo',
    categoria: 'ongs',
  },
  {
    titulo: 'Inclusión social y empoderamiento — ASORECH',
    desc: 'Promueve la inclusión social y el desarrollo integral de personas con disminuciones en sus capacidades sensoriales.',
    youtube: 'xK_KWaBJcac',
    categoria: 'ongs',
  },
  {
    titulo: 'Proyecto ASA 2 — CRS',
    desc: 'Agua y Suelo para la Agricultura 2, implementado por Catholic Relief Services y ASORECH en Chiquimula, con prácticas agrícolas sostenibles.',
    youtube: '5NiXyBwFUS8',
    categoria: 'ongs',
  },
  {
    titulo: 'Proyecto ASA 2 — Cáritas',
    desc: 'Agricultura de conservación y manejo integrado de la fertilidad del suelo para pequeños agricultores más resilientes ante sequías.',
    youtube: 'NPzlBTvHZXQ',
    categoria: 'ongs',
  },
  {
    titulo: 'Visita de campo — World Vision Guatemala',
    desc: 'La junta directiva de World Vision Guatemala visita las áreas de acción para observar el impacto y el progreso de los proyectos.',
    youtube: '09uhw4rRLDg',
    categoria: 'ongs',
  },
  {
    titulo: 'Los colores de IXIM — Ayuda en Acción',
    desc: 'Documental sobre la conexión entre los agricultores de Camotán y el maíz, como sustento e identidad.',
    youtube: 'U35iLovrvXA',
    categoria: 'ongs',
  },
  {
    titulo: 'Empleo digno — Plan Internacional',
    desc: 'Historias sobre los desafíos para encontrar empleo digno en entornos rurales y la iniciativa que busca mejorar esas condiciones.',
    youtube: '5jEEfa3eBd8',
    categoria: 'ongs',
  },
  {
    titulo: 'Nuevas masculinidades — ASORECH / Ayuda en Acción',
    desc: 'Hombres en entornos rurales redefiniendo la masculinidad, desafiando estereotipos y promoviendo relaciones más equitativas.',
    youtube: 'cBeho3llp5E',
    categoria: 'ongs',
  },
  {
    titulo: 'Proyecto ESCALAR — CATIE',
    desc: 'Iniciativas de apoyo al corredor seco: mejoras al sector agrícola y adaptación de los agricultores al cambio climático.',
    youtube: 'k5X0mx8yyeA',
    categoria: 'ongs',
  },
  {
    titulo: 'Autoayuda Plan — Ayuda en Acción',
    desc: 'Documental sobre cómo la enseñanza de nuevas profesiones puede transformar comunidades al abrir oportunidades laborales sostenibles.',
    youtube: 'bJoBOQ2wbmM',
    categoria: 'ongs',
  },
  {
    titulo: 'Proyecto ACCER — World Vision',
    desc: 'Captación y gestión del agua para prácticas agrícolas más sostenibles y resilientes en las comunidades de Comapa.',
    youtube: 'nPdhs2Hpksk',
    categoria: 'ongs',
  },
  {
    titulo: 'El valor del agua — World Vision',
    desc: 'La realidad de muchos niños en Guatemala: el acceso a agua limpia es fundamental para la salud, la agricultura y una infancia digna.',
    youtube: 'YuxgE4VJKho',
    categoria: 'ongs',
  },
]

export const destacadosInicio = [
  { youtube: 'dGZlUmXZwA8', titulo: 'Trabajo destacado' },
  { youtube: 'sfKvk-ciQ-g', titulo: 'Trabajo destacado' },
  { youtube: '4AwXj6mRUZg', titulo: 'Trabajo destacado' },
  { youtube: 'xzurNLvOF2w', titulo: 'Trabajo destacado' },
]

// Author attribution verified against the original local HTML; see docs/AUTORES_TESTIMONIOS.md.
export const testimonios: { quote: string; name: string | null; company: string | null; source: string }[] = [
  {
    "quote": "Trabajar con Render Media ha sido una excelente experiencia. Su equipo entendió mis necesidades y creó estrategias efectivas que impulsaron el crecimiento de mi negocio. Son profesionales, creativos y siempre están atentos a los detalles. Además, su atención al cliente es de primera. ¡Definitivamente los recomiendo para cualquier proyecto de marketing!",
    "name": "Zoom Media",
    "company": null,
    "source": "private/local-evidence/home-first.html:31 (et_pb_slide_0)"
  },
  {
    "quote": "Los recomiendo, tanto su equipo como personal es muy profesional.",
    "name": "Men’s Boutique",
    "company": null,
    "source": "private/local-evidence/home-first.html:31 (et_pb_slide_1)"
  },
  {
    "quote": "Podcasts, Videos Corporativos, Pre-Roll's, Videos/Fotografía de Productos, etc., para esto y más, en Render encontraran Profesionalismo, Creatividad, Compromiso y un Equipo Humano capaz para cualquier proyecto multimedia.",
    "name": "Eddy Osorio",
    "company": null,
    "source": "private/local-evidence/home-first.html:31 (et_pb_slide_2)"
  },
  {
    "quote": "El mejor proveedor de servicios Multimedia, son profesionales y brindan productos de calidad, son amables y proactivos en los proyectos que trabajan, recomendados",
    "name": "Wester Lopez",
    "company": null,
    "source": "private/local-evidence/home-first.html:31 (et_pb_slide_3)"
  },
  {
    "quote": "Un proveedor con excelente atención, puntualidad y profesionalismo, muy recomendado para eventos donde necesitas que todo quede con calidad, el trabajo que realizan se ve al momento de recibirlo porque se distingue y resalta. Muy recomendado",
    "name": "José Manuel Chigua",
    "company": null,
    "source": "private/local-evidence/home-first.html:31 (et_pb_slide_4)"
  }
]

export const team = [
  { img: '/assets/team/kenny.png', nombre: 'Kenny Chacón', cargo: 'Director de Producción' },
  { img: '/assets/team/julio.png', nombre: 'Julio Valdés', cargo: 'Productor Audiovisual' },
  { img: '/assets/team/andres.png', nombre: 'Andrés Chacón', cargo: 'Diseñador Gráfico' },
  { img: '/assets/team/cesar.png', nombre: 'César Alarcón', cargo: 'Diseñador / Ilustrador' },
] as const
