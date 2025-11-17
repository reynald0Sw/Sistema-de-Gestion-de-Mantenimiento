import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus } from 'lucide-react';
import type { WorkOrder } from './WorkOrders';

interface WorkOrderExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exitData: any) => void;
  workOrder: WorkOrder | null;
}

interface ExitFormData {
  code: string;
  hour: string;
  startDate: string;
  endDate: string;
  projectName: string;
  maintenanceType: 'correctivo' | 'preventivo' | 'autonomo' | 'predictivo' | 'n';
  area: string;
  equipment: string;
  equipmentCode: string;
  specialties: {
    electrical: boolean;
    mechanical: boolean;
    instrumentation: boolean;
    electronic: boolean;
    refrigeration: boolean;
    lubrication: boolean;
  };
  staffCount: string;
  totalTime: string;
  workType: 'interno' | 'externo' | '';
  materials: Array<{
    activity: string;
    quantity: string;
    description: string;
    lubricated: boolean;
    calibrated: boolean;
    replaced: boolean;
  }>;
  observations: string;
  precautions: {
    clearArea: boolean;
    properSignaling: boolean;
    auditiveProtection: boolean;
    dielectricGloves: boolean;
    safetyHat: boolean;
    safetyGlasses: boolean;
    protectiveGloves: boolean;
    safetyHarness: boolean;
    steelToeBoots: boolean;
    fireResistantClothing: boolean;
    oculoFacialProtection: boolean;
    coldResistantGloves: boolean;
    adjustedClothing: boolean;
  };
  signatures: {
    technicianName: string;
    maintenanceChiefName: string;
    plantChiefName: string;
  };
}

const initialExitData: ExitFormData = {
  code: '',
  hour: '',
  startDate: '',
  endDate: '',
  projectName: '',
  maintenanceType: 'correctivo',
  area: '',
  equipment: '',
  equipmentCode: '',
  specialties: {
    electrical: false,
    mechanical: false,
    instrumentation: false,
    electronic: false,
    refrigeration: false,
    lubrication: false,
  },
  staffCount: '',
  totalTime: '',
  workType: '',
  materials: [{ activity: '', quantity: '', description: '', lubricated: false, calibrated: false, replaced: false }],
  observations: '',
  precautions: {
    clearArea: false,
    properSignaling: false,
    auditiveProtection: false,
    dielectricGloves: false,
    safetyHat: false,
    safetyGlasses: false,
    protectiveGloves: false,
    safetyHarness: false,
    steelToeBoots: false,
    fireResistantClothing: false,
    oculoFacialProtection: false,
    coldResistantGloves: false,
    adjustedClothing: false,
  },
  signatures: {
    technicianName: '',
    maintenanceChiefName: '',
    plantChiefName: '',
  },
};

export function WorkOrderExitModal({ isOpen, onClose, onSubmit, workOrder }: WorkOrderExitModalProps) {
  const [formData, setFormData] = useState<ExitFormData>(initialExitData);

  const handleAddMaterial = () => {
    setFormData({
      ...formData,
      materials: [
        ...formData.materials,
        { activity: '', quantity: '', description: '', lubricated: false, calibrated: false, replaced: false },
      ],
    });
  };

  const handleRemoveMaterial = (index: number) => {
    if (formData.materials.length > 1) {
      setFormData({
        ...formData,
        materials: formData.materials.filter((_, i) => i !== index),
      });
    }
  };

  const handleMaterialChange = (index: number, field: string, value: any) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    setFormData({ ...formData, materials: newMaterials });
  };

  const handleSpecialtyChange = (specialty: keyof typeof formData.specialties) => {
    setFormData({
      ...formData,
      specialties: {
        ...formData.specialties,
        [specialty]: !formData.specialties[specialty],
      },
    });
  };

  const handlePrecautionChange = (precaution: keyof typeof formData.precautions) => {
    setFormData({
      ...formData,
      precautions: {
        ...formData.precautions,
        [precaution]: !formData.precautions[precaution],
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...workOrder,
      exitData: formData,
      status: 'ejecutado',
    });
    setFormData(initialExitData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 py-3 border-b">
          <DialogTitle className="text-base sm:text-lg font-bold">OT Salida: {workOrder?.id}</DialogTitle>
          <p className="text-xs text-gray-600 mt-1">{workOrder?.equipment}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <Tabs defaultValue="general" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-4 gap-1 px-4 sm:px-6 pt-3 pb-2 h-auto p-0">
              <TabsTrigger value="general" className="text-xs py-1">General</TabsTrigger>
              <TabsTrigger value="tecnico" className="text-xs py-1">Técnico</TabsTrigger>
              <TabsTrigger value="materiales" className="text-xs py-1">Materiales</TabsTrigger>
              <TabsTrigger value="seguridad" className="text-xs py-1">Seguridad</TabsTrigger>
            </TabsList>

            {/* TAB 1: GENERAL */}
            <TabsContent value="general" className="flex-1 overflow-y-auto space-y-2 px-4 sm:px-6 py-3">
              <div className="bg-gray-50 p-2 rounded border text-xs space-y-1">
                <h4 className="font-semibold">Encargado y Departamento</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-600 text-xs">Encargado</p>
                    <p className="font-medium text-xs">ING. CARLOS M. QUEZADA</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Departamento</p>
                    <p className="font-medium text-xs">MANTENIMIENTO</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Código *</Label>
                <Input
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="CIN-001"
                  className="text-xs h-7"
                />
              </div>

              <div className="grid grid-cols-3 gap-1">
                <div>
                  <Label className="text-xs">Hora *</Label>
                  <Input
                    type="time"
                    required
                    value={formData.hour}
                    onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                    className="text-xs h-7"
                  />
                </div>
                <div>
                  <Label className="text-xs">Inicio *</Label>
                  <Input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="text-xs h-7"
                  />
                </div>
                <div>
                  <Label className="text-xs">Fin *</Label>
                  <Input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="text-xs h-7"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div>
                  <Label className="text-xs">Proyecto</Label>
                  <Input
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    placeholder="Proyecto"
                    className="text-xs h-7"
                  />
                </div>
                <div>
                  <Label className="text-xs">OT</Label>
                  <Input disabled value={workOrder?.id || ''} className="text-xs h-7 bg-gray-100" />
                </div>
              </div>

              <div className="bg-blue-50 p-2 rounded border border-blue-200 space-y-1">
                <h4 className="font-semibold text-xs">Área y Equipo</h4>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <Label className="text-xs">Área *</Label>
                    <Input
                      required
                      value={formData.area || workOrder?.area || ''}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="text-xs h-7"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Equipo *</Label>
                    <Input
                      required
                      value={formData.equipment || workOrder?.equipment || ''}
                      onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                      className="text-xs h-7"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Código</Label>
                  <Input
                    value={formData.equipmentCode}
                    onChange={(e) => setFormData({ ...formData, equipmentCode: e.target.value })}
                    className="text-xs h-7"
                  />
                </div>
              </div>

              <div className="bg-purple-50 p-2 rounded border border-purple-200 space-y-1">
                <h4 className="font-semibold text-xs">Tipo de Mantenimiento</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {[
                    { value: 'correctivo', label: 'Correctivo' },
                    { value: 'preventivo', label: 'Preventivo' },
                    { value: 'autonomo', label: 'Autónomo' },
                    { value: 'predictivo', label: 'Predictivo' },
                    { value: 'n', label: 'N' },
                  ].map((type) => (
                    <label key={type.value} className="flex items-center gap-1 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="maintenanceType"
                        value={type.value}
                        checked={formData.maintenanceType === type.value}
                        onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value as any })}
                        className="w-3 h-3"
                      />
                      {type.label}
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: TÉCNICO */}
            <TabsContent value="tecnico" className="flex-1 overflow-y-auto space-y-2 px-4 sm:px-6 py-3">
              <div className="bg-green-50 p-2 rounded border border-green-200 space-y-1">
                <h4 className="font-semibold text-xs">Cuadrilla de Técnicos</h4>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { key: 'electrical', label: 'Eléctrico' },
                    { key: 'mechanical', label: 'Mecánico' },
                    { key: 'instrumentation', label: 'Instrumentación' },
                    { key: 'electronic', label: 'Electrónico' },
                    { key: 'refrigeration', label: 'Refrigeración' },
                    { key: 'lubrication', label: 'Lubricación' },
                  ].map((specialty) => (
                    <label key={specialty.key} className="flex items-center gap-1 cursor-pointer text-xs">
                      <Checkbox
                        checked={formData.specialties[specialty.key as keyof typeof formData.specialties]}
                        onCheckedChange={() => handleSpecialtyChange(specialty.key as keyof typeof formData.specialties)}
                        className="w-3 h-3"
                      />
                      {specialty.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 p-2 rounded border border-orange-200 space-y-1">
                <h4 className="font-semibold text-xs">Dotación y Tiempo</h4>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <Label className="text-xs">Técnicos</Label>
                    <Input
                      type="number"
                      value={formData.staffCount}
                      onChange={(e) => setFormData({ ...formData, staffCount: e.target.value })}
                      placeholder="3"
                      className="text-xs h-7"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Tiempo (h)</Label>
                    <Input
                      value={formData.totalTime}
                      onChange={(e) => setFormData({ ...formData, totalTime: e.target.value })}
                      placeholder="4.5"
                      className="text-xs h-7"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-2 rounded border border-yellow-200 space-y-1">
                <h4 className="font-semibold text-xs">Tipo de Trabajo</h4>
                <div className="flex gap-2 text-xs">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="workType"
                      value="interno"
                      checked={formData.workType === 'interno'}
                      onChange={(e) => setFormData({ ...formData, workType: e.target.value as any })}
                      className="w-3 h-3"
                    />
                    Interno
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="workType"
                      value="externo"
                      checked={formData.workType === 'externo'}
                      onChange={(e) => setFormData({ ...formData, workType: e.target.value as any })}
                      className="w-3 h-3"
                    />
                    Externo
                  </label>
                </div>
              </div>

              <div>
                <Label className="text-xs">Observaciones</Label>
                <Textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Detalles del trabajo..."
                  className="text-xs min-h-[50px] text-xs"
                />
              </div>
            </TabsContent>

            {/* TAB 3: MATERIALES */}
            <TabsContent value="materiales" className="flex-1 overflow-hidden flex flex-col px-4 sm:px-6 py-3">
              <div className="flex-1 overflow-x-auto border rounded mb-2">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-1 text-left">Actividad</th>
                      <th className="border p-1 text-center w-10">Q</th>
                      <th className="border p-1 text-left">Descripción</th>
                      <th className="border p-1 text-center w-6">L</th>
                      <th className="border p-1 text-center w-6">C</th>
                      <th className="border p-1 text-center w-6">Ca</th>
                      <th className="border p-1 text-center w-5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.materials.map((material, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border p-0.5">
                          <Input
                            value={material.activity}
                            onChange={(e) => handleMaterialChange(index, 'activity', e.target.value)}
                            placeholder="Acción"
                            className="text-xs h-6 border-0 p-0.5"
                          />
                        </td>
                        <td className="border p-0.5">
                          <Input
                            value={material.quantity}
                            onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
                            placeholder="Q"
                            className="text-xs h-6 text-center border-0 p-0.5"
                          />
                        </td>
                        <td className="border p-0.5">
                          <Input
                            value={material.description}
                            onChange={(e) => handleMaterialChange(index, 'description', e.target.value)}
                            placeholder="Desc"
                            className="text-xs h-6 border-0 p-0.5"
                          />
                        </td>
                        <td className="border p-0.5 text-center">
                          <Checkbox
                            checked={material.lubricated}
                            onCheckedChange={(checked: boolean) => handleMaterialChange(index, 'lubricated', checked)}
                            className="w-3 h-3 mx-auto"
                          />
                        </td>
                        <td className="border p-0.5 text-center">
                          <Checkbox
                            checked={material.calibrated}
                            onCheckedChange={(checked: boolean) => handleMaterialChange(index, 'calibrated', checked)}
                            className="w-3 h-3 mx-auto"
                          />
                        </td>
                        <td className="border p-0.5 text-center">
                          <Checkbox
                            checked={material.replaced}
                            onCheckedChange={(checked: boolean) => handleMaterialChange(index, 'replaced', checked)}
                            className="w-3 h-3 mx-auto"
                          />
                        </td>
                        <td className="border p-0.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterial(index)}
                            className="text-red-600 hover:text-red-800 font-bold text-sm w-full"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                type="button"
                onClick={handleAddMaterial}
                variant="outline"
                size="sm"
                className="w-full text-xs h-7 gap-1"
              >
                <Plus className="w-3 h-3" /> Agregar
              </Button>
            </TabsContent>

            {/* TAB 4: SEGURIDAD */}
            <TabsContent value="seguridad" className="flex-1 overflow-y-auto space-y-2 px-4 sm:px-6 py-3">
              <div className="bg-red-50 p-2 rounded border border-red-200 space-y-1">
                <h4 className="font-semibold text-xs">Precauciones de Seguridad</h4>
                <div className="grid grid-cols-1 gap-0.5">
                  {[
                    { key: 'clearArea', label: 'Despejar área' },
                    { key: 'properSignaling', label: 'Señalización' },
                    { key: 'auditiveProtection', label: 'Protección auditiva' },
                    { key: 'dielectricGloves', label: 'Guantes dieléctricos' },
                    { key: 'safetyHat', label: 'Casco' },
                    { key: 'safetyGlasses', label: 'Gafas' },
                    { key: 'protectiveGloves', label: 'Guantes' },
                    { key: 'safetyHarness', label: 'Arnés' },
                    { key: 'steelToeBoots', label: 'Botas de acero' },
                    { key: 'fireResistantClothing', label: 'Ropa ignífuga' },
                    { key: 'oculoFacialProtection', label: 'Protección ocular' },
                    { key: 'coldResistantGloves', label: 'Guantes fríos' },
                    { key: 'adjustedClothing', label: 'Ropa de trabajo' },
                  ].map((precaution) => (
                    <label key={precaution.key} className="flex items-center gap-1 cursor-pointer text-xs">
                      <Checkbox
                        checked={formData.precautions[precaution.key as keyof typeof formData.precautions]}
                        onCheckedChange={() => handlePrecautionChange(precaution.key as keyof typeof formData.precautions)}
                        className="w-3 h-3"
                      />
                      {precaution.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded border space-y-1">
                <h4 className="font-semibold text-xs">Firmas</h4>
                <div className="grid grid-cols-1 gap-1">
                  {[
                    { id: 'technicianName', label: 'Técnico', value: formData.signatures.technicianName },
                    { id: 'maintenanceChiefName', label: 'Jefe Mto.', value: formData.signatures.maintenanceChiefName },
                    { id: 'plantChiefName', label: 'Jefe Planta', value: formData.signatures.plantChiefName },
                  ].map((sig) => (
                    <div key={sig.id}>
                      <Label className="text-xs">{sig.label}</Label>
                      <Input
                        value={sig.value}
                        onChange={(e) => {
                          if (sig.id === 'technicianName') {
                            setFormData({ ...formData, signatures: { ...formData.signatures, technicianName: e.target.value } });
                          } else if (sig.id === 'maintenanceChiefName') {
                            setFormData({ ...formData, signatures: { ...formData.signatures, maintenanceChiefName: e.target.value } });
                          } else {
                            setFormData({ ...formData, signatures: { ...formData.signatures, plantChiefName: e.target.value } });
                          }
                        }}
                        placeholder="Nombre"
                        className="text-xs h-7"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="border-t px-4 sm:px-6 py-2 gap-2 bg-gray-50">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs h-7">
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-xs h-7">
              Finalizar OT
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
