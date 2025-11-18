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

export interface MachinePerformanceData {
  operatorName: string;
  page: string;
  turno: string;
  startTime: string;
  endTime: string;
  date: string;
  area: string;
  machine: string;
  code: string;
  funcionamiento: {
    encendidoNormal: boolean;
    errorEncendido: boolean;
    funcionamientoNormal: boolean;
    descripcion: string;
  };
  produccion: {
    ritmoNormal: boolean;
    atascos: boolean;
    intermitente: boolean;
    perdidaProducto: boolean;
    descripcion: string;
  };
  condiciones: {
    ruidos: boolean;
    panelNormal: boolean;
    vibraciones: boolean;
    alarmas: boolean;
    ajustesFlojos: boolean;
    fallosSensores: boolean;
    lubricacion: boolean;
    funcionamientoNormal: boolean;
    descripcion: string;
  };
  fallas: {
    fallaMecanica: boolean;
    horaFalla: string;
    fallaElectrica: boolean;
    otros: string;
    accionTomada: string;
    descripcion: string;
  };
  estadoRecibidoDescripcion: string;
  firmaSaliente: string;
  firmaEntrante: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MachinePerformanceData) => void;
}

export function MachinePerformanceModal({ isOpen, onClose, onSubmit }: Props) {
  const [operatorName, setOperatorName] = useState("");
  const [page] = useState("1 de 1");
  const [turno, setTurno] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [area, setArea] = useState("");
  const [machine, setMachine] = useState("");
  const [code, setCode] = useState("");

  const [func, setFunc] = useState({
    encendidoNormal: false,
    errorEncendido: false,
    funcionamientoNormal: false,
    descripcion: "",
  });

  const [prod, setProd] = useState({
    ritmoNormal: false,
    atascos: false,
    intermitente: false,
    perdidaProducto: false,
    descripcion: "",
  });

  const [cond, setCond] = useState({
    ruidos: false,
    panelNormal: false,
    vibraciones: false,
    alarmas: false,
    ajustesFlojos: false,
    fallosSensores: false,
    lubricacion: false,
    funcionamientoNormal: false,
    descripcion: "",
  });

  const [fallas, setFallas] = useState({
    fallaMecanica: false,
    horaFalla: "",
    fallaElectrica: false,
    otros: "",
    accionTomada: "",
    descripcion: "",
  });

  const [estadoRecibidoDescripcion, setEstadoRecibidoDescripcion] =
    useState("");
  const [firmaSaliente, setFirmaSaliente] = useState("");
  const [firmaEntrante, setFirmaEntrante] = useState("");

  const reset = () => {
    setOperatorName("");
    setTurno("");
    setStartTime("");
    setEndTime("");
    setDate(new Date().toISOString().split("T")[0]);
    setArea("");
    setMachine("");
    setCode("");
    setFunc({
      encendidoNormal: false,
      errorEncendido: false,
      funcionamientoNormal: false,
      descripcion: "",
    });
    setProd({
      ritmoNormal: false,
      atascos: false,
      intermitente: false,
      perdidaProducto: false,
      descripcion: "",
    });
    setCond({
      ruidos: false,
      panelNormal: false,
      vibraciones: false,
      alarmas: false,
      ajustesFlojos: false,
      fallosSensores: false,
      lubricacion: false,
      funcionamientoNormal: false,
      descripcion: "",
    });
    setFallas({
      fallaMecanica: false,
      horaFalla: "",
      fallaElectrica: false,
      otros: "",
      accionTomada: "",
      descripcion: "",
    });
    setEstadoRecibidoDescripcion("");
    setFirmaSaliente("");
    setFirmaEntrante("");
  };

  const handleSubmit = () => {
    if (!operatorName.trim()) return alert("Ingresa el nombre del operario.");
    if (!firmaSaliente.trim() || !firmaEntrante.trim())
      return alert("Ambas firmas son obligatorias.");

    const data: MachinePerformanceData = {
      operatorName,
      page,
      turno,
      startTime,
      endTime,
      date,
      area,
      machine,
      code,
      funcionamiento: { ...func },
      produccion: { ...prod },
      condiciones: { ...cond },
      fallas: { ...fallas },
      estadoRecibidoDescripcion,
      firmaSaliente,
      firmaEntrante,
    };

    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        reset();
        onClose();
      }}
    >
      <DialogContent className="!fixed !inset-6 !w-[calc(100vw-48px)] !h-[calc(100vh-48px)] flex flex-col rounded-lg shadow-2xl bg-white">
        <DialogHeader className="px-6 pt-6 pb-2 border-b">
          <DialogTitle className="flex items-center justify-between text-2xl font-bold">
            <div>
              <div className="text-sm text-gray-600">PÁGINA</div>
              <div className="text-base font-semibold">{page}</div>
            </div>
            <div className="text-center">
              <div className="text-lg">NOMBRE DEL OPERADOR</div>
              <div className="text-sm text-gray-600">
                Llena en el campo abajo
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              <X />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Top grid */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-semibold">
                NOMBRE DEL OPERADOR
              </Label>
              <Input
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="mt-2 h-10 text-sm"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">TURNO</Label>
              <Input
                value={turno}
                onChange={(e) => setTurno(e.target.value)}
                className="mt-2 h-10 text-sm"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">
                HORA INICIO / HORA FIN
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-10 text-sm"
                />
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
              <div className="mt-2">
                <Label className="text-sm font-semibold">FECHA</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 h-10 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-semibold">AREA</Label>
              <Input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="mt-2 h-10 text-sm"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">MAQUINA</Label>
              <Input
                value={machine}
                onChange={(e) => setMachine(e.target.value)}
                className="mt-2 h-10 text-sm"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">CÓDIGO</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-2 h-10 text-sm"
              />
            </div>
          </div>

          {/* Funcionamiento */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">
                FUNCIONAMIENTO DE LA MÁQUINA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={func.encendidoNormal}
                      onCheckedChange={(v: boolean) =>
                        setFunc({ ...func, encendidoNormal: v })
                      }
                    />{" "}
                    <span>ENCENDIDO NORMAL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={func.errorEncendido}
                      onCheckedChange={(v: boolean) =>
                        setFunc({ ...func, errorEncendido: v })
                      }
                    />{" "}
                    <span>ERROR AL ENCENDIDO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={func.funcionamientoNormal}
                      onCheckedChange={(v: boolean) =>
                        setFunc({ ...func, funcionamientoNormal: v })
                      }
                    />{" "}
                    <span>FUNCIONAMIENTO NORMAL</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-semibold">DESCRIPCION</Label>
                  <Textarea
                    value={func.descripcion}
                    onChange={(e) =>
                      setFunc({ ...func, descripcion: e.target.value })
                    }
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Producción */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">
                PRODUCCIÓN / DESEMPEÑO
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={prod.ritmoNormal}
                      onCheckedChange={(v: boolean) =>
                        setProd({ ...prod, ritmoNormal: v })
                      }
                    />{" "}
                    <span>PRODUCCIÓN EN RITMO NORMAL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={prod.atascos}
                      onCheckedChange={(v: boolean) =>
                        setProd({ ...prod, atascos: v })
                      }
                    />{" "}
                    <span>ATASCOS O INTERRUPCIONES FRECUENTES</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={prod.intermitente}
                      onCheckedChange={(v: boolean) =>
                        setProd({ ...prod, intermitente: v })
                      }
                    />{" "}
                    <span>PRODUCCIÓN INTERMITENTE / BAJA VELOCIDAD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={prod.perdidaProducto}
                      onCheckedChange={(v: boolean) =>
                        setProd({ ...prod, perdidaProducto: v })
                      }
                    />{" "}
                    <span>PÉRDIDA DE PRODUCTO</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-semibold">DESCRIPCION</Label>
                  <Textarea
                    value={prod.descripcion}
                    onChange={(e) =>
                      setProd({ ...prod, descripcion: e.target.value })
                    }
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Condiciones mecánicas */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">
                CONDICIONES MECÁNICAS / ELÉCTRICA / ELECTRÓNICA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={cond.ruidos}
                      onCheckedChange={(v: boolean) =>
                        setCond({ ...cond, ruidos: v })
                      }
                    />{" "}
                    <span>RUIDOS ANORMALES</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={cond.panelNormal}
                      onCheckedChange={(v: boolean) =>
                        setCond({ ...cond, panelNormal: v })
                      }
                    />{" "}
                    <span>PANEL DE CONTROL EN ESTADO NORMAL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={cond.vibraciones}
                      onCheckedChange={(v: boolean) =>
                        setCond({ ...cond, vibraciones: v })
                      }
                    />{" "}
                    <span>VIBRACIONES EXCESIVAS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={cond.alarmas}
                      onCheckedChange={(v: boolean) =>
                        setCond({ ...cond, alarmas: v })
                      }
                    />{" "}
                    <span>ALARMAS DE PILOTOS-PANTALLA (SI CORRESPONDE)</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={cond.ajustesFlojos}
                      onCheckedChange={(v: boolean) =>
                        setCond({ ...cond, ajustesFlojos: v })
                      }
                    />{" "}
                    <span>AJUSTES FLOJOS / PARTES SUELTAS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={cond.fallosSensores}
                      onCheckedChange={(v: boolean) =>
                        setCond({ ...cond, fallosSensores: v })
                      }
                    />{" "}
                    <span>FALLOS DE SENSORES</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={cond.lubricacion}
                      onCheckedChange={(v: boolean) =>
                        setCond({ ...cond, lubricacion: v })
                      }
                    />{" "}
                    <span>LUBRICACIÓN INSUFICIENTE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={cond.funcionamientoNormal}
                      onCheckedChange={(v: boolean) =>
                        setCond({ ...cond, funcionamientoNormal: v })
                      }
                    />{" "}
                    <span>FUNCIONAMIENTO NORMAL</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">DESCRIPCION</Label>
                  <Textarea
                    value={cond.descripcion}
                    onChange={(e) =>
                      setCond({ ...cond, descripcion: e.target.value })
                    }
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fallas presentadas */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">
                FALLAS PRESENTADAS (EN CASO DE HABER)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={fallas.fallaMecanica}
                      onCheckedChange={(v: boolean) =>
                        setFallas({ ...fallas, fallaMecanica: v })
                      }
                    />{" "}
                    <span>FALLA MECÁNICA</span>
                  </div>
                  <Label className="text-sm font-semibold mt-2">
                    HORA DE LA OCURRENCIA
                  </Label>
                  <Input
                    type="time"
                    value={fallas.horaFalla}
                    onChange={(e) =>
                      setFallas({ ...fallas, horaFalla: e.target.value })
                    }
                    className="mt-2 h-10"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={fallas.fallaElectrica}
                      onCheckedChange={(v: boolean) =>
                        setFallas({ ...fallas, fallaElectrica: v })
                      }
                    />{" "}
                    <span>FALLA ELÉCTRICA</span>
                  </div>
                  <Label className="text-sm font-semibold mt-2">OTROS</Label>
                  <Input
                    value={fallas.otros}
                    onChange={(e) =>
                      setFallas({ ...fallas, otros: e.target.value })
                    }
                    className="mt-2 h-10"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">ACCIÓN TOMADA</Label>
                  <Textarea
                    value={fallas.accionTomada}
                    onChange={(e) =>
                      setFallas({ ...fallas, accionTomada: e.target.value })
                    }
                    className="mt-2 min-h-[80px]"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label className="text-sm font-semibold">DESCRIPCION</Label>
                <Textarea
                  value={fallas.descripcion}
                  onChange={(e) =>
                    setFallas({ ...fallas, descripcion: e.target.value })
                  }
                  className="mt-2 min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Estado recibido */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">
                ESTADO RECIBIDO
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea
                value={estadoRecibidoDescripcion}
                onChange={(e) => setEstadoRecibidoDescripcion(e.target.value)}
                className="min-h-[140px]"
              />
            </CardContent>
          </Card>

          {/* Firmas */}
          <div className="grid grid-cols-2 gap-6 items-end">
            <div className="text-center">
              <Label className="text-sm font-semibold">
                Firma del Operario Saliente
              </Label>
              <Input
                value={firmaSaliente}
                onChange={(e) => setFirmaSaliente(e.target.value)}
                className="mt-2 h-10"
              />
            </div>
            <div className="text-center">
              <Label className="text-sm font-semibold">
                Firma del Operario Entrante
              </Label>
              <Input
                value={firmaEntrante}
                onChange={(e) => setFirmaEntrante(e.target.value)}
                className="mt-2 h-10"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 justify-end px-6 py-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 text-white">
            <Plus /> Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MachinePerformanceModal;
