export const SITE_CONFIG = {
  name: "FabLab INACAP",
  description: "Laboratorio de Fabricación Digital - Instituto INACAP",
  url: "https://fablab-inacap.cl",
  ogImage: "/og-image.jpg",
  keywords: [
    "FabLab",
    "INACAP",
    "Impresión 3D",
    "Fabricación Digital",
    "Prototipado",
    "Innovación Tecnológica",
    "Diseño",
    "Manufactura",
  ],
} as const;

export const CONTACT_INFO = {
  email: "fablab@inacap.cl",
  phone: "+56 2 1234 5678",
  address: "Av. Vicuña Mackenna 20000, San Joaquín, Santiago",
  socialMedia: {
    instagram: "https://instagram.com/fablab_inacap",
    linkedin: "https://linkedin.com/company/fablab-inacap",
    youtube: "https://youtube.com/@fablab-inacap",
  },
} as const;

export const NAVIGATION_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/tecnologias", label: "Tecnologías" },
  { href: "/equipo", label: "Equipo" },
  { href: "/contacto", label: "Contacto" },
] as const;
