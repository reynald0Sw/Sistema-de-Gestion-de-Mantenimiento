import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, FileText, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function Reports() {
  // Datos de ejemplo para las gráficas
  const monthlyData = [
    { month: 'Ene', preventivo: 25, correctivo: 15, mejora: 5, costo: 12500 },
    { month: 'Feb', preventivo: 28, correctivo: 12, mejora: 8, costo: 14200 },
    { month: 'Mar', preventivo: 22, correctivo: 18, mejora: 6, costo: 15800 },
    { month: 'Abr', preventivo: 30, correctivo: 10, mejora: 7, costo: 13900 },
    { month: 'May', preventivo: 26, correctivo: 14, mejora: 9, costo: 16200 },
    { month: 'Jun', preventivo: 29, correctivo: 11, mejora: 5, costo: 14500 },
  ];

  const equipmentDowntime = [
    { equipment: 'CNC-001', hours: 48 },
    { equipment: 'FRS-102', hours: 32 },
    { equipment: 'COMP-A205', hours: 18 },
    { equipment: 'BHD-102', hours: 24 },
    { equipment: 'TRN-205', hours: 36 },
  ];

  const technicianPerformance = [
    { name: 'Juan Pérez', ot: 48, avg: 4.2 },
    { name: 'María López', ot: 52, avg: 3.8 },
    { name: 'Pedro Ramírez', ot: 45, avg: 3.5 },
    { name: 'Ana Torres', ot: 38, avg: 4.5 },
    { name: 'Carlos Mendoza', ot: 41, avg: 4.0 },
  ];

  const costByCategory = [
    { name: 'Repuestos', value: 35000 },
    { name: 'Mano de obra', value: 28000 },
    { name: 'Servicios externos', value: 15000 },
    { name: 'Herramientas', value: 8000 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Controles de reporte */}
      <Card>
        <CardHeader>
          <CardTitle>Generar Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select defaultValue="monthly">
              <SelectTrigger>
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diario</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Tipo de OT" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="preventivo">Preventivo</SelectItem>
                <SelectItem value="correctivo">Correctivo</SelectItem>
                <SelectItem value="mejora">Mejora</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las áreas</SelectItem>
                <SelectItem value="linea1">Línea 1</SelectItem>
                <SelectItem value="linea2">Línea 2</SelectItem>
                <SelectItem value="linea3">Línea 3</SelectItem>
                <SelectItem value="compresores">Compresores</SelectItem>
              </SelectContent>
            </Select>

            <Button className="gap-2" onClick={() => alert('Funcionalidad: Exportar reporte en PDF')}>
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráficas de reportes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mantenimientos mensuales */}
        <Card>
          <CardHeader>
            <CardTitle>Mantenimientos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
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

        {/* Costos mensuales */}
        <Card>
          <CardHeader>
            <CardTitle>Costos de Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="costo"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Costo ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tiempos de parada por equipo */}
        <Card>
          <CardHeader>
            <CardTitle>Tiempos de Parada por Equipo (horas)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={equipmentDowntime} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="equipment" type="category" />
                <Tooltip />
                <Bar dataKey="hours" fill="#f59e0b" name="Horas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución de costos */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Costos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rendimiento de técnicos */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento de Técnicos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={technicianPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="ot" fill="#3b82f6" name="OT Completadas" />
              <Bar yAxisId="right" dataKey="avg" fill="#10b981" name="Tiempo Prom. (h)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resumen estadístico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Total OT Ejecutadas</p>
                <div className="text-2xl mt-1">224</div>
                <p className="text-sm text-green-600">+15% vs mes anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600">Cumplimiento de Programa</p>
                <div className="text-2xl mt-1">92%</div>
                <p className="text-sm text-green-600">+3% vs mes anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Costo Total</p>
                <div className="text-2xl mt-1">$86,100</div>
                <p className="text-sm text-red-600">+8% vs mes anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
