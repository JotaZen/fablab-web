"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/cards/card';
import { Users, AlertCircle, Construction } from 'lucide-react';

export default function UsersAdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestiona los usuarios y sus permisos en el sistema
        </p>
      </div>

      {/* En construcción */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            En desarrollo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            La gestión de usuarios está siendo refactorizada.
            Por ahora puedes gestionar usuarios desde Strapi directamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
