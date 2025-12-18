export interface Autor {
    id: string;
    nombre: string;
    avatar?: string;
    rol?: string;
}

export interface Categoria {
    id: string;
    nombre: string;
    slug: string;
    color?: string;
}

export interface PostBlog {
    id: string;
    titulo: string;
    slug: string;
    extracto: string;
    contenido?: string;
    imagenPortada?: string;
    autor: Autor;
    categoria: Categoria;
    etiquetas: string[];
    vistas: number;
    tiempoLectura: number;
    fechaPublicacion: string;
    destacado?: boolean;
}

export const categoriasMock: Categoria[] = [
    { id: "1", nombre: "Tutoriales", slug: "tutoriales", color: "bg-blue-500" },
    { id: "2", nombre: "Proyectos", slug: "proyectos", color: "bg-green-500" },
    { id: "3", nombre: "Noticias", slug: "noticias", color: "bg-purple-500" },
    { id: "4", nombre: "Eventos", slug: "eventos", color: "bg-orange-500" },
    { id: "5", nombre: "Tecnología", slug: "tecnologia", color: "bg-red-500" },
];

export const postsMock: PostBlog[] = [
    {
        id: "1",
        titulo: "Introducción a la Impresión 3D FDM: Todo lo que necesitas saber",
        slug: "introduccion-impresion-3d-fdm",
        extracto:
            "Descubre los fundamentos de la impresión 3D por deposición de material fundido, los materiales más utilizados y cómo empezar a crear tus propios proyectos.",
        contenido: `
      <h2>¿Qué es la impresión 3D FDM?</h2>
      <p>La impresión 3D por deposición de material fundido (FDM) es la tecnología más común y accesible en el mercado actual. Funciona derritiendo un filamento termoplástico y depositándolo capa por capa para construir un objeto tridimensional.</p>
      
      <h2>Materiales Básicos</h2>
      <ul>
        <li><strong>PLA:</strong> Biodegradable, fácil de imprimir, ideal para principiantes.</li>
        <li><strong>PETG:</strong> Resistente y flexible, bueno para piezas mecánicas.</li>
        <li><strong>ABS:</strong> Muy resistente pero requiere cama caliente y ventilación.</li>
      </ul>

      <h2>Primeros Pasos</h2>
      <p>Para comenzar, necesitarás un modelo 3D (puedes descargarlo de sitios como Thingiverse o diseñarlo tú mismo) y un programa "slicer" como Cura o PrusaSlicer para preparar el archivo para la impresora.</p>
    `,
        imagenPortada: "/images/blog/impresion-3d.jpg",
        autor: {
            id: "1",
            nombre: "Carlos Muñoz",
            avatar: "/images/team/carlos.jpg",
            rol: "Técnico FabLab",
        },
        categoria: categoriasMock[0],
        etiquetas: ["impresión 3D", "FDM", "PLA", "tutorial"],
        vistas: 1250,
        tiempoLectura: 8,
        fechaPublicacion: "2025-11-28",
        destacado: true,
    },
    {
        id: "2",
        titulo: "Proyecto: Robot Seguidor de Línea con Arduino",
        slug: "robot-seguidor-linea-arduino",
        extracto:
            "Aprende paso a paso cómo construir un robot seguidor de línea utilizando Arduino, sensores infrarrojos y piezas impresas en 3D.",
        contenido: `
      <h2>Componentes Necesarios</h2>
      <ul>
        <li>Arduino Uno o Nano</li>
        <li>Chasis impreso en 3D</li>
        <li>2 Motores DC con caja reductora</li>
        <li>Driver de motores L298N</li>
        <li>Módulo de sensores infrarrojos (CNY70 o similar)</li>
        <li>Baterías LiPo</li>
      </ul>

      <h2>El Código</h2>
      <p>El algoritmo básico consiste en leer los sensores: si el sensor izquierdo detecta línea, girar a la izquierda; si el derecho detecta, girar a la derecha; si ambos detectan, avanzar.</p>
    `,
        imagenPortada: "/images/blog/robot-arduino.jpg",
        autor: {
            id: "2",
            nombre: "María González",
            avatar: "/images/team/maria.jpg",
            rol: "Instructora Electrónica",
        },
        categoria: categoriasMock[1],
        etiquetas: ["arduino", "robótica", "electrónica", "proyecto"],
        vistas: 890,
        tiempoLectura: 15,
        fechaPublicacion: "2025-11-25",
        destacado: true,
    },
    {
        id: "3",
        titulo: "FabLab Los Ángeles inaugura nueva área de Corte Láser",
        slug: "inauguracion-area-corte-laser",
        extracto:
            "Estamos emocionados de anunciar la apertura de nuestra nueva área de corte láser, equipada con máquinas de última generación para proyectos más grandes.",
        contenido: `
      <h2>Nuevas Capacidades</h2>
      <p>La nueva cortadora láser CO2 de 130W permite cortar materiales como MDF, acrílico, cuero y tela con gran precisión y velocidad. El área de trabajo de 1300x900mm abre posibilidades para mobiliario y señalética de gran formato.</p>
      
      <h2>Horarios de Uso</h2>
      <p>El área estará disponible para reservas a partir del próximo lunes, de 09:00 a 18:00 hrs. Recuerda que es necesario haber aprobado el curso de inducción de seguridad.</p>
    `,
        imagenPortada: "/images/blog/corte-laser.jpg",
        autor: {
            id: "3",
            nombre: "Roberto Silva",
            avatar: "/images/team/roberto.jpg",
            rol: "Director FabLab",
        },
        categoria: categoriasMock[2],
        etiquetas: ["noticias", "corte láser", "equipamiento"],
        vistas: 2100,
        tiempoLectura: 4,
        fechaPublicacion: "2025-11-20",
    },
    // ... (puedes copiar el resto de los posts del archivo original aquí si se necesita, por brevedad incluyo estos 3 principales)
];
