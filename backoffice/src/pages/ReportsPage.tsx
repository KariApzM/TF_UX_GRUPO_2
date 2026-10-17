import { useState } from "react";
import {
  Download,
  CalendarDays,
  TrendingUp,
  Target,
  Package,
  ShoppingBasket,
} from "lucide-react";
import { useData } from "../app/AppDataProvider";
import {
  Button,
  PageHeading,
  Panel,
  SearchInput,
  ProductImage,
  Badge,
  EmptyState,
} from "../components/ui";
import { SalesChart } from "../components/dashboard/Charts";
import { money, downloadCSV } from "../utils/format";
import { categories } from "../mocks/products";
export default function ReportsPage() {
  const { state, notify } = useData();
  const [period, setPeriod] = useState("Últimos 7 días");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState("Últimos 7 días");
  const factor = applied === "Hoy" ? 1 : applied === "Este mes" ? 25 : 7;
  const rows = state.products.filter(
    (p) =>
      (!category || p.category === category) &&
      `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase()),
  );
  const volume = (index: number) => (32 + index * 17) * factor;
  const revenue = rows.reduce((s, p, i) => s + volume(i) * p.massPrice, 0);
  return (
    <>
      <PageHeading
        eyebrow="INTELIGENCIA OPERATIVA / TIENDA MASS"
        title="Reportes y Analítica Operativa"
        description="Indicadores de ventas, cumplimiento y rendimiento del surtido."
        actions={
          <Button
            onClick={() => {
              downloadCSV("reporte-operativo", [
                ["Periodo", applied],
                ["SKU", "Producto", "Unidades", "Ventas", "Stock"],
                ...rows.map((p, i) => [
                  p.sku,
                  p.name,
                  volume(i),
                  volume(i) * p.massPrice,
                  state.inventory.find((j) => j.productId === p.id)!.stock,
                ]),
              ]);
              notify("Reporte generado en CSV");
            }}
          >
            <Download size={17} />
            Exportar reporte
          </Button>
        }
      />
      <Panel>
        <div className="filters report-filters">
          <CalendarDays size={20} />
          <label>
            Periodo
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option>Hoy</option>
              <option>Últimos 7 días</option>
              <option>Este mes</option>
            </select>
          </label>
          <label>
            Categoría
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <Button
            onClick={() => {
              setApplied(period);
              notify("Filtros aplicados");
            }}
          >
            Aplicar filtros
          </Button>
        </div>
      </Panel>
      <div className="report-caption">
        Periodo: <b>{applied}</b> · Indicadores ilustrativos calculados sobre el
        surtido mock
      </div>
      <div className="kpi-grid">
        {[
          {
            name: "Ventas del periodo",
            value: money(revenue),
            note: "+12.4% vs. periodo anterior",
            icon: TrendingUp,
            color: "blue",
          },
          {
            name: "Cumplimiento de meta",
            value: "96.8%",
            note: "Meta diaria de operación",
            icon: Target,
            color: "green",
          },
          {
            name: "Unidades vendidas",
            value: rows
              .reduce((s, _, i) => s + volume(i), 0)
              .toLocaleString("es-PE"),
            note: "Volumen estimado del periodo",
            icon: ShoppingBasket,
            color: "gold",
          },
          {
            name: "SKUs auditados",
            value: String(rows.length),
            note: "Productos del surtido activo",
            icon: Package,
            color: "blue",
          },
        ].map((k) => (
          <div className={`kpi-card ${k.color}`} key={k.name}>
            <div className="kpi-top">
              {k.name}
              <k.icon size={20} />
            </div>
            <div className="kpi-value inventory-value">{k.value}</div>
            <small>{k.note}</small>
          </div>
        ))}
      </div>
      <div className="charts-grid">
        <Panel
          title="Evolución de Ventas vs. Meta Diaria"
          subtitle={`Tendencia del periodo · ${applied}`}
        >
          <SalesChart
            range={
              applied === "Hoy"
                ? "Hoy"
                : applied === "Este mes"
                  ? "Mes"
                  : "7 días"
            }
          />
        </Panel>
        <Panel
          title="Ventas por Categoría"
          subtitle="Distribución ilustrativa del surtido"
        >
          <div className="category-chart">
            {categories
              .filter((c) => state.products.some((p) => p.category === c))
              .map((c, i) => (
                <div key={c}>
                  <div>
                    <span>{c}</span>
                    <b>{[42, 24, 18, 10, 6][i]}%</b>
                  </div>
                  <span>
                    <i
                      style={{
                        width: [92, 64, 48, 35, 22][i] + "%",
                        background: [
                          "var(--primary)",
                          "var(--yellow)",
                          "#5475a8",
                          "#92aad0",
                          "#cbd5e7",
                        ][i],
                      }}
                    />
                  </span>
                </div>
              ))}
          </div>
        </Panel>
      </div>
      <Panel
        title="Auditoría de Rendimiento por SKU y Pasillo"
        subtitle="Datos ilustrativos para presentación académica"
      >
        <div className="filters">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar SKU o producto en el reporte…"
          />
        </div>
        <div className="desktop-table">
          <table>
            <thead>
              <tr>
                <th>SKU / Producto</th>
                <th>Categoría</th>
                <th>Unidades</th>
                <th>Ventas</th>
                <th>Stock actual</th>
                <th>Rendimiento</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                      <ProductImage src={p.image} name={p.name} />
                      <div>
                        <strong>{p.name}</strong>
                        <small>{p.sku}</small>
                      </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{volume(i)}</td>
                  <td>
                    <b>{money(volume(i) * p.massPrice)}</b>
                  </td>
                  <td>
                    {state.inventory.find((j) => j.productId === p.id)!.stock}
                  </td>
                  <td>
                    <Badge tone={i % 3 === 0 ? "warning" : "success"}>
                      {i % 3 === 0 ? "En observación" : "En objetivo"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mobile-product-list">
          {rows.map((p, i) => (
            <article className="product-card" key={p.id}>
              <div className="product-card-top">
                <ProductImage src={p.image} name={p.name} />
                <div>
                  <h3>{p.name}</h3>
                  <small>{p.sku}</small>
                </div>
              </div>
              <div className="product-card-bottom">
                <span>{volume(i)} unidades</span>
                <b>{money(volume(i) * p.massPrice)}</b>
                <Badge tone={i % 3 === 0 ? "warning" : "success"}>
                  {i % 3 === 0 ? "En observación" : "En objetivo"}
                </Badge>
              </div>
            </article>
          ))}
        </div>
        {!rows.length && <EmptyState />}
      </Panel>
    </>
  );
}
