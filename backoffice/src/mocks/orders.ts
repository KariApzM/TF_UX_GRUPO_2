import type { Order } from "../types";
export const stores = [
  {
    id: "412",
    name: "Próceres, SJL",
    address: "Av. Próceres de la Independencia 102, SJL",
  },
  {
    id: "104",
    name: "Canto Grande, SJL",
    address: "Av. Canto Grande 410, SJL",
  },
  {
    id: "218",
    name: "Av. Perú, SMP",
    address: "Av. Perú 218, San Martín de Porres",
  },
];
export const orders: Order[] = [
  {
    id: "PED-2024-8921",
    date: "24 Oct 2024",
    time: "08:30",
    origin: "CEDI Lurín · Bahía 4",
    destination: "Mass #412 · Próceres, SJL",
    storeId: "412",
    status: "En ruta",
    priority: "Alta",
    items: [
      { productId: "p1", quantity: 300, unitPrice: 18.9 },
      { productId: "p2", quantity: 480, unitPrice: 6.5 },
      { productId: "p4", quantity: 100, unitPrice: 23.9 },
      { productId: "p8", quantity: 600, unitPrice: 3.2 },
      { productId: "p3", quantity: 960, unitPrice: 3.6 },
    ],
    notes:
      "Verificar integridad del precinto #SL-9942 antes de abrir la compuerta. Descarga programada en rampa 1.",
    driver: "Jorge Valenzuela Rojas",
    vehicle: "Isuzu Forward 12T · B8F-912",
    eta: "14:25",
  },
  ...(
    [
      "Entregado",
      "En preparación",
      "Pendiente",
      "Entregado",
      "En ruta",
      "Pendiente",
    ] as const
  ).map((status, i) => ({
    id: `PED-${9482 - i}`,
    date: "24 Oct 2024",
    time: `${14 - Math.floor(i / 3)}:${String(28 - i * 3).padStart(2, "0")}`,
    origin: ["Caja 02 · Presencial", "App Mass Ya!", "CEDI Lurín"][i % 3],
    destination: "Mass #412 · Próceres, SJL",
    storeId: "412",
    status,
    priority: i === 2 ? ("Alta" as const) : ("Normal" as const),
    items: [
      {
        productId: `p${i + 1}`,
        quantity: (i + 1) * 4,
        unitPrice: [18.9, 6.5, 3.6, 23.9, 2.5, 13.9][i],
      },
    ],
    notes: "Reposición de surtido de alta rotación.",
    driver: "Jorge Valenzuela Rojas",
    vehicle: "Isuzu Forward 12T · B8F-912",
    eta: "14:25",
  })),
];
