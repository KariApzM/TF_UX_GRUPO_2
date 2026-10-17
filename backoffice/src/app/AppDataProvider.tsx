import {
  createContext,
  useContext,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type {
  Product,
  InventoryItem,
  InventoryMovement,
  Order,
  User,
  Notification,
  TrackingEvent,
  Price,
} from "../types";
import { products } from "../mocks/products";
import { inventory, movements } from "../mocks/inventory";
import { orders, stores } from "../mocks/orders";
import { tracking } from "../mocks/tracking";
import { prices } from "../mocks/prices";
interface State {
  user: User | null;
  storeId: string;
  products: Product[];
  inventory: InventoryItem[];
  movements: InventoryMovement[];
  orders: Order[];
  tracking: TrackingEvent[];
  prices: Price[];
  notifications: Notification[];
}
type Action =
  | { type: "LOGIN"; email: string }
  | { type: "LOGOUT" }
  | { type: "STORE"; id: string }
  | { type: "PRODUCT"; product: Product; inventory: InventoryItem }
  | { type: "STOCK"; productId: string; stock: number; note: string }
  | { type: "ORDER"; order: Order }
  | { type: "READ_NOTIFICATIONS" }
  | { type: "INCIDENT"; event: TrackingEvent };
const initial: State = {
  user: null,
  storeId: "412",
  products,
  inventory,
  movements,
  orders,
  tracking,
  prices,
  notifications: [
    {
      id: "n1",
      title: "Aceite Mass 900ml por debajo del stock mínimo",
      read: false,
    },
    { id: "n2", title: "Pedido PED-2024-8921 en ruta a tienda", read: false },
    { id: "n3", title: "Nuevo reporte de ventas disponible", read: false },
  ],
};
export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "LOGIN":
      return {
        ...s,
        user: {
          name: "Carlos Quispe M.",
          email: a.email,
          role: "Jefe de Operaciones",
        },
      };
    case "LOGOUT":
      return { ...s, user: null };
    case "STORE":
      return { ...s, storeId: a.id };
    case "PRODUCT":
      return {
        ...s,
        products: s.products.some((p) => p.id === a.product.id)
          ? s.products.map((p) => (p.id === a.product.id ? a.product : p))
          : [a.product, ...s.products],
        inventory: s.inventory.some((i) => i.productId === a.product.id)
          ? s.inventory.map((i) =>
              i.productId === a.product.id ? a.inventory : i,
            )
          : [a.inventory, ...s.inventory],
        prices: [
          ...s.prices.filter((p) => p.productId !== a.product.id),
          {
            productId: a.product.id,
            regularPrice: a.product.regularPrice,
            massPrice: a.product.massPrice,
          },
        ],
      };
    case "STOCK": {
      const before =
        s.inventory.find((i) => i.productId === a.productId)?.stock || 0;
      return {
        ...s,
        inventory: s.inventory.map((i) =>
          i.productId === a.productId ? { ...i, stock: a.stock } : i,
        ),
        movements: [
          {
            id: crypto.randomUUID(),
            productId: a.productId,
            type: "Ajuste de stock",
            quantity: a.stock - before,
            time: new Date().toLocaleTimeString("es-PE", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            note: a.note,
          },
          ...s.movements,
        ],
      };
    }
    case "ORDER":
      return {
        ...s,
        orders: s.orders.some((o) => o.id === a.order.id)
          ? s.orders.map((o) => (o.id === a.order.id ? a.order : o))
          : [a.order, ...s.orders],
      };
    case "INCIDENT":
      return { ...s, tracking: [a.event, ...s.tracking] };
    case "READ_NOTIFICATIONS":
      return {
        ...s,
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      };
  }
}
const Context = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  notify: (message: string) => void;
} | null>(null);
export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null,
  );
  function notify(message: string) {
    const id = Date.now();
    setToast({ id, message });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 4000);
  }
  return (
    <Context.Provider value={{ state, dispatch, notify }}>
      {children}
      {toast && (
        <div className="toast" role="status">
          <span className="toast-check">✓</span>
          {toast.message}
          <button aria-label="Cerrar mensaje" onClick={() => setToast(null)}>
            ×
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export function useData() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("AppDataProvider requerido");
  return ctx;
}
export { stores };
