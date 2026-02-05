import React from "react";
import { getContactMessages } from "./actions";
import {
  Card,
  CardContent,
} from "@/shared/ui/cards/card";
import { Mail } from "lucide-react";
import { ContactMessageItem } from "./contact-message-item";

export const dynamic = 'force-dynamic';

export default async function ContactosPage() {
  // La autenticación y verificación de rol admin
  // ya se manejan en middleware.ts y admin/layout.tsx
  const mensajes = await getContactMessages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mensajes de Contacto</h1>
          <p className="text-gray-600 mt-1">
            {mensajes.length} mensaje{mensajes.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {mensajes.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay mensajes de contacto</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mensajes.map((mensaje) => (
            <ContactMessageItem key={mensaje.id} mensaje={mensaje} />
          ))}
        </div>
      )}
    </div>
  );
}
