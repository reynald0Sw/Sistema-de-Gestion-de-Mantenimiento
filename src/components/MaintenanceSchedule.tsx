import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, User, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { AssignTechnicianModal } from "./AssignTechnicianModal";
import { RejectOrderModal } from "./RejectOrderModal";
import { WorkOrderExitModal } from "./WorkOrderExitModal";
import { WorkOrderClosingModal } from "./WorkOrderClosingModal";
import {
  updateOrder as storeUpdateOrder,
  getWorkOrders,
  subscribe as subscribeWorkOrders,
} from "../lib/workOrdersStore";
import { TECHNICIANS } from "../lib/technicians";

type MaintenanceTask = {
  id: string;
  otId: string;
  equipment: string;
  type: string;
  scheduledDate: string;
  estimatedDuration: string;
  assignedTo?: string;
  status:
    | "programado"
    | "en-proceso"
    | "completado"
    | "ejecutado"
    | "cerrado"
    | "reprogramado"
    | "rechazado"
    | "pendiente"
    | "no-ejecutado";
  priority: string;
};

export function MaintenanceSchedule() {
  const initial: MaintenanceTask[] = [
    {
      id: "PROG-001",
      otId: "OT-2025-101",
      equipment: "Torno CNC-001",
      type: "Correctivo",
      scheduledDate: "2025-11-19T09:00:00",
      estimatedDuration: "3 horas",
      assignedTo: "Juan Pérez",
      status: "programado",
      priority: "urgente",
    },
    {
      id: "PROG-002",
      otId: "OT-2025-102",
      equipment: "Compresor A-205",
      type: "Preventivo",
      scheduledDate: "2025-11-19T11:00:00",
      estimatedDuration: "2 horas",
      assignedTo: "María López",
      status: "en-proceso",
      priority: "programado",
    },
    {
      id: "PROG-003",
      otId: "OT-2025-103",
      equipment: "Bomba hidráulica B-102",
      type: "Preventivo",
      scheduledDate: "2025-11-20T14:00:00",
      estimatedDuration: "1.5 horas",
      assignedTo: "Pedro Ramírez",
      status: "ejecutado",
      priority: "programado",
    },
    {
      id: "PROG-004",
      otId: "OT-2025-104",
      equipment: "Generador G-12",
      type: "Correctivo",
      scheduledDate: "2025-11-21T08:00:00",
      estimatedDuration: "4 horas",
      assignedTo: "Ana Torres",
      status: "rechazado",
      priority: "emergencia",
    },
    {
      id: "PROG-005",
      otId: "OT-2025-105",
      equipment: "Transportador T-8",
      type: "Mejora",
      scheduledDate: "2025-11-22T10:30:00",
      estimatedDuration: "2 horas",
      assignedTo: "Carlos Mendoza",
      status: "reprogramado",
      priority: "mejora",
    },
    {
      id: "PROG-006",
      otId: "OT-2025-106",
      equipment: "Cinta Dosificadora C-3",
      type: "Preventivo",
      scheduledDate: "2025-11-19T13:00:00",
      estimatedDuration: "1 hora",
      assignedTo: undefined,
      status: "programado",
      priority: "programado",
    },
    {
      id: "PROG-007",
      otId: "OT-2025-107",
      equipment: "Compresor B-11",
      type: "Correctivo",
      scheduledDate: "2025-11-23T09:00:00",
      estimatedDuration: "3 horas",
      assignedTo: "Juan Pérez",
      status: "completado",
      priority: "urgente",
    },
    {
      id: "PROG-008",
      otId: "OT-2025-108",
      equipment: "Bomba dosificadora D-7",
      type: "Predictivo",
      scheduledDate: "2025-11-24T15:00:00",
      estimatedDuration: "2 horas",
      assignedTo: "María López",
      status: "en-proceso",
      priority: "inspeccion",
    },
    {
      id: "PROG-009",
      otId: "OT-2025-109",
      equipment: "Turbina T-2",
      type: "Correctivo",
      scheduledDate: "2025-11-18T07:30:00",
      estimatedDuration: "5 horas",
      assignedTo: "Pedro Ramírez",
      status: "cerrado",
      priority: "emergencia",
    },
    {
      id: "PROG-010",
      otId: "OT-2025-110",
      equipment: "Panel Eléctrico P-4",
      type: "Autónomo",
      scheduledDate: "2025-11-25T09:00:00",
      estimatedDuration: "1.5 horas",
      assignedTo: undefined,
      status: "programado",
      priority: "programado",
    },
    {
      id: "PROG-011",
      otId: "OT-2025-111",
      equipment: "Prensa P-201",
      type: "Correctivo",
      scheduledDate: "2025-11-20T07:00:00",
      estimatedDuration: "4 horas",
      assignedTo: "Lucía Fernández",
      status: "pendiente",
      priority: "urgente",
    },
    {
      id: "PROG-012",
      otId: "OT-2025-112",
      equipment: "Medidor M-77",
      type: "Evaluación",
      scheduledDate: "2025-11-21T12:00:00",
      estimatedDuration: "1 hora",
      assignedTo: "Alberto Ruiz",
      status: "no-ejecutado",
      priority: "inspeccion",
    },
    {
      id: "PROG-013",
      otId: "OT-2025-113",
      equipment: "Panel Solar S-1",
      type: "Preventivo",
      scheduledDate: "2025-11-22T08:30:00",
      estimatedDuration: "2 horas",
      assignedTo: "Marcela Díaz",
      status: "programado",
      priority: "programado",
    },
    {
      id: "PROG-014",
      otId: "OT-2025-114",
      equipment: "Sistema HVAC H-9",
      type: "Mejora",
      scheduledDate: "2025-11-23T14:00:00",
      estimatedDuration: "3 horas",
      assignedTo: "Roberto Silva",
      status: "reprogramado",
      priority: "mejora",
    },
    {
      id: "PROG-015",
      otId: "OT-2025-115",
      equipment: "Transportador T-9",
      type: "Correctivo",
      scheduledDate: "2025-11-24T10:00:00",
      estimatedDuration: "2.5 horas",
      assignedTo: "Paola García",
      status: "en-proceso",
      priority: "urgente",
    },
    {
      id: "PROG-016",
      otId: "OT-2025-116",
      equipment: "Filtro F-55",
      type: "Preventivo",
      scheduledDate: "2025-11-25T16:00:00",
      estimatedDuration: "1 hora",
      assignedTo: undefined,
      status: "programado",
      priority: "programado",
    },
  ];

  const [tasks, setTasks] = useState<MaintenanceTask[]>(() => {
    try {
      const stored = getWorkOrders();
      if (stored && stored.length) {
        // map some stored orders into schedule tasks when possible
        return stored.map(
          (o: any, idx: number) =>
            ({
              id: `PROG-${idx + 1}`,
              otId: o.id,
              equipment: o.equipment || o.id,
              type: o.type || "Preventivo",
              scheduledDate: o.date || new Date().toISOString(),
              estimatedDuration: "2 horas",
              assignedTo: o.assignedTo || undefined,
              status: (o.status as MaintenanceTask["status"]) || "programado",
              priority: o.priority || "programado",
            } as MaintenanceTask)
        );
      }
    } catch {}
    return initial;
  });

  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(
    null
  );

  const getStatusColor = (status: string) => {
    const colors = {
      programado: "bg-blue-100 text-blue-800 border-blue-200",
      "en-proceso": "bg-yellow-100 text-yellow-800 border-yellow-200",
      completado: "bg-green-100 text-green-800 border-green-200",
      reprogramado: "bg-purple-100 text-purple-800 border-purple-200",
      rechazado: "bg-red-100 text-red-800 border-red-200",
      pendiente: "bg-gray-100 text-gray-800 border-gray-200",
      "no-ejecutado": "bg-rose-50 text-rose-800 border-rose-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      emergencia: "bg-red-100 text-red-800",
      urgente: "bg-orange-100 text-orange-800",
      programado: "bg-blue-100 text-blue-800",
    };
    return (
      colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  // modal states and admin filters
  const [assignOpen, setAssignOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [closingOpen, setClosingOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [techFilter, setTechFilter] = useState<string>("all");
  const [assignedFilter, setAssignedFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const technicianOptions = TECHNICIANS.map((t) => t.name);

  const [sortByPriority, setSortByPriority] = useState<boolean>(false);

  // apply filters then group tasks by date
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter)
      return false;
    if (techFilter !== "all" && task.assignedTo !== techFilter) return false;
    if (assignedFilter === "assigned" && !task.assignedTo) return false;
    if (assignedFilter === "unassigned" && task.assignedTo) return false;
    return true;
  });

  const priorityScore = (p: string) => {
    switch (p) {
      case "emergencia":
        return 4;
      case "urgente":
        return 3;
      case "mejora":
        return 2;
      case "inspeccion":
        return 2;
      case "programado":
        return 1;
      default:
        return 0;
    }
  };

  const sortedTasks = sortByPriority
    ? [...filteredTasks].sort(
        (a, b) => priorityScore(b.priority) - priorityScore(a.priority)
      )
    : filteredTasks;

  const groupedTasks = sortedTasks.reduce((acc, task) => {
    const date = new Date(task.scheduledDate).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, MaintenanceTask[]>);

  // Keep tasks in sync with the shared store (source of truth)
  useEffect(() => {
    const mapOrdersToTasks = () => {
      try {
        const orders = getWorkOrders();
        if (orders && orders.length) {
          const mapped = orders.map(
            (o: any, idx: number) =>
              ({
                id: `PROG-${idx + 1}`,
                otId: o.id,
                equipment: o.equipment || o.id,
                type: o.type || o.type_name || "Preventivo",
                scheduledDate:
                  o.date || o.scheduledDate || new Date().toISOString(),
                estimatedDuration: o.estimatedDuration || "2 horas",
                assignedTo: o.assignedTo || undefined,
                status: (o.status as MaintenanceTask["status"]) || "programado",
                priority: o.priority || "programado",
              } as MaintenanceTask)
          );
          setTasks(mapped);
          return;
        }
      } catch (e) {
        // fallback to existing tasks
      }
      setTasks(initial);
    };

    mapOrdersToTasks();
    const unsub = subscribeWorkOrders(() => mapOrdersToTasks());
    return unsub;
  }, []);

  // Prioritize handler: quick bump priority
  const handlePrioritize = (task: MaintenanceTask) => {
    if (!task.otId) return;
    const current = task.priority || "programado";
    let next = "urgente";
    if (current === "emergencia") next = "emergencia";
    else if (current === "urgente") next = "emergencia";
    else next = "urgente";

    try {
      storeUpdateOrder(
        task.otId,
        { priority: next },
        "planner",
        "Prioridad desde Planificación"
      );
    } catch (e) {
      console.warn("store update failed", e);
    }
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, priority: next } : t))
    );
  };

  useEffect(() => {
    // Keep tasks mapped to store when possible (best-effort sync)
    // No-op here, but could be used to refresh from store
  }, []);

  // derive status counts from shared store when available, otherwise from local tasks
  const storeOrders = getWorkOrders() || [];
  const sourceOrders: any[] =
    storeOrders && storeOrders.length
      ? storeOrders
      : tasks.map((t) => ({ id: t.otId, status: t.status }));

  const countProgramados = sourceOrders.filter(
    (o) => o.status === "programado"
  ).length;
  const countEnProceso = sourceOrders.filter(
    (o) => o.status === "en-proceso"
  ).length;
  const countCompletados = sourceOrders.filter(
    (o) => o.status === "ejecutado" || o.status === "completado"
  ).length;
  const countReprogramados = sourceOrders.filter(
    (o) => o.status === "reprogramado"
  ).length;
  const countRechazados = sourceOrders.filter(
    (o) => o.status === "rechazado"
  ).length;

  const handleOpenAssign = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setAssignOpen(true);
  };

  const handleAssign = (technician: string) => {
    if (!selectedTask) return;
    const updated = tasks.map((t) =>
      t.id === selectedTask.id
        ? { ...t, assignedTo: technician, status: "en-proceso" }
        : t
    );
    setTasks(updated as MaintenanceTask[]);
    // try to update shared store (best-effort)
    try {
      if (selectedTask.otId) {
        storeUpdateOrder(
          selectedTask.otId,
          { assignedTo: technician, status: "en-proceso" },
          technician,
          "Asignado desde Planificación"
        );
      }
    } catch (e) {
      console.warn("store update failed", e);
    }
    setSelectedTask(null);
  };

  const handleOpenReject = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setRejectOpen(true);
  };

  const handleOpenExit = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setExitOpen(true);
  };

  const handleOpenClosing = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setClosingOpen(true);
  };

  const handleExitSubmit = (payload: any) => {
    if (!selectedTask) return;
    const id = (payload && payload.id) || selectedTask.otId;
    try {
      storeUpdateOrder(
        id,
        {
          status: payload.status || "ejecutado",
          exitData: payload.exitData || payload,
        },
        (payload &&
          payload.exitData &&
          payload.exitData.signatures &&
          payload.exitData.signatures.technicianName) ||
          "planner",
        "Finalizado desde Planificación"
      );
    } catch (e) {
      console.warn("store update failed", e);
    }
    const updated = tasks.map((t) =>
      t.id === selectedTask.id ? { ...t, status: "ejecutado" } : t
    );
    setTasks(updated as MaintenanceTask[]);
    setSelectedTask(null);
    setExitOpen(false);
  };

  const handleClosingSubmit = (payload: any) => {
    if (!selectedTask) return;
    const id = (payload && payload.id) || selectedTask.otId;
    try {
      storeUpdateOrder(
        id,
        {
          status: payload.status || "cerrado",
          closingData: payload.closingData || payload,
        },
        (payload && payload.responsibleTechnician) || "planner",
        "Cerrado desde Planificación"
      );
    } catch (e) {
      console.warn("store update failed", e);
    }
    const updated = tasks.map((t) =>
      t.id === selectedTask.id ? { ...t, status: "cerrado" as any } : t
    );
    setTasks(updated as MaintenanceTask[]);
    setSelectedTask(null);
    setClosingOpen(false);
  };

  const handleReject = (reason: string) => {
    if (!selectedTask) return;
    const updated = tasks.map((t) =>
      t.id === selectedTask.id ? { ...t, status: "rechazado" } : t
    );
    setTasks(updated as MaintenanceTask[]);
    try {
      if (selectedTask.otId) {
        storeUpdateOrder(
          selectedTask.otId,
          { status: "rechazado" },
          "planner",
          reason || "Rechazado desde Planificación"
        );
      }
    } catch (e) {
      console.warn("store update failed", e);
    }
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-blue-600">{countProgramados}</div>
              <p className="text-gray-600 mt-1">Programados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-yellow-600">{countEnProceso}</div>
              <p className="text-gray-600 mt-1">En Proceso</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-green-600">{countCompletados}</div>
              <p className="text-gray-600 mt-1">Completados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-purple-600">
                {countReprogramados}
              </div>
              <p className="text-gray-600 mt-1">Reprogramados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-gray-600">{countRechazados}</div>
              <p className="text-gray-600 mt-1">Rechazados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros de planificación (admin) */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Estado</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">Todos</option>
            <option value="programado">Programado</option>
            <option value="en-proceso">En Proceso</option>
            {/* <option value="ejecutado">Ejecutado</option> */}
            <option value="cerrado">Completados</option>
            <option value="reprogramado">Reprogramado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Técnico</label>
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">Todos</option>
            {technicianOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Asignación</label>
          <select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">Todos</option>
            <option value="assigned">Asignados</option>
            <option value="unassigned">Sin asignar</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Prioridad</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">Todas</option>
            <option value="emergencia">Emergencia</option>
            <option value="urgente">Urgente</option>
            <option value="programado">Programado</option>
            <option value="mejora">Mejora</option>
            <option value="inspeccion">Inspección</option>
          </select>
        </div>
      </div>

      {/* Vista de calendario con tareas agrupadas por fecha */}
      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([date, dateTasks]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-gray-500" />
              <h3 className="capitalize">{date}</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {dateTasks.map((task) => (
                <Card
                  key={task.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{task.otId}</CardTitle>
                          <div className="text-xs text-gray-500">
                            {task.type ?? "—"}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {task.equipment}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(task.scheduledDate).toLocaleDateString()} •{" "}
                          {new Date(task.scheduledDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Técnico</p>
                        <p>{task.assignedTo ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duración</p>
                        <p>{task.estimatedDuration}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tipo</p>
                        <p>{task.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Estado</p>
                        <p>{task.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t gap-2">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert(`Detalles de: ${task.otId}`)}
                        >
                          Ver detalles
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenAssign(task)}
                        >
                          Asignar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleOpenReject(task)}
                        >
                          Rechazar
                        </Button>
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrioritize(task)}
                        >
                          Priorizar
                        </Button> */}
                        {/* {(task.status === "en-proceso" || task.assignedTo) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenExit(task)}
                          >
                            Finalizar
                          </Button>
                        )} */}
                        {/* {task.status === "ejecutado" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenClosing(task)}
                          >
                            Cerrar
                          </Button>
                        )} */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AssignTechnicianModal
        isOpen={assignOpen}
        onClose={() => {
          setAssignOpen(false);
          setSelectedTask(null);
        }}
        onAssign={handleAssign}
        options={technicianOptions}
        initial={selectedTask?.assignedTo || ""}
      />

      <RejectOrderModal
        isOpen={rejectOpen}
        onClose={() => {
          setRejectOpen(false);
          setSelectedTask(null);
        }}
        onReject={handleReject}
      />
      <WorkOrderExitModal
        isOpen={exitOpen}
        onClose={() => {
          setExitOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleExitSubmit}
        workOrder={
          (selectedTask &&
            getWorkOrders().find((o: any) => o.id === selectedTask.otId)) ||
          null
        }
      />

      <WorkOrderClosingModal
        isOpen={closingOpen}
        onClose={() => {
          setClosingOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleClosingSubmit}
        workOrder={
          (selectedTask &&
            getWorkOrders().find((o: any) => o.id === selectedTask.otId)) ||
          null
        }
      />
    </div>
  );
}
