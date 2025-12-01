"use client";

import Link from "next/link";
import { useAuth } from "@/shared/auth/useAuth";
import { Button } from "@/shared/ui/buttons/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/misc/dropdown-menu";
import { LogOut, User, HelpCircle, ChevronDown } from "lucide-react";

export function AdminHeader() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <header className="h-14 border-b bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/" className="font-semibold text-lg hover:text-primary transition-colors">
          FabLab
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">Admin</span>
      </div>
      
      <div className="flex items-center">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.email || user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/admin/profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/help" className="flex items-center gap-2 cursor-pointer">
                  <HelpCircle className="h-4 w-4" />
                  Ayuda
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
