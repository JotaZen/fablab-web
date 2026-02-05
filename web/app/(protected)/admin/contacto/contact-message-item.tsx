"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/cards/card";
import { Button } from "@/shared/ui/buttons/button";
import {
  Mail,
  Phone,
  CheckCircle,
  Trash2,
  Reply,
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/inputs/select";
import { updateContactMessageStatus, deleteContactMessage } from "./actions";

interface ContactMessage {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
  estado: "nuevo" | "leido" | "progreso" | "resuelto";
  respuesta?: string;
  fechaRespuesta?: string;
  createdAt: string;
}

interface ContactMessageItemProps {
  mensaje: ContactMessage;
}

export function ContactMessageItem({ mensaje: initialMensaje }: ContactMessageItemProps) {
  const [mensaje, setMensaje] = useState(initialMensaje);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCambiarEstado = async (nuevoEstado: string) => {
    setIsLoading(true);
    try {
      await updateContactMessageStatus(mensaje.id, nuevoEstado);
      setMensaje((prev) => ({ ...prev, estado: nuevoEstado as any }));
    } catch (error) {
      console.error("Error actualizando estado:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este mensaje?")) return;

    setIsLoading(true);
    try {
      await deleteContactMessage(mensaje.id);
      // Recargar página
      window.location.reload();
    } catch (error) {
      console.error("Error eliminando mensaje:", error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="pt-6 pb-6">
        <div
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {mensaje.nombre}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    mensaje.estado === "nuevo"
                      ? "bg-red-100 text-red-700"
                      : mensaje.estado === "leido"
                      ? "bg-blue-100 text-blue-700"
                      : mensaje.estado === "progreso"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {mensaje.estado}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {mensaje.asunto}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(mensaje.createdAt).toLocaleDateString("es-CL", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Mail className="w-5 h-5 text-gray-400" />
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Detalle expandido */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t space-y-6">
            {/* Información de contacto */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <a
                  href={`mailto:${mensaje.email}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {mensaje.email}
                </a>
              </div>
              {mensaje.telefono && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <a
                    href={`tel:${mensaje.telefono}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {mensaje.telefono}
                  </a>
                </div>
              )}
            </div>

            {/* Mensaje */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">Mensaje</h4>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {mensaje.mensaje}
              </p>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">Estado</h4>
              <Select value={mensaje.estado} onValueChange={handleCambiarEstado}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="leido">Leído</SelectItem>
                  <SelectItem value="progreso">En Progreso</SelectItem>
                  <SelectItem value="resuelto">Resuelto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Respuesta */}
            {mensaje.respuesta && (
              <div className="space-y-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Respuesta
                </h4>
                <p className="text-green-800 text-sm whitespace-pre-wrap">
                  {mensaje.respuesta}
                </p>
                {mensaje.fechaRespuesta && (
                  <p className="text-xs text-green-600 mt-2">
                    {new Date(mensaje.fechaRespuesta).toLocaleDateString("es-CL")}
                  </p>
                )}
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() =>
                  window.open(`mailto:${mensaje.email}`, "_blank")
                }
              >
                <Reply className="w-4 h-4 mr-2" />
                Responder
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={handleEliminar}
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
