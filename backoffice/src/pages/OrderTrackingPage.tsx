import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Truck,
  Clock,
  ShieldCheck,
  Thermometer,
  MapPin,
  Navigation,
  User,
  TriangleAlert,
  Send,
  Printer,
  ScanLine,
} from "lucide-react";
import { useData } from "../app/AppDataProvider";
import {
  Button,
  PageHeading,
  Panel,
  Badge,
  EmptyState,
  Modal,
} from "../components/ui";
import OrderTimeline from "../components/orders/OrderTimeline";
export function RouteMap() {
  return (
    <div className="route-map">
      <svg
        viewBox="0 0 800 440"
        role="img"
        aria-label="Ruta visual simulada desde CEDI Lurín hasta Tienda Mass Próceres en Lima"
      >
        <defs>
          <pattern
            id="blocks"
            width="68"
            height="49"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-24)"
          >
            <rect width="68" height="49" fill="#edf0e9" />
            <rect x="5" y="5" width="58" height="39" rx="5" fill="#dfe4dc" />
            <path d="M0 0H68M0 0V49" stroke="white" strokeWidth="5" />
          </pattern>
          <filter id="routeShadow">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity=".15" />
          </filter>
        </defs>
        <rect width="800" height="440" fill="url(#blocks)" />
        <path d="M0 80Q130 140 145 240T220 440H0Z" fill="#bddce6" />
        <path d="M690 0L800 0V440H725Q650 350 730 235T690 0" fill="#d1dec4" />
        <path
          d="M180 440L230 350 340 300 430 260 500 195 540 135 650 70 690 0"
          fill="none"
          stroke="#fff"
          strokeWidth="22"
        />
        <path
          d="M80 100L280 130 420 190 780 270M240 0L350 150 430 260 500 440"
          fill="none"
          stroke="white"
          strokeWidth="13"
        />
        <path
          d="M230 350L340 300 430 260 500 195 540 135 650 70"
          fill="none"
          stroke="#00255b"
          strokeWidth="7"
          strokeDasharray="8 6"
          strokeLinecap="round"
        />
        <path
          d="M230 350L340 300 430 260"
          fill="none"
          stroke="#00255b"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle
          cx="230"
          cy="350"
          r="10"
          fill="#fff"
          stroke="#00255b"
          strokeWidth="5"
        />
        <circle
          cx="650"
          cy="70"
          r="12"
          fill="#fecb00"
          stroke="#00255b"
          strokeWidth="4"
        />
        <circle cx="430" cy="260" r="28" fill="#fecb00" fillOpacity=".3" />
        <circle
          cx="430"
          cy="260"
          r="18"
          fill="#fecb00"
          stroke="white"
          strokeWidth="4"
        />
        <path
          d="M420 264V251H433V264M433 255H440L444 261V264H433M423 264V268M439 264V268"
          fill="none"
          stroke="#00255b"
          strokeWidth="2"
        />
        <g fill="#7e897c" fontSize="11" fontFamily="Inter">
          <text x="312" y="344">
            LURÍN
          </text>
          <text x="285" y="244">
            SURCO
          </text>
          <text x="480" y="317">
            LA MOLINA
          </text>
          <text x="510" y="104">
            EL AGUSTINO
          </text>
          <text x="555" y="35">
            SAN JUAN DE LURIGANCHO
          </text>
          <text
            x="63"
            y="300"
            transform="rotate(-65 63 300)"
            fill="#5b99b1"
            letterSpacing="4"
          >
            OCÉANO PACÍFICO
          </text>
        </g>
        <g filter="url(#routeShadow)">
          <rect x="149" y="368" width="168" height="46" rx="7" fill="white" />
          <text x="162" y="388" fontSize="12" fontWeight="700" fill="#00255b">
            CEDI Lurín SPSA
          </text>
          <text x="162" y="403" fontSize="10" fill="#6d7788">
            Salida 12:45 PM · Km 38.5
          </text>
          <rect x="563" y="88" width="194" height="47" rx="7" fill="white" />
          <text x="575" y="108" fontSize="12" fontWeight="700" fill="#00255b">
            Tienda Mass #412
          </text>
          <text x="575" y="123" fontSize="10" fill="#6d7788">
            Av. Próceres de la Independencia
          </text>
          <rect x="363" y="290" width="139" height="27" rx="6" fill="#00255b" />
          <text x="377" y="308" fontSize="11" fontWeight="600" fill="white">
            48 km/h · Rbo. NNE
          </text>
        </g>
      </svg>
      <span className="map-demo-label">MAPA ILUSTRATIVO · SIN GPS REAL</span>
      <span className="map-north">N ↑</span>
    </div>
  );
}
export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const { state, dispatch, notify } = useData();
  const order = state.orders.find((o) => o.id === orderId);
  const [synced, setSynced] = useState(false);
  const [incident, setIncident] = useState(false);
  const [text, setText] = useState("");
  const incidents = state.tracking.filter(
    (e) => e.orderId === orderId && e.kind === "incident",
  );
  if (!order) return <EmptyState title="Pedido no encontrado" />;
  return (
    <>
      <Link to={`/pedidos/${order.id}`} className="breadcrumb">
        <ArrowLeft size={15} />
        Volver al pedido {order.id}
      </Link>
      <PageHeading
        eyebrow={`DESPACHO LOGÍSTICO / ${order.id}`}
        title="Seguimiento de Despacho"
        description="Control de la cadena de suministro · CEDI Lurín a tienda Mass"
        actions={
          <>
            <Badge>{order.status}</Badge>
            <Button
              variant="secondary"
              onClick={() => {
                setSynced(true);
                notify("Coordenadas de demostración sincronizadas");
              }}
            >
              <RefreshCw size={17} />
              Sincronizar GPS
            </Button>
          </>
        }
      />
      <div className="tracking-kpis kpi-grid">
        {[
          {
            label: "Estado actual",
            value:
              order.status === "En ruta" ? "En ruta (Km 18)" : order.status,
            note:
              order.status === "En ruta"
                ? "Vía de Evitamiento"
                : "Estado actualizado del pedido",
            icon: Truck,
            color: "blue",
          },
          {
            label: "Llegada estimada (ETA)",
            value: order.status === "En ruta" ? order.eta + " hrs" : "—",
            note:
              order.status === "En ruta"
                ? "Faltan 28 min · tráfico regular"
                : "Entrega según estado de la orden",
            icon: Clock,
            color: "gold",
          },
          {
            label: "Cumplimiento SLA",
            value: "99.1%",
            note: "En objetivo · ventana ±10 min",
            icon: ShieldCheck,
            color: "green",
          },
          {
            label: "Sensores de carga",
            value: "19.5°C",
            note: "Carga seca · furgón sellado",
            icon: Thermometer,
            color: "blue",
          },
        ].map((k) => (
          <div className={`kpi-card ${k.color}`} key={k.label}>
            <div className="kpi-top">
              {k.label}
              <k.icon size={21} />
            </div>
            <div className="tracking-value">{k.value}</div>
            <small>{k.note}</small>
          </div>
        ))}
      </div>
      <Panel
        title="Progreso de Entrega y Control de Cadena"
        subtitle={
          synced
            ? "Actualizado hace 1s · Simulación GPS"
            : "Actualizado hace 24 segundos · Simulación GPS"
        }
      >
        <OrderTimeline order={order} horizontal />
      </Panel>
      <div className="tracking-columns">
        <div>
          <Panel
            title="Cartografía de Despacho · Lima Metropolitana"
            subtitle="Ruta óptima de CEDI a tienda"
            action={
              <span className="soft-pill">
                <Navigation size={13} />
                GPS demo
              </span>
            }
          >
            <RouteMap />
            <div className="map-footer">
              <span>
                <MapPin size={15} />
                Distancia restante: <b>14.8 km</b>
              </span>
              <span>
                <Clock size={15} />
                Tiempo estimado: <b>28 min</b>
              </span>
              <Badge tone="warning">Congestión leve +8 min</Badge>
            </div>
          </Panel>
          <Panel
            title="Bitácora de Telemetría e Incidentes"
            subtitle="Registro simulado de control de marcha"
          >
            <div className="incident-list">
              {incidents.map((n, i) => (
                <div className="incident" key={i}>
                  <TriangleAlert size={19} />
                  <div>
                    <strong>Incidencia reportada</strong>
                    <p>{n.description}</p>
                    <small>Registrada en esta sesión</small>
                  </div>
                </div>
              ))}
              <div className="incident">
                <TriangleAlert size={19} />
                <div>
                  <strong>
                    Alerta de tráfico en ruta <small>14:02 PM</small>
                  </strong>
                  <p>
                    Congestión moderada en Peaje Separadora Industrial. Margen
                    de SLA compensado (+8 minutos).
                  </p>
                </div>
              </div>
              {[
                [
                  "Paso por Peaje Monterrico",
                  "13:50 PM",
                  "Telepeaje verificado. Temperatura estable a 19.5°C.",
                ],
                [
                  "Salida autorizada de CEDI Lurín",
                  "13:15 PM",
                  "Pesaje conforme y guía de remisión firmada.",
                ],
                [
                  "Carga completada en Andén 12",
                  "12:45 PM",
                  "Instalación de precinto inviolable #SL-9942.",
                ],
              ].map(([title, time, body]) => (
                <div className="incident plain" key={title}>
                  <span className="live-dot" />
                  <div>
                    <strong>
                      {title}
                      <small>{time}</small>
                    </strong>
                    <p>{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="panel-actions">
              <Button variant="secondary" onClick={() => setIncident(true)}>
                <TriangleAlert size={17} />
                Reportar incidencia
              </Button>
              <Button
                onClick={() =>
                  notify(
                    "Aviso de arribo próximo simulado para la tienda destino",
                  )
                }
              >
                <Send size={16} />
                Notificar a tienda
              </Button>
            </div>
          </Panel>
        </div>
        <aside>
          <Panel
            title="Transporte y Tripulación"
            action={<Badge tone="success">Habilitado</Badge>}
          >
            <div className="driver-card">
              <span className="avatar">JV</span>
              <div>
                <small>CONDUCTOR TITULAR</small>
                <strong>{order.driver}</strong>
                <small>Brevete A-IIIc · 9 años de experiencia</small>
              </div>
            </div>
            <div className="transport-info">
              <Truck size={23} />
              <div>
                <small>UNIDAD DE TRANSPORTE</small>
                <b>{order.vehicle}</b>
                <small>SOAT y revisión técnica vigentes</small>
              </div>
            </div>
            <div className="capacity">
              <span>
                Ocupación de carga<b>85%</b>
              </span>
              <div>
                <i />
              </div>
              <small>3.2 toneladas · 185 bultos · 4 pallets</small>
            </div>
            <div className="seal">
              <ShieldCheck size={18} />
              Precinto #SL-9942 · Sin aperturas
            </div>
            <Button
              variant="secondary"
              onClick={() =>
                notify("Canal simulado con Central CEDI Lurín disponible")
              }
            >
              Contactar central CEDI Lurín
            </Button>
          </Panel>
          <Panel title="Productos en transporte">
            <div className="tracking-products">
              {order.items.map((item) => (
                <div key={item.productId}>
                  <span>
                    {state.products.find((p) => p.id === item.productId)?.name}
                  </span>
                  <b>{item.quantity} und</b>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Acciones operativas">
            <div className="action-stack">
              <Button
                variant="secondary"
                onClick={() =>
                  notify("Escaneo simulado: precinto #SL-9942 verificado")
                }
              >
                <ScanLine size={18} />
                Escanear código
              </Button>
              <Button variant="secondary" onClick={() => window.print()}>
                <Printer size={18} />
                Imprimir guía
              </Button>
              <Link to={`/pedidos/${order.id}`} className="btn btn-primary">
                <ArrowLeft size={17} />
                Volver al pedido
              </Link>
            </div>
          </Panel>
        </aside>
      </div>
      {incident && (
        <Modal
          title="Reportar incidencia en ruta"
          onClose={() => setIncident(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({
                type: "INCIDENT",
                event: {
                  id: crypto.randomUUID(),
                  orderId: order.id,
                  title: "Incidencia reportada",
                  time: "Ahora",
                  description: text,
                  status: "Actual",
                  kind: "incident",
                },
              });
              setText("");
              setIncident(false);
              notify("Incidencia registrada en la bitácora");
            }}
          >
            <label>
              Tipo de incidencia
              <select>
                <option>Tráfico / demora</option>
                <option>Mercadería</option>
                <option>Vehículo</option>
                <option>Otro</option>
              </select>
            </label>
            <label>
              Descripción
              <textarea
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe la incidencia"
              />
            </label>
            <div className="modal-actions">
              <Button type="submit">Registrar incidencia</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
