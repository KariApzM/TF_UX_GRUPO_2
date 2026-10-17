import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Plus,
  Download,
  ArrowRight,
  Truck,
  Package,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useData, stores } from "../app/AppDataProvider";
import type { Order, OrderStatus, OrderPriority } from "../types";
import {
  Button,
  PageHeading,
  Panel,
  SearchInput,
  Badge,
  Pagination,
  EmptyState,
  Modal,
} from "../components/ui";
import { total, money, downloadCSV } from "../utils/format";
import { SalesChart, OrdersChart } from "../components/dashboard/Charts";
export const statuses: OrderStatus[] = [
  "Pendiente",
  "En preparación",
  "En ruta",
  "Entregado",
  "Cancelado",
];
export default function OrdersPage() {
  const { state, dispatch, notify } = useData();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") || "");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [origin, setOrigin] = useState("");
  const [page, setPage] = useState(1);
  const [create, setCreate] = useState(false);
  const [productId, setProductId] = useState("p1");
  const [quantity, setQuantity] = useState(1);
  const [newPriority, setNewPriority] = useState<OrderPriority>("Normal");
  const [destination, setDestination] = useState(state.storeId);
  const [notes, setNotes] = useState("");
  const filtered = state.orders.filter(
    (o) =>
      `${o.id} ${o.origin} ${o.destination}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!status || o.status === status) &&
      (!priority || o.priority === priority) &&
      (!origin || o.origin.includes(origin)),
  );
  const current = Math.min(page, Math.max(1, Math.ceil(filtered.length / 6)));
  const rows = filtered.slice((current - 1) * 6, current * 6);
  return (
    <>
      <PageHeading
        eyebrow="LOGÍSTICA Y ABASTECIMIENTO / CONTROL DE ÓRDENES"
        title="Gestión de Pedidos"
        description="Reabastecimiento, ventas y transferencias de la red Mass."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                downloadCSV("pedidos-mass", [
                  [
                    "Pedido",
                    "Origen",
                    "Destino",
                    "Estado",
                    "Prioridad",
                    "Total",
                  ],
                  ...filtered.map((o) => [
                    o.id,
                    o.origin,
                    o.destination,
                    o.status,
                    o.priority,
                    total(o),
                  ]),
                ]);
                notify("Pedidos exportados");
              }}
            >
              <Download size={17} />
              Exportar
            </Button>
            <Button onClick={() => setCreate(true)}>
              <Plus size={18} />
              Crear pedido
            </Button>
          </>
        }
      />
      <div className="kpi-grid compact-kpis">
        {[
          {
            name: "Total de pedidos",
            value: state.orders.length,
            icon: Package,
            color: "blue",
          },
          {
            name: "En preparación",
            value: state.orders.filter((o) => o.status === "En preparación")
              .length,
            icon: Clock,
            color: "gold",
          },
          {
            name: "En ruta",
            value: state.orders.filter((o) => o.status === "En ruta").length,
            icon: Truck,
            color: "blue",
          },
          {
            name: "Entregados",
            value: state.orders.filter((o) => o.status === "Entregado").length,
            icon: CheckCircle2,
            color: "green",
          },
        ].map((k) => (
          <div className={`kpi-card ${k.color}`} key={k.name}>
            <div className="kpi-top">
              {k.name}
              <k.icon size={20} />
            </div>
            <div className="kpi-value">
              {k.value}
              <small>pedidos</small>
            </div>
          </div>
        ))}
      </div>
      <div className="charts-grid orders-charts">
        <Panel
          title="Volumen Semanal Despachado"
          subtitle="Evolución del flujo de pedidos · semana 43"
        >
          <SalesChart />
        </Panel>
        <Panel
          title="Distribución de Estados"
          subtitle="Resumen ilustrativo de la operación"
        >
          <OrdersChart />
        </Panel>
      </div>
      <Panel>
        <div className="tabs">
          {["", ...statuses].map((s) => (
            <button
              key={s}
              className={status === s ? "active" : ""}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
            >
              {s || "Todos"}
              <span>
                {state.orders.filter((o) => !s || o.status === s).length}
              </span>
            </button>
          ))}
        </div>
        <div className="filters">
          <SearchInput
            placeholder="Buscar pedido, origen o destino…"
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
          />
          <select
            aria-label="Prioridad"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">Todas las prioridades</option>
            <option>Alta</option>
            <option>Normal</option>
            <option>Baja</option>
          </select>
          <select
            aria-label="Origen"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          >
            <option value="">Todos los orígenes</option>
            <option value="CEDI">CEDI Lurín</option>
            <option value="App">App Mass Ya!</option>
            <option value="Caja">Caja presencial</option>
          </select>
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setStatus("");
              setPriority("");
              setOrigin("");
            }}
          >
            Limpiar filtros
          </Button>
        </div>
        <div className="desktop-table">
          <table>
            <thead>
              <tr>
                <th>Pedido / Fecha</th>
                <th>Origen / Destino</th>
                <th>Productos</th>
                <th>Prioridad</th>
                <th>Importe total</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link className="order-id" to={`/pedidos/${o.id}`}>
                      #{o.id}
                    </Link>
                    <small>
                      {o.date} · {o.time}
                    </small>
                  </td>
                  <td>
                    <strong>{o.origin}</strong>
                    <small>{o.destination}</small>
                  </td>
                  <td>
                    {o.items.length} SKUs
                    <small>
                      {o.items.reduce((sum, i) => sum + i.quantity, 0)} unidades
                    </small>
                  </td>
                  <td>
                    <Badge tone={o.priority === "Alta" ? "danger" : "neutral"}>
                      {o.priority}
                    </Badge>
                  </td>
                  <td>
                    <b>{money(total(o))}</b>
                  </td>
                  <td>
                    <Badge>{o.status}</Badge>
                  </td>
                  <td>
                    <Link
                      className="icon-button"
                      aria-label={`Ver ${o.id}`}
                      to={`/pedidos/${o.id}`}
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mobile-product-list">
          {rows.map((o) => (
            <Link className="order-card" to={`/pedidos/${o.id}`} key={o.id}>
              <div className="order-card-head">
                <strong>#{o.id}</strong>
                <Badge>{o.status}</Badge>
              </div>
              <small>
                {o.date} · {o.time}
              </small>
              <div className="order-route">
                <span>
                  <i />
                  {o.origin}
                </span>
                <span>
                  <i />
                  {o.destination}
                </span>
              </div>
              <div className="order-card-foot">
                <span>
                  {o.items.length} SKUs{" "}
                  <Badge tone={o.priority === "Alta" ? "danger" : "neutral"}>
                    {o.priority}
                  </Badge>
                </span>
                <strong>
                  {money(total(o))} <ArrowRight size={16} />
                </strong>
              </div>
            </Link>
          ))}
        </div>
        {!rows.length && <EmptyState />}
        <Pagination
          page={current}
          count={filtered.length}
          pageSize={6}
          onChange={setPage}
        />
      </Panel>
      {create && (
        <Modal
          title="Crear pedido de reposición"
          onClose={() => setCreate(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const p = state.products.find((p) => p.id === productId)!;
              const store = stores.find((s) => s.id === destination)!;
              const order: Order = {
                id: `PED-DEMO-${Date.now().toString().slice(-6)}`,
                date: "24 Oct 2024",
                time: new Date().toLocaleTimeString("es-PE", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                origin: "CEDI Lurín · Bahía 4",
                destination: `Mass #${store.id} · ${store.name}`,
                storeId: store.id,
                status: "Pendiente",
                priority: newPriority,
                items: [{ productId: p.id, quantity, unitPrice: p.massPrice }],
                notes,
                driver: "Por asignar",
                vehicle: "Por asignar",
                eta: "Por confirmar",
              };
              dispatch({ type: "ORDER", order });
              setCreate(false);
              notify("Pedido creado correctamente");
            }}
          >
            <label>
              Producto
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {state.products.map((p) => (
                  <option value={p.id} key={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-grid">
              <label>
                Cantidad
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </label>
              <label>
                Prioridad
                <select
                  value={newPriority}
                  onChange={(e) =>
                    setNewPriority(e.target.value as OrderPriority)
                  }
                >
                  <option>Normal</option>
                  <option>Alta</option>
                  <option>Baja</option>
                </select>
              </label>
            </div>
            <label>
              Tienda destino
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.id} {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Observaciones
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <div className="modal-total">
              Total estimado{" "}
              <strong>
                {money(
                  quantity *
                    state.products.find((p) => p.id === productId)!.massPrice,
                )}
              </strong>
            </div>
            <div className="modal-actions">
              <Button type="submit">Crear pedido</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
