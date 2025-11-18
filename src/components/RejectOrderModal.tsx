import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

interface RejectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}

export function RejectOrderModal({
  isOpen,
  onClose,
  onReject,
}: RejectOrderModalProps) {
  const [reason, setReason] = useState("");

  const submit = () => {
    if (reason.trim() === "") return;
    onReject(reason.trim());
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rechazar orden</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Motivo del rechazo</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={submit} className="bg-red-600 text-white">
              Rechazar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
