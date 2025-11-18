import { useState } from 'react';
import MachinePerformanceModal, { MachinePerformanceData } from './MachinePerformanceModal';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

export default function MachinePerformanceSection(){
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState<MachinePerformanceData[]>([]);

  const handleSubmit = (data: MachinePerformanceData) => {
    setReports(prev => [data, ...prev]);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Desempeño de Máquina</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Registra el desempeño de máquinas. Accesible por operarios y técnicos.</p>
            <Button onClick={() => setOpen(true)} className="bg-blue-600 text-white">Nuevo Registro</Button>
          </div>
        </CardContent>
      </Card>

      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Registros recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.map((r, i) => (
                <div key={i} className="p-3 border rounded">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{r.operatorName} — {r.machine}</div>
                      <div className="text-sm text-gray-600">Área: {r.area} | Turno: {r.turno} | Fecha: {r.date}</div>
                    </div>
                    <div className="text-sm text-gray-500">Firmas: {r.firmaSaliente ? '✓' : '-'} / {r.firmaEntrante ? '✓' : '-'}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <MachinePerformanceModal isOpen={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
