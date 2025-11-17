import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { WorkOrder } from './WorkOrders';

interface WorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: WorkOrder) => void;
}

export function WorkOrderModal({ isOpen, onClose, onSubmit }: WorkOrderModalProps) {
  const [formData, setFormData] = useState({
    requestor: '',
    department: '',
    area: '',
    equipment: '',
    description: '',
    type: 'correctivo' as const,
    priority: 'programado' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: WorkOrder = {
      id: `OT-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      ...formData,
      date: new Date().toISOString(),
      status: 'pendiente',
    };
    onSubmit(newOrder);
    setFormData({
      requestor: '',
      department: '',
      area: '',
      equipment: '',
      description: '',
      type: 'correctivo',
      priority: 'programado',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Orden de Trabajo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requestor">Solicitante *</Label>
              <Input
                id="requestor"
                required
                value={formData.requestor}
                onChange={(e) => setFormData({ ...formData, requestor: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento *</Label>
              <Input
                id="department"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Área / Línea *</Label>
              <Input
                id="area"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment">Equipo *</Label>
              <Input
                id="equipment"
                required
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Mantenimiento *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventivo">Mantenimiento Preventivo</SelectItem>
                  <SelectItem value="correctivo">Mantenimiento Correctivo</SelectItem>
                  <SelectItem value="mejora">Mejora Técnica</SelectItem>
                  <SelectItem value="evaluacion">Evaluación Técnica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergencia">Emergencia</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="programado">Programado</SelectItem>
                  <SelectItem value="mejora">Mejora</SelectItem>
                  <SelectItem value="inspeccion">Inspección Técnica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción / Detalle de la Falla *</Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describa detalladamente el problema o la solicitud de mantenimiento..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Crear Orden de Trabajo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
