import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, User, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { AssignTechnicianModal } from "./AssignTechnicianModal";
import { RejectOrderModal } from "./RejectOrderModal";
import {
  updateOrder as storeUpdateOrder,
  getWorkOrders,
} from "../lib/workOrdersStore";

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
    | "reprogramado"
    | "rechazado";
  priority: string;
};

export function MaintenanceSchedule() {
  const initial: MaintenanceTask[] = [
    {
      id: "PROG-001",
      otId: "OT-2024-001",
      equipment: "Torno CNC-001",
      type: "Correctivo",
      scheduledDate: "2024-11-15T09:00:00",
      estimatedDuration: "3 horas",
      assignedTo: "Juan Pérez",
      status: "programado",
      priority: "urgente",
    },
    {
      id: "PROG-002",
      otId: "OT-2024-002",
      equipment: "Compresor A-205",
      type: "Preventivo",
      scheduledDate: "2024-11-16T08:00:00",
      estimatedDuration: "2 horas",
      assignedTo: "María López",
      status: "programado",
      priority: "programado",
    },
    {
      id: "PROG-003",
      otId: "OT-2024-005",
      equipment: "Bomba hidráulica B-102",
      type: "Preventivo",
      scheduledDate: "2024-11-14T14:00:00",
      estimatedDuration: "1.5 horas",
      assignedTo: "Pedro Ramírez",
      status: "en-proceso",
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
  const [assignOpen, setAssignOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      programado: "bg-blue-100 text-blue-800 border-blue-200",
      "en-proceso": "bg-yellow-100 text-yellow-800 border-yellow-200",
      completado: "bg-green-100 text-green-800 border-green-200",
      reprogramado: "bg-purple-100 text-purple-800 border-purple-200",
      rechazado: "bg-red-100 text-red-800 border-red-200",
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

  // Agrupar tareas por fecha
  const groupedTasks = tasks.reduce((acc, task) => {
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

  useEffect(() => {
    // Keep tasks mapped to store when possible (best-effort sync)
    // No-op here, but could be used to refresh from store
  }, []);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-blue-600">8</div>
              <p className="text-gray-600 mt-1">Programados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-yellow-600">3</div>
              <p className="text-gray-600 mt-1">En Proceso</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-green-600">25</div>
              <p className="text-gray-600 mt-1">Completados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-purple-600">2</div>
              <p className="text-gray-600 mt-1">Reprogramados</p>
            </div>
          </CardContent>
        </Card>
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
                        <CardTitle className="text-lg">
                          {task.equipment}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {task.otId}
                        </p>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Hora:</span>
                        <span>
                          {new Date(task.scheduledDate).toLocaleTimeString(
                            "es-ES",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Duración:</span>
                        <span>{task.estimatedDuration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Técnico:</span>
                        <span>{task.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Wrench className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Tipo:</span>
                        <span>{task.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert(`Detalles de: ${task.id}`)}
                        >
                          Ver detalles
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenAssign(task)}
                        >
                          Tomar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleOpenReject(task)}
                        >
                          Rechazar
                        </Button>
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
      />

      <RejectOrderModal
        isOpen={rejectOpen}
        onClose={() => {
          setRejectOpen(false);
          setSelectedTask(null);
        }}
        onReject={handleReject}
      />
    </div>
  );
}
