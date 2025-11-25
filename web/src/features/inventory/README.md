# Módulo de Inventario

Sistema de gestión de inventario del FabLab con arquitectura hexagonal, integrado con la API de Vessel.

## Estructura del Módulo

```
inventory/
├── domain/                    # Capa de Dominio (reglas de negocio)
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
```

## Capas

### Domain (Dominio)
- **Entidades**: Tipos TypeScript que representan los conceptos del negocio
- **Constantes**: Valores predefinidos y datos semilla
- Sin dependencias externas

### Infrastructure (Infraestructura)
- **API Client**: Comunicación HTTP con Vessel API
- **Adapters**: Transforman snake_case (API) ↔ camelCase español (Dominio)
- **Mock Client**: Datos simulados para desarrollo sin backend

### Presentation (Presentación)
- **Components**: Componentes UI reutilizables organizados por entidad
- **Pages**: Componentes de página completos (dashboards)
- **Hooks**: Lógica de estado y efectos

## Uso

```typescript
// Importar desde el módulo principal
import { 
  // Domain
  Vocabulario, 
  Termino,
  VOCABULARIOS,
  
  // Infrastructure  
  TaxonomyClient,
  
  // Presentation
  useTaxonomy,
  InventoryDashboard,
  CatalogoDashboard,
} from '@/features/inventory';
```

## Configuración

Variable de entorno para la URL de Vessel API:
```env
NEXT_PUBLIC_VESSEL_API_URL=http://127.0.0.1:8000
```

## Vocabularios Predefinidos

| ID | Nombre | Descripción |
|----|--------|-------------|
| vocab-categorias | Categorías | Clasificación principal de items |
| vocab-marcas | Marcas | Fabricantes y marcas |
| vocab-etiquetas | Etiquetas | Tags para búsqueda |
| vocab-colores | Colores | Colores de productos |
| vocab-estados | Estados | Estado en inventario |
