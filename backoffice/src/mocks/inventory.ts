import type { InventoryItem, InventoryMovement } from "../types";
export const inventory: InventoryItem[] = [
  420, 8, 650, 110, 240, 4, 890, 24, 0,
].map((stock, i) => ({
  productId: `p${i + 1}`,
  stock,
  reserved: i === 0 ? 30 : 0,
  min: [80, 50, 120, 40, 30, 20, 100, 50, 100][i],
  max: [600, 500, 900, 300, 500, 200, 1200, 400, 400][i],
  location: `Pasillo ${String((i % 5) + 1).padStart(2, "0")} · Góndola ${"ABC"[i % 3]}`,
}));
export const movements: InventoryMovement[] = [
  {
    id: "m1",
    productId: "p1",
    type: "Ingreso CEDI",
    quantity: 850,
    time: "13:14",
    note: "CEDI Lurín · Guía #GR-9821",
  },
  {
    id: "m2",
    productId: "p2",
    type: "Venta POS",
    quantity: -12,
    time: "12:45",
    note: "Cajas 01, 02 y 03 consolidadas",
  },
  {
    id: "m3",
    productId: "p4",
    type: "Reposición",
    quantity: 48,
    time: "09:30",
    note: "Almacén Buffer → Pasillo 05",
  },
];
