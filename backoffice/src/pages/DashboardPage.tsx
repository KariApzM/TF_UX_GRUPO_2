import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Package,
  TriangleAlert,
  Truck,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  Zap,
  Clock,
} from "lucide-react";
import { useData, stores } from "../app/AppDataProvider";
import {
  Button,
  PageHeading,
  Panel,
  Badge,
  ProductImage,
} from "../components/ui";
import { SalesChart, OrdersChart } from "../components/dashboard/Charts";
import { money, total, downloadCSV } from "../utils/format";
export default function DashboardPage() {
  const { state, notify } = useData();
  const [range, setRange] = useState("Hoy");
  const critical = state.inventory.filter((i) => i.stock < i.min);
  const store = stores.find((s) => s.id === state.storeId)!;
  const active = state.orders.filter(
    (o) => !["Entregado", "Cancelado"].includes(o.status),
  );
  const delivered = state.orders.filter((o) => o.status === "Entregado");
  function report() {
    downloadCSV("reporte-ejecutivo", [
      ["Indicador", "Valor", "Periodo"],
      ["Productos activos", state.products.length, range],
      ["Stock crítico", critical.length, range],
      ["Pedidos en proceso", active.length, range],
      ["Entregados", delivered.length, range],
    ]);
    notify("Reporte generado");
  }
  return (
    <>
      <PageHeading
        eyebrow="HARD DISCOUNT RETAIL OPS · TURNO MAÑANA: 07:00–15:30"
        title="Dashboard Operativo"
        description={`Monitoreo de operaciones — Tienda Mass #${store.id} ${store.name} | 24 de octubre de 2024`}
      />
      <div className="dashboard-toolbar">
        <div className="segmented">
          {["Hoy", "7 días", "Mes"].map((r) => (
            <button
              key={r}
              className={range === r ? "selected" : ""}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <span className="date-chip">
            <CalendarDays size={16} />
            24 Oct 2024{range !== "Hoy" && ` · ${range}`}
          </span>
          <Button variant="secondary" onClick={report}>
            <Download size={16} />
            <span>Descargar reporte</span>
          </Button>
        </div>
      </div>
      <div className="kpi-grid">
        {[
          {
            label: "Productos activos",
            value: state.products.filter((p) => p.status === "Activo").length,
            unit: "SKUs",
            note: "+4.2% sem. anterior",
            icon: Package,
            color: "blue",
            tag: "Surtido activo",
          },
          {
            label: "Stock crítico",
            value: critical.length,
            unit: "SKUs en riesgo",
            note: "Requieren reposición",
            icon: TriangleAlert,
            color: "red",
            tag: "Atención urgente",
          },
          {
            label: "Pedidos en proceso",
            value: active.length,
            unit: "pedidos activos",
            note: `Valor: ${money(active.reduce((s, o) => s + total(o), 0))}`,
            icon: Truck,
            color: "gold",
            tag: "En preparación",
          },
          {
            label: "Pedidos entregados",
            value: delivered.length,
            unit: "despachos hoy",
            note: "98.4% SLA a tiempo",
            icon: CheckCircle2,
            color: "green",
            tag: "Meta cumplida",
          },
        ].map((k) => (
          <div className={`kpi-card ${k.color}`} key={k.label}>
            <div className="kpi-top">
              <span>{k.label}</span>
              <div className="kpi-icon">
                <k.icon size={21} />
              </div>
            </div>
            <div className="kpi-value">
              {range === "Hoy" ? k.value : k.value * (range === "Mes" ? 12 : 4)}
              <small>{k.unit}</small>
            </div>
            <div className="kpi-footer">
              <span>
                {k.color === "red" ? (
                  <TriangleAlert size={13} />
                ) : (
                  <TrendingUp size={13} />
                )}{" "}
                {k.note}
              </span>
            </div>
            <span className="kpi-tag">{k.tag}</span>
          </div>
        ))}
      </div>
      <div className="charts-grid">
        <Panel
          title="Ventas y Pedidos Semanales"
          subtitle="Comparativo de ingresos brutos y volumen de tickets despachados"
          action={
            <span className="chart-tag">
              +8.6% <TrendingUp size={13} />
            </span>
          }
        >
          <SalesChart range={range} />
          <div className="chart-note">
            <Zap size={15} />
            <span>
              Pico de demanda a las <b>11:45 AM</b> con 78 canastas simultáneas.
            </span>
            <strong>Ticket prom. S/ 48.60</strong>
          </div>
        </Panel>
        <Panel
          title="Estado de Pedidos"
          subtitle="Distribución de solicitudes registradas hoy"
          action={<span className="muted">•••</span>}
        >
          <OrdersChart />
        </Panel>
      </div>
      <div className="dashboard-lower">
        <Panel
          title="Stock Crítico en Góndola"
          subtitle="Productos por debajo del punto de reorden mínimo"
          action={
            <Link className="text-link" to="/inventario">
              Ver todos <ArrowRight size={15} />
            </Link>
          }
        >
          <div className="critical-list">
            {critical.slice(0, 4).map((i) => {
              const p = state.products.find((p) => p.id === i.productId)!;
              return (
                <div className="critical-row" key={p.id}>
                  <ProductImage src={p.image} name={p.name} />
                  <div className="product-text">
                    <Link to={`/catalogo/${p.id}/editar`}>{p.name}</Link>
                    <small>{p.sku}</small>
                  </div>
                  <div className="stock-critical">
                    <strong>
                      {i.stock}
                      <small> / mín. {i.min}</small>
                    </strong>
                    <span>
                      <i
                        style={{
                          width: Math.max(5, (i.stock / i.min) * 100) + "%",
                        }}
                      />
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      notify(`Reposición de ${p.name} solicitada a CEDI`)
                    }
                  >
                    Reponer <ArrowUpRight size={14} />
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="panel-footnote">
            <Clock size={14} />
            Transferencias sugeridas desde CEDI Lurín listas para aprobación.
          </div>
        </Panel>
        <Panel
          title="Pedidos Recientes"
          subtitle="Últimos movimientos de caja y despacho"
          action={
            <Link className="text-link" to="/pedidos">
              Ir al módulo <ArrowRight size={15} />
            </Link>
          }
        >
          <div className="recent-orders">
            {state.orders.slice(0, 4).map((o) => (
              <Link key={o.id} to={`/pedidos/${o.id}`}>
                <div className="order-icon">
                  <Truck size={18} />
                </div>
                <div>
                  <strong>#{o.id}</strong>
                  <small>
                    {o.origin} · {o.time}
                  </small>
                </div>
                <div className="recent-total">
                  <strong>{money(total(o))}</strong>
                  <Badge>{o.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
          <div className="panel-footnote">
            <span className="live-dot" />
            Datos mock en memoria · Sin persistencia
          </div>
        </Panel>
      </div>
    </>
  );
}
