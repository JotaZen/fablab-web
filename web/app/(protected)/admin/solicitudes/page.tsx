"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/cards/card";
import { Button } from "@/shared/ui/buttons/button";
import { Input } from "@/shared/ui/inputs/input";
import { Textarea } from "@/shared/ui/inputs/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/tables/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/misc/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/inputs/select";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Search,
  User,
  Package,
  Calendar,
  MessageSquare,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { 
  getAllEquipmentRequests, 
  updateRequestStatus,
} from "../equipment-usage/actions";

interface EquipmentRequest {
  id: string;
  equipmentName: string;
  description: string;
  quantity: number;
  justification: string;
  status: "pending" | "approved" | "rejected";
  requestedBy: string;
  requestedByAvatar?: string;
  requestedById?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
};

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

export default function SolicitudesPage() {
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<EquipmentRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const data = await getAllEquipmentRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
      toast.error("Error al cargar las solicitudes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: "pending" | "approved" | "rejected") => {
    try {
      setIsSubmitting(true);
      const result = await updateRequestStatus(requestId, newStatus, reviewNotes || undefined);
      
      if (result.success) {
        toast.success(`Solicitud ${statusLabels[newStatus].toLowerCase()}`);
        setIsDialogOpen(false);
        setSelectedRequest(null);
        setReviewNotes("");
        loadRequests();
      } else {
        toast.error(result.error || "Error al actualizar la solicitud");
      }
    } catch (error) {
      toast.error("Error al actualizar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReviewDialog = (request: EquipmentRequest) => {
    setSelectedRequest(request);
    setReviewNotes(request.reviewNotes || "");
    setIsDialogOpen(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CL', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return formatDate(dateStr);
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.justification.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;
  const rejectedCount = requests.filter(r => r.status === "rejected").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Solicitudes de FabLab</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona las solicitudes de equipos de todos los usuarios</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Pendientes</p>
                <p className="text-xl sm:text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="hidden sm:block p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Aprobadas</p>
                <p className="text-xl sm:text-3xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <div className="hidden sm:block p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Rechazadas</p>
                <p className="text-xl sm:text-3xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <div className="hidden sm:block p-3 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por equipo, usuario o justificación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="approved">Aprobadas</SelectItem>
            <SelectItem value="rejected">Rechazadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Historial de Solicitudes ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No hay solicitudes que coincidan con los filtros</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead className="hidden md:table-cell">Cantidad</TableHead>
                    <TableHead className="hidden lg:table-cell">Justificación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => {
                    const StatusIcon = statusIcons[request.status];
                    
                    return (
                      <TableRow key={request.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {request.requestedByAvatar ? (
                              <Image
                                src={request.requestedByAvatar}
                                alt={request.requestedBy}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-semibold">
                                {request.requestedBy?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                              </div>
                            )}
                            <span className="font-medium text-sm truncate max-w-[120px]">
                              {request.requestedBy}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{request.equipmentName}</p>
                            {request.description && (
                              <p className="text-xs text-gray-500 truncate max-w-[150px]">{request.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="font-medium">{request.quantity}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <p className="text-sm text-gray-600 truncate max-w-[200px]" title={request.justification}>
                            {request.justification}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[request.status]}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span className="hidden sm:inline">{statusLabels[request.status]}</span>
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-sm text-gray-500">{formatRelativeTime(request.createdAt)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openReviewDialog(request)}
                            className="text-xs"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Gestionar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Gestionar Solicitud
            </DialogTitle>
            <DialogDescription>
              Revisa los detalles y actualiza el estado de la solicitud
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              {/* Solicitante */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {selectedRequest.requestedByAvatar ? (
                  <Image
                    src={selectedRequest.requestedByAvatar}
                    alt={selectedRequest.requestedBy}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                    {selectedRequest.requestedBy?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                  </div>
                )}
                <div>
                  <p className="font-medium">{selectedRequest.requestedBy}</p>
                  <p className="text-sm text-gray-500">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {formatDate(selectedRequest.createdAt)}
                  </p>
                </div>
              </div>

              {/* Detalles */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Equipo Solicitado</label>
                  <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{selectedRequest.equipmentName}</p>
                </div>
                
                {selectedRequest.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Descripción</label>
                    <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{selectedRequest.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cantidad</label>
                    <p className="mt-1 text-sm bg-gray-50 p-2 rounded">{selectedRequest.quantity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estado Actual</label>
                    <p className={`mt-1 text-sm p-2 rounded ${statusColors[selectedRequest.status]}`}>
                      {statusLabels[selectedRequest.status]}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Justificación</label>
                  <p className="mt-1 text-sm bg-gray-50 p-2 rounded whitespace-pre-wrap">{selectedRequest.justification}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Notas de Revisión (opcional)</label>
                  <Textarea
                    placeholder="Agrega comentarios sobre tu decisión..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => selectedRequest && handleStatusChange(selectedRequest.id, "pending")}
                disabled={isSubmitting || selectedRequest?.status === "pending"}
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4 mr-1" />}
                En Espera
              </Button>
              <Button
                variant="outline"
                onClick={() => selectedRequest && handleStatusChange(selectedRequest.id, "rejected")}
                disabled={isSubmitting || selectedRequest?.status === "rejected"}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                Rechazar
              </Button>
              <Button
                onClick={() => selectedRequest && handleStatusChange(selectedRequest.id, "approved")}
                disabled={isSubmitting || selectedRequest?.status === "approved"}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                Aprobar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
