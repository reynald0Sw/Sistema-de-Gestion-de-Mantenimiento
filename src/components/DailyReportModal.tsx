import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { X, Plus } from "lucide-react";

export interface DailyWorkRecord {
  number: number;
  startTime: string;
  endTime: string;
  totalTime: string;
  description: string;
  completed: boolean;
  incompletionReason: string;
  observations: string;
}

export interface DailyReportData {
  id: string;
  technicianId: string;
  technicianName: string;
  date: string;
  records: DailyWorkRecord[];
  technicianSignature: string;
  supervisorSignature: string;
  createdAt: string;
}

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportData: DailyReportData) => void;
  technician: { id: string; name: string };
}

const initialRecords: DailyWorkRecord[] = [
  {
    number: 4,
    startTime: "",
    endTime: "",
    totalTime: "",
    description: "",
    completed: true,
    incompletionReason: "",
    observations: "",
  },
  {
    number: 5,
    startTime: "",
    endTime: "",
    totalTime: "",
    description: "",
    completed: true,
    incompletionReason: "",
    observations: "",
  },
  {
    number: 6,
    startTime: "",
    endTime: "",
    totalTime: "",
    description: "",
    completed: true,
    incompletionReason: "",
    observations: "",
  },
];

export function DailyReportModal({
  isOpen,
  onClose,
  onSubmit,
  technician,
}: DailyReportModalProps) {
  const [records, setRecords] = useState<DailyWorkRecord[]>(initialRecords);
  const [technicianSignature, setTechnicianSignature] = useState("");
  const [supervisorSignature, setSupervisorSignature] = useState("");
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const calculateTotalTime = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return "";

    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startDate = new Date(0, 0, 0, startHour, startMin);
    const endDate = new Date(0, 0, 0, endHour, endMin);

    let diff = endDate.getTime() - startDate.getTime();
    if (diff < 0) diff += 24 * 60 * 60 * 1000;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const handleRecordChange = (
    index: number,
    field: keyof DailyWorkRecord,
    value: any
  ) => {
    const newRecords = [...records];
    newRecords[index] = {
      ...newRecords[index],
      [field]: value,
    };

    if (field === "startTime" || field === "endTime") {
      const startTime =
        field === "startTime" ? value : newRecords[index].startTime;
      const endTime = field === "endTime" ? value : newRecords[index].endTime;
      newRecords[index].totalTime = calculateTotalTime(startTime, endTime);
    }

    setRecords(newRecords);
  };

  const handleCompletedChange = (index: number, completed: boolean) => {
    handleRecordChange(index, "completed", completed);
    if (completed) {
      handleRecordChange(index, "incompletionReason", "");
    }
  };

  const handleSubmit = () => {
    const requiredFields = records.every(
      (r) => r.startTime && r.endTime && r.description
    );

    if (!requiredFields) {
      alert(
        "Por favor, completa los campos: Hora inicio, Hora fin y Descripción en todos los registros."
      );
      return;
    }

    if (!technicianSignature.trim()) {
      alert("Por favor, ingresa la firma del técnico responsable.");
      return;
    }

    if (!supervisorSignature.trim()) {
      alert("Por favor, ingresa la firma del supervisor.");
      return;
    }

    const reportData: DailyReportData = {
      id: `REPORT-${Date.now()}`,
      technicianId: technician.id,
      technicianName: technician.name,
      date: reportDate,
      records,
      technicianSignature,
      supervisorSignature,
      createdAt: new Date().toISOString(),
    };

    onSubmit(reportData);
    handleClose();
  };

  const handleClose = () => {
    setRecords(initialRecords);
    setTechnicianSignature("");
    setSupervisorSignature("");
    setReportDate(new Date().toISOString().split("T")[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[1800px] max-h-[90vh] p-3 overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center justify-between text-2xl">
            <span>📋 Reporte Diario de Trabajos</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-gray-700">
                Técnico Responsable
              </Label>
              <Input
                disabled
                value={technician.name}
                className="mt-0.5 bg-gray-100 h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-700">ID Técnico</Label>
              <Input
                disabled
                value={technician.id}
                className="mt-0.5 bg-gray-100 h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="date" className="text-xs text-gray-700">
                Fecha del Reporte
              </Label>
              <Input
                id="date"
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="mt-0.5 h-8 text-sm"
              />
            </div>
          </div>

          {/* Table Wrapper */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Tabla de Registro de Trabajos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                        N.º
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                        Hora Inicio
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                        Hora Fin
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                        Tiempo Total
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                        Descripción
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-center font-semibold">
                        ¿Cumplido?
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                        Motivo
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                        Observaciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 border-b border-gray-200"
                      >
                        {/* N.º */}
                        <td className="border border-gray-300 px-2 py-1 text-center font-medium whitespace-nowrap">
                          {record.number}
                        </td>

                        {/* Hora Inicio */}
                        <td className="border border-gray-300 px-2 py-1">
                          <Input
                            type="time"
                            value={record.startTime}
                            onChange={(e) =>
                              handleRecordChange(
                                index,
                                "startTime",
                                e.target.value
                              )
                            }
                            className="w-full h-7 text-xs"
                            required
                          />
                        </td>

                        {/* Hora Fin */}
                        <td className="border border-gray-300 px-2 py-1">
                          <Input
                            type="time"
                            value={record.endTime}
                            onChange={(e) =>
                              handleRecordChange(
                                index,
                                "endTime",
                                e.target.value
                              )
                            }
                            className="w-full h-7 text-xs"
                            required
                          />
                        </td>

                        {/* Tiempo Total */}
                        <td className="border border-gray-300 px-2 py-1 text-center bg-gray-50 whitespace-nowrap">
                          <span className="font-medium text-blue-600 text-xs">
                            {record.totalTime || "-"}
                          </span>
                        </td>

                        {/* Descripción */}
                        <td className="border border-gray-300 px-2 py-1">
                          <Textarea
                            value={record.description}
                            onChange={(e) =>
                              handleRecordChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Trabajo..."
                            className="min-h-[50px] text-xs resize-none"
                            required
                          />
                        </td>

                        {/* ¿Cumplido? */}
                        <td className="border border-gray-300 px-2 py-1 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <Checkbox
                              checked={record.completed}
                              onCheckedChange={(checked: boolean) =>
                                handleCompletedChange(index, checked)
                              }
                            />
                            <span className="text-xs font-medium">
                              {record.completed ? "Sí" : "No"}
                            </span>
                          </div>
                        </td>

                        {/* Motivo si No */}
                        <td className="border border-gray-300 px-2 py-1">
                          <Textarea
                            value={record.incompletionReason}
                            onChange={(e) =>
                              handleRecordChange(
                                index,
                                "incompletionReason",
                                e.target.value
                              )
                            }
                            placeholder={record.completed ? "N/A" : "Motivo..."}
                            disabled={record.completed}
                            className="min-h-[50px] text-xs resize-none disabled:bg-gray-100"
                          />
                        </td>

                        {/* Observaciones */}
                        <td className="border border-gray-300 px-2 py-1">
                          <Textarea
                            value={record.observations}
                            onChange={(e) =>
                              handleRecordChange(
                                index,
                                "observations",
                                e.target.value
                              )
                            }
                            placeholder="Notas..."
                            className="min-h-[50px] text-xs resize-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Firmas */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">✍️ Firmas Autorizadas</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Firma Técnico */}
                <div>
                  <Label
                    htmlFor="tech-sig"
                    className="text-xs text-gray-700 font-semibold"
                  >
                    Firma: Técnico Responsable ⭐
                  </Label>
                  <Input
                    id="tech-sig"
                    type="text"
                    placeholder="Ingresa tu nombre como firma"
                    value={technicianSignature}
                    onChange={(e) => setTechnicianSignature(e.target.value)}
                    className="mt-1 border-2 border-blue-300 focus:border-blue-500 h-9 text-sm font-medium"
                    required
                  />
                  <div className="text-xs text-gray-600 mt-1">
                    Nombre y Cédula: {technician.name}
                  </div>
                </div>

                {/* Firma Supervisor */}
                <div>
                  <Label
                    htmlFor="super-sig"
                    className="text-xs text-gray-700 font-semibold"
                  >
                    Firma: Supervisor ⭐
                  </Label>
                  <Input
                    id="super-sig"
                    type="text"
                    placeholder="Ingresa nombre del supervisor"
                    value={supervisorSignature}
                    onChange={(e) => setSupervisorSignature(e.target.value)}
                    className="mt-1 border-2 border-orange-300 focus:border-orange-500 h-9 text-sm font-medium"
                    required
                  />
                  <div className="text-xs text-gray-600 mt-1">
                    Nombre y Cédula del Supervisor
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Footer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900 leading-snug">
              <span className="font-semibold">📌 Nota:</span> Este reporte
              registra trabajos realizados sin Orden de Trabajo (OT). Todos los
              campos marcados con ⭐ son obligatorios. El sistema registrará
              automáticamente la fecha y hora de creación del reporte.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 justify-end pt-3 border-t mt-2">
          <Button variant="outline" onClick={handleClose} size="sm">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Guardar Reporte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
