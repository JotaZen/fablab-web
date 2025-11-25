"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils';
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
  UserCog
} from 'lucide-react';

interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Inventario',
    icon: Package,
    children: [
      {
        title: 'Dashboard',
        href: '/admin/inventory',
        icon: LayoutDashboard,
      },
      {
        title: 'Catálogo',
        href: '/admin/inventory/catalogo',
        icon: FolderTree,
      },
      {
        title: 'Items',
        href: '/admin/inventory/items',
        icon: Boxes,
      },
    ],
  },
  {
    title: 'Blog',
    icon: FileText,
    children: [
      {
        title: 'Ver posts',
        href: '/admin/blog',
        icon: List,
      },
      {
        title: 'Nuevo post',
        href: '/admin/blog/nuevo',
        icon: PlusCircle,
      },
    ],
  },
  {
    title: 'Usuarios',
    icon: UserCog,
    children: [
      {
        title: 'Lista de usuarios',
        href: '/admin/users',
        icon: Users,
      },
      {
        title: 'Roles y permisos',
        href: '/admin/users/roles',
        icon: Shield,
      },
    ],
  },
  {
    title: 'Perfil',
    href: '/admin/profile',
    icon: Users,
  },
  {
    title: 'Configuración',
    href: '/admin/settings',
    icon: Settings,
  },
];

function SidebarItemComponent({ item, level = 0 }: { item: SidebarItem; level?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(() => {
    // Abrir automáticamente si algún hijo está activo
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
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
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
              <SidebarItemComponent key={child.href} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
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
  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {sidebarItems.map((item) => (
          <SidebarItemComponent key={item.title} item={item} />
        ))}
      </nav>
    </aside>
  );
}