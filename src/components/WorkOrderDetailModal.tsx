import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { WorkOrder } from "./WorkOrders";
import { Calendar, User, MapPin, Wrench, Clock, FileText } from "lucide-react";

interface WorkOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder;
}

export function WorkOrderDetailModal({
  isOpen,
  onClose,
  workOrder,
}: WorkOrderDetailModalProps) {
  const getPriorityColor = (priority: string) => {
    const colors = {
      emergencia: "bg-red-100 text-red-800 border-red-200",
      urgente: "bg-orange-100 text-orange-800 border-orange-200",
      programado: "bg-blue-100 text-blue-800 border-blue-200",
      mejora: "bg-purple-100 text-purple-800 border-purple-200",
      inspeccion: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
      programado: "bg-blue-100 text-blue-800 border-blue-200",
      ejecutado: "bg-green-100 text-green-800 border-green-200",
      reprogramado: "bg-purple-100 text-purple-800 border-purple-200",
      "no-ejecutado": "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      preventivo: "Preventivo",
      correctivo: "Correctivo",
      mejora: "Mejora Técnica",
      evaluacion: "Evaluación Técnica",
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{workOrder.id}</DialogTitle>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(workOrder.priority)}>
                {workOrder.priority}
              </Badge>
              <Badge className={getStatusColor(workOrder.status)}>
                {workOrder.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información general */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Solicitante</p>
                  <p>{workOrder.requestor}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Fecha de solicitud</p>
                  <p>{new Date(workOrder.date).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Departamento</p>
                  <p>{workOrder.department}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Área / Línea</p>
                  <p>{workOrder.area}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wrench className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Equipo</p>
                  <p>{workOrder.equipment}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Tipo de mantenimiento</p>
                  <p>{getTypeLabel(workOrder.type)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descripción */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Descripción del Problema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{workOrder.description}</p>
            </CardContent>
          </Card>

          {/* Asignación */}
          {workOrder.assignedTo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Asignación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Técnico asignado</p>
                    <p>{workOrder.assignedTo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historial de estados */}
          {((workOrder as any).statusHistory || []).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historial de estados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {((workOrder as any).statusHistory || []).map(
                    (h: any, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="text-sm text-gray-600">
                            {h.status}
                          </div>
                          <div className="text-xs text-gray-500">
                            {h.by} • {new Date(h.at).toLocaleString()}{" "}
                            {h.note ? `• ${h.note}` : ""}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {workOrder.status === "pendiente" && (
              <Button onClick={() => alert("Funcionalidad: Asignar técnico")}>
                Asignar Técnico
              </Button>
            )}
            {workOrder.status === "programado" && (
              <Button onClick={() => alert("Funcionalidad: Iniciar ejecución")}>
                Iniciar Ejecución
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
