"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/shared/auth/RequireAuth";
import { useAuth } from "@/shared/auth/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/cards/card";
import { Button } from "@/shared/ui/buttons/button";
import { Badge } from "@/shared/ui/badges/badge";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { UserDebugPanel } from "@/features/auth/presentation/user-debug-panel";

export default function AdminProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/admin");
  };

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Mi Perfil
            </CardTitle>
            <CardDescription>
              Información de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {user && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Usuario</div>
                      <div className="font-medium">{user.username || "—"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{user.email || "—"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Roles</div>
                      <div className="flex gap-2 mt-1">
                        {user.roles?.length ? (
                          user.roles.map((role) => (
                            <Badge key={role} variant="secondary">
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">Usuario</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Panel de Debug */}
        {user && process.env.NODE_ENV === "development" && (
          <UserDebugPanel user={user} defaultExpanded={false} />
        )}
      </div>
    </RequireAuth>
  );
}
