"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/cards/card';
import { Badge } from '@/shared/ui/badges/badge';
import { Shield, Users, Lock, Unlock } from 'lucide-react';
import { 
  ROLES, 
  translatePermission, 
  translateResource,
  groupPermissionsByResource 
} from '@/features/auth/domain/permissions';

export default function RolesPage() {
  const rolesArray = Object.values(ROLES);
  const permisosAgrupados = groupPermissionsByResource();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Roles y Permisos</h1>
        <p className="text-muted-foreground">
          Visualiza los roles del sistema y sus permisos asociados
        </p>
      </div>

      {/* Roles del sistema */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rolesArray.map((rol) => (
          <Card key={rol.id} className={rol.esEditable ? '' : 'border-amber-200'}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {rol.nombre}
                </CardTitle>
                {rol.esEditable ? (
                  <Badge variant="outline" className="text-green-600">
                    <Unlock className="h-3 w-3 mr-1" />
                    Editable
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-600">
                    <Lock className="h-3 w-3 mr-1" />
                    Sistema
                  </Badge>
                )}
              </div>
              <CardDescription>{rol.descripcion}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{rol.permisos.length} permisos</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {rol.permisos.slice(0, 5).map((perm) => (
                    <Badge key={perm} variant="secondary" className="text-xs">
                      {translatePermission(perm)}
                    </Badge>
                  ))}
                  {rol.permisos.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{rol.permisos.length - 5} más
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Matriz de permisos */}
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Permisos</CardTitle>
          <CardDescription>
            Vista detallada de qué permisos tiene cada rol
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Permiso</th>
                  {rolesArray.map((rol) => (
                    <th key={rol.id} className="text-center py-3 px-2 font-medium">
                      <div className="writing-vertical-lr rotate-180 whitespace-nowrap text-xs">
                        {rol.nombre}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(permisosAgrupados).map(([recurso, permisos]) => (
                  <>
                    <tr key={recurso} className="bg-muted/50">
                      <td colSpan={rolesArray.length + 1} className="py-2 px-4 font-medium">
                        {translateResource(recurso)}
                      </td>
                    </tr>
                    {permisos.map((perm) => (
                      <tr key={perm} className="border-b">
                        <td className="py-2 px-4 text-muted-foreground">
                          {translatePermission(perm)}
                        </td>
                        {rolesArray.map((rol) => (
                          <td key={`${rol.id}-${perm}`} className="text-center py-2 px-2">
                            {rol.permisos.includes(perm) ? (
                              <span className="inline-block w-4 h-4 rounded-full bg-green-500" title="Tiene permiso" />
                            ) : (
                              <span className="inline-block w-4 h-4 rounded-full bg-gray-200" title="Sin permiso" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Sistema de Permisos</p>
              <p className="text-sm text-blue-700 mt-1">
                Los roles del sistema (marcados como &quot;Sistema&quot;) no pueden modificarse. 
                Los roles editables pueden ser personalizados asignando o quitando permisos específicos.
                Los permisos se asignan a través de la gestión de usuarios individual.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
