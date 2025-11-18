import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Package } from 'lucide-react';
import MachinePerformanceSection from './MachinePerformanceSection';

export function Dashboard() {
  // Datos mock para las gráficas
  const otByStatus = [
    { name: 'Pendiente', value: 12 },
    { name: 'Programado', value: 25 },
    { name: 'Ejecutado', value: 48 },
    { name: 'No Ejecutado', value: 5 },
  ];

  const otByType = [
    { name: 'Ene', preventivo: 20, correctivo: 15, mejora: 5 },
    { name: 'Feb', preventivo: 25, correctivo: 12, mejora: 8 },
    { name: 'Mar', preventivo: 22, correctivo: 18, mejora: 6 },
    { name: 'Abr', preventivo: 28, correctivo: 10, mejora: 7 },
  ];

  const mttrData = [
    { name: 'Sem 1', tiempo: 4.5 },
    { name: 'Sem 2', tiempo: 3.8 },
    { name: 'Sem 3', tiempo: 4.2 },
    { name: 'Sem 4', tiempo: 3.5 },
  ];

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

  const kpis = [
    {
      title: 'OT Completadas',
      value: '48',
      change: '+12%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'OT Pendientes',
      value: '12',
      change: '-8%',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'MTTR (Mean Time To Repair) Promedio',
      value: '3.8h',
      change: '-15%',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Disponibilidad',
      value: '94.5%',
      change: '+2.3%',
      icon: AlertCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">{kpi.title}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl">{kpi.value}</span>
                      <span className={`text-sm ${kpi.color}`}>{kpi.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OT por Estado */}
        <Card>
          <CardHeader>
            <CardTitle>Órdenes de Trabajo por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={otByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {otByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* OT por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Órdenes de Trabajo por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={otByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="preventivo" fill="#3b82f6" name="Preventivo" />
                <Bar dataKey="correctivo" fill="#ef4444" name="Correctivo" />
                <Bar dataKey="mejora" fill="#10b981" name="Mejora" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* MTTR */}
        <Card>
          <CardHeader>
            <CardTitle>Tiempo Promedio de Reparación (MTTR)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mttrData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tiempo" stroke="#8b5cf6" strokeWidth={2} name="Horas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alertas y Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-red-900">Máquina crítica parada</p>
                  <p className="text-sm text-red-700">Línea de producción 3 - Torno CNC-001</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-orange-900">Mantenimiento próximo</p>
                  <p className="text-sm text-orange-700">Compresor A-205 - Vence en 2 días</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Package className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-yellow-900">Stock bajo</p>
                  <p className="text-sm text-yellow-700">Rodamiento SKF-6205 - Solo 2 unidades</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección: Desempeño de Máquina */}
      <div className="mt-6">
        <MachinePerformanceSection />
      </div>
    </div>
  );
}