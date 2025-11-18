import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Trash, Edit, Plus, Download, Copy, Eye, FilePlus } from "lucide-react";
import { Badge } from "./ui/badge";

export interface CodingItem {
  id: string;
  item: number;
  planta: string;
  codigoPlanta: string;
  area: string;
  codigoArea: string;
  ubicacion: string;
  codigoUbicacion: string;
  equipo: string;
  codigoEquipo: string;
  numeroEquipo: string;
  ubicacionTecnica: string;
}

const STORAGE_KEY = "equipment_coding_v1";

const initialData: CodingItem[] = [
  {
    id: "1",
    item: 1,
    planta: "CBBA",
    codigoPlanta: "PL1",
    area: "PRODUCCION",
    codigoArea: "PROD",
    ubicacion: "LINEA DE COCCION",
    codigoUbicacion: "L50",
    equipo: "LAVADORA",
    codigoEquipo: "LAV",
    numeroEquipo: "001",
    ubicacionTecnica: "PL1-PROD-L50-LAV-001",
  },
  {
    id: "2",
    item: 2,
    planta: "CBBA",
    codigoPlanta: "PL1",
    area: "PRODUCCION",
    codigoArea: "PROD",
    ubicacion: "LINEA DE COCCION",
    codigoUbicacion: "L50",
    equipo: "OLLA A PRESION INDUSTRIAL",
    codigoEquipo: "OLL",
    numeroEquipo: "001",
    ubicacionTecnica: "PL1-PROD-L50-OLL-001",
  },
  {
    id: "3",
    item: 3,
    planta: "CBBA",
    codigoPlanta: "PL1",
    area: "PRODUCCION",
    codigoArea: "PROD",
    ubicacion: "LINEA DE COCCION",
    codigoUbicacion: "L50",
    equipo: "DESPULPADORA",
    codigoEquipo: "DES",
    numeroEquipo: "001",
    ubicacionTecnica: "PL1-PROD-L50-DES-001",
  },
  {
    id: "4",
    item: 4,
    planta: "CBBA",
    codigoPlanta: "PL1",
    area: "PRODUCCION",
    codigoArea: "PROD",
    ubicacion: "LINEA DE COCCION",
    codigoUbicacion: "L50",
    equipo: "DESPULPADORA",
    codigoEquipo: "DES",
    numeroEquipo: "002",
    ubicacionTecnica: "PL1-PROD-L50-DES-002",
  },
  {
    id: "5",
    item: 5,
    planta: "CBBA",
    codigoPlanta: "PL1",
    area: "PRODUCCION",
    codigoArea: "PROD",
    ubicacion: "LINEA DE COCCION",
    codigoUbicacion: "L50",
    equipo: "TINAS DE MEZCLADO Y COCCION",
    codigoEquipo: "TIN",
    numeroEquipo: "001",
    ubicacionTecnica: "PL1-PROD-L50-TIN-001",
  },
  {
    id: "6",
    item: 6,
    planta: "CBBA",
    codigoPlanta: "PL1",
    area: "PRODUCCION",
    codigoArea: "PROD",
    ubicacion: "LINEA DE COCCION",
    codigoUbicacion: "L50",
    equipo: "TINAS DE MEZCLADO Y COCCION",
    codigoEquipo: "TIN",
    numeroEquipo: "002",
    ubicacionTecnica: "PL1-PROD-L50-TIN-002",
  },
  {
    id: "7",
    item: 7,
    planta: "CBBA",
    codigoPlanta: "PL1",
    area: "PRODUCCION",
    codigoArea: "PROD",
    ubicacion: "LINEA DE COCCION",
    codigoUbicacion: "L50",
    equipo: "TINAS DE MEZCLADO Y COCCION",
    codigoEquipo: "TIN",
    numeroEquipo: "003",
    ubicacionTecnica: "PL1-PROD-L50-TIN-003",
  },
];

export default function EquipmentCoding() {
  const [items, setItems] = useState<CodingItem[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CodingItem | null>(null);
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 8;
  const [viewOnly, setViewOnly] = useState(false);
  const fileInputId = "equipment-csv-import";

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
        return;
      } catch (e) {}
    }
    setItems(initialData);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    setEditing({
      id: Date.now().toString(),
      item: items.length + 1,
      planta: "",
      codigoPlanta: "",
      area: "",
      codigoArea: "",
      ubicacion: "",
      codigoUbicacion: "",
      equipo: "",
      codigoEquipo: "",
      numeroEquipo: "",
      ubicacionTecnica: "",
    });
    setOpen(true);
  };

  const handleEdit = (it: CodingItem) => {
    setViewOnly(false);
    setEditing(it);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    const it = items.find((i) => i.id === id);
    const label = it
      ? `${it.codigoEquipo} ${it.numeroEquipo} (${it.ubicacionTecnica})`
      : id;
    if (!confirm(`Eliminar registro ${label}?`)) return;
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const saveEditing = (it: CodingItem) => {
    // basic validation
    if (
      !it.planta ||
      !it.codigoPlanta ||
      !it.area ||
      !it.codigoArea ||
      !it.ubicacion ||
      !it.codigoUbicacion ||
      !it.equipo ||
      !it.codigoEquipo ||
      !it.numeroEquipo
    ) {
      alert(
        "Por favor completa los campos obligatorios: Planta, Código Planta, Área, Código Área, Ubicación, Código Ubicación, Equipo, Código Equipo, Número de Equipo."
      );
      return;
    }

    // auto-generate ubicacionTecnica if not provided
    const generatedUbicacion = `${it.codigoPlanta}-${it.codigoArea}-${it.codigoUbicacion}-${it.codigoEquipo}-${it.numeroEquipo}`;
    const toSave = {
      ...it,
      ubicacionTecnica: it.ubicacionTecnica?.trim()
        ? it.ubicacionTecnica
        : generatedUbicacion,
    };

    setItems((prev) => {
      const exists = prev.find((p) => p.id === toSave.id);
      if (exists) {
        return prev.map((p) => (p.id === toSave.id ? toSave : p));
      }
      return [...prev, toSave];
    });
    setOpen(false);
    setEditing(null);
  };

  // derived: filtered and paginated
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        String(i.item).includes(q) ||
        i.planta.toLowerCase().includes(q) ||
        i.codigoPlanta.toLowerCase().includes(q) ||
        i.area.toLowerCase().includes(q) ||
        i.codigoArea.toLowerCase().includes(q) ||
        i.ubicacion.toLowerCase().includes(q) ||
        i.equipo.toLowerCase().includes(q) ||
        i.codigoEquipo.toLowerCase().includes(q) ||
        i.ubicacionTecnica.toLowerCase().includes(q)
    );
  }, [items, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (pageIndex >= pageCount) setPageIndex(0);
  }, [pageCount]);

  const visible = filtered.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  const exportCSV = () => {
    const headers = [
      "ITEM",
      "PLANTA",
      "CODIGO PLANTA",
      "AREA",
      "CODIGO AREA",
      "UBICACION",
      "CODIGO UBICACION",
      "EQUIPO",
      "CODIGO EQUIPO",
      "NUMERO EQUIPO",
      "UBICACION TECNICA",
    ];
    const rows = items.map((i) => [
      i.item,
      i.planta,
      i.codigoPlanta,
      i.area,
      i.codigoArea,
      i.ubicacion,
      i.codigoUbicacion,
      i.equipo,
      i.codigoEquipo,
      i.numeroEquipo,
      i.ubicacionTecnica,
    ]);
    const csv = [headers, ...rows]
      .map((r) =>
        r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "equipment_coding.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        if (lines.length < 2) {
          alert("CSV vacío o sin filas");
          return;
        }
        const headers = lines[0]
          .split(/,|;|\t/)
          .map((h) => h.replace(/"/g, "").trim().toUpperCase());
        const body = lines.slice(1);
        const parsed: CodingItem[] = body.map((ln, idx) => {
          const cols = ln
            .split(/,|;|\t/)
            .map((c) => c.replace(/^"|"$/g, "").trim());
          const map: any = {};
          headers.forEach((h, i) => (map[h] = cols[i] ?? ""));
          const codigoPlanta =
            map["CODIGO PLANTA"] ||
            map["CODIGO_PLANTA"] ||
            map["CODIGOPLANTA"] ||
            "";
          const codigoArea =
            map["CODIGO AREA"] || map["CODIGO_AREA"] || map["CODIGOAREA"] || "";
          const codigoUbicacion =
            map["CODIGO UBICACION"] ||
            map["CODIGO_UBICACION"] ||
            map["CODIGOUNICACION"] ||
            "";
          const codigoEquipo =
            map["CODIGO EQUIPO"] ||
            map["CODIGO_EQUIPO"] ||
            map["CODIGOEQUIPO"] ||
            "";
          const numeroEquipo =
            map["NUMERO EQUIPO"] ||
            map["NUMERO_EQUIPO"] ||
            map["NUMEROEQUIPO"] ||
            "";
          const ubicacionTecnica =
            map["UBICACION TECNICA"] || map["UBICACION_TECNICA"] || "";
          return {
            id: Date.now().toString() + "-" + idx,
            item: items.length + idx + 1,
            planta: map["PLANTA"] || "",
            codigoPlanta,
            area: map["AREA"] || "",
            codigoArea,
            ubicacion: map["UBICACION"] || "",
            codigoUbicacion,
            equipo: map["EQUIPO"] || "",
            codigoEquipo,
            numeroEquipo,
            ubicacionTecnica:
              ubicacionTecnica ||
              `${codigoPlanta}-${codigoArea}-${codigoUbicacion}-${codigoEquipo}-${numeroEquipo}`,
          } as CodingItem;
        });
        setItems((prev) => [...prev, ...parsed]);
        alert(`Importadas ${parsed.length} filas`);
      } catch (e) {
        console.error(e);
        alert("Error al parsear CSV");
      }
    };
    reader.readAsText(file);
  };

  const onImportClick = () => {
    const input = document.getElementById(
      fileInputId
    ) as HTMLInputElement | null;
    input?.click();
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (f) importCSV(f);
    e.currentTarget.value = "";
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Ubicación técnica copiada");
    } catch (e) {
      console.error(e);
      alert("No se pudo copiar");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sección de Codificación de Equipos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <p className="text-sm text-gray-600">
                Gestiona códigos y ubicación técnica de equipos.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  placeholder="Buscar (planta, área, equipo, ubicación técnica...)"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPageIndex(0);
                  }}
                  className="max-w-xs"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setPageIndex(0);
                  }}
                >
                  Limpiar
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* <input
                id={fileInputId}
                type="file"
                accept=".csv,text/csv"
                onChange={onFileChange}
                className="hidden"
              />
              <Button onClick={onImportClick} className="gap-2">
                <FilePlus className="h-4 w-4" /> Importar CSV
              </Button>
              <Button onClick={exportCSV} className="gap-2">
                <Download className="h-4 w-4" /> Exportar CSV
              </Button> */}
              <Button onClick={handleAdd} className="bg-blue-600 text-white">
                <Plus className="h-4 w-4" /> Nuevo
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">ITEM</th>
                  <th className="border px-2 py-1">PLANTA</th>
                  <th className="border px-2 py-1">CODIGO PLANTA</th>
                  <th className="border px-2 py-1">AREA</th>
                  <th className="border px-2 py-1">CODIGO AREA</th>
                  <th className="border px-2 py-1">UBICACIÓN</th>
                  <th className="border px-2 py-1">CODIGO UBICACIÓN</th>
                  <th className="border px-2 py-1">EQUIPO</th>
                  <th className="border px-2 py-1">CODIGO EQUIPO</th>
                  <th className="border px-2 py-1">NUMERO EQUIPO</th>
                  <th className="border px-2 py-1">UBICACIÓN TÉCNICA</th>
                  <th className="border px-2 py-1">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((it) => (
                  <tr key={it.id} className="border-b hover:bg-slate-50">
                    <td className="border px-2 py-1 text-center">{it.item}</td>
                    <td className="border px-2 py-1">
                      <Badge>{it.planta}</Badge>
                    </td>
                    <td className="border px-2 py-1">
                      <Badge>{it.codigoPlanta}</Badge>
                    </td>
                    <td className="border px-2 py-1">{it.area}</td>
                    <td className="border px-2 py-1">{it.codigoArea}</td>
                    <td className="border px-2 py-1">{it.ubicacion}</td>
                    <td className="border px-2 py-1">{it.codigoUbicacion}</td>
                    <td className="border px-2 py-1">{it.equipo}</td>
                    <td className="border px-2 py-1">{it.codigoEquipo}</td>
                    <td className="border px-2 py-1">{it.numeroEquipo}</td>
                    <td className="border px-2 py-1 max-w-xs">
                      <div className="truncate" title={it.ubicacionTecnica}>
                        {it.ubicacionTecnica}
                      </div>
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setViewOnly(true);
                            setEditing(it);
                            setOpen(true);
                          }}
                          className="h-8 px-2"
                          title="Ver"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(it)}
                          className="h-8 px-2"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => copyToClipboard(it.ubicacionTecnica)}
                          className="h-8 px-2"
                          title="Copiar ubicación técnica"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(it.id)}
                          className="h-8 px-2"
                          title="Eliminar"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-600">
              No se encontraron registros. Usa "Nuevo" o importa un CSV para
              agregar equipos.
            </div>
          )}
        </CardContent>
      </Card>
      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-gray-600">
          Mostrando {filtered.length} registros
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
          >
            Anterior
          </Button>
          <div className="text-sm">
            {pageIndex + 1} / {pageCount}
          </div>
          <Button
            variant="outline"
            onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
            disabled={pageIndex >= pageCount - 1}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setEditing(null);
          setViewOnly(false);
        }}
      >
        <DialogContent className="w-full max-w-6xl max-h-[90vh] flex flex-col rounded-lg shadow-2xl bg-white overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2 border-b">
            <DialogTitle className="text-xl font-bold">
              {editing?.id ? "Editar" : "Nuevo"} Código de Equipo
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {editing && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>ITEM</Label>
                  <Input
                    disabled={viewOnly}
                    value={editing.item}
                    onChange={(e) =>
                      setEditing({ ...editing, item: Number(e.target.value) })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>PLANTA</Label>
                  <Input
                    disabled={viewOnly}
                    value={editing.planta}
                    onChange={(e) =>
                      setEditing({ ...editing, planta: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>CODIGO PLANTA</Label>
                  <Input
                    disabled={viewOnly}
                    value={editing.codigoPlanta}
                    onChange={(e) =>
                      setEditing({ ...editing, codigoPlanta: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>AREA</Label>
                  <Input
                    disabled={viewOnly}
                    value={editing.area}
                    onChange={(e) =>
                      setEditing({ ...editing, area: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>CODIGO AREA</Label>
                  <Input
                    disabled={viewOnly}
                    value={editing.codigoArea}
                    onChange={(e) =>
                      setEditing({ ...editing, codigoArea: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>UBICACIÓN</Label>
                  <Input
                    disabled={viewOnly}
                    value={editing.ubicacion}
                    onChange={(e) =>
                      setEditing({ ...editing, ubicacion: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>CODIGO UBICACIÓN</Label>
                  <Input
                    disabled={viewOnly}
                    value={editing.codigoUbicacion}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        codigoUbicacion: e.target.value,
                      })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>EQUIPO</Label>
                  <Input
                    disabled={viewOnly}
                    value={editing.equipo}
                    onChange={(e) =>
                      setEditing({ ...editing, equipo: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>CODIGO DEL EQUIPO</Label>
                  <Input
                    disabled={viewOnly}
                    value={editing.codigoEquipo}
                    onChange={(e) =>
                      setEditing({ ...editing, codigoEquipo: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>NUMERO DE EQUIPO</Label>
                  <Input
                    disabled={viewOnly}
                    value={editing.numeroEquipo}
                    onChange={(e) =>
                      setEditing({ ...editing, numeroEquipo: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <Label>UBICACIÓN TÉCNICA</Label>
                  <Textarea
                    disabled={viewOnly}
                    value={editing.ubicacionTecnica}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        ubicacionTecnica: e.target.value,
                      })
                    }
                    className="mt-2"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-3 justify-end px-6 py-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setEditing(null);
                setViewOnly(false);
              }}
            >
              Cerrar
            </Button>
            {!viewOnly && (
              <Button
                onClick={() => editing && saveEditing(editing)}
                className="bg-blue-600 text-white"
              >
                Guardar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
