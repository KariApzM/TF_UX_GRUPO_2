import { useState } from "react";
import {
  Pencil,
  Download,
  Tags,
  TrendingDown,
  ShieldCheck,
  Printer,
} from "lucide-react";
import { useData } from "../app/AppDataProvider";
import {
  Button,
  PageHeading,
  Panel,
  SearchInput,
  ProductImage,
  Badge,
  Modal,
  EmptyState,
} from "../components/ui";
import { money, downloadCSV } from "../utils/format";
import { categories } from "../mocks/products";
export default function PricesPage() {
  const { state, dispatch, notify } = useData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [promo, setPromo] = useState("");
  const [selected, setSelected] = useState("p1");
  const [edit, setEdit] = useState<string | null>(null);
  const [regular, setRegular] = useState(0);
  const [mass, setMass] = useState(0);
  const [promotion, setPromotion] = useState(false);
  const [error, setError] = useState("");
  const rows = state.products.filter(
    (p) =>
      `${p.name} ${p.sku} ${p.barcode}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!category || p.category === category) &&
      (!promo || p.promotion === (promo === "yes")),
  );
  const p = state.products.find((p) => p.id === selected) || state.products[0];
  return (
    <>
      <PageHeading
        eyebrow="ESTRATEGIA MASS / AHORRO GARANTIZADO"
        title="Gestión de Precios y Competitividad"
        description="Control del precio Mass, promociones y ahorro en la canasta básica."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              downloadCSV("precios-mass", [
                [
                  "SKU",
                  "Producto",
                  "Precio regular",
                  "Precio Mass",
                  "Promoción",
                ],
                ...rows.map((p) => [
                  p.sku,
                  p.name,
                  p.regularPrice,
                  p.massPrice,
                  p.promotion ? "Sí" : "No",
                ]),
              ]);
              notify("Lista de precios exportada");
            }}
          >
            <Download size={17} />
            Exportar precios
          </Button>
        }
      />
      <div className="kpi-grid price-kpis">
        <div className="kpi-card blue">
          <div className="kpi-top">
            SKUs con ventaja de precio
            <Tags size={21} />
          </div>
          <div className="kpi-value">
            {state.products.filter((p) => p.massPrice < p.regularPrice).length}
            <small>productos</small>
          </div>
          <small>Precio Mass menor al referencial</small>
        </div>
        <div className="kpi-card green">
          <div className="kpi-top">
            Ahorro promedio
            <TrendingDown size={21} />
          </div>
          <div className="kpi-value">
            {(
              state.products.reduce(
                (s, p) => s + (1 - p.massPrice / p.regularPrice) * 100,
                0,
              ) / state.products.length
            ).toFixed(1)}
            <small>%</small>
          </div>
          <small>Respecto al precio de mercado</small>
        </div>
        <div className="kpi-card gold">
          <div className="kpi-top">
            Promociones activas
            <ShieldCheck size={21} />
          </div>
          <div className="kpi-value">
            {state.products.filter((p) => p.promotion).length}
            <small>campañas</small>
          </div>
          <small>Bajón de precios Mass</small>
        </div>
      </div>
      <div className="prices-columns">
        <Panel title="Monitoreo de Canasta Básica vs. Cadena">
          <div className="filters">
            <SearchInput value={search} onChange={setSearch} />
            <select
              aria-label="Categoría de precios"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              aria-label="Promoción"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            >
              <option value="">Todas las promociones</option>
              <option value="yes">En promoción</option>
              <option value="no">Sin promoción</option>
            </select>
          </div>
          <div className="price-list">
            {rows.map((p) => (
              <div
                key={p.id}
                className={selected === p.id ? "selected-price" : ""}
              >
                <button
                  className="price-product"
                  onClick={() => setSelected(p.id)}
                >
                  <ProductImage src={p.image} name={p.name} />
                  <span>
                    <strong>{p.name}</strong>
                    <small>{p.sku}</small>
                    {p.promotion && (
                      <Badge tone="warning">Promoción activa</Badge>
                    )}
                  </span>
                </button>
                <div className="price-comparison">
                  <s>{money(p.regularPrice)}</s>
                  <strong>{money(p.massPrice)}</strong>
                  <span>
                    ↓ {((1 - p.massPrice / p.regularPrice) * 100).toFixed(1)}%
                  </span>
                </div>
                <button
                  className="icon-button"
                  aria-label={`Editar precio de ${p.name}`}
                  onClick={() => {
                    setEdit(p.id);
                    setRegular(p.regularPrice);
                    setMass(p.massPrice);
                    setPromotion(p.promotion);
                    setError("");
                  }}
                >
                  <Pencil size={18} />
                </button>
              </div>
            ))}
          </div>
          {!rows.length && <EmptyState />}
        </Panel>
        <aside>
          <Panel
            title="Fleje de Góndola Mass"
            action={
              <button
                className="icon-button"
                aria-label="Imprimir etiqueta"
                onClick={() => window.print()}
              >
                <Printer size={18} />
              </button>
            }
          >
            <div className="shelf-label">
              <div>
                TIENDAS MASS <b>mass</b>
              </div>
              <h3>{p.name}</h3>
              <span>PRECIO MASS</span>
              <strong>{money(p.massPrice)}</strong>
              <footer>
                PRECIO REGULAR {money(p.regularPrice)}
                <br />
                <b>AHORRAS {money(p.regularPrice - p.massPrice)}</b>
              </footer>
              <div className="barcode" />
              <small>{p.barcode}</small>
            </div>
            <div className="selected-product">
              <ProductImage src={p.image} name={p.name} />
              <h3>{p.name}</h3>
              <small>Producto seleccionado</small>
            </div>
          </Panel>
        </aside>
      </div>
      {edit && (
        <Modal title="Editar precio Mass" onClose={() => setEdit(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (mass > regular) {
                setError("El precio Mass no puede superar al precio regular.");
                return;
              }
              const product = state.products.find((p) => p.id === edit)!;
              dispatch({
                type: "PRODUCT",
                product: {
                  ...product,
                  regularPrice: regular,
                  massPrice: mass,
                  promotion,
                },
                inventory: state.inventory.find((i) => i.productId === edit)!,
              });
              setEdit(null);
              notify("Precio actualizado en el catálogo y en el fleje");
            }}
          >
            <label>
              Precio regular (S/)
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={regular}
                onChange={(e) => setRegular(Number(e.target.value))}
              />
            </label>
            <label>
              Precio Mass (S/)
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={promotion}
                onChange={(e) => setPromotion(e.target.checked)}
              />
              Promoción activa
            </label>
            {error && <p className="field-error">{error}</p>}
            <div className="modal-actions">
              <Button type="submit">Guardar precio</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
