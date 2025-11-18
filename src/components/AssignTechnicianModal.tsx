import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface AssignTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (technician: string) => void;
  initial?: string;
}

export function AssignTechnicianModal({
  isOpen,
  onClose,
  onAssign,
  initial = "",
}: AssignTechnicianModalProps) {
  const [name, setName] = useState(initial);

  const submit = () => {
    if (name.trim() === "") return;
    onAssign(name.trim());
    setName("");
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
            <Input value={name} onChange={(e) => setName(e.target.value)} />
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
