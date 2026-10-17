import type { InventoryItem, Order } from "../types";
export const money = (value: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    value,
  );
export const total = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
export const stockStatus = (i: InventoryItem) =>
  i.stock === 0
    ? "Agotado"
    : i.stock < i.min
      ? "Por reponer"
      : i.stock > i.max
        ? "Sobre-stock"
        : "Óptimo";
export function downloadCSV(name: string, rows: (string | number)[][]) {
  const escape = (v: string | number) => `"${String(v).replaceAll('"', '""')}"`;
  const url = URL.createObjectURL(
    new Blob(
      ["\uFEFF" + rows.map((r) => r.map(escape).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8" },
    ),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name + ".csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
