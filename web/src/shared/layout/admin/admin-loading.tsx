"use client";

import { Loader2 } from "lucide-react";

export function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando panel de administración...</p>
      </div>
    </div>
  );
}
