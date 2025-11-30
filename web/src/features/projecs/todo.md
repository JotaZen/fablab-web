projecs/
├── /                    # Capa de Dominio (reglas de negocio)
│   ├── entities/             # Entidades y tipos del dominio
│   │   └── index.ts          # Vocabulario, Termino, ArbolTermino, Breadcrumb
│   ├── constants/            # Constantes y datos semilla
│   │   └── index.ts          # VOCABULARIOS, TERMINOS_*
│   └── index.ts
│
├── infrastructure/            # Capa de Infraestructura (implementaciones)
│   ├── api/                  # Cliente real de Vessel API
│   │   ├── types.ts          # Tipos de la API (snake_case)
│   │   ├── adapters.ts       # Transformadores API ↔ Dominio
│   │   └── taxonomy-client.ts # Cliente HTTP
│   ├── mock/                 # Cliente mock para desarrollo
│   │   └── mock-client.ts    # Datos en memoria
│   └── index.ts
│
├── presentation/              # Capa de Presentación (UI)
│   ├── components/           # Componentes reutilizables
│   │   ├── vocabularios/
│   │   │   └── vocabularios-list.tsx
│   │   └── terminos/
│   │       └── terminos-list.tsx
│   ├── pages/                # Componentes de página
│   │   ├── inventory-dashboard.tsx
│   │   └── catalogo-dashboard.tsx
│   ├── hooks/                # Custom hooks
│   │   └── use-taxonomy.ts
│   └── index.ts
│
├── index.ts                   # Barrel export del módulo
└── README.md















Cuando el usuario ingrese a la pestaña Proyectos, deben aparecer automáticamente tres boxes organizados en una barra con cascada lateral. Cada box debe incluir una imagen, un título llamativo y una breve descripción. La página debe ser totalmente responsiva:

Si el espacio disponible se reduce, el diseño debe ajustarse para mostrar solo dos boxes.

Si se reduce aún más, debe mostrarse únicamente un box.