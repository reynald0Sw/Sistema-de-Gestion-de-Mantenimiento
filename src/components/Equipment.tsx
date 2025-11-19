import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Wrench,
  Search,
  Eye,
  Plus,
  Activity,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { EquipmentDetailModal } from "./EquipmentDetailModal";
import EquipmentCoding from "./EquipmentCoding";
import EquipmentInventory from "./EquipmentInventory";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

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
  status: "operativo" | "en-mantenimiento" | "fuera-de-servicio" | "en-espera";
  mtbf: number; // Mean Time Between Failures (horas)
  mttr: number; // Mean Time To Repair (horas)
  availability: number; // Porcentaje
  lastMaintenance: string;
  nextMaintenance: string;
};

export function Equipment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const equipment: Equipment[] = [
    {
      id: "EQ-001",
      name: "Torno CNC-001",
      code: "CNC-001",
      model: "CNC-2500X",
      brand: "Haas Automation",
      serialNumber: "HS-2024-5678",
      area: "Línea 3",
      location: "Producción - Piso 1",
      acquisitionDate: "2020-03-15",
      status: "en-mantenimiento",
      mtbf: 720,
      mttr: 4.2,
      availability: 94.5,
      lastMaintenance: "2024-10-15",
      nextMaintenance: "2024-12-15",
    },
    {
      id: "EQ-002",
      name: "Compresor A-205",
      code: "COMP-A205",
      model: "Atlas Copco GA55",
      brand: "Atlas Copco",
      serialNumber: "AC-2023-1234",
      area: "Compresores",
      location: "Planta - Área de Servicios",
      acquisitionDate: "2019-06-20",
      status: "operativo",
      mtbf: 1200,
      mttr: 2.5,
      availability: 97.8,
      lastMaintenance: "2024-10-01",
      nextMaintenance: "2024-11-15",
    },
    {
      id: "EQ-003",
      name: "Fresadora F-102",
      code: "FRS-102",
      model: "VMC-850",
      brand: "DMG MORI",
      serialNumber: "DM-2021-9876",
      area: "Línea 1",
      location: "Producción - Piso 2",
      acquisitionDate: "2021-01-10",
      status: "operativo",
      mtbf: 850,
      mttr: 3.8,
      availability: 95.2,
      lastMaintenance: "2024-10-20",
      nextMaintenance: "2024-12-20",
    },
    {
      id: "EQ-004",
      name: "Bomba Hidráulica B-102",
      code: "BHD-102",
      model: "HYD-500",
      brand: "Bosch Rexroth",
      serialNumber: "BR-2022-4567",
      area: "Sistemas Hidráulicos",
      location: "Planta - Sótano",
      acquisitionDate: "2022-08-05",
      status: "operativo",
      mtbf: 950,
      mttr: 2.8,
      availability: 96.5,
      lastMaintenance: "2024-11-01",
      nextMaintenance: "2025-01-01",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      operativo: "bg-green-100 text-green-800 border-green-200",
      "en-mantenimiento": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "fuera-de-servicio": "bg-red-100 text-red-800 border-red-200",
      "en-espera": "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getAvailabilityColor = (availability: number) => {
    if (availability >= 95) return "text-green-600";
    if (availability >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredEquipment = equipment.filter(
    (eq) =>
      searchTerm === "" ||
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setDetailModalOpen(true);
  };

  // Calcular estadísticas
  const totalEquipment = equipment.length;
  const operationalEquipment = equipment.filter(
    (eq) => eq.status === "operativo"
  ).length;
  const avgAvailability = (
    equipment.reduce((sum, eq) => sum + eq.availability, 0) / equipment.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Equipos</p>
                <div className="text-3xl mt-2">{totalEquipment}</div>
              </div>
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Operativos</p>
                <div className="text-3xl mt-2 text-green-600">
                  {operationalEquipment}
                </div>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Disponibilidad Promedio</p>
                <div className="text-3xl mt-2 text-blue-600">
                  {avgAvailability}%
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Alertas</p>
                <div className="text-3xl mt-2 text-orange-600">3</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar equipo, código, área..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Equipo
        </Button>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="equipos">
          <TabsList>
            <TabsTrigger value="equipos">Equipos</TabsTrigger>
            <TabsTrigger value="codificacion">Codificación</TabsTrigger>
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
          </TabsList>

          <TabsContent value="equipos">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredEquipment.map((eq) => (
                <Card key={eq.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{eq.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{eq.code}</p>
                      </div>
                      <Badge className={getStatusColor(eq.status)}>
                        {eq.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Marca</p>
                        <p>{eq.brand}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Modelo</p>
                        <p>{eq.model}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Área</p>
                        <p>{eq.area}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Ubicación</p>
                        <p className="truncate">{eq.location}</p>
                      </div>
                    </div>

                    {/* <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Disponibilidad</span>
                        <span className={getAvailabilityColor(eq.availability)}>
                          {eq.availability}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">MTBF</span>
                        <span>{eq.mtbf}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">MTTR</span>
                        <span>{eq.mttr}h</span>
                      </div>
                    </div> */}

                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600">
                        Próximo mantenimiento
                      </p>
                      <p className="text-sm">
                        {new Date(eq.nextMaintenance).toLocaleDateString(
                          "es-ES"
                        )}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => handleViewDetails(eq)}
                    >
                      <Eye className="h-4 w-4" />
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="codificacion">
            <div className="mt-4">
              <EquipmentCoding />
            </div>
          </TabsContent>
          <TabsContent value="inventario">
            <div className="mt-4">
              <EquipmentInventory />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedEquipment && (
        <EquipmentDetailModal
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedEquipment(null);
          }}
          equipment={selectedEquipment}
        />
      )}
    </div>
  );
}
