import React, { useEffect, useMemo, useState } from "react";
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
import { Plus, Edit, Trash, Download, FilePlus } from "lucide-react";

export interface InventoryItem {
  id: string;
  item: number;
  equipo: string;
  cantidad: number;
  funcion: string;
}

export interface InventorySection {
  id: string;
  area: string;
  linea: string;
  items: InventoryItem[];
}

const STORAGE_KEY = "equipment_inventory_v1";

const initialSections: InventorySection[] = [
  {
    id: "s-prod-coccion",
    area: "PRODUCCIÓN",
    linea: "COCCIÓN",
    items: [
      {
        id: "i-1",
        item: 1,
        equipo: "LAVADORA",
        cantidad: 1,
        funcion: "LAVAR LA MATERIA PRIMA VIRGEN",
      },
      {
        id: "i-2",
        item: 2,
        equipo: "OLLA A PRESION INDUSTRIAL",
        cantidad: 1,
        funcion: "COCINAR LA MATERIA PRIMA",
      },
      {
        id: "i-3",
        item: 3,
        equipo: "DESPULPADORA",
        cantidad: 2,
        funcion: "SEPARAR LA PULPA DE LA PEPA",
      },
      {
        id: "i-4",
        item: 4,
        equipo: "TINAS DE MEZCLADO Y COCCION",
        cantidad: 3,
        funcion: "MEZCLAR LOS INGREDIENTES Y COCER",
      },
    ],
  },
  {
    id: "s-prod-pasteurizacion",
    area: "PRODUCCIÓN",
    linea: "PASTEURIZACIÓN",
    items: [
      {
        id: "i-101",
        item: 1,
        equipo: "TANQUE DE HOMOGENEIZADO",
        cantidad: 1,
        funcion: "GARANTIZAR UN FLUJO CONSTANTE",
      },
      {
        id: "i-102",
        item: 2,
        equipo: "HOMOGENEIZADOR",
        cantidad: 1,
        funcion: "GARANTIZAR UNA TEXTURA SUAVE",
      },
      {
        id: "i-103",
        item: 3,
        equipo: "FILTRO",
        cantidad: 1,
        funcion: "SEPARAR SOLIDOS DE LIQUIDOS",
      },
      {
        id: "i-104",
        item: 4,
        equipo: "PASTEURIZADOR",
        cantidad: 1,
        funcion: "ELIMINAR MICROORGANISMOS",
      },
    ],
  },
  {
    id: "s-prod-2l",
    area: "PRODUCCIÓN",
    linea: "2 LITROS",
    items: [
      {
        id: "i-201",
        item: 1,
        equipo: "LLENADORA 2 LITROS",
        cantidad: 1,
        funcion: "LLENAR DE PRODUCTO Y TAPAR LAS BOTELLAS",
      },
      {
        id: "i-202",
        item: 2,
        equipo: "SECADOR DE BOTELLAS 2 LITROS",
        cantidad: 1,
        funcion: "QUITAR LA HUMEDAD REMANENTE",
      },
      {
        id: "i-203",
        item: 3,
        equipo: "ETIQUITADORA 2 LITROS",
        cantidad: 1,
        funcion: "APLICAR LAS ETIQUETAS",
      },
      {
        id: "i-204",
        item: 4,
        equipo: "CODIFICADORA 2 LITROS",
        cantidad: 1,
        funcion: "APLICAR FECHA Y LOTE",
      },
      {
        id: "i-205",
        item: 5,
        equipo: "EMPAQUETADORA 2 LITROS",
        cantidad: 1,
        funcion: "EMPAQUETAR PRODUCTO",
      },
    ],
  },
];

export default function EquipmentInventory() {
  const [sections, setSections] = useState<InventorySection[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [search, setSearch] = useState("");
  const [sectionOpen, setSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<InventorySection | null>(
    null
  );
  const [sectionArea, setSectionArea] = useState("");
  const [sectionLinea, setSectionLinea] = useState("");
  const fileInputId = "inventory-csv-import";

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setSections(JSON.parse(raw));
        return;
      } catch (e) {}
    }
    setSections(initialSections);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  }, [sections]);

  const addSection = (area: string, linea: string) => {
    const id = `s-${area.toLowerCase().replace(/\s+/g, "-")}-${linea
      .toLowerCase()
      .replace(/\s+/g, "-")}-${Date.now()}`;
    const sec: InventorySection = { id, area, linea, items: [] };
    setSections((prev) => [...prev, sec]);
    return sec.id;
  };

  const handleAddSectionClick = () => {
    setEditingSection(null);
    setSectionArea("");
    setSectionLinea("");
    setSectionOpen(true);
  };

  const handleEditSectionClick = (sec: InventorySection) => {
    setEditingSection(sec);
    setSectionArea(sec.area);
    setSectionLinea(sec.linea);
    setSectionOpen(true);
  };

  const handleDeleteSection = (secId: string) => {
    const sec = sections.find((s) => s.id === secId);
    if (!sec) return;
    if (!confirm(`Eliminar sección ${sec.area} / ${sec.linea}?`)) return;
    setSections((prev) => prev.filter((s) => s.id !== secId));
  };

  const saveSection = () => {
    if (!sectionArea.trim() || !sectionLinea.trim()) {
      alert("Area y Línea son obligatorios");
      return;
    }
    if (editingSection) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === editingSection.id
            ? { ...s, area: sectionArea.trim(), linea: sectionLinea.trim() }
            : s
        )
      );
    } else {
      addSection(sectionArea.trim(), sectionLinea.trim());
    }
    setSectionOpen(false);
    setEditingSection(null);
  };

  const handleAddItem = (sectionId?: string) => {
    const secId = sectionId ?? (sections[0] && sections[0].id);
    const sec = sections.find((s) => s.id === secId);
    if (!sec) {
      alert("No hay sección seleccionada");
      return;
    }
    const nextItem: InventoryItem = {
      id: Date.now().toString(),
      item: sec.items.length + 1,
      equipo: "",
      cantidad: 1,
      funcion: "",
    };
    setEditingSectionId(secId);
    setEditingItem(nextItem);
    setOpen(true);
  };

  const handleEditItem = (secId: string, it: InventoryItem) => {
    setEditingSectionId(secId);
    setEditingItem(it);
    setOpen(true);
  };

  const handleDeleteItem = (secId: string, id: string) => {
    if (!confirm("Eliminar item del inventario?")) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === secId ? { ...s, items: s.items.filter((i) => i.id !== id) } : s
      )
    );
  };

  const saveItem = (secId: string, item: InventoryItem) => {
    // basic validation
    if (!item.equipo) {
      alert("Ingrese nombre de equipo");
      return;
    }
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== secId) return s;
        const exists = s.items.find((i) => i.id === item.id);
        if (exists) {
          return {
            ...s,
            items: s.items.map((i) => (i.id === item.id ? { ...item } : i)),
          };
        }
        return { ...s, items: [...s.items, item] };
      })
    );
    setOpen(false);
    setEditingItem(null);
    setEditingSectionId(null);
  };

  const exportCSV = () => {
    const headers = ["AREA", "LINEA", "ITEM", "EQUIPO", "CANTIDAD", "FUNCION"];
    const rows: any[] = [];
    sections.forEach((s) =>
      s.items.forEach((it) =>
        rows.push([
          s.area,
          s.linea,
          it.item,
          it.equipo,
          it.cantidad,
          it.funcion,
        ])
      )
    );
    const csv = [headers, ...rows]
      .map((r: any[]) =>
        r.map((v: any) => '"' + String(v).replace(/"/g, '""') + '"').join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "equipment_inventory.csv";
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
          alert("CSV vacío");
          return;
        }
        const headers = lines[0]
          .split(/,|;|\t/)
          .map((h) => h.replace(/"/g, "").trim().toUpperCase());
        const body = lines.slice(1);
        const imported: InventorySection[] = [];
        body.forEach((ln, idx) => {
          const cols = ln
            .split(/,|;|\t/)
            .map((c) => c.replace(/^"|"$/g, "").trim());
          const map: any = {};
          headers.forEach((h, i) => (map[h] = cols[i] ?? ""));
          const area = map["AREA"] || "SIN AREA";
          const linea = map["LINEA"] || "SIN LINEA";
          const itemNum = Number(map["ITEM"] || idx + 1);
          const equipo = map["EQUIPO"] || "";
          const cantidad = Number(map["CANTIDAD"] || 1);
          const funcion = map["FUNCION"] || "";
          let sec = imported.find((s) => s.area === area && s.linea === linea);
          if (!sec) {
            sec = {
              id: "imp-" + imported.length + "-" + Date.now(),
              area,
              linea,
              items: [],
            };
            imported.push(sec);
          }
          sec.items.push({
            id: Date.now().toString() + "-" + idx,
            item: itemNum,
            equipo,
            cantidad,
            funcion,
          });
        });
        setSections((prev) => [...prev, ...imported]);
        alert(
          `Importadas ${imported.reduce((a, b) => a + b.items.length, 0)} filas`
        );
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

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (i) =>
            i.equipo.toLowerCase().includes(q) ||
            i.funcion.toLowerCase().includes(q)
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [sections, search]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Inventario de Equipos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <p className="text-sm text-gray-600">
                Gestiona el inventario por Área y Línea.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  placeholder="Buscar equipo o función..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-xs"
                />
                <Button variant="outline" onClick={() => setSearch("")}>
                  Limpiar
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* <input
                id={fileInputId}
                <Button onClick={handleAddSectionClick} className="gap-2">Nueva Sección</Button>
              </div>
            </div>
                type="file"
                accept=".csv,text/csv"
                onChange={onFileChange}
                className="hidden"
              /> */}
              {/* <Button onClick={onImportClick} className="gap-2">
                <FilePlus className="h-4 w-4" /> Importar CSV
              </Button>
              <Button onClick={exportCSV} className="gap-2">
                <Download className="h-4 w-4" /> Exportar CSV
              </Button> */}
              <Button
                onClick={() => handleAddItem()}
                className="bg-blue-600 text-white gap-2"
              >
                <Plus className="h-4 w-4 " /> Nuevo Item
              </Button>
            </div>
          </div>

          {filteredSections.map((sec) => (
            <div key={sec.id} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-500">
                    AREA: <strong>{sec.area}</strong>
                  </div>
                  <div className="text-sm text-gray-500">
                    LINEA: <strong>{sec.linea}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleAddItem(sec.id)}
                  >
                    Añadir
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleEditSectionClick(sec)}
                  >
                    Editar Sección
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteSection(sec.id)}
                  >
                    Eliminar Sección
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">ITEM</th>
                      <th className="border px-2 py-1">EQUIPO</th>
                      <th className="border px-2 py-1">CANTIDAD</th>
                      <th className="border px-2 py-1">FUNCIÓN</th>
                      <th className="border px-2 py-1">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sec.items.map((it) => (
                      <tr key={it.id} className="border-b hover:bg-slate-50">
                        <td className="border px-2 py-1 text-center">
                          {it.item}
                        </td>
                        <td className="border px-2 py-1">{it.equipo}</td>
                        <td className="border px-2 py-1 text-center">
                          {it.cantidad}
                        </td>
                        <td className="border px-2 py-1">{it.funcion}</td>
                        <td className="border px-2 py-1 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              onClick={() => handleEditItem(sec.id, it)}
                              className="h-8 px-2"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteItem(sec.id, it.id)}
                              className="h-8 px-2"
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
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setEditingItem(null);
          setEditingSectionId(null);
        }}
      >
        <DialogContent className="!fixed !inset-20 !w-[calc(100vw-160px)] !h-[calc(100vh-160px)] flex flex-col rounded-lg shadow-2xl bg-white">
          <DialogHeader className="px-6 pt-6 pb-2 border-b">
            <DialogTitle className="text-xl font-bold">
              {editingItem?.id ? "Editar" : "Nuevo"} Item
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {editingItem && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>ITEM</Label>
                  <Input
                    value={editingItem.item}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        item: Number(e.target.value),
                      })
                    }
                    className="mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <Label>EQUIPO</Label>
                  <Input
                    value={editingItem.equipo}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, equipo: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>CANTIDAD</Label>
                  <Input
                    type="number"
                    value={editingItem.cantidad}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        cantidad: Number(e.target.value),
                      })
                    }
                    className="mt-2"
                  />
                </div>
                <div className="col-span-2">
                  <Label>FUNCIÓN</Label>
                  <Textarea
                    value={editingItem.funcion}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        funcion: e.target.value,
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
                setEditingItem(null);
                setEditingSectionId(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                editingItem &&
                editingSectionId &&
                saveItem(editingSectionId, editingItem)
              }
              className="bg-blue-600 text-white"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={sectionOpen}
        onOpenChange={() => {
          setSectionOpen(false);
          setEditingSection(null);
          setSectionArea("");
          setSectionLinea("");
        }}
      >
        <DialogContent className="!fixed !inset-20 !w-[calc(100vw-160px)] !h-[calc(100vh-160px)] flex flex-col rounded-lg shadow-2xl bg-white">
          <DialogHeader className="px-6 pt-6 pb-2 border-b">
            <DialogTitle className="text-xl font-bold">
              {editingSection ? "Editar Sección" : "Nueva Sección"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>AREA</Label>
                <Input
                  value={sectionArea}
                  onChange={(e) => setSectionArea(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>LINEA</Label>
                <Input
                  value={sectionLinea}
                  onChange={(e) => setSectionLinea(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-3 justify-end px-6 py-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setSectionOpen(false);
                setEditingSection(null);
                setSectionArea("");
                setSectionLinea("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => saveSection()}
              className="bg-blue-600 text-white"
            >
              Guardar Sección
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
