import type { TrackingEvent } from "../types";
import { orders } from "./orders";
export const tracking: TrackingEvent[] = orders.flatMap((o) =>
  [
    "Pedido creado",
    "Aprobado por Planificación",
    "Picking y paletizado CEDI",
    "Despachado en camión",
    "En ruta a tienda",
    "Recepción en tienda",
  ].map((title, i) => ({
    id: `${o.id}-t${i}`,
    orderId: o.id,
    title,
    time: ["08:30", "09:15", "11:20", "12:45", "En progreso", "14:25"][i],
    description: [
      "Generación de orden de reposición",
      "Validado por Control de Inventarios",
      "Mercadería preparada y flejada",
      "Precinto #SL-9942 verificado",
      "Vía de Evitamiento · 48 km/h",
      "Conformidad física y validación de inventario",
    ][i],
    status:
      o.status === "Entregado"
        ? "Completado"
        : i < 4
          ? "Completado"
          : i === 4
            ? "Actual"
            : "Pendiente",
  })),
);
