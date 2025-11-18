import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  LogOut,
  Clock,
  TrendingUp,
  AlertCircle,
  Package,
} from "lucide-react";
import { Input } from "./ui/input";
import { WorkOrderModal } from "./WorkOrderModal";
import { WorkOrderDetailModal } from "./WorkOrderDetailModal";
import { WorkOrderExitModal } from "./WorkOrderExitModal";
import { WorkOrderClosingModal } from "./WorkOrderClosingModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type WorkOrder = {
  id: string;
  requestor: string;
  date: string;
  issueDate?: string;
  issueTime?: string;
  deliveryDate?: string;
  department: string;
  area: string;
  equipment: string;
  description: string;
  projectCode?: string;
  type: "preventivo" | "correctivo" | "mejora" | "evaluacion";
  priority: "emergencia" | "urgente" | "programado" | "mejora" | "inspeccion";
  status:
    | "pendiente"
    | "programado"
    | "en-proceso"
    | "ejecutado"
    | "cerrado"
    | "reprogramado"
    | "no-ejecutado"
    | "rechazado";
  assignedTo?: string;
  exitData?: any; // Datos de salida / finalización de OT
  closingData?: any; // Datos de cierre de OT
};

export function WorkOrders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [closingModalOpen, setClosingModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: "OT-2024-001",
      projectCode: "PROJ-A1",
      requestor: "Carlos Mendoza",
      date: "2024-11-10T08:30:00",
      issueDate: "2024-11-10",
      issueTime: "08:30",
      deliveryDate: "2024-11-11",
      department: "Producción",
      area: "Línea 3",
      equipment: "Torno CNC-001",
      description: "Ruido anormal en el husillo principal",
      type: "correctivo",
      priority: "urgente",
      status: "programado",
      assignedTo: "Juan Pérez",
    },
    {
      id: "OT-2024-002",
      projectCode: "PROJ-B2",
      requestor: "María González",
      date: "2024-11-11T10:15:00",
      issueDate: "2024-11-11",
      issueTime: "10:15",
      department: "Mantenimiento",
      area: "Compresores",
      equipment: "Compresor A-205",
      description: "Mantenimiento preventivo mensual",
      type: "preventivo",
      priority: "programado",
      status: "pendiente",
    },
    {
      id: "OT-2024-003",
      projectCode: "PROJ-C3",
      requestor: "Roberto Silva",
      date: "2024-11-09T14:20:00",
      issueDate: "2024-11-09",
      issueTime: "14:20",
      department: "Producción",
      area: "Línea 1",
      equipment: "Fresadora F-102",
      description: "Falla eléctrica - No enciende",
      type: "correctivo",
      priority: "emergencia",
      status: "ejecutado",
      assignedTo: "Pedro Ramírez",
    },
    {
      id: "OT-2024-004",
      projectCode: "PROJ-D4",
      requestor: "Ana Torres",
      date: "2024-11-13T09:00:00",
      issueDate: "2024-11-13",
      issueTime: "09:00",
      department: "Producción",
      area: "Línea 2",
      equipment: "Línea de Ensamblaje A",
      description: "Ajuste de tensores y calibración",
      type: "preventivo",
      priority: "programado",
      status: "en-proceso",
      assignedTo: "Marcos Díaz",
    },
    {
      id: "OT-2024-005",
      projectCode: "PROJ-E5",
      requestor: "Jorge Ruiz",
      date: "2024-11-14T11:30:00",
      issueDate: "2024-11-14",
      issueTime: "11:30",
      department: "Mantenimiento",
      area: "Calderas",
      equipment: "Caldera C-12",
      description: "Inspección de seguridad y reemplazo de válvula",
      type: "correctivo",
      priority: "urgente",
      status: "reprogramado",
      assignedTo: "Lucía Fernández",
    },
    {
      id: "OT-2024-006",
      projectCode: "PROJ-F6",
      requestor: "Luis Martínez",
      date: "2024-11-12T07:45:00",
      issueDate: "2024-11-12",
      issueTime: "07:45",
      department: "Producción",
      area: "Línea 4",
      equipment: "Prensa P-201",
      description: "Parada por bloque de seguridad activado",
      type: "correctivo",
      priority: "emergencia",
      status: "no-ejecutado",
    },
    {
      id: "OT-2024-007",
      projectCode: "PROJ-G7",
      requestor: "Sofía Ramírez",
      date: "2024-11-15T13:00:00",
      issueDate: "2024-11-15",
      issueTime: "13:00",
      department: "Calidad",
      area: "Línea 5",
      equipment: "Medidor M-77",
      description: "Revisión por lectura fuera de tolerancia",
      type: "evaluacion",
      priority: "programado",
      status: "rechazado",
      assignedTo: "",
    },
    {
      id: "OT-2024-008",
      projectCode: "PROJ-H8",
      requestor: "Pedro Gómez",
      date: "2024-11-16T08:30:00",
      issueDate: "2024-11-16",
      issueTime: "08:30",
      department: "Mantenimiento",
      area: "Línea 3",
      equipment: "Torno CNC-002",
      description: "Cambio de herramienta y prueba de corte",
      type: "mejora",
      priority: "programado",
      status: "programado",
      assignedTo: "Alberto Ruiz",
    },
  ]);

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

  // Conteos para KPIs (estilo Dashboard)
  const countProgramados = workOrders.filter(
    (o) => o.status === "programado"
  ).length;
  const countEnProceso =
    workOrders.filter((o) => o.status === "en-proceso").length || 0;
  const countCompletados = workOrders.filter(
    (o) => o.status === "ejecutado"
  ).length;
  const countReprogramados = workOrders.filter(
    (o) => o.status === "reprogramado"
  ).length;
  const countRechazados =
    workOrders.filter((o) => o.status === "rechazado").length || 0;

  const getStatusLabel = (s: string) => {
    const map: Record<string, string> = {
      pendiente: "Pendiente",
      programado: "Programado",
      "en-proceso": "En Proceso",
      ejecutado: "Completado",
      reprogramado: "Reprogramado",
      "no-ejecutado": "No Ejecutado",
      rechazado: "Rechazado",
      cerrado: "Cerrado",
    };
    return map[s] || s;
  };

  const filteredOrders = workOrders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || order.priority === filterPriority;
    const matchesSearch =
      searchTerm === "" ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.projectCode &&
        order.projectCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleAddOrder = (order: WorkOrder) => {
    setWorkOrders([...workOrders, order]);
  };

  const handleViewDetails = (order: WorkOrder) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const handleOpenExitModal = (order: WorkOrder) => {
    setSelectedOrder(order);
    setExitModalOpen(true);
  };

  const handleExitSubmit = (exitData: any) => {
    const updatedOrders = workOrders.map((order) =>
      order.id === exitData.id ? exitData : order
    );
    setWorkOrders(updatedOrders);
    setExitModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOpenClosingModal = (order: WorkOrder) => {
    setSelectedOrder(order);
    setClosingModalOpen(true);
  };

  const handleClosingSubmit = (closingData: any) => {
    const updatedOrders = workOrders.map((order) =>
      order.id === closingData.id ? closingData : order
    );
    setWorkOrders(updatedOrders);
    setClosingModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* KPIs estilo Dashboard: fila horizontal (no wrapping) */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <Card className="min-w-[200px] flex-shrink-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Programados</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl">{countProgramados}</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-[200px] flex-shrink-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">En Proceso</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl">{countEnProceso}</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-[200px] flex-shrink-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Completados</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl">{countCompletados}</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-[200px] flex-shrink-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Reprogramados</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl">{countReprogramados}</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-[200px] flex-shrink-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Rechazados</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl">{countRechazados}</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-100">
                <AlertCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Header con búsqueda y filtros */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar OT, equipo, descripción..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="programado">Programado</SelectItem>
              <SelectItem value="en-proceso">En Proceso</SelectItem>
              <SelectItem value="ejecutado">Ejecutado</SelectItem>
              <SelectItem value="reprogramado">Reprogramado</SelectItem>
              {/* <SelectItem value="no-ejecutado">No ejecutado</SelectItem> */}
              <SelectItem value="rechazado">Rechazado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las prioridades</SelectItem>
              <SelectItem value="emergencia">Emergencia</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
              <SelectItem value="programado">Programado</SelectItem>
              <SelectItem value="mejora">Mejora</SelectItem>
              <SelectItem value="inspeccion">Inspección</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva OT
        </Button>
      </div>

      {/* Lista de OT en tarjetas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <div className="text-xs text-gray-500">
                      {order.projectCode ?? "—"}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.equipment}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Dept: {order.department} • Área: {order.area}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Emitida:{" "}
                    {order.issueDate
                      ? order.issueDate
                      : new Date(order.date).toLocaleDateString()}{" "}
                    {order.issueTime ? order.issueTime : ""}
                    {order.deliveryDate && (
                      <span> • Entrega: {order.deliveryDate}</span>
                    )}
                  </p>
                </div>
                <Badge className={getPriorityColor(order.priority)}>
                  {order.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Descripción:</p>
                <p className="text-sm line-clamp-2">{order.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Solicitante:</p>
                  <p>{order.requestor}</p>
                </div>
                <div>
                  <p className="text-gray-600">Área:</p>
                  <p>{order.area}</p>
                </div>
                <div>
                  <p className="text-gray-600">Tipo:</p>
                  <p>{getTypeLabel(order.type)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha:</p>
                  <p>{new Date(order.date).toLocaleDateString()}</p>
                </div>
              </div>
              {order.assignedTo && (
                <div className="text-sm">
                  <p className="text-gray-600">Asignado a:</p>
                  <p>{order.assignedTo}</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t gap-2">
                <Badge className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalles
                  </Button>
                  {order.status !== "ejecutado" &&
                    order.status !== "cerrado" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenExitModal(order)}
                        className="gap-2 text-green-600 hover:text-green-700 border-green-600 hover:bg-green-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Finalizar
                      </Button>
                    )}
                  {order.status === "ejecutado" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenClosingModal(order)}
                      className="gap-2 text-blue-600 hover:text-blue-700 border-blue-600 hover:bg-blue-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Cerrar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No se encontraron órdenes de trabajo con los filtros aplicados.
          </CardContent>
        </Card>
      )}

      <WorkOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOrder}
      />

      {selectedOrder && (
        <WorkOrderDetailModal
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedOrder(null);
          }}
          workOrder={selectedOrder}
        />
      )}

      {selectedOrder && (
        <WorkOrderExitModal
          isOpen={exitModalOpen}
          onClose={() => {
            setExitModalOpen(false);
            setSelectedOrder(null);
          }}
          onSubmit={handleExitSubmit}
          workOrder={selectedOrder}
        />
      )}

      {selectedOrder && (
        <WorkOrderClosingModal
          isOpen={closingModalOpen}
          onClose={() => {
            setClosingModalOpen(false);
            setSelectedOrder(null);
          }}
          onSubmit={handleClosingSubmit}
          workOrder={selectedOrder}
        />
      )}
    </div>
  );
}
