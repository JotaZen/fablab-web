import type { Schema, Struct } from '@strapi/strapi';

export interface ProyectoContenidoGeneral extends Struct.ComponentSchema {
  collectionName: 'components_proyecto_contenido_generals';
  info: {
    displayName: 'ContenidoGeneral';
    icon: 'book';
  };
  attributes: {};
}

export interface ProyectoEquipo extends Struct.ComponentSchema {
  collectionName: 'components_proyecto_equipos';
  info: {
    displayName: 'Equipo';
    icon: 'user';
  };
  attributes: {};
}

export interface ProyectoImagenes extends Struct.ComponentSchema {
  collectionName: 'components_proyecto_imagenes';
  info: {
    displayName: 'Imagenes';
    icon: 'landscape';
  };
  attributes: {};
}

export interface ProyectoSeccionesDelProyecto extends Struct.ComponentSchema {
  collectionName: 'components_proyecto_secciones_del_proyectos';
  info: {
    displayName: 'Secciones del Proyecto';
    icon: 'archive';
  };
  attributes: {};
}

export interface ProyectoTecnologias extends Struct.ComponentSchema {
  collectionName: 'components_proyecto_tecnologias';
  info: {
    displayName: 'Tecnologias';
    icon: 'rotate';
  };
  attributes: {};
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'proyecto.contenido-general': ProyectoContenidoGeneral;
      'proyecto.equipo': ProyectoEquipo;
      'proyecto.imagenes': ProyectoImagenes;
      'proyecto.secciones-del-proyecto': ProyectoSeccionesDelProyecto;
      'proyecto.tecnologias': ProyectoTecnologias;
    }
  }
}
