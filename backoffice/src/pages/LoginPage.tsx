import { useState, type FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Package,
  Truck,
  RefreshCw,
  Mail,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";
import { useData } from "../app/AppDataProvider";
import { Button, Modal } from "../components/ui";
import { Logo } from "../components/layout/AppLayout";
export default function LoginPage() {
  const { state, dispatch, notify } = useData();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [recover, setRecover] = useState(false);
  function login(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password.trim()) {
      setError("Ingresa un correo válido y una contraseña.");
      return;
    }
    dispatch({ type: "LOGIN", email });
    navigate("/dashboard");
    notify("Bienvenido al Portal de Operaciones Mass");
  }
  if (state.user) return <Navigate to="/dashboard" replace />;
  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="hero-top">
          <Logo />
          <span className="version-label">BACKOFFICE CENTRAL</span>
        </div>
        <div className="hero-content">
          <span className="eyebrow">EFICIENCIA QUE NOS ACERCA</span>
          <h1>
            Portal de Operaciones
            <br />
            Retail <span>Mass</span>
          </h1>
          <p>
            La operación de cada tienda,
            <br />
            conectada en un solo lugar.
          </p>
          <div className="hero-features">
            {[
              [
                RefreshCw,
                "Control en tiempo real",
                "Visibilidad de ventas y pedidos en tu tienda",
              ],
              [
                Package,
                "Gestión ágil de stock",
                "El surtido correcto, siempre en góndola",
              ],
              [
                Truck,
                "Seguimiento logístico 24/7",
                "De CEDI a tienda, cada paso bajo control",
              ],
            ].map(([Icon, title, text]) => {
              const I = Icon as typeof Package;
              return (
                <div key={String(title)}>
                  <span>
                    <I size={23} />
                  </span>
                  <div>
                    <strong>{String(title)}</strong>
                    <small>{String(text)}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <footer>
          <ShieldCheck size={21} />
          <div>
            Respaldo Corporativo
            <small>Supermercados Peruanos S.A. | InRetail</small>
          </div>
          <span className="hero-secure">
            <CheckCircle2 size={15} />
            Sistemas conectados
          </span>
        </footer>
        <div className="hero-grid" />
      </section>
      <section className="login-form-side">
        <div className="mobile-login-logo">
          <Logo />
        </div>
        <div className="login-form-wrap">
          <div className="secure-label">
            <ShieldCheck size={16} />
            PORTAL INTERNO · ACCESO SEGURO
          </div>
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus credenciales corporativas autorizadas.</p>
          <form onSubmit={login} noValidate>
            <label htmlFor="email">Correo electrónico corporativo</label>
            <div className="input-icon">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="nombre@tiendasmass.pe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <label htmlFor="password">Contraseña</label>
            <div className="input-icon">
              <LockKeyhole size={18} />
              <input
                id="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
            <div className="login-options">
              <label>
                <input type="checkbox" />
                Recordarme en este equipo
              </label>
              <button type="button" onClick={() => setRecover(true)}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="login-submit">
              Ingresar al Sistema
              <ArrowRight size={19} />
            </Button>
          </form>
          <div className="divider-text">o continúa con</div>
          <Button
            variant="secondary"
            className="google-button"
            onClick={() => {
              dispatch({ type: "LOGIN", email: "admin@mass.pe" });
              navigate("/dashboard");
              notify("Ingreso con Google Workspace simulado");
            }}
          >
            <span className="google-g">G</span>Ingresar con Google Workspace
          </Button>
          <div className="login-notice">
            <ShieldCheck size={20} />
            <p>
              <strong>Prototipo académico.</strong> Usa <b>admin@mass.pe</b> y{" "}
              <b>123456</b> o cualquier correo válido y contraseña. No se envían
              datos ni se realiza autenticación real.
            </p>
          </div>
          <div className="login-help">
            ¿Inconvenientes de acceso?
            <button
              onClick={() => notify("Soporte TI Mass · Anexo 4422 (simulado)")}
            >
              Contacta a Soporte TI Mass ↗
            </button>
          </div>
        </div>
        <footer>
          TIENDAS MASS · PROTOTIPO UX NO OFICIAL<span>PERÚ · 2024</span>
        </footer>
      </section>
      {recover && (
        <Modal title="Recuperar contraseña" onClose={() => setRecover(false)}>
          <p>Simula una solicitud de recuperación de acceso.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setRecover(false);
              notify("Solicitud de recuperación simulada correctamente");
            }}
          >
            <label htmlFor="recover-email">Correo corporativo</label>
            <input
              id="recover-email"
              type="email"
              defaultValue={email}
              required
              placeholder="nombre@mass.pe"
            />
            <div className="modal-actions">
              <Button type="submit">Enviar solicitud</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
