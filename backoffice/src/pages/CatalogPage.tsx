import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Plus,
  Upload,
  Download,
  Pencil,
  RotateCcw,
  Zap,
  ArrowUpDown,
  Check,
  Tag,
} from "lucide-react";
import { useData } from "../app/AppDataProvider";
import { categories } from "../mocks/products";
import {
  Button,
  PageHeading,
  Panel,
  SearchInput,
  Badge,
  ProductImage,
  Pagination,
  EmptyState,
  Modal,
} from "../components/ui";
import { money, downloadCSV, stockStatus } from "../utils/format";
export default function CatalogPage() {
  const { state, notify } = useData();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") || "");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [upload, setUpload] = useState(false);
  function reset() {
    setSearch("");
    setCategory("");
    setStatus("");
    setBrand("");
    setPrice("");
    setPage(1);
  }
  const filtered = state.products
    .filter((p) => {
      const inv = state.inventory.find((i) => i.productId === p.id)!;
      return (
        `${p.name} ${p.sku} ${p.barcode}`
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (!category || p.category === category) &&
        (!brand || p.brand === brand) &&
        (!status ||
          (status === "Stock Crítico"
            ? inv.stock < inv.min
            : status === "Agotado"
              ? inv.stock === 0
              : p.status === status)) &&
        (!price ||
          (price === "low"
            ? p.massPrice <= 10
            : price === "medium"
              ? p.massPrice > 10 && p.massPrice <= 30
              : p.massPrice > 30))
      );
    })
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "price"
          ? a.massPrice - b.massPrice
          : 0,
    );
  const current = Math.min(page, Math.max(1, Math.ceil(filtered.length / 7)));
  const rows = filtered.slice((current - 1) * 7, current * 7);
  function exportRows() {
    downloadCSV("catalogo-mass", [
      [
        "SKU",
        "Producto",
        "Categoría",
        "Precio regular",
        "Precio Mass",
        "Stock",
      ],
      ...filtered.map((p) => [
        p.sku,
        p.name,
        p.category,
        p.regularPrice,
        p.massPrice,
        state.inventory.find((i) => i.productId === p.id)!.stock,
      ]),
    ]);
    notify("Catálogo exportado en CSV");
  }
  return (
    <>
      <div className="sync-banner">
        <Zap size={16} />
        <span>
          Catálogo central actualizado ·{" "}
          <b>Precios y stock compartidos en esta sesión</b>
        </span>
        <span className="desktop-only">Surtido Abarrotes / FMCG</span>
      </div>
      <PageHeading
        eyebrow="CATÁLOGO MAESTRO V3 / SKU INVENTORY MATRIX"
        title="Catálogo de Productos"
        description="Gestión centralizada de surtido, SKUs, categorías y política de precios retail Mass"
        actions={
          <>
            <Button variant="secondary" onClick={() => setUpload(true)}>
              <Upload size={17} />
              Carga masiva
            </Button>
            <Link className="btn btn-primary" to="/catalogo/nuevo">
              <Plus size={18} />
              Nuevo producto
            </Link>
          </>
        }
      />
      <Panel className="catalog-panel">
        <div className="filters">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
          />
          <select
            aria-label="Categoría"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            aria-label="Estado"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos los estados</option>
            {["Activo", "Inactivo", "Stock Crítico", "Agotado"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            aria-label="Marca"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="">Todas las marcas</option>
            {Array.from(new Set(state.products.map((p) => p.brand))).map(
              (b) => (
                <option key={b}>{b}</option>
              ),
            )}
          </select>
          <select
            aria-label="Rango de precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          >
            <option value="">Todos los precios</option>
            <option value="low">S/ 0 – S/ 10</option>
            <option value="medium">S/ 10 – S/ 30</option>
            <option value="high">S/ 30 a más</option>
          </select>
        </div>
        <div className="table-toolbar">
          <span>
            <b>{filtered.length}</b> productos en el catálogo{" "}
            <span className="soft-pill">Marca Mass</span>
          </span>
          <div>
            <button className="text-link muted" onClick={reset}>
              <RotateCcw size={14} />
              Limpiar filtros
            </button>
            <select
              aria-label="Ordenar productos"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Orden original</option>
              <option value="name">Nombre A–Z</option>
              <option value="price">Precio menor a mayor</option>
            </select>
            <button className="text-link" onClick={exportRows}>
              <Download size={15} />
              <span className="desktop-only">Descargar vista</span>
            </button>
          </div>
        </div>
        <div className="desktop-table">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    aria-label="Seleccionar página"
                    type="checkbox"
                    checked={
                      rows.length > 0 &&
                      rows.every((p) => selected.includes(p.id))
                    }
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? Array.from(
                              new Set([...selected, ...rows.map((p) => p.id)]),
                            )
                          : selected.filter(
                              (id) => !rows.some((p) => p.id === id),
                            ),
                      )
                    }
                  />
                </th>
                <th>Producto y EAN</th>
                <th>SKU / Categoría</th>
                <th>
                  <button onClick={() => setSort("price")}>
                    P. regular <ArrowUpDown size={12} />
                  </button>
                </th>
                <th>Precio Mass</th>
                <th>Stock actual</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const inv = state.inventory.find((i) => i.productId === p.id)!;
                return (
                  <tr key={p.id}>
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Seleccionar ${p.name}`}
                        checked={selected.includes(p.id)}
                        onChange={(e) =>
                          setSelected(
                            e.target.checked
                              ? [...selected, p.id]
                              : selected.filter((id) => id !== p.id),
                          )
                        }
                      />
                    </td>
                    <td>
                      <div className="product-cell">
                        <ProductImage src={p.image} name={p.name} />
                        <div>
                          <Link to={`/catalogo/${p.id}/editar`}>{p.name}</Link>
                          <small>
                            {p.brand} · EAN: {p.barcode}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="mono">{p.sku}</span>
                      <small>{p.category}</small>
                    </td>
                    <td className="regular-price">{money(p.regularPrice)}</td>
                    <td>
                      <strong className="mass-price">
                        {money(p.massPrice)}
                      </strong>
                      <small className="saving">
                        ↓ Ahorra {money(p.regularPrice - p.massPrice)}
                      </small>
                    </td>
                    <td>
                      <strong className={inv.stock < inv.min ? "red-text" : ""}>
                        {inv.stock} <small className="inline">und</small>
                      </strong>
                    </td>
                    <td>
                      <Badge>
                        {p.status === "Inactivo"
                          ? p.status
                          : inv.stock < inv.min
                            ? stockStatus(inv)
                            : "Activo"}
                      </Badge>
                    </td>
                    <td>
                      <Link
                        className="icon-button"
                        aria-label={`Editar ${p.name}`}
                        to={`/catalogo/${p.id}/editar`}
                      >
                        <Pencil size={17} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mobile-product-list">
          {rows.map((p) => {
            const inv = state.inventory.find((i) => i.productId === p.id)!;
            return (
              <article className="product-card" key={p.id}>
                <div className="product-card-top">
                  <ProductImage src={p.image} name={p.name} />
                  <div>
                    <span className="category-label">{p.category}</span>
                    <Link to={`/catalogo/${p.id}/editar`}>
                      <h3>{p.name}</h3>
                    </Link>
                    <small className="mono">{p.sku}</small>
                  </div>
                  <Link
                    className="icon-button"
                    aria-label={`Editar ${p.name}`}
                    to={`/catalogo/${p.id}/editar`}
                  >
                    <Pencil size={17} />
                  </Link>
                </div>
                <div className="product-card-bottom">
                  <div>
                    <small>PRECIO MASS</small>
                    <strong>
                      {money(p.massPrice)} <s>{money(p.regularPrice)}</s>
                    </strong>
                  </div>
                  <div>
                    <small>
                      STOCK: <b>{inv.stock} UND</b>
                    </small>
                    <Badge>
                      {p.status === "Inactivo"
                        ? p.status
                        : inv.stock < inv.min
                          ? stockStatus(inv)
                          : "Activo"}
                    </Badge>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {!rows.length && <EmptyState />}
        <Pagination
          page={current}
          count={filtered.length}
          pageSize={7}
          onChange={setPage}
        />
        {selected.length > 0 && (
          <div className="selection-bar">
            <Check size={18} />
            {selected.length} productos seleccionados
            <Button
              variant="secondary"
              onClick={() => {
                notify("Flejes preparados para imprimir");
                window.print();
              }}
            >
              Imprimir flejes Mass
            </Button>
            <Button variant="ghost" onClick={() => setSelected([])}>
              Deseleccionar
            </Button>
          </div>
        )}
      </Panel>
      {upload && (
        <Modal
          title="Carga masiva de productos"
          onClose={() => setUpload(false)}
        >
          <p>
            Importación simulada. El archivo se selecciona localmente y no se
            envía a ningún servicio.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setUpload(false);
              notify("Carga masiva simulada correctamente · archivo validado");
            }}
          >
            <label htmlFor="bulk">Archivo Excel o CSV</label>
            <input id="bulk" type="file" accept=".csv,.xlsx,.xls" required />
            <div className="modal-actions">
              <Button type="submit">
                <Upload size={17} />
                Simular importación
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
