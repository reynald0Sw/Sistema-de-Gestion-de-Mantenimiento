import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Calendar,
  MapPin,
  Wrench,
  TrendingUp,
  ClipboardList,
  Package,
} from 'lucide-react';

type Equipment = {
  id: string;
  name: string;
  code: string;
  model: string;
  brand: string;
  serialNumber: string;
  area: string;
  location: string;
  acquisitionDate: string;
  status: string;
  mtbf: number;
  mttr: number;
  availability: number;
  lastMaintenance: string;
  nextMaintenance: string;
};

interface EquipmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
}

export function EquipmentDetailModal({ isOpen, onClose, equipment }: EquipmentDetailModalProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      operativo: 'bg-green-100 text-green-800 border-green-200',
      'en-mantenimiento': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'fuera-de-servicio': 'bg-red-100 text-red-800 border-red-200',
      'en-espera': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Historial de mantenimientos mock
  const maintenanceHistory = [
    {
      id: 'OT-2024-001',
      date: '2024-10-15',
      type: 'Preventivo',
      duration: '3h',
      technician: 'Juan Pérez',
      status: 'Completado',
    },
    {
      id: 'OT-2024-008',
      date: '2024-09-10',
      type: 'Correctivo',
      duration: '5h',
      technician: 'María López',
      status: 'Completado',
    },
    {
      id: 'OT-2024-015',
      date: '2024-08-05',
      type: 'Preventivo',
      duration: '2h',
      technician: 'Juan Pérez',
      status: 'Completado',
    },
  ];

  // Repuestos asociados mock
  const associatedParts = [
    { code: 'RP-001', name: 'Rodamiento SKF-6205', qty: 2, lastUsed: '2024-10-15' },
    { code: 'RP-015', name: 'Filtro de aceite', qty: 1, lastUsed: '2024-10-15' },
    { code: 'RP-023', name: 'Correa de transmisión', qty: 1, lastUsed: '2024-09-10' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{equipment.name}</DialogTitle>
              <p className="text-gray-600 mt-1">{equipment.code}</p>
            </div>
            <Badge className={getStatusColor(equipment.status)}>{equipment.status}</Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="parts">Repuestos</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información Técnica</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Marca</p>
                  <p>{equipment.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Modelo</p>
                  <p>{equipment.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Número de Serie</p>
                  <p>{equipment.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de Adquisición</p>
                  <p>{new Date(equipment.acquisitionDate).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Área</p>
                  <p>{equipment.area}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ubicación</p>
                  <p>{equipment.location}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mantenimiento</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Último Mantenimiento</p>
                    <p>{new Date(equipment.lastMaintenance).toLocaleDateString('es-ES')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Próximo Mantenimiento</p>
                    <p>{new Date(equipment.nextMaintenance).toLocaleDateString('es-ES')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kpis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Disponibilidad</p>
                      <div className="text-2xl text-blue-600">{equipment.availability}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">MTBF</p>
                      <div className="text-2xl text-green-600">{equipment.mtbf}h</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">MTTR</p>
                      <div className="text-2xl text-orange-600">{equipment.mttr}h</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Disponibilidad</span>
                    <span>{equipment.availability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${equipment.availability}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Confiabilidad</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Eficiencia</span>
                    <span>88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Mantenimientos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {maintenanceHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <ClipboardList className="h-5 w-5 text-gray-500" />
                        <div>
                          <p>{item.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(item.date).toLocaleDateString('es-ES')} - {item.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{item.technician}</p>
                        <p className="text-sm text-gray-600">{item.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Repuestos Asociados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {associatedParts.map((part) => (
                    <div
                      key={part.code}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-gray-500" />
                        <div>
                          <p>{part.name}</p>
                          <p className="text-sm text-gray-600">{part.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Cant. usada: {part.qty}</p>
                        <p className="text-sm text-gray-600">
                          Último uso: {new Date(part.lastUsed).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button>Editar Equipo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
