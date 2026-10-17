import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Plus,
  History,
  ArrowLeftRight,
  Warehouse,
  Package,
  TriangleAlert,
  TrendingUp,
} from "lucide-react";
import { useData } from "../app/AppDataProvider";
import {
  Button,
  PageHeading,
  Panel,
  SearchInput,
  Badge,
  ProductImage,
  EmptyState,
} from "../components/ui";
import { stockStatus, money, downloadCSV } from "../utils/format";
import { categories } from "../mocks/products";
import InventoryDialog from "../components/inventory/InventoryDialog";
import { SalesChart } from "../components/dashboard/Charts";
export default function InventoryPage() {
  const { state, notify } = useData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState<"adjust" | "transfer" | "history" | null>(
    null,
  );
  const [id, setId] = useState("p1");
  const [historyId, setHistoryId] = useState<string | null>(null);
  const rows = state.inventory.filter((i) => {
    const p = state.products.find((p) => p.id === i.productId)!;
    return (
      `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase()) &&
      (!category || p.category === category) &&
      (!status || stockStatus(i) === status) &&
      (!location || i.location.includes(location))
    );
  });
  function openAdjust(productId: string) {
    setId(productId);
    setMode("adjust");
  }
  function exportRows() {
    downloadCSV("inventario-mass", [
      ["SKU", "Producto", "Stock", "Reservado", "Mínimo", "Máximo", "Estado"],
      ...rows.map((i) => {
        const p = state.products.find((p) => p.id === i.productId)!;
        return [
          p.sku,
          p.name,
          i.stock,
          i.reserved,
          i.min,
          i.max,
          stockStatus(i),
        ];
      }),
    ]);
    notify("Inventario exportado");
  }
  return (
    <>
      <PageHeading
        eyebrow="GESTIÓN HARD DISCOUNT SPSA · CORTE DEMO: 14:30 HRS"
        title="Control de Inventario y Existencias"
        description="Stock valorizado, quiebres, rotación y transferencias entre CEDI y tiendas."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setMode("transfer");
              }}
            >
              <ArrowLeftRight size={17} />
              Transferencia
            </Button>
            <Button onClick={() => openAdjust("p1")}>
              <Plus size={18} />
              Actualizar stock
            </Button>
          </>
        }
      />
      <div className="kpi-grid inventory-kpis">
        {[
          {
            label: "Stock valorizado total",
            value: money(
              state.inventory.reduce(
                (sum, i) =>
                  sum +
                  i.stock *
                    (state.products.find((p) => p.id === i.productId)
                      ?.massPrice || 0),
                0,
              ),
            ),
            note: "Stock físico en sala y bodega",
            icon: Warehouse,
            color: "blue",
          },
          {
            label: "Productos con quiebre",
            value:
              String(state.inventory.filter((i) => i.stock === 0).length) +
              " SKUs",
            note: "Atención crítica",
            icon: TriangleAlert,
            color: "red",
          },
          {
            label: "Productos por reponer",
            value:
              String(
                state.inventory.filter((i) => i.stock > 0 && i.stock < i.min)
                  .length,
              ) + " SKUs",
            note: "Bajo punto de reorden",
            icon: Package,
            color: "gold",
          },
          {
            label: "Stock óptimo",
            value:
              String(
                state.inventory.filter((i) => stockStatus(i) === "Óptimo")
                  .length,
              ) + " SKUs",
            note: "Surtido disponible",
            icon: TrendingUp,
            color: "green",
          },
        ].map((k) => (
          <div className={`kpi-card ${k.color}`} key={k.label}>
            <div className="kpi-top">
              {k.label}
              <div className="kpi-icon">
                <k.icon size={20} />
              </div>
            </div>
            <div className="kpi-value inventory-value">{k.value}</div>
            <small>{k.note}</small>
          </div>
        ))}
      </div>
      <div className="charts-grid inventory-charts">
        <Panel
          title="Tendencia de Stock y Nivel de Servicio"
          subtitle="Comparativo de existencias y colchón de seguridad · datos ilustrativos"
        >
          <SalesChart />
        </Panel>
        <Panel
          title="Kardex Reciente"
          action={<Badge tone="success">En vivo</Badge>}
        >
          <div className="movement-list">
            {state.movements.slice(0, 4).map((m) => (
              <div key={m.id}>
                <span className="movement-icon">
                  <History size={18} />
                </span>
                <div>
                  <strong>{m.type}</strong>
                  <small>
                    {state.products.find((p) => p.id === m.productId)?.name}
                  </small>
                  <small>
                    {m.time} · {m.note}
                  </small>
                </div>
                <b className={m.quantity >= 0 ? "green-text" : "red-text"}>
                  {m.quantity > 0 ? "+" : ""}
                  {m.quantity}
                </b>
              </div>
            ))}
          </div>
          <button
            className="panel-link"
            onClick={() => {
              setHistoryId(null);
              setMode("history");
            }}
          >
            Ver libro de Kardex completo →
          </button>
        </Panel>
      </div>
      <Panel
        title="Detalle de SKUs en Tienda"
        action={
          <Button variant="ghost" onClick={exportRows}>
            <Download size={16} />
            Exportar
          </Button>
        }
      >
        <div className="filters">
          <SearchInput value={search} onChange={setSearch} />
          <select
            aria-label="Categoría de inventario"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            aria-label="Estado de stock"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {["Óptimo", "Por reponer", "Agotado", "Sobre-stock"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            aria-label="Ubicación"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Todos los recintos</option>
            {["01", "02", "03", "04", "05"].map((i) => (
              <option value={"Pasillo " + i} key={i}>
                Pasillo {i}
              </option>
            ))}
          </select>
        </div>
        <div className="desktop-table">
          <table>
            <thead>
              <tr>
                <th>Producto / SKU</th>
                <th>Ubicación</th>
                <th>Stock actual</th>
                <th>Reservado</th>
                <th>Mín. / Máx.</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => {
                const p = state.products.find((p) => p.id === i.productId)!;
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="product-cell">
                        <ProductImage src={p.image} name={p.name} />
                        <div>
                          <Link to={`/catalogo/${p.id}/editar`}>{p.name}</Link>
                          <small>{p.sku}</small>
                        </div>
                      </div>
                    </td>
                    <td>{i.location}</td>
                    <td>
                      <strong className={i.stock < i.min ? "red-text" : ""}>
                        {i.stock} uds
                      </strong>
                    </td>
                    <td>{i.reserved} uds</td>
                    <td>
                      {i.min} / {i.max}
                    </td>
                    <td>
                      <Badge>{stockStatus(i)}</Badge>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="icon-button"
                          aria-label={`Movimientos de ${p.name}`}
                          onClick={() => {
                            setHistoryId(p.id);
                            setMode("history");
                          }}
                        >
                          <History size={17} />
                        </button>
                        <Button
                          variant="secondary"
                          onClick={() => openAdjust(p.id)}
                        >
                          <Plus size={15} />
                          Ajustar
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mobile-product-list">
          {rows.map((i) => {
            const p = state.products.find((p) => p.id === i.productId)!;
            return (
              <article className="product-card" key={p.id}>
                <div className="product-card-top">
                  <ProductImage src={p.image} name={p.name} />
                  <div>
                    <h3>{p.name}</h3>
                    <small>{p.sku}</small>
                    <small>{i.location}</small>
                  </div>
                  <Badge>{stockStatus(i)}</Badge>
                </div>
                <div className="inventory-numbers">
                  <div>
                    <small>ACTUAL</small>
                    <b className={i.stock < i.min ? "red-text" : ""}>
                      {i.stock}
                    </b>
                  </div>
                  <div>
                    <small>RESERVADO</small>
                    <b>{i.reserved}</b>
                  </div>
                  <div>
                    <small>MÍNIMO</small>
                    <b>{i.min}</b>
                  </div>
                  <div>
                    <small>MÁXIMO</small>
                    <b>{i.max}</b>
                  </div>
                </div>
                <div className="card-actions">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setHistoryId(p.id);
                      setMode("history");
                    }}
                  >
                    <History size={16} />
                    Kardex
                  </Button>
                  <Button onClick={() => openAdjust(p.id)}>
                    <Plus size={16} />
                    Ajustar stock
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
        {!rows.length && <EmptyState />}
        <div className="panel-footnote">
          {rows.length} SKUs · Stock unificado con el catálogo
        </div>
      </Panel>
      {mode && (
        <InventoryDialog
          mode={mode}
          initialId={id}
          historyId={historyId}
          onClose={() => setMode(null)}
        />
      )}
    </>
  );
}
