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
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import type { WorkOrder } from "./WorkOrders";

interface WorkOrderClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (closingData: any) => void;
  workOrder: WorkOrder | null;
}

interface ClosingFormData {
  year: string;
  otNumber: string;
  startHour: string;
  closingHour: string;

  // Identificación del Equipo
  equipment: string;
  equipmentCode: string;
  location: string;
  assignedTechnician: string;
  approvedBy: string;
  technicianSignature: string;

  // Tipo de Mantenimiento
  maintenanceType: "preventivo" | "correctivo" | "predictivo" | "mejora" | "";

  // Prioridad
  priority: "urgente" | "alta" | "media" | "baja" | "";

  // Requisitos de Seguridad
  securityRequirements: {
    loto: boolean;
    safetyGloves: boolean;
    safetyGlasses: boolean;
    safetyHarness: boolean;
    electricalRisk: boolean;
    mechanicalRisk: boolean;
    chemicalRisk: boolean;
  };
  otherRisks: string;

  // Descripciones
  descriptionBefore: string;
  effectCauseDescription: string;
  workDescription: string;
  findings: string;
  spareParts: string;
  recommendations: string;

  // Cierre y Validación
  responsibleTechnician: string;
  responsibleSignature: string;
  startTime: string;
  endTime: string;
  totalTime: string;
  receivedValidatedBy: string;
  validationSignature: string;

  // Estado Final
  finalStatus: "completado" | "pendiente" | "";
}

const initialClosingData: ClosingFormData = {
  year: new Date().getFullYear().toString(),
  otNumber: "",
  startHour: "",
  closingHour: "",
  equipment: "",
  equipmentCode: "",
  location: "",
  assignedTechnician: "",
  approvedBy: "",
  technicianSignature: "",
  maintenanceType: "",
  priority: "",
  securityRequirements: {
    loto: false,
    safetyGloves: false,
    safetyGlasses: false,
    safetyHarness: false,
    electricalRisk: false,
    mechanicalRisk: false,
    chemicalRisk: false,
  },
  otherRisks: "",
  descriptionBefore: "",
  effectCauseDescription: "",
  workDescription: "",
  findings: "",
  spareParts: "",
  recommendations: "",
  responsibleTechnician: "",
  responsibleSignature: "",
  startTime: "",
  endTime: "",
  totalTime: "",
  receivedValidatedBy: "",
  validationSignature: "",
  finalStatus: "",
};

export function WorkOrderClosingModal({
  isOpen,
  onClose,
  onSubmit,
  workOrder,
}: WorkOrderClosingModalProps) {
  const [formData, setFormData] = useState<ClosingFormData>(initialClosingData);

  const handleSecurityChange = (
    key: keyof typeof formData.securityRequirements
  ) => {
    setFormData({
      ...formData,
      securityRequirements: {
        ...formData.securityRequirements,
        [key]: !formData.securityRequirements[key],
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...workOrder,
      closingData: formData,
      status: "cerrado",
    });
    setFormData(initialClosingData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 py-3 border-b bg-blue-50">
          <DialogTitle className="text-base sm:text-lg font-bold">
            Cierre de OT: {workOrder?.id}
          </DialogTitle>
          <p className="text-xs text-gray-600 mt-1">
            FO – MTTO – 002 | Versión: 01 | Página: 1 de 1
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <Tabs
            defaultValue="general"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-4 gap-1 px-4 sm:px-6 pt-3 pb-2 h-auto p-0">
              <TabsTrigger value="general" className="text-xs py-1">
                General
              </TabsTrigger>
              <TabsTrigger value="seguridad" className="text-xs py-1">
                Seguridad
              </TabsTrigger>
              <TabsTrigger value="descripcion" className="text-xs py-1">
                Descripción
              </TabsTrigger>
              <TabsTrigger value="cierre" className="text-xs py-1">
                Cierre
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: GENERAL */}
            <TabsContent
              value="general"
              className="flex-1 overflow-y-auto space-y-2 px-4 sm:px-6 py-3"
            >
              <div className="grid grid-cols-3 gap-1">
                <div>
                  <Label className="text-xs">Año *</Label>
                  <Input
                    required
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className="text-xs h-7"
                  />
                </div>
                <div>
                  <Label className="text-xs">N° de OT *</Label>
                  <Input
                    required
                    value={formData.otNumber || workOrder?.id || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, otNumber: e.target.value })
                    }
                    className="text-xs h-7"
                  />
                </div>
                <div>
                  <Label className="text-xs">Hora de Emisión</Label>
                  <Input
                    disabled
                    value={new Date().toLocaleTimeString()}
                    className="text-xs h-7 bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div>
                  <Label className="text-xs">Hora de Inicio *</Label>
                  <Input
                    type="time"
                    required
                    value={formData.startHour}
                    onChange={(e) =>
                      setFormData({ ...formData, startHour: e.target.value })
                    }
                    className="text-xs h-7"
                  />
                </div>
                <div>
                  <Label className="text-xs">Hora de Cierre *</Label>
                  <Input
                    type="time"
                    required
                    value={formData.closingHour}
                    onChange={(e) =>
                      setFormData({ ...formData, closingHour: e.target.value })
                    }
                    className="text-xs h-7"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-2 rounded border border-blue-200 space-y-1">
                <h4 className="font-semibold text-xs">
                  Identificación del Equipo
                </h4>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <Label className="text-xs">Equipo *</Label>
                    <Input
                      required
                      value={formData.equipment || workOrder?.equipment || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, equipment: e.target.value })
                      }
                      className="text-xs h-7"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Código del Equipo</Label>
                    <Input
                      value={formData.equipmentCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          equipmentCode: e.target.value,
                        })
                      }
                      className="text-xs h-7"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Ubicación / Línea</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="text-xs h-7"
                  />
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <Label className="text-xs">Asignado a (Técnico)</Label>
                    <Input
                      value={formData.assignedTechnician}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assignedTechnician: e.target.value,
                        })
                      }
                      className="text-xs h-7"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Aprobado Por</Label>
                    <Input
                      value={formData.approvedBy}
                      onChange={(e) =>
                        setFormData({ ...formData, approvedBy: e.target.value })
                      }
                      className="text-xs h-7"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Firma (Técnico)</Label>
                  <Input
                    value={formData.technicianSignature}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        technicianSignature: e.target.value,
                      })
                    }
                    placeholder="Nombre"
                    className="text-xs h-7"
                  />
                </div>
              </div>

              <div className="bg-purple-50 p-2 rounded border border-purple-200 space-y-1">
                <h4 className="font-semibold text-xs">Tipo de Mantenimiento</h4>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { value: "preventivo", label: "Preventivo" },
                    { value: "correctivo", label: "Correctivo" },
                    { value: "predictivo", label: "Predictivo" },
                    { value: "mejora", label: "Mejora" },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center gap-1 cursor-pointer text-xs"
                    >
                      <input
                        type="radio"
                        name="maintenanceType"
                        value={type.value}
                        checked={formData.maintenanceType === type.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maintenanceType: e.target.value as any,
                          })
                        }
                        className="w-3 h-3"
                      />
                      {type.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 p-2 rounded border border-red-200 space-y-1">
                <h4 className="font-semibold text-xs">Prioridad</h4>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { value: "urgente", label: "Urgente" },
                    { value: "alta", label: "Alta" },
                    { value: "media", label: "Media" },
                    { value: "baja", label: "Baja" },
                  ].map((prio) => (
                    <label
                      key={prio.value}
                      className="flex items-center gap-1 cursor-pointer text-xs"
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={prio.value}
                        checked={formData.priority === prio.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priority: e.target.value as any,
                          })
                        }
                        className="w-3 h-3"
                      />
                      {prio.label}
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: SEGURIDAD */}
            <TabsContent
              value="seguridad"
              className="flex-1 overflow-y-auto space-y-2 px-4 sm:px-6 py-3"
            >
              <div className="bg-orange-50 p-2 rounded border border-orange-200 space-y-1">
                <h4 className="font-semibold text-xs">
                  Requisitos para la Ejecución - Seguridad
                </h4>
                <div className="space-y-1">
                  <div>
                    <p className="font-semibold text-xs mb-1">
                      Requisito de Seguridad:
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        {
                          key: "loto",
                          label:
                            "Aplicar Procedimiento LOTO (Bloqueo y Etiquetado)",
                        },
                        { key: "safetyGloves", label: "Guantes de seguridad" },
                        { key: "safetyGlasses", label: "Lentes de seguridad" },
                        { key: "safetyHarness", label: "Arnés de seguridad" },
                      ].map((req) => (
                        <label
                          key={req.key}
                          className="flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <Checkbox
                            checked={
                              formData.securityRequirements[
                                req.key as keyof typeof formData.securityRequirements
                              ]
                            }
                            onCheckedChange={() =>
                              handleSecurityChange(
                                req.key as keyof typeof formData.securityRequirements
                              )
                            }
                            className="w-3 h-3"
                          />
                          {req.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-2">
                    <p className="font-semibold text-xs mb-1">
                      Riesgos Identificados:
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { key: "electricalRisk", label: "Riesgo Eléctrico" },
                        { key: "mechanicalRisk", label: "Riesgo Mecánico" },
                        { key: "chemicalRisk", label: "Riesgo Químico" },
                      ].map((risk) => (
                        <label
                          key={risk.key}
                          className="flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <Checkbox
                            checked={
                              formData.securityRequirements[
                                risk.key as keyof typeof formData.securityRequirements
                              ]
                            }
                            onCheckedChange={() =>
                              handleSecurityChange(
                                risk.key as keyof typeof formData.securityRequirements
                              )
                            }
                            className="w-3 h-3"
                          />
                          {risk.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Otros Riesgos</Label>
                    <Input
                      value={formData.otherRisks}
                      onChange={(e) =>
                        setFormData({ ...formData, otherRisks: e.target.value })
                      }
                      placeholder="Especificar otros riesgos"
                      className="text-xs h-7"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: DESCRIPCIÓN */}
            <TabsContent
              value="descripcion"
              className="flex-1 overflow-y-auto space-y-2 px-4 sm:px-6 py-3"
            >
              <div>
                <Label className="text-xs">
                  Descripción del Estado Antes de la OT
                </Label>
                <Textarea
                  value={formData.descriptionBefore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descriptionBefore: e.target.value,
                    })
                  }
                  placeholder="Describir estado inicial del equipo..."
                  className="text-xs min-h-[45px]"
                />
              </div>

              <div>
                <Label className="text-xs">
                  Descripción de Efecto / Causa / No Prevista
                </Label>
                <Textarea
                  value={formData.effectCauseDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      effectCauseDescription: e.target.value,
                    })
                  }
                  placeholder="Describir efectos y causas identificadas..."
                  className="text-xs min-h-[45px]"
                />
              </div>

              <div>
                <Label className="text-xs">
                  Descripción del Trabajo Realizado *
                </Label>
                <Textarea
                  required
                  value={formData.workDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      workDescription: e.target.value,
                    })
                  }
                  placeholder="Describir detalladamente el trabajo ejecutado..."
                  className="text-xs min-h-[50px]"
                />
              </div>

              <div>
                <Label className="text-xs">
                  Hallazgos y Anomalías Encontradas
                </Label>
                <Textarea
                  value={formData.findings}
                  onChange={(e) =>
                    setFormData({ ...formData, findings: e.target.value })
                  }
                  placeholder="Nivel bajo, fugas, ruido, piezas sueltas, etc."
                  className="text-xs min-h-[45px]"
                />
              </div>

              <div>
                <Label className="text-xs">
                  Repuestos Utilizados (cantidad)
                </Label>
                <Textarea
                  value={formData.spareParts}
                  onChange={(e) =>
                    setFormData({ ...formData, spareParts: e.target.value })
                  }
                  placeholder="Listar repuestos con cantidades..."
                  className="text-xs min-h-[45px]"
                />
              </div>

              <div>
                <Label className="text-xs">
                  Recomendaciones / Trabajos Pendientes
                </Label>
                <Textarea
                  value={formData.recommendations}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recommendations: e.target.value,
                    })
                  }
                  placeholder="Describir trabajos pendientes o recomendaciones..."
                  className="text-xs min-h-[45px]"
                />
              </div>
            </TabsContent>

            {/* TAB 4: CIERRE */}
            <TabsContent
              value="cierre"
              className="flex-1 overflow-y-auto space-y-2 px-4 sm:px-6 py-3"
            >
              <div className="bg-green-50 p-2 rounded border border-green-200 space-y-1">
                <h4 className="font-semibold text-xs">Cierre y Validación</h4>
                <div className="space-y-1">
                  <div>
                    <Label className="text-xs">Técnico Responsable *</Label>
                    <Input
                      required
                      value={formData.responsibleTechnician}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          responsibleTechnician: e.target.value,
                        })
                      }
                      className="text-xs h-7"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Firma del Técnico</Label>
                    <Input
                      value={formData.responsibleSignature}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          responsibleSignature: e.target.value,
                        })
                      }
                      placeholder="Nombre"
                      className="text-xs h-7"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-2 rounded border border-blue-200 space-y-1">
                <h4 className="font-semibold text-xs">Tiempos de Ejecución</h4>
                <div className="grid grid-cols-3 gap-1">
                  <div>
                    <Label className="text-xs">Hora de Inicio *</Label>
                    <Input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      className="text-xs h-7"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Hora Fin *</Label>
                    <Input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      className="text-xs h-7"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Tiempo Total (h)</Label>
                    <Input
                      value={formData.totalTime}
                      onChange={(e) =>
                        setFormData({ ...formData, totalTime: e.target.value })
                      }
                      placeholder="Ej: 4.5"
                      className="text-xs h-7"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-2 rounded border border-yellow-200 space-y-1">
                <h4 className="font-semibold text-xs">Validación Final</h4>
                <div>
                  <Label className="text-xs">
                    Trabajo Recibido y Validado Por *
                  </Label>
                  <Input
                    required
                    value={formData.receivedValidatedBy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        receivedValidatedBy: e.target.value,
                      })
                    }
                    placeholder="Nombre del Supervisor/Jefe"
                    className="text-xs h-7"
                  />
                </div>
                <div>
                  <Label className="text-xs">Firma de Validación</Label>
                  <Input
                    value={formData.validationSignature}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validationSignature: e.target.value,
                      })
                    }
                    placeholder="Nombre"
                    className="text-xs h-7"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-2 rounded border space-y-1">
                <h4 className="font-semibold text-xs">
                  Estado Final de la OT *
                </h4>
                <div className="flex gap-3 text-xs">
                  {[
                    { value: "completado", label: "Completado" },
                    { value: "pendiente", label: "Pendiente" },
                  ].map((status) => (
                    <label
                      key={status.value}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="finalStatus"
                        value={status.value}
                        checked={formData.finalStatus === status.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            finalStatus: e.target.value as any,
                          })
                        }
                        className="w-3 h-3"
                        required
                      />
                      {status.label}
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="border-t px-4 sm:px-6 py-2 gap-2 bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs h-7"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-xs h-7"
            >
              Cerrar OT
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
