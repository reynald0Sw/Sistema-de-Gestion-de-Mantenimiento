import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";

interface AssignTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (technician: string) => void;
  initial?: string;
  options?: string[];
}

export function AssignTechnicianModal({
  isOpen,
  onClose,
  onAssign,
  initial = "",
  options,
}: AssignTechnicianModalProps) {
  const [name, setName] = useState(initial);
  const [selected, setSelected] = useState<string>(
    initial && options && options.includes(initial) ? initial : ""
  );
  const [otherValue, setOtherValue] = useState("");

  useEffect(() => {
    setName(initial || "");
    setSelected(initial && options && options.includes(initial) ? initial : "");
    setOtherValue("");
  }, [initial, isOpen, options]);

  const submit = () => {
    let final = name;
    if (options && selected) final = selected;
    if (selected === "other") final = otherValue;
    if (!final || final.trim() === "") return;
    onAssign(final.trim());
    setName("");
    setSelected("");
    setOtherValue("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar técnico</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Nombre del técnico</label>
            {options && options.length ? (
              <div className="space-y-2">
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-full text-sm border rounded px-2 py-1"
                >
                  <option value="">-- Seleccione --</option>
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                  <option value="other">Otro...</option>
                </select>
                {selected === "other" && (
                  <Input
                    value={otherValue}
                    onChange={(e) => setOtherValue(e.target.value)}
                    placeholder="Nombre del técnico"
                  />
                )}
              </div>
            ) : (
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={submit}>Asignar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
