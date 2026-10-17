import {
  useEffect,
  useRef,
  type ReactNode,
  type ButtonHTMLAttributes,
} from "react";
import {
  Search,
  X,
  PackageOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: string;
}) {
  const text = String(children);
  return (
    <span
      className={`badge ${tone || (["Activo", "Óptimo", "Entregado", "Completado"].includes(text) ? "success" : ["Cancelado", "Agotado", "Alta", "Por reponer"].includes(text) ? "danger" : ["En ruta", "Actual"].includes(text) ? "info" : "warning")}`}
    >
      {children}
    </span>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab") {
        const items = ref.current?.querySelectorAll<HTMLElement>(
          "button,input,select,textarea,a[href]",
        );
        if (!items?.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal"
      >
        <header>
          <h2 id="modal-title">{title}</h2>
          <button
            className="icon-button"
            aria-label="Cerrar ventana"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
export function ConfirmDialog({
  title,
  description,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p>{description}</p>
      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>
          Volver
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirmar cancelación
        </Button>
      </div>
    </Modal>
  );
}
export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar por nombre, SKU o EAN…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="search-input">
      <Search size={18} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button aria-label="Limpiar búsqueda" onClick={() => onChange("")}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}
export function EmptyState({
  title = "No se encontraron resultados",
  description = "Prueba con otra búsqueda o ajusta los filtros.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="empty">
      <PackageOpen size={36} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="heading-actions">{actions}</div>}
    </div>
  );
}
export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {title && (
        <header className="panel-heading">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
export function ProductImage({ src, name }: { src: string; name: string }) {
  return (
    <div className="product-image">
      <img
        src={src}
        alt={name}
        onError={(e) => {
          e.currentTarget.src = "/assets/rice.svg";
        }}
      />
    </div>
  );
}
export function Pagination({
  page,
  count,
  pageSize,
  onChange,
}: {
  page: number;
  count: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(count / pageSize));
  return (
    <div className="pagination">
      <span>
        Mostrando {count ? (page - 1) * pageSize + 1 : 0}–
        {Math.min(page * pageSize, count)} de {count} registros
      </span>
      <div>
        <button
          className="icon-button"
          disabled={page === 1}
          aria-label="Página anterior"
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={17} />
        </button>
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "current" : ""}
            onClick={() => onChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="icon-button"
          disabled={page === pages}
          aria-label="Página siguiente"
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
