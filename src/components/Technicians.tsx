import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { User, Wrench, Clock, CheckCircle, Plus } from 'lucide-react';

type Technician = {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  status: 'disponible' | 'ocupado' | 'en-descanso';
  assignedTasks: number;
  completedTasks: number;
  avgRepairTime: number;
  efficiency: number;
};

export function Technicians() {
  const technicians: Technician[] = [
    {
      id: 'TECH-001',
      name: 'Juan Pérez',
      specialization: 'Mecánico - CNC',
      email: 'juan.perez@empresa.com',
      phone: '+52 55 1234 5678',
      status: 'ocupado',
      assignedTasks: 3,
      completedTasks: 48,
      avgRepairTime: 4.2,
      efficiency: 95,
    },
    {
      id: 'TECH-002',
      name: 'María López',
      specialization: 'Electricista',
      email: 'maria.lopez@empresa.com',
      phone: '+52 55 2345 6789',
      status: 'disponible',
      assignedTasks: 1,
      completedTasks: 52,
      avgRepairTime: 3.8,
      efficiency: 97,
    },
    {
      id: 'TECH-003',
      name: 'Pedro Ramírez',
      specialization: 'Hidráulica y Neumática',
      email: 'pedro.ramirez@empresa.com',
      phone: '+52 55 3456 7890',
      status: 'ocupado',
      assignedTasks: 2,
      completedTasks: 45,
      avgRepairTime: 3.5,
      efficiency: 92,
    },
    {
      id: 'TECH-004',
      name: 'Ana Torres',
      specialization: 'Instrumentación',
      email: 'ana.torres@empresa.com',
      phone: '+52 55 4567 8901',
      status: 'disponible',
      assignedTasks: 0,
      completedTasks: 38,
      avgRepairTime: 4.5,
      efficiency: 89,
    },
    {
      id: 'TECH-005',
      name: 'Carlos Mendoza',
      specialization: 'Mecánico General',
      email: 'carlos.mendoza@empresa.com',
      phone: '+52 55 5678 9012',
      status: 'en-descanso',
      assignedTasks: 0,
      completedTasks: 41,
      avgRepairTime: 4.0,
      efficiency: 91,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      disponible: 'bg-green-100 text-green-800 border-green-200',
      ocupado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'en-descanso': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const availableTechs = technicians.filter((t) => t.status === 'disponible').length;
  const busyTechs = technicians.filter((t) => t.status === 'ocupado').length;
  const avgEfficiency = (
    technicians.reduce((sum, t) => sum + t.efficiency, 0) / technicians.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Técnicos</p>
                <div className="text-3xl mt-2">{technicians.length}</div>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Disponibles</p>
                <div className="text-3xl mt-2 text-green-600">{availableTechs}</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Ocupados</p>
                <div className="text-3xl mt-2 text-yellow-600">{busyTechs}</div>
              </div>
              <Wrench className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Eficiencia Promedio</p>
                <div className="text-3xl mt-2 text-purple-600">{avgEfficiency}%</div>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botón para agregar técnico */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Técnico
        </Button>
      </div>

      {/* Lista de técnicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {technicians.map((tech) => (
          <Card key={tech.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getInitials(tech.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{tech.name}</CardTitle>
                  <p className="text-sm text-gray-600">{tech.specialization}</p>
                </div>
                <Badge className={getStatusColor(tech.status)}>{tech.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="truncate ml-2">{tech.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Teléfono:</span>
                  <span>{tech.phone}</span>
                </div>
              </div>

              <div className="border-t pt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl text-blue-600">{tech.assignedTasks}</div>
                    <p className="text-xs text-gray-600 mt-1">Tareas Asignadas</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl text-green-600">{tech.completedTasks}</div>
                    <p className="text-xs text-gray-600 mt-1">Completadas</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Eficiencia</span>
                    <span className="text-blue-600">{tech.efficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${tech.efficiency}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiempo promedio:</span>
                  <span>{tech.avgRepairTime}h</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver perfil
                </Button>
                <Button size="sm" className="flex-1" disabled={tech.status !== 'disponible'}>
                  Asignar tarea
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
