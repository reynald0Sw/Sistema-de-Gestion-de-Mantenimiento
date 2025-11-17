import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Package, Search, Plus, AlertTriangle, Building2, Phone, Mail } from 'lucide-react';

type SparePart = {
  id: string;
  name: string;
  code: string;
  model: string;
  stock: number;
  minStock: number;
  unit: string;
  supplier: string;
  cost: number;
  lastPurchase: string;
  category: string;
};

type Supplier = {
  id: string;
  name: string;
  company: string;
  country: string;
  phone: string;
  email: string;
  contact: string;
  productsSupplied: string[];
  lastPurchase: string;
  rating: number;
};

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');

  const spareParts: SparePart[] = [
    {
      id: 'RP-001',
      name: 'Rodamiento SKF-6205',
      code: 'SKF-6205',
      model: '6205-2RS1',
      stock: 2,
      minStock: 5,
      unit: 'unidad',
      supplier: 'SKF México',
      cost: 45.50,
      lastPurchase: '2024-09-15',
      category: 'Rodamientos',
    },
    {
      id: 'RP-002',
      name: 'Filtro de aceite hidráulico',
      code: 'FLT-HYD-100',
      model: 'P164378',
      stock: 12,
      minStock: 8,
      unit: 'unidad',
      supplier: 'Donaldson',
      cost: 28.75,
      lastPurchase: '2024-10-20',
      category: 'Filtros',
    },
    {
      id: 'RP-003',
      name: 'Correa de transmisión',
      code: 'BLT-A52',
      model: 'A52',
      stock: 6,
      minStock: 4,
      unit: 'unidad',
      supplier: 'Gates Industrial',
      cost: 18.90,
      lastPurchase: '2024-10-05',
      category: 'Correas',
    },
    {
      id: 'RP-004',
      name: 'Aceite hidráulico ISO 46',
      code: 'OIL-HYD-46',
      model: 'Shell Tellus S2 M46',
      stock: 45,
      minStock: 50,
      unit: 'litro',
      supplier: 'Shell Lubricants',
      cost: 8.50,
      lastPurchase: '2024-10-28',
      category: 'Lubricantes',
    },
    {
      id: 'RP-005',
      name: 'Sello mecánico',
      code: 'SEAL-M25',
      model: 'M25-40',
      stock: 8,
      minStock: 6,
      unit: 'unidad',
      supplier: 'John Crane',
      cost: 125.00,
      lastPurchase: '2024-09-30',
      category: 'Sellos',
    },
  ];

  const suppliers: Supplier[] = [
    {
      id: 'SUP-001',
      name: 'SKF México',
      company: 'SKF de México S.A. de C.V.',
      country: 'México',
      phone: '+52 55 1234 5678',
      email: 'ventas@skf.com.mx',
      contact: 'Roberto González',
      productsSupplied: ['Rodamientos', 'Lubricantes', 'Sellos'],
      lastPurchase: '2024-10-15',
      rating: 5,
    },
    {
      id: 'SUP-002',
      name: 'Donaldson',
      company: 'Donaldson Company Inc.',
      country: 'Estados Unidos',
      phone: '+1 800 365 1331',
      email: 'filtration@donaldson.com',
      contact: 'María Hernández',
      productsSupplied: ['Filtros'],
      lastPurchase: '2024-10-20',
      rating: 5,
    },
    {
      id: 'SUP-003',
      name: 'Gates Industrial',
      company: 'Gates Corporation',
      country: 'Estados Unidos',
      phone: '+1 303 744 1911',
      email: 'industrial@gates.com',
      contact: 'Carlos Mendoza',
      productsSupplied: ['Correas', 'Mangueras'],
      lastPurchase: '2024-10-05',
      rating: 4,
    },
    {
      id: 'SUP-004',
      name: 'Shell Lubricants',
      company: 'Shell Lubricants Mexico',
      country: 'México',
      phone: '+52 55 9876 5432',
      email: 'lubricantes@shell.com.mx',
      contact: 'Ana Torres',
      productsSupplied: ['Aceites', 'Grasas', 'Lubricantes'],
      lastPurchase: '2024-10-28',
      rating: 5,
    },
  ];

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { color: 'bg-red-100 text-red-800 border-red-200', label: 'Sin stock' };
    if (stock < minStock) return { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Stock bajo' };
    return { color: 'bg-green-100 text-green-800 border-green-200', label: 'Stock OK' };
  };

  const filteredParts = spareParts.filter(
    (part) =>
      searchTerm === '' ||
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      searchTerm === '' ||
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = spareParts.filter((part) => part.stock < part.minStock).length;
  const totalValue = spareParts.reduce((sum, part) => sum + part.stock * part.cost, 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Repuestos</p>
                <div className="text-3xl mt-2">{spareParts.length}</div>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Stock Bajo</p>
                <div className="text-3xl mt-2 text-orange-600">{lowStockCount}</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Valor Inventario</p>
                <div className="text-3xl mt-2">${totalValue.toFixed(0)}</div>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Proveedores</p>
                <div className="text-3xl mt-2">{suppliers.length}</div>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="parts" className="w-full">
        <TabsList>
          <TabsTrigger value="parts">Repuestos</TabsTrigger>
          <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
        </TabsList>

        <TabsContent value="parts" className="space-y-4">
          {/* Búsqueda y acciones */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar repuesto, código, categoría..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Repuesto
            </Button>
          </div>

          {/* Lista de repuestos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredParts.map((part) => {
              const status = getStockStatus(part.stock, part.minStock);
              return (
                <Card key={part.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{part.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{part.code}</p>
                      </div>
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Modelo</p>
                        <p>{part.model}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Categoría</p>
                        <p>{part.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Stock actual</p>
                        <p className={part.stock < part.minStock ? 'text-orange-600' : ''}>
                          {part.stock} {part.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Stock mínimo</p>
                        <p>{part.minStock} {part.unit}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Costo unitario</p>
                        <p>${part.cost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Valor total</p>
                        <p>${(part.stock * part.cost).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600">Proveedor</p>
                      <p className="text-sm">{part.supplier}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver historial
                      </Button>
                      <Button size="sm" className="flex-1">
                        Solicitar compra
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          {/* Búsqueda y acciones */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar proveedor, empresa, país..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Proveedor
            </Button>
          </div>

          {/* Lista de proveedores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{supplier.company}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {'⭐'.repeat(supplier.rating)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">País:</span>
                      <span>{supplier.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Teléfono:</span>
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Email:</span>
                      <span className="truncate">{supplier.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-gray-600">Productos:</span>
                        <p>{supplier.productsSupplied.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600">Contacto principal</p>
                    <p className="text-sm">{supplier.contact}</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Ver historial de compras
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
