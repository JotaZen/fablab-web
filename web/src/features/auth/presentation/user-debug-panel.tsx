"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/cards/card";
import { Button } from "@/shared/ui/buttons/button";
import { Badge } from "@/shared/ui/badges/badge";
import { Bug, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

interface UserDebugPanelProps {
  user: unknown;
  title?: string;
  defaultExpanded?: boolean;
}

/**
 * Panel de debug para visualizar datos del usuario en JSON formateado.
 * Solo visible en desarrollo o para superadmins.
 */
export function UserDebugPanel({ 
  user, 
  title = "Debug: Datos del Usuario",
  defaultExpanded = false 
}: UserDebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(user, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  return (
    <Card className="border-dashed border-amber-500/50 bg-amber-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {title}
            </CardTitle>
            <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600">
              DEV
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardDescription className="text-xs">
          Información completa del objeto usuario para debugging
        </CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="absolute top-2 right-2 h-7 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copiar
                </>
              )}
            </Button>
            
            <pre className="bg-slate-950 text-slate-100 p-4 rounded-lg overflow-auto max-h-[500px] text-xs font-mono">
              <code>{jsonString}</code>
            </pre>
          </div>

          {/* Resumen rápido */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-muted">
              <span className="text-muted-foreground">Campos:</span>{" "}
              <span className="font-medium">{user ? Object.keys(user as object).length : 0}</span>
            </div>
            <div className="p-2 rounded bg-muted">
              <span className="text-muted-foreground">Tamaño:</span>{" "}
              <span className="font-medium">{(jsonString.length / 1024).toFixed(2)} KB</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
