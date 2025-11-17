import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Clock, User, Wrench } from 'lucide-react';

type MaintenanceTask = {
  id: string;
  otId: string;
  equipment: string;
  type: string;
  scheduledDate: string;
  estimatedDuration: string;
  assignedTo: string;
  status: 'programado' | 'en-proceso' | 'completado' | 'reprogramado';
  priority: string;
};

export function MaintenanceSchedule() {
  const tasks: MaintenanceTask[] = [
    {
      id: 'PROG-001',
      otId: 'OT-2024-001',
      equipment: 'Torno CNC-001',
      type: 'Correctivo',
      scheduledDate: '2024-11-15T09:00:00',
      estimatedDuration: '3 horas',
      assignedTo: 'Juan Pérez',
      status: 'programado',
      priority: 'urgente',
    },
    {
      id: 'PROG-002',
      otId: 'OT-2024-002',
      equipment: 'Compresor A-205',
      type: 'Preventivo',
      scheduledDate: '2024-11-16T08:00:00',
      estimatedDuration: '2 horas',
      assignedTo: 'María López',
      status: 'programado',
      priority: 'programado',
    },
    {
      id: 'PROG-003',
      otId: 'OT-2024-005',
      equipment: 'Bomba hidráulica B-102',
      type: 'Preventivo',
      scheduledDate: '2024-11-14T14:00:00',
      estimatedDuration: '1.5 horas',
      assignedTo: 'Pedro Ramírez',
      status: 'en-proceso',
      priority: 'programado',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      programado: 'bg-blue-100 text-blue-800 border-blue-200',
      'en-proceso': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completado: 'bg-green-100 text-green-800 border-green-200',
      reprogramado: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      emergencia: 'bg-red-100 text-red-800',
      urgente: 'bg-orange-100 text-orange-800',
      programado: 'bg-blue-100 text-blue-800',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Agrupar tareas por fecha
  const groupedTasks = tasks.reduce((acc, task) => {
    const date = new Date(task.scheduledDate).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, MaintenanceTask[]>);

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
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{task.equipment}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{task.otId}</p>
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
                          {new Date(task.scheduledDate).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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
                      <Button variant="outline" size="sm" onClick={() => alert(`Detalles de: ${task.id}`)}>
                        Ver detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
