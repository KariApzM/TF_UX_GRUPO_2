import MassMark from "./MassMark";
import { useState, useRef, useEffect } from "react";
import {
  NavLink,
  Link,
  Outlet,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Warehouse,
  Truck,
  Route,
  ChartNoAxesCombined,
  Settings,
  Headphones,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Menu,
  Store,
  ArrowRight,
} from "lucide-react";
import { useData, stores } from "../../app/AppDataProvider";
import { Modal, Button } from "../ui";
const navigation = [
  {
    to: "/dashboard",
    label: "Dashboard",
    mobile: "Inicio",
    icon: LayoutDashboard,
  },
  { to: "/catalogo", label: "Catálogo", mobile: "Catálogo", icon: Package },
  { to: "/precios", label: "Precios", mobile: "Precios", icon: Tags },
  { to: "/inventario", label: "Inventario", mobile: "Kardex", icon: Warehouse },
  { to: "/pedidos", label: "Pedidos", mobile: "Pedidos", icon: Truck },
  {
    to: "/pedidos/PED-2024-8921/seguimiento",
    label: "Seguimiento",
    mobile: "Seguimiento",
    icon: Route,
  },
  {
    to: "/reportes",
    label: "Reportes",
    mobile: "Reportes",
    icon: ChartNoAxesCombined,
  },
];
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand ${light ? "light" : ""}`}>
      <div className="mass-logo">
        <MassMark />
      </div>
      <div className="brand-caption">
        Tiendas Mass<small>Portal de Operaciones</small>
      </div>
    </div>
  );
}
export default function AppLayout() {
  const { state, dispatch, notify } = useData();
  const [dialog, setDialog] = useState<
    "notifications" | "profile" | "more" | null
  >(null);
  const [search, setSearch] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const store = stores.find((s) => s.id === state.storeId)!;
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  if (!state.user) return <Navigate to="/login" replace />;
  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <Link to="/dashboard" className="brand-link">
          <Logo />
        </Link>
        <span className="nav-label">MENÚ PRINCIPAL</span>
        <nav>
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive &&
                !(
                  to === "/pedidos" && location.pathname.includes("seguimiento")
                )
                  ? "active"
                  : ""
              }
            >
              <Icon size={20} />
              {label}
              {label === "Pedidos" && (
                <span className="nav-count">
                  {
                    state.orders.filter(
                      (o) =>
                        o.status !== "Entregado" && o.status !== "Cancelado",
                    ).length
                  }
                </span>
              )}
            </NavLink>
          ))}
          <button
            onClick={() =>
              notify("Funcionalidad no incluida en este prototipo")
            }
          >
            <Settings size={20} />
            Configuración
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="prototype-tag">
            <span />
            v2.4 Prototipo UX SPSA
          </div>
          <button
            onClick={() => notify("Soporte TI Mass · Anexo 4422 (simulado)")}
          >
            <Headphones size={18} />
            Soporte técnico
            <ArrowRight size={16} />
          </button>
        </div>
      </aside>
      <header className="desktop-header">
        <form
          className="global-search"
          onSubmit={(e) => {
            e.preventDefault();
            const query = search.trim().replace(/^#/, "");
            const destination = /^(PED|DSP)-/i.test(query)
              ? "/pedidos"
              : "/catalogo";
            navigate(destination + "?q=" + encodeURIComponent(query));
          }}
        >
          <Search size={18} />
          <input
            ref={input}
            aria-label="Búsqueda global"
            placeholder="Buscar SKU, producto, pedido…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd>⌘ K</kbd>
        </form>
        <label className="store-selector">
          <Store size={19} />
          <span>
            Tienda Mass #{store.id}
            <small>{store.name} · Lima</small>
          </span>
          <select
            aria-label="Cambiar tienda"
            value={state.storeId}
            onChange={(e) => {
              dispatch({ type: "STORE", id: e.target.value });
              notify(
                "Sucursal seleccionada · datos de demostración compartidos",
              );
            }}
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.id} — {s.name}
              </option>
            ))}
          </select>
          <ChevronDown size={15} />
        </label>
        <span className="online">
          <i />
          En línea
        </span>
        <button
          className="icon-button notification-button"
          aria-label="Notificaciones"
          onClick={() => setDialog("notifications")}
        >
          <Bell size={21} />
          {state.notifications.some((n) => !n.read) && <b />}
        </button>
        <button className="profile" onClick={() => setDialog("profile")}>
          <span className="avatar">CQ</span>
          <span>
            Carlos Quispe M.<small>Jefe de Operaciones</small>
          </span>
          <ChevronDown size={15} />
        </button>
      </header>
      <header className="mobile-header">
        <Link to="/dashboard">
          <div className="mass-logo">
            <MassMark />
          </div>
        </Link>
        <label>
          <small>LOCAL ACTIVO</small>
          <select
            aria-label="Tienda activa"
            value={state.storeId}
            onChange={(e) => dispatch({ type: "STORE", id: e.target.value })}
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.id} {s.name.split(",")[0]}
              </option>
            ))}
          </select>
        </label>
        <button
          className="icon-button"
          aria-label="Notificaciones"
          onClick={() => setDialog("notifications")}
        >
          <Bell size={21} />
        </button>
        <button
          className="avatar"
          aria-label="Mi perfil"
          onClick={() => setDialog("profile")}
        >
          CQ
        </button>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <nav className="mobile-bottom-nav">
        {[navigation[0], navigation[1], navigation[3], navigation[4]].map(
          ({ to, mobile, icon: Icon }) => (
            <NavLink key={to} to={to}>
              <Icon size={22} />
              <span>{mobile}</span>
            </NavLink>
          ),
        )}
        <button
          className={dialog === "more" ? "active" : ""}
          onClick={() => setDialog("more")}
        >
          <Menu size={22} />
          <span>Más</span>
        </button>
      </nav>
      {dialog && (
        <Modal
          title={
            dialog === "notifications"
              ? "Centro de notificaciones"
              : dialog === "profile"
                ? "Mi cuenta"
                : "Más opciones"
          }
          onClose={() => setDialog(null)}
        >
          {dialog === "notifications" ? (
            <>
              <div className="notification-list">
                {state.notifications.map((n) => (
                  <div key={n.id}>
                    <span className={n.read ? "read-dot" : "unread-dot"} />
                    <p>
                      {n.title}
                      <small>Hoy · Tienda #{store.id}</small>
                    </p>
                  </div>
                ))}
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  dispatch({ type: "READ_NOTIFICATIONS" });
                  notify("Notificaciones marcadas como leídas");
                }}
              >
                Marcar todas como leídas
              </Button>
            </>
          ) : dialog === "profile" ? (
            <>
              <div className="account">
                <span className="avatar">CQ</span>
                <h3>{state.user.name}</h3>
                <p>{state.user.email}</p>
                <p>{state.user.role}</p>
              </div>
              <Button
                variant="danger"
                onClick={() => {
                  dispatch({ type: "LOGOUT" });
                  navigate("/login");
                }}
              >
                <LogOut size={17} />
                Cerrar sesión
              </Button>
            </>
          ) : (
            <div className="more-menu">
              {navigation
                .slice(2)
                .filter((n) => !["/inventario", "/pedidos"].includes(n.to))
                .map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to} onClick={() => setDialog(null)}>
                    <Icon size={20} />
                    {label}
                    <ArrowRight size={17} />
                  </Link>
                ))}
              <button
                onClick={() =>
                  notify("Funcionalidad no incluida en este prototipo")
                }
              >
                <Settings size={20} />
                Configuración
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
