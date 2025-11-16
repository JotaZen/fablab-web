
Estructura

web/
├─ app/                          # Next.js App Router (rutas, layouts, assets, api)
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ globals.css
│  ├─ favicon.ico
│  ├─ control-iot/               # Ruta /control-iot
│  └─ api/
│     ├─ auth/
│     │  ├─ login/
│     │  ├─ logout/
│     │  └─ session/
│     └─ tuya/
│        ├─ commands/
│        ├─ device-info/
│        ├─ device-status/
│        └─ token/
├─ src/
│  ├─ features/                  # Features por dominio (reales detectadas)
│  │  ├─ auth/
│  │  ├─ blog/
│  │  ├─ config/
│  │  ├─ inventory/
│  │  ├─ iot/
│  │  ├─ landing/
│  │  ├─ models-3d/
│  │  ├─ team/
│  │  └─ web/
│  ├─ shared/                    # Providers, hooks, utilitarios reutilizables
│  │  ├─ auth/
│  │  ├─ constants/
│  │  ├─ helpers/
│  │  ├─ hooks/
│  │  ├─ layout/
│  │  ├─ ui/
│  │  ├─ types/
│  │  └─ utils.ts

