"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils';
import { useAuth } from '@/features/auth';
import { hasPermission, type Permission } from '@/features/auth/domain/value-objects/permission';
import {
  Package,
  Users,
  Settings,
  Home,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  FolderTree,
  Boxes,
  FileText,
  List,
  PlusCircle,
  Shield,
  UserCog,
  Building2,
  ArrowDownUp,
  CalendarClock
} from 'lucide-react';

interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission; // Permiso requerido para ver este item
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
    // Sin permiso = visible para todos los autenticados
  },
  {
    title: 'Inventario',
    icon: Package,
    permission: 'inventory.items.read:all',
    children: [
      {
        title: 'Dashboard',
        href: '/admin/inventory',
        icon: LayoutDashboard,
        permission: 'inventory.items.read:all',
      },
      {
        title: 'Locaciones',
        href: '/admin/inventory/locations',
        icon: Building2,
        permission: 'inventory.locations.read:all',
      },
      {
        title: 'Catálogo',
        href: '/admin/inventory/catalogo',
        icon: FolderTree,
        permission: 'inventory.categories.read:all',
      },
      {
        title: 'Items',
        href: '/admin/inventory/items',
        icon: Boxes,
        permission: 'inventory.items.read:all',
      },
      {
        title: 'Movimientos',
        href: '/admin/inventory/movimientos',
        icon: ArrowDownUp,
        permission: 'inventory.stock.read:all',
      },
      {
        title: 'Reservas',
        href: '/admin/inventory/reservas',
        icon: CalendarClock,
        permission: 'inventory.stock.read:all',
      },
      {
        title: 'Configuración',
        href: '/admin/inventory/settings',
        icon: Settings,
        permission: 'settings.config.read:all',
      },
    ],
  },
  {
    title: 'Blog',
    icon: FileText,
    permission: 'blog.posts.read:all',
    children: [
      {
        title: 'Ver posts',
        href: '/admin/blog',
        icon: List,
        permission: 'blog.posts.read:all',
      },
      {
        title: 'Nuevo post',
        href: '/admin/blog/nuevo',
        icon: PlusCircle,
        permission: 'blog.posts.create:all',
      },
    ],
  },
  {
    title: 'Mis Reservas',
    href: '/admin/reservas',
    icon: CalendarClock,
    permission: 'reservations.requests.read:own', // Guests ven esta página simple
  },
  {
    title: 'Usuarios',
    icon: UserCog,
    permission: 'users.users.read:all',
    children: [
      {
        title: 'Lista de usuarios',
        href: '/admin/users',
        icon: Users,
        permission: 'users.users.read:all',
      },
    ],
  },
  {
    title: 'Perfil',
    href: '/admin/profile',
    icon: Users,
    // Sin permiso = visible para todos
  },
  {
    title: 'Gestión Web',
    icon: FolderTree,
    children: [
      {
        title: 'Equipo',
        href: '/admin/content/team',
        icon: Users,
      },
      {
        title: 'Config. Página',
        href: '/admin/content/page-settings',
        icon: Settings,
      }
    ]
  },
  {
    title: 'Configuración',
    href: '/admin/settings',
    icon: Settings,
    permission: 'settings.config.read:all',
  },
];

/**
 * Verificar si el usuario tiene un permiso usando el nuevo sistema
 */
function userHasPermission(userPermissions: Permission[], required?: Permission): boolean {
  if (!required) return true; // Sin permiso requerido = visible para todos
  return hasPermission(userPermissions, required);
}

/**
 * Filtrar items según permisos del usuario
 */
function filterItemsByPermission(items: SidebarItem[], userPermissions: Permission[]): SidebarItem[] {
  return items
    .filter(item => userHasPermission(userPermissions, item.permission))
    .map(item => ({
      ...item,
      children: item.children
        ? filterItemsByPermission(item.children, userPermissions)
        : undefined,
    }))
    .filter(item => !item.children || item.children.length > 0);
}

function SidebarItemComponent({ item, level = 0 }: { item: SidebarItem; level?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(() => {
    if (item.children) {
      return item.children.some(child => pathname.startsWith(child.href || ''));
    }
    return false;
  });

  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href ? pathname === item.href : false;
  const isParentActive = hasChildren && item.children?.some(child => pathname.startsWith(child.href || ''));

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
            isParentActive
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5" />
            <span>{item.title}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isOpen && (
          <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
            {item.children?.map((child) => (
              <SidebarItemComponent key={child.href || child.title} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '/admin'}
      className={cn(
        'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{item.title}</span>
    </Link>
  );
}

export function AdminSidebar() {
  const { user } = useAuth();

  // Obtener permisos del usuario actual
  const userPermissions = user?.role?.permissions ?? [];

  // Filtrar items según permisos
  const visibleItems = filterItemsByPermission(sidebarItems, userPermissions);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {visibleItems.map((item) => (
          <SidebarItemComponent key={item.title} item={item} />
        ))}
      </nav>
    </aside>
  );
}