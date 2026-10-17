import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Truck,
  Printer,
  Pencil,
  XCircle,
  Warehouse,
  Store,
  User,
  CalendarDays,
  FileText,
  Download,
  Plus,
  Route,
  ShieldCheck,
} from "lucide-react";
import { useData } from "../app/AppDataProvider";
import type { OrderStatus, OrderPriority } from "../types";
import {
  Button,
  PageHeading,
  Panel,
  Badge,
  ProductImage,
  EmptyState,
  ConfirmDialog,
  Modal,
} from "../components/ui";
import { money, total, downloadCSV } from "../utils/format";
import OrderTimeline from "../components/orders/OrderTimeline";
import { statuses } from "./OrdersPage";
export default function OrderDetailPage() {
  const { orderId } = useParams();
  const { state, dispatch, notify } = useData();
  const order = state.orders.find((o) => o.id === orderId);
  const [cancel, setCancel] = useState(false);
  const [edit, setEdit] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<OrderStatus>(
    order?.status || "Pendiente",
  );
  const [priority, setPriority] = useState<OrderPriority>(
    order?.priority || "Normal",
  );
  if (!order)
    return (
      <>
        <Link className="breadcrumb" to="/pedidos">
          <ArrowLeft size={16} />
          Volver a pedidos
        </Link>
        <EmptyState title="Pedido no encontrado" />
      </>
    );
  const amount = total(order);
  return (
    <>
      <Link className="breadcrumb" to="/pedidos">
        <ArrowLeft size={15} />
        Pedidos / Órdenes de reposición / {order.id}
      </Link>
      <PageHeading
        title={`Pedido #${order.id}`}
        description="Orden de reabastecimiento · Surtido de alta rotación"
        actions={
          <>
            <Button
              variant="secondary"
              disabled={order.status === "Cancelado"}
              onClick={() => {
                setStatus(order.status);
                setPriority(order.priority);
                setEdit(true);
              }}
            >
              <Pencil size={16} />
              Editar pedido
            </Button>
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer size={17} />
              Imprimir guía
            </Button>
            <Button
              variant="danger"
              disabled={order.status === "Cancelado"}
              onClick={() => setCancel(true)}
            >
              <XCircle size={17} />
              Cancelar pedido
            </Button>
          </>
        }
      />
      <div className="order-status-line">
        <Badge>{order.status}</Badge>
        <Badge tone={order.priority === "Alta" ? "danger" : "neutral"}>
          Prioridad {order.priority}
        </Badge>
        <span className="muted">ID interno: SPSA-LOG-9021-X</span>
      </div>
      <div
        className={`transit-banner ${order.status === "Cancelado" ? "cancelled-banner" : ""}`}
      >
        <Truck size={28} />
        <div>
          <strong>
            {order.status === "Cancelado"
              ? "Pedido cancelado"
              : order.status === "Entregado"
                ? "Entrega completada"
                : order.status === "En ruta"
                  ? `Unidad en tránsito · Llegada estimada ${order.eta} hrs`
                  : `${order.status} · Pendiente de despacho`}
          </strong>
          <p>
            {order.status === "Cancelado"
              ? "La orden ha sido cancelada durante esta sesión."
              : "Ruta CEDI Lurín → Tienda Mass · Precinto #SL-9942 · Carga seca"}
          </p>
        </div>
        <Link
          className="btn btn-secondary"
          to={`/pedidos/${order.id}/seguimiento`}
        >
          <Route size={17} />
          Ver seguimiento
        </Link>
      </div>
      <div className="detail-columns">
        <div className="detail-main">
          <Panel title="Información General del Pedido">
            <div className="order-info-grid">
              {[
                [
                  CalendarDays,
                  "Fecha de emisión",
                  `${order.date} · ${order.time}`,
                  "Turno Apertura (AM)",
                ],
                [
                  Warehouse,
                  "Almacén de origen",
                  order.origin,
                  "Km 38.5 Panamericana Sur",
                ],
                [
                  Store,
                  "Tienda destino",
                  order.destination,
                  "Av. Próceres de la Independencia",
                ],
                [
                  Truck,
                  "Transportista",
                  "Flota InRetail Logistics",
                  order.vehicle,
                ],
                [
                  User,
                  "Conductor",
                  order.driver,
                  "Brevete A-IIIc · Operador habilitado",
                ],
                [
                  ShieldCheck,
                  "Tipo de orden",
                  "Reabastecimiento Hard Discount",
                  "Surtido de alta rotación",
                ],
              ].map(([Icon, label, value, sub]) => {
                const I = Icon as typeof Truck;
                return (
                  <div key={String(label)}>
                    <I size={19} />
                    <div>
                      <small>{String(label)}</small>
                      <strong>{String(value)}</strong>
                      <small>{String(sub)}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
          <Panel
            title="Productos Solicitados"
            subtitle={`${order.items.length} líneas de SKU consolidadas · Precios incluyen IGV`}
          >
            <div className="desktop-table">
              <table>
                <thead>
                  <tr>
                    <th>Producto y SKU</th>
                    <th>Cantidad</th>
                    <th>Precio unit. Mass</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => {
                    const p = state.products.find(
                      (p) => p.id === item.productId,
                    )!;
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="product-cell">
                            <ProductImage src={p.image} name={p.name} />
                            <div>
                              <Link to={`/catalogo/${p.id}/editar`}>
                                {p.name}
                              </Link>
                              <small>{p.sku}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <b>{item.quantity}</b> und
                        </td>
                        <td>{money(item.unitPrice)}</td>
                        <td>
                          <b>{money(item.quantity * item.unitPrice)}</b>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mobile-product-list">
              {order.items.map((item) => {
                const p = state.products.find((p) => p.id === item.productId)!;
                return (
                  <div className="product-card" key={p.id}>
                    <div className="product-card-top">
                      <ProductImage src={p.image} name={p.name} />
                      <div>
                        <h3>{p.name}</h3>
                        <small>{p.sku}</small>
                      </div>
                    </div>
                    <div className="product-card-bottom">
                      <span>
                        {item.quantity} und × {money(item.unitPrice)}
                      </span>
                      <b>{money(item.quantity * item.unitPrice)}</b>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="panel-footnote">
              Total:{" "}
              {order.items
                .reduce((s, i) => s + i.quantity, 0)
                .toLocaleString("es-PE")}{" "}
              unidades · Auditoría de picking completada
            </div>
          </Panel>
          <Panel
            title="Observaciones e Incidencias"
            action={
              <Button variant="ghost" onClick={() => setNoteOpen(true)}>
                <Plus size={16} />
                Añadir nota
              </Button>
            }
          >
            <div className="observation">
              <ShieldCheck size={23} />
              <div>
                <strong>Instrucción de CEDI Lurín</strong>
                <p className="pre-line">
                  {order.notes || "Sin observaciones registradas."}
                </p>
                <small>
                  Pallets retractilados · Validar precinto antes de descarga
                </small>
              </div>
            </div>
          </Panel>
        </div>
        <aside className="detail-aside">
          <Panel title="Resumen de Importes">
            <div className="amount-lines">
              <div>
                Subtotal sin IGV <b>{money(amount / 1.18)}</b>
              </div>
              <div>
                IGV (18%)<b>{money(amount - amount / 1.18)}</b>
              </div>
              <div>
                Costo logístico <b className="green-text">S/ 0.00</b>
              </div>
            </div>
            <div className="total-box">
              <span>Total general liquidado</span>
              <strong>{money(amount)}</strong>
              <small>Precio Mass Retail · Soles (PEN)</small>
            </div>
            <div className="load-info">
              <div>
                <small>Volumen carga</small>
                <b>185 bultos</b>
              </div>
              <div>
                <small>Peso báscula</small>
                <b>3,240 kg</b>
              </div>
            </div>
          </Panel>
          <Panel title="Seguimiento de Reposición" action={<Route size={18} />}>
            <OrderTimeline order={order} />
            <Link
              className="panel-link"
              to={`/pedidos/${order.id}/seguimiento`}
            >
              Ver seguimiento completo →
            </Link>
          </Panel>
          <Panel title="Documentos Adjuntos">
            <div className="documents-list">
              {[
                "Guía de remisión",
                "Manifiesto de carga",
                "Acta de control de calidad",
              ].map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    downloadCSV(name, [
                      ["Documento", "Pedido", "Estado"],
                      [name, order.id, "Documento mock académico"],
                    ]);
                    notify("Documento mock descargado en CSV");
                  }}
                >
                  <FileText size={20} />
                  <span>
                    {name}
                    <small>Documento de demostración · CSV</small>
                  </span>
                  <Download size={16} />
                </button>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
      {cancel && (
        <ConfirmDialog
          title="¿Cancelar este pedido?"
          description={`El pedido ${order.id} cambiará a Cancelado. El cambio se reflejará en el listado durante esta sesión.`}
          onClose={() => setCancel(false)}
          onConfirm={() => {
            dispatch({
              type: "ORDER",
              order: { ...order, status: "Cancelado" },
            });
            setCancel(false);
            notify("Pedido cancelado");
          }}
        />
      )}
      {edit && (
        <Modal title="Editar pedido" onClose={() => setEdit(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({
                type: "ORDER",
                order: { ...order, status, priority },
              });
              setEdit(false);
              notify("Pedido actualizado correctamente");
            }}
          >
            <label>
              Estado
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
              >
                {statuses
                  .filter((s) => s !== "Cancelado")
                  .map((s) => (
                    <option key={s}>{s}</option>
                  ))}
              </select>
            </label>
            <label>
              Prioridad
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as OrderPriority)}
              >
                <option>Alta</option>
                <option>Normal</option>
                <option>Baja</option>
              </select>
            </label>
            <div className="modal-actions">
              <Button type="submit">Guardar cambios</Button>
            </div>
          </form>
        </Modal>
      )}
      {noteOpen && (
        <Modal
          title="Añadir nota de descarga"
          onClose={() => setNoteOpen(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({
                type: "ORDER",
                order: { ...order, notes: order.notes + "\n" + note },
              });
              setNoteOpen(false);
              setNote("");
              notify("Nota añadida al pedido");
            }}
          >
            <label>
              Observación
              <textarea
                required
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
            <div className="modal-actions">
              <Button type="submit">Guardar nota</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
