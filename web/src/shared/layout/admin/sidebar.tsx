"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils';
import { useAuth, hasModuleAccess } from '@/features/auth';
import type { FeatureModule, UserModuleAccess } from '@/features/auth/domain/value-objects/permission';
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
  CalendarClock,
  Database,
  Wrench,
  Cpu,
  Calendar,
  HelpCircle,
  MessageSquare,
  ImageIcon,
  ExternalLink
} from 'lucide-react';

interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  module?: FeatureModule; // Módulo requerido para ver este item
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
    // Sin módulo = visible para todos los autenticados
  },
  {
    title: 'Inventario',
    icon: Package,
    module: 'inventory',
    children: [
      {
        title: 'Dashboard',
        href: '/admin/inventory',
        icon: LayoutDashboard,
        module: 'inventory',
      },
      {
        title: 'Locaciones',
        href: '/admin/inventory/locations',
        icon: Building2,
        module: 'inventory',
      },
      {
        title: 'Catálogo',
        href: '/admin/inventory/catalogo',
        icon: FolderTree,
        module: 'inventory',
      },
      {
        title: 'Items',
        href: '/admin/inventory/items',
        icon: Boxes,
        module: 'inventory',
      },
      {
        title: 'Movimientos',
        href: '/admin/inventory/movimientos',
        icon: ArrowDownUp,
        module: 'inventory',
      },
      {
        title: 'Reservas',
        href: '/admin/inventory/reservas',
        icon: CalendarClock,
        module: 'inventory',
      },
      {
        title: 'Configuración',
        href: '/admin/inventory/settings',
        icon: Settings,
        module: 'settings',
      },
    ],
  },
  {
    title: 'Blog',
    icon: FileText,
    module: 'blog',
    children: [
      {
        title: 'Ver posts',
        href: '/admin/blog',
        icon: List,
        module: 'blog',
      },
      {
        title: 'Nuevo post',
        href: '/admin/blog/nuevo',
        icon: PlusCircle,
        module: 'blog',
      },
    ],
  },
  {
    title: 'CMS Payload',
    icon: Database,
    module: 'cms',
    children: [
      {
        title: 'Dashboard CMS',
        href: '/admin/cms',
        icon: LayoutDashboard,
      },
      {
        title: 'Posts',
        href: '/cms/collections/posts',
        icon: FileText,
      },
      {
        title: 'Categorías',
        href: '/cms/collections/categories',
        icon: FolderTree,
      },
      {
        title: 'Servicios',
        href: '/cms/collections/services',
        icon: Wrench,
      },
      {
        title: 'Equipamiento',
        href: '/cms/collections/equipment',
        icon: Cpu,
      },
      {
        title: 'Eventos',
        href: '/cms/collections/events',
        icon: Calendar,
      },
      {
        title: 'Proyectos',
        href: '/cms/collections/projects',
        icon: Boxes,
      },
      {
        title: 'Equipo',
        href: '/cms/collections/team-members',
        icon: Users,
      },
      {
        title: 'FAQs',
        href: '/cms/collections/faqs',
        icon: HelpCircle,
      },
      {
        title: 'Testimonios',
        href: '/cms/collections/testimonials',
        icon: MessageSquare,
      },
      {
        title: 'Media',
        href: '/cms/collections/media',
        icon: ImageIcon,
      },
      {
        title: 'Configuración Web',
        href: '/cms/globals/site-settings',
        icon: Settings,
      },
      {
        title: 'Panel Completo →',
        href: '/cms',
        icon: ExternalLink,
      },
    ],
  },
  {
    title: 'Mis Reservas',
    href: '/admin/reservas',
    icon: CalendarClock,
    // Visible para todos - Guest usa esta página
  },
  {
    title: 'Usuarios',
    icon: UserCog,
    module: 'users',
    children: [
      {
        title: 'Lista de usuarios',
        href: '/admin/users',
        icon: Users,
        module: 'users',
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
    module: 'cms',
    children: [
      {
        title: 'Servicios',
        href: '/admin/content/services',
        icon: Wrench,
      },
      {
        title: 'Equipamiento',
        href: '/admin/content/equipment',
        icon: Cpu,
      },
      {
        title: 'Eventos',
        href: '/admin/content/events',
        icon: Calendar,
      },
      {
        title: 'Equipo',
        href: '/admin/content/team',
        icon: Users,
      },
      {
        title: 'Proyectos',
        href: '/admin/content/projects',
        icon: Boxes,
      },
      {
        title: 'FAQs',
        href: '/admin/content/faqs',
        icon: HelpCircle,
      },
      {
        title: 'Testimonios',
        href: '/admin/content/testimonials',
        icon: MessageSquare,
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
    module: 'settings',
  },
];

/**
 * Verificar si el usuario tiene acceso a un módulo
 */
function userHasModuleAccess(userAccess: UserModuleAccess, requiredModule?: FeatureModule): boolean {
  if (!requiredModule) return true; // Sin módulo requerido = visible para todos
  return hasModuleAccess(userAccess, requiredModule, 'view');
}

/**
 * Filtrar items según acceso del usuario a módulos
 */
function filterItemsByModule(items: SidebarItem[], userAccess: UserModuleAccess): SidebarItem[] {
  return items
    .filter(item => userHasModuleAccess(userAccess, item.module))
    .map(item => ({
      ...item,
      children: item.children
        ? filterItemsByModule(item.children, userAccess)
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
  const { effectiveModuleAccess, isSimulating, stopSimulation } = useAuth();

  // Filtrar items según acceso a módulos (usa effectiveModuleAccess que incluye simulación)
  const visibleItems = filterItemsByModule(sidebarItems, effectiveModuleAccess);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
      {isSimulating && (
        <div className="bg-amber-50 border-b border-amber-200 p-3 text-center">
          <p className="text-xs font-medium text-amber-800 mb-2">
            Modo Simulación
          </p>
          <button
            onClick={stopSimulation}
            className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-md transition-colors"
          >
            Volver a mi vista
          </button>
        </div>
      )}
      <nav className="p-4 space-y-1 flex-1">
        {visibleItems.map((item) => (
          <SidebarItemComponent key={item.title} item={item} />
        ))}
      </nav>
    </aside>
  );
}