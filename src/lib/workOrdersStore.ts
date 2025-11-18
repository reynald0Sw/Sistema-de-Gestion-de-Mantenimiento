const STORAGE_KEY = "work_orders_v1";

export type WO = any;

export function getWorkOrders(): WO[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WO[];
  } catch (e) {
    console.error("workOrdersStore: failed to read", e);
    return [];
  }
}

export function setWorkOrders(orders: WO[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    // notify
    window.dispatchEvent(new CustomEvent("workorders:updated", { detail: orders }));
  } catch (e) {
    console.error("workOrdersStore: failed to write", e);
  }
}

export function updateOrder(id: string, patch: Partial<WO>, actor?: string, note?: string) {
  const orders = getWorkOrders();
  const idx = orders.findIndex((o: any) => o.id === id);
  if (idx === -1) return null;
  const existing = orders[idx];
  const updated = { ...existing, ...patch };
  // add history
  const hist = existing.statusHistory ? [...existing.statusHistory] : [];
  if (patch.status) {
    hist.push({ status: patch.status, by: actor || "system", at: new Date().toISOString(), note: note || "" });
    updated.statusHistory = hist;
  }
  orders[idx] = updated;
  setWorkOrders(orders);
  return updated;
}

export function subscribe(cb: (e?: any) => void) {
  const handler = (e: any) => cb(e.detail);
  window.addEventListener("workorders:updated", handler as EventListener);
  return () => window.removeEventListener("workorders:updated", handler as EventListener);
}
