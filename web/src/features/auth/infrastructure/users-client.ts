/**
 * Cliente para gestión de usuarios en Strapi
 */

import type { 
  Usuario, 
  UsuarioInput, 
  UsuarioRegistro,
  UsuariosPaginados, 
  FiltrosUsuarios 
} from '../domain/users';
import { getPermissionsForRoles, type Permission } from '../domain/permissions';
import { USUARIOS_POR_PAGINA } from '../domain/users';

// ==================== TIPOS STRAPI ====================

interface StrapiUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  role?: {
    id: number;
    name: string;
    type: string;
  };
  // Campos custom que agregaremos en Strapi
  firstName?: string;
  lastName?: string;
  avatar?: string;
  lastLogin?: string;
  customRoles?: string[];  // Roles adicionales del sistema
}

interface StrapiUsersResponse {
  data: StrapiUser[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiRole {
  id: number;
  name: string;
  description: string;
  type: string;
}

// ==================== CLIENTE ====================

export interface UsersClientConfig {
  baseUrl: string;
  token: string;
}

export class UsersClient {
  private baseUrl: string;
  private token: string;

  constructor(config: UsersClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.token = config.token;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || `Error ${res.status}`);
    }
    return res.json();
  }

  /**
   * Normaliza un usuario de Strapi al formato interno
   */
  private normalizeUser(strapiUser: StrapiUser): Usuario {
    // Combinar rol de Strapi + roles custom
    const roles: string[] = [];
    if (strapiUser.role?.type) {
      roles.push(strapiUser.role.type);
    }
    if (strapiUser.customRoles) {
      roles.push(...strapiUser.customRoles);
    }
    
    // Calcular permisos basado en roles
    const permisos = getPermissionsForRoles(roles);

    return {
      id: strapiUser.id,
      username: strapiUser.username,
      email: strapiUser.email,
      nombre: strapiUser.firstName,
      apellido: strapiUser.lastName,
      avatar: strapiUser.avatar,
      roles,
      permisos,
      bloqueado: strapiUser.blocked,
      confirmado: strapiUser.confirmed,
      proveedor: strapiUser.provider as 'local' | 'google' | 'github',
      fechaCreacion: new Date(strapiUser.createdAt),
      fechaActualizacion: new Date(strapiUser.updatedAt),
      ultimoAcceso: strapiUser.lastLogin ? new Date(strapiUser.lastLogin) : undefined,
    };
  }

  // ==================== CRUD USUARIOS ====================

  /**
   * Obtiene lista de usuarios con filtros
   */
  async getUsers(filtros?: FiltrosUsuarios): Promise<UsuariosPaginados> {
    const params = new URLSearchParams();
    
    // Paginación
    params.set('pagination[page]', String(filtros?.pagina || 1));
    params.set('pagination[pageSize]', String(filtros?.porPagina || USUARIOS_POR_PAGINA));
    
    // Populate rol
    params.set('populate', 'role');
    
    // Filtros
    if (filtros?.busqueda) {
      params.set('filters[$or][0][username][$containsi]', filtros.busqueda);
      params.set('filters[$or][1][email][$containsi]', filtros.busqueda);
    }
    
    if (filtros?.estado === 'bloqueado') {
      params.set('filters[blocked][$eq]', 'true');
    } else if (filtros?.estado === 'activo') {
      params.set('filters[blocked][$eq]', 'false');
    }
    
    // Ordenamiento
    const sortField = filtros?.ordenarPor === 'fechaCreacion' ? 'createdAt' :
                      filtros?.ordenarPor === 'ultimoAcceso' ? 'lastLogin' :
                      filtros?.ordenarPor || 'createdAt';
    params.set('sort', `${sortField}:${filtros?.orden || 'desc'}`);

    const url = `${this.baseUrl}/api/users?${params}`;
    const res = await fetch(url, { headers: this.getHeaders() });
    
    // Strapi users endpoint devuelve array directo, no {data, meta}
    const users = await this.handleResponse<StrapiUser[]>(res);
    
    // Para paginación, necesitamos hacer count separado
    const countRes = await fetch(`${this.baseUrl}/api/users/count`, { 
      headers: this.getHeaders() 
    });
    const total = await countRes.json() as number;
    
    const porPagina = filtros?.porPagina || USUARIOS_POR_PAGINA;
    
    return {
      usuarios: users.map(u => this.normalizeUser(u)),
      total,
      pagina: filtros?.pagina || 1,
      porPagina,
      totalPaginas: Math.ceil(total / porPagina),
    };
  }

  /**
   * Obtiene un usuario por ID
   */
  async getUser(id: string | number): Promise<Usuario> {
    const res = await fetch(`${this.baseUrl}/api/users/${id}?populate=role`, {
      headers: this.getHeaders(),
    });
    const user = await this.handleResponse<StrapiUser>(res);
    return this.normalizeUser(user);
  }

  /**
   * Crea un nuevo usuario
   */
  async createUser(input: UsuarioInput): Promise<Usuario> {
    const body = {
      username: input.username,
      email: input.email,
      password: input.password,
      firstName: input.nombre,
      lastName: input.apellido,
      blocked: input.bloqueado || false,
      confirmed: true,
      customRoles: input.roles,
      // El rol de Strapi se asigna por defecto como 'authenticated'
      role: 1, // ID del rol 'Authenticated' en Strapi
    };

    const res = await fetch(`${this.baseUrl}/api/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    
    const user = await this.handleResponse<StrapiUser>(res);
    return this.normalizeUser(user);
  }

  /**
   * Actualiza un usuario
   */
  async updateUser(id: string | number, input: Partial<UsuarioInput>): Promise<Usuario> {
    const body: Record<string, unknown> = {};
    
    if (input.username) body.username = input.username;
    if (input.email) body.email = input.email;
    if (input.password) body.password = input.password;
    if (input.nombre !== undefined) body.firstName = input.nombre;
    if (input.apellido !== undefined) body.lastName = input.apellido;
    if (input.bloqueado !== undefined) body.blocked = input.bloqueado;
    if (input.roles) body.customRoles = input.roles;

    const res = await fetch(`${this.baseUrl}/api/users/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    
    const user = await this.handleResponse<StrapiUser>(res);
    return this.normalizeUser(user);
  }

  /**
   * Elimina un usuario
   */
  async deleteUser(id: string | number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/api/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    if (!res.ok) {
      throw new Error('Error al eliminar usuario');
    }
  }

  /**
   * Bloquea/desbloquea un usuario
   */
  async toggleBlock(id: string | number, blocked: boolean): Promise<Usuario> {
    return this.updateUser(id, { bloqueado: blocked });
  }

  /**
   * Cambia los roles de un usuario
   */
  async updateRoles(id: string | number, roles: string[]): Promise<Usuario> {
    return this.updateUser(id, { roles });
  }

  // ==================== REGISTRO PÚBLICO ====================

  /**
   * Registra un nuevo usuario (público, sin token)
   */
  static async register(baseUrl: string, data: UsuarioRegistro): Promise<{ user: Usuario; jwt: string }> {
    const res = await fetch(`${baseUrl}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.nombre,
        lastName: data.apellido,
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Error al registrar usuario');
    }

    const result = await res.json() as { jwt: string; user: StrapiUser };
    
    // Normalizar manualmente ya que no tenemos instancia
    const user: Usuario = {
      id: result.user.id,
      username: result.user.username,
      email: result.user.email,
      roles: ['authenticated'],
      permisos: [],
      bloqueado: false,
      confirmado: result.user.confirmed,
      proveedor: 'local',
      fechaCreacion: new Date(result.user.createdAt),
      fechaActualizacion: new Date(result.user.updatedAt),
    };

    return { user, jwt: result.jwt };
  }

  // ==================== ROLES STRAPI ====================

  /**
   * Obtiene los roles disponibles en Strapi
   */
  async getStrapiRoles(): Promise<StrapiRole[]> {
    const res = await fetch(`${this.baseUrl}/api/users-permissions/roles`, {
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<{ roles: StrapiRole[] }>(res);
    return data.roles;
  }
}

// Singleton
let clientInstance: UsersClient | null = null;

export function getUsersClient(token: string): UsersClient {
  // Siempre crear nueva instancia con el token actual
  clientInstance = new UsersClient({
    baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    token,
  });
  return clientInstance;
}
