"use client";

import React, { useEffect, useState } from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { useAuth } from "@/features/auth";
import { useRouter } from "next/navigation";
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
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Reply,
  Eye,
  MoreVertical,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/inputs/select";

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

export default function ContactosPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [mensajes, setMensajes] = useState<ContactMessage[]>([]);
  const [loadingMensajes, setLoadingMensajes] = useState(true);
  const [selectedMensaje, setSelectedMensaje] = useState<ContactMessage | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState<string>("todos");

  // Verificar permisos de admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user as any)?.role !== "admin")) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Cargar mensajes de contacto
  useEffect(() => {
    const loadMensajes = async () => {
      try {
        const payload = await getPayload({ config });
        const result = await payload.find({
          collection: "contact-messages",
          limit: 100,
          sort: "-createdAt",
        });

        setMensajes(result.docs as unknown as ContactMessage[]);
      } catch (error) {
        console.error("Error cargando mensajes:", error);
      } finally {
        setLoadingMensajes(false);
      }
    };

    loadMensajes();
  }, []);

  // Filtrar mensajes por estado
  const mensajesFiltrados = estadoFiltro === "todos"
    ? mensajes
    : mensajes.filter((m) => m.estado === estadoFiltro);

  // Cambiar estado de un mensaje
  const handleCambiarEstado = async (id: string, nuevoEstado: string) => {
    try {
      const payload = await getPayload({ config });
      await payload.update({
        collection: "contact-messages",
        id,
        data: { estado: nuevoEstado },
      });

      setMensajes((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, estado: nuevoEstado as any } : m
        )
      );
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  // Eliminar mensaje
  const handleEliminar = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este mensaje?")) return;

    try {
      const payload = await getPayload({ config });
      await payload.delete({
        collection: "contact-messages",
        id,
      });

      setMensajes((prev) => prev.filter((m) => m.id !== id));
      setSelectedMensaje(null);
    } catch (error) {
      console.error("Error eliminando mensaje:", error);
    }
  };

  if (isLoading || loadingMensajes) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mensajes de Contacto</h1>
          <p className="text-gray-600 mt-1">
            {mensajesFiltrados.length} mensaje{mensajesFiltrados.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filtro por estado */}
      <div className="flex gap-3">
        {["todos", "nuevo", "leido", "progreso", "resuelto"].map((estado) => (
          <Button
            key={estado}
            onClick={() => setEstadoFiltro(estado)}
            variant={estadoFiltro === estado ? "default" : "outline"}
            className={estadoFiltro === estado ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lista de mensajes */}
        <div className="lg:col-span-2 space-y-4">
          {mensajesFiltrados.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay mensajes en esta categoría</p>
              </CardContent>
            </Card>
          ) : (
            mensajesFiltrados.map((mensaje) => (
              <Card
                key={mensaje.id}
                className={`cursor-pointer transition-all ${
                  selectedMensaje?.id === mensaje.id
                    ? "ring-2 ring-orange-500 shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedMensaje(mensaje)}
              >
                <CardContent className="pt-6 pb-6">
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
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detalle del mensaje seleccionado */}
        {selectedMensaje ? (
          <Card className="h-fit sticky top-6">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">Detalle del Mensaje</CardTitle>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Información de contacto */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <a
                    href={`mailto:${selectedMensaje.email}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {selectedMensaje.email}
                  </a>
                </div>
                {selectedMensaje.telefono && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <a
                      href={`tel:${selectedMensaje.telefono}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {selectedMensaje.telefono}
                    </a>
                  </div>
                )}
              </div>

              {/* Mensaje */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm">Asunto</h4>
                <p className="text-gray-700 text-sm">{selectedMensaje.asunto}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm">Mensaje</h4>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {selectedMensaje.mensaje}
                </p>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm">Estado</h4>
                <Select
                  value={selectedMensaje.estado}
                  onValueChange={(valor) =>
                    handleCambiarEstado(selectedMensaje.id, valor)
                  }
                >
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
              {selectedMensaje.respuesta && (
                <div className="space-y-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Respuesta
                  </h4>
                  <p className="text-green-800 text-sm whitespace-pre-wrap">
                    {selectedMensaje.respuesta}
                  </p>
                  {selectedMensaje.fechaRespuesta && (
                    <p className="text-xs text-green-600 mt-2">
                      {new Date(selectedMensaje.fechaRespuesta).toLocaleDateString("es-CL")}
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
                    window.open(`mailto:${selectedMensaje.email}`, "_blank")
                  }
                >
                  <Reply className="w-4 h-4 mr-2" />
                  Responder
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleEliminar(selectedMensaje.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-fit flex items-center justify-center p-6">
            <div className="text-center text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Selecciona un mensaje para ver detalles</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
