import { useState, type FormEvent } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Save,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Printer,
  ImagePlus,
  Package,
  Tags,
  Warehouse,
  Megaphone,
} from "lucide-react";
import { useData } from "../app/AppDataProvider";
import { categories } from "../mocks/products";
import type { Product, InventoryItem } from "../types";
import {
  Button,
  PageHeading,
  Panel,
  ProductImage,
  EmptyState,
} from "../components/ui";
import { money } from "../utils/format";
const blank: Product = {
  id: "",
  name: "",
  sku: "",
  barcode: "",
  category: "Abarrotes",
  brand: "Marca Mass",
  description: "",
  supplier: "Supermercados Peruanos S.A.",
  regularPrice: 0,
  massPrice: 0,
  status: "Activo",
  image: "/assets/rice.svg",
  promotion: false,
};
export default function ProductFormPage() {
  const { productId } = useParams();
  const { state, dispatch, notify } = useData();
  const navigate = useNavigate();
  const original = state.products.find((p) => p.id === productId);
  const isNew = !productId;
  const [p, setP] = useState<Product>(() => ({ ...(original || blank) }));
  const [inv, setInv] = useState<InventoryItem>(() => ({
    ...(state.inventory.find((i) => i.productId === productId) || {
      productId: "",
      stock: 0,
      reserved: 0,
      min: 30,
      max: 600,
      location: "Pasillo 01 · Góndola A",
    }),
  }));
  const [error, setError] = useState("");
  const [campaign, setCampaign] = useState(
    "Bajón de Precios Mass · Octubre 2024",
  );
  const [start, setStart] = useState("2024-10-01");
  const [end, setEnd] = useState("2024-10-31");
  function update<K extends keyof Product>(k: K, v: Product[K]) {
    setP((prev) => ({ ...prev, [k]: v }));
  }
  function stock(k: keyof InventoryItem, v: string) {
    setInv((prev) => ({ ...prev, [k]: k === "location" ? v : Number(v) }));
  }
  function save(e: FormEvent) {
    e.preventDefault();
    if (
      !p.name.trim() ||
      !p.sku.trim() ||
      !/^\d{13}$/.test(p.barcode) ||
      p.massPrice <= 0 ||
      p.regularPrice < p.massPrice ||
      inv.min > inv.max ||
      inv.reserved > inv.stock ||
      state.products.some((q) => q.id !== p.id && q.sku === p.sku)
    ) {
      setError(
        "Revisa los campos: EAN de 13 dígitos, SKU único, precios válidos y stock mínimo menor al máximo. El reservado no puede superar el actual.",
      );
      return;
    }
    const id = p.id || crypto.randomUUID();
    dispatch({
      type: "PRODUCT",
      product: { ...p, id },
      inventory: { ...inv, productId: id },
    });
    notify(
      isNew
        ? "Producto creado correctamente"
        : "Producto actualizado correctamente",
    );
    navigate("/catalogo");
  }
  if (!isNew && !original) return <EmptyState title="Producto no encontrado" />;
  return (
    <>
      <Link className="breadcrumb" to="/catalogo">
        <ArrowLeft size={15} />
        Catálogo / Productos / {isNew ? "Nuevo producto" : "Editar producto"}
      </Link>
      <PageHeading
        title={isNew ? "Nuevo Producto" : `Editar Producto: ${p.name}`}
        description={
          isNew
            ? "Agrega un producto al surtido de esta sesión."
            : `SKU: ${p.sku} · Modifica la ficha y previsualiza el fleje en tiempo real.`
        }
      />
      <form onSubmit={save} className="product-form">
        <div className="form-top-actions">
          <Link className="btn btn-secondary" to="/catalogo">
            Cancelar
          </Link>
          <Button
            variant="secondary"
            type="button"
            onClick={() =>
              notify(
                "Borrador disponible en este formulario mientras permanezca abierto",
              )
            }
          >
            <Save size={16} />
            Guardar borrador
          </Button>
          <Button type="submit">
            <CheckCircle2 size={17} />
            Guardar cambios
          </Button>
        </div>
        <div className="info-banner">
          <ShieldCheck size={24} />
          <div>
            <strong>Producto Estratégico Hard Discount</strong>
            <p>
              Artículo de la canasta básica. Los cambios se reflejan en el
              catálogo, precios e inventario durante esta sesión.
            </p>
          </div>
          <span className="desktop-only">
            Última auditoría
            <br />
            <b>Hoy, 09:42 AM</b>
          </span>
        </div>
        <div className="form-columns">
          <div className="form-main">
            <Panel
              title="1. Información General"
              action={<Package size={19} />}
            >
              <div className="form-grid">
                <label className="span-2">
                  Nombre comercial del producto *
                  <input
                    maxLength={80}
                    value={p.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                  />
                </label>
                <label>
                  SKU interno SPSA *
                  <input
                    value={p.sku}
                    onChange={(e) => update("sku", e.target.value)}
                    required
                  />
                </label>
                <label>
                  Código de barras (EAN-13) *
                  <input
                    value={p.barcode}
                    inputMode="numeric"
                    maxLength={13}
                    onChange={(e) => update("barcode", e.target.value)}
                    required
                    pattern="[0-9]{13}"
                  />
                </label>
                <label>
                  Categoría primaria *
                  <select
                    value={p.category}
                    onChange={(e) =>
                      update("category", e.target.value as Product["category"])
                    }
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Marca / fabricante *
                  <input
                    value={p.brand}
                    onChange={(e) => update("brand", e.target.value)}
                    required
                  />
                </label>
                <label className="span-2">
                  Proveedor
                  <input
                    value={p.supplier}
                    onChange={(e) => update("supplier", e.target.value)}
                  />
                </label>
                <label className="span-2">
                  Descripción del producto y origen
                  <textarea
                    rows={4}
                    value={p.description}
                    onChange={(e) => update("description", e.target.value)}
                  />
                </label>
              </div>
            </Panel>
            <Panel
              title="2. Precios y Estrategia Mass"
              action={<Tags size={19} />}
            >
              <div className="form-grid">
                <label>
                  Precio regular (mercado) · S/
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={p.regularPrice || ""}
                    onChange={(e) =>
                      update("regularPrice", Number(e.target.value))
                    }
                  />
                  <small>
                    Precio referencial en autoservicios tradicionales.
                  </small>
                </label>
                <label className="price-field">
                  Precio Mass (PVP final) · S/ *
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={p.massPrice || ""}
                    onChange={(e) =>
                      update("massPrice", Number(e.target.value))
                    }
                  />
                  <small>Incluye IGV (18%).</small>
                </label>
                <div className="saving-banner span-2">
                  ↓ Ahorro para el cliente:{" "}
                  <b>{money(p.regularPrice - p.massPrice)}</b> por unidad ·{" "}
                  {p.regularPrice
                    ? (
                        ((p.regularPrice - p.massPrice) / p.regularPrice) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
                <label className="checkbox-label span-2">
                  <input
                    type="checkbox"
                    checked={p.promotion}
                    onChange={(e) => update("promotion", e.target.checked)}
                  />
                  Aplicar promoción por volumen (Pack x 3 unidades)
                </label>
              </div>
            </Panel>
            <Panel
              title="3. Control de Stock y Reposición"
              action={<Warehouse size={19} />}
            >
              <div className="form-grid three-cols">
                {(
                  [
                    ["stock", "Stock actual"],
                    ["min", "Stock mínimo"],
                    ["max", "Stock máximo"],
                    ["reserved", "Reservado"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={inv[key]}
                      onChange={(e) => stock(key, e.target.value)}
                    />
                  </label>
                ))}
                <label className="span-2">
                  Ubicación en tienda
                  <input
                    value={inv.location}
                    onChange={(e) => stock("location", e.target.value)}
                  />
                </label>
              </div>
            </Panel>
            <Panel
              title="4. Promociones y Campañas"
              action={<Megaphone size={19} />}
            >
              <div className="form-grid">
                <label className="span-2">
                  Campaña institucional
                  <select
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                  >
                    <option>Bajón de Precios Mass · Octubre 2024</option>
                    <option>La Caserita Ahorradora Mass</option>
                    <option>Sin campaña asignada</option>
                  </select>
                </label>
                <label>
                  Vigencia inicio
                  <input
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </label>
                <label>
                  Vigencia fin
                  <input
                    type="date"
                    min={start}
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </label>
              </div>
              <small>
                Selección ilustrativa de campaña. La promoción activa se guarda
                con el producto.
              </small>
            </Panel>
          </div>
          <aside className="form-aside">
            <Panel
              title="Fleje de Góndola"
              action={
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Imprimir fleje"
                  onClick={() => window.print()}
                >
                  <Printer size={17} />
                </button>
              }
            >
              <p className="muted">
                Previsualización del rotulado físico en percha.
              </p>
              <div className="shelf-label">
                <div>
                  TIENDAS MASS <b>mass</b>
                </div>
                <h3>{p.name || "NOMBRE DEL PRODUCTO"}</h3>
                <span>PRECIO MASS</span>
                <strong>{money(p.massPrice)}</strong>
                <footer>
                  PRECIO REGULAR {money(p.regularPrice)}
                  <br />
                  <b>AHORRAS {money(p.regularPrice - p.massPrice)}</b>
                </footer>
                <div className="barcode" />
                <small>{p.barcode || "7751234001019"}</small>
              </div>
              <p className="hint">
                <CheckCircle2 size={15} />
                Vista previa actualizada en tiempo real
              </p>
            </Panel>
            <Panel title="Imágenes del Producto">
              <div className="image-preview">
                <ProductImage src={p.image} name={p.name || "Producto"} />
              </div>
              <label className="upload-label">
                <ImagePlus size={18} />
                Subir imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      notify("Selecciona una imagen menor a 5 MB");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () =>
                      update("image", String(reader.result));
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              <small>Archivo local · máximo 5 MB</small>
            </Panel>
            <Panel title="Estado y Canales">
              <label>
                Estado del producto
                <select
                  value={p.status}
                  onChange={(e) =>
                    update("status", e.target.value as Product["status"])
                  }
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </label>
              <div className="channel-row">
                <span>POS Tiendas Mass</span>
                <span className="live-dot" />
                Activo
              </div>
              <div className="channel-row">
                <span>Verificador de precios</span>
                <span className="live-dot" />
                Activo
              </div>
            </Panel>
          </aside>
        </div>
        {error && (
          <div role="alert" className="field-error error-banner">
            {error}
          </div>
        )}
        <footer className="form-bottom">
          <span>
            <ShieldCheck size={15} />
            Cambios disponibles solo durante esta sesión
          </span>
          <Link className="btn btn-secondary" to="/catalogo">
            Descartar cambios
          </Link>
          <Button type="submit">
            <Save size={17} />
            Guardar cambios
          </Button>
        </footer>
      </form>
    </>
  );
}
