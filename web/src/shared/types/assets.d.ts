// Declaraciones globales para importaciones de estilos y assets
// Evita errores de TypeScript al importar archivos CSS/SCSS/imagenes desde componentes

declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.module.css';
declare module '*.module.scss';
declare module '*.module.sass';

declare module '*.svg' {
  import * as React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';

export {};
