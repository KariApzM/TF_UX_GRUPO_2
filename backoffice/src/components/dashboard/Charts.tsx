import { weeklySales } from "../../mocks/dashboard";
export function SalesChart({ range = "Hoy" }: { range?: string }) {
  const multiplier = range === "Mes" ? 1.12 : range === "7 días" ? 0.9 : 1;
  const points = weeklySales
    .map((v, i) => `${55 + i * 90},${225 - v * 2.2 * multiplier}`)
    .join(" ");
  return (
    <div className="chart-wrap">
      <div className="chart-legend">
        <span>
          <i />
          Ventas (Miles S/)
        </span>
        <span>
          <i className="yellow" />
          Pedidos (#)
        </span>
        <span>
          <i className="gray" />
          Semana pasada
        </span>
      </div>
      <svg
        viewBox="0 0 650 270"
        role="img"
        aria-label={`Ventas y pedidos semanales, rango ${range}`}
      >
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00255b" stopOpacity=".14" />
            <stop offset="100%" stopColor="#00255b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line
              x1="45"
              y1={35 + i * 47}
              x2="625"
              y2={35 + i * 47}
              stroke="#e9edf4"
              strokeDasharray="4 4"
            />
            <text x="2" y={39 + i * 47} fill="#8a94a6" fontSize="10">
              S/ {80 - i * 20}k
            </text>
          </g>
        ))}
        <polyline
          points="55,170 145,155 235,168 325,140 415,160 505,110 595,150"
          fill="none"
          stroke="#b9c2d1"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        {weeklySales.map((v, i) => (
          <rect
            key={i}
            x={42 + i * 90}
            y={225 - v * 1.5 * multiplier}
            width="25"
            height={v * 1.5 * multiplier}
            rx="4"
            fill="#fecb00"
            opacity={i === 3 ? 1 : 0.55}
          />
        ))}
        <polygon points={`55,225 ${points} 595,225`} fill="url(#area)" />
        <polyline
          points={points}
          fill="none"
          stroke="#00255b"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {weeklySales.map((v, i) => (
          <circle
            key={i}
            cx={55 + i * 90}
            cy={225 - v * 2.2 * multiplier}
            r={i === 3 ? 5 : 3.5}
            fill={i === 3 ? "#fecb00" : "#fff"}
            stroke="#00255b"
            strokeWidth="2"
          />
        ))}
        {[
          "Lun 21",
          "Mar 22",
          "Mié 23",
          "Hoy (Jue)",
          "Vie 25",
          "Sáb 26",
          "Dom 27",
        ].map((day, i) => (
          <text
            key={day}
            x={55 + i * 90}
            y="255"
            fill={i === 3 ? "#00255b" : "#8892a2"}
            fontWeight={i === 3 ? "700" : "400"}
            fontSize="10"
            textAnchor="middle"
          >
            {day}
          </text>
        ))}
      </svg>
    </div>
  );
}
export function OrdersChart() {
  return (
    <div className="orders-chart">
      <div className="donut">
        <div>
          <strong>381</strong>
          <small>Total hoy</small>
        </div>
      </div>
      <div className="donut-legend">
        {[
          ["Entregados con éxito", "145", "38%", "green"],
          ["En ruta / despachados", "133", "35%", "blue"],
          ["En preparación", "84", "22%", "gold"],
          ["Observados / quiebre", "19", "5%", "red"],
        ].map(([label, n, p, c]) => (
          <div key={label}>
            <i className={c} />
            <span>{label}</span>
            <b>{n}</b>
            <small>{p}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
