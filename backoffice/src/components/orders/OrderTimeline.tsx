import { Check, Truck, Warehouse } from "lucide-react";
import { useData } from "../../app/AppDataProvider";
import type { Order } from "../../types";
export default function OrderTimeline({
  order,
  horizontal = false,
}: {
  order: Order;
  horizontal?: boolean;
}) {
  const { state } = useData();
  const events = state.tracking.filter(
    (t) => t.orderId === order.id && !t.kind,
  );
  const activeStep =
    order.status === "Entregado"
      ? 6
      : order.status === "En ruta"
        ? 4
        : order.status === "En preparación"
          ? 2
          : 0;
  const fallback = [
    "Pedido creado",
    "Aprobado",
    "Picking",
    "Despachado",
    "En ruta",
    "Recepción",
  ].map((title, i) => ({
    id: String(i),
    title,
    time: i === 0 ? order.time : "Pendiente",
    description: "Operación de demostración",
    status: i === 0 ? "Actual" : "Pendiente",
  }));
  return (
    <div
      className={`order-timeline ${horizontal ? "horizontal" : ""} ${order.status === "Cancelado" ? "cancelled-timeline" : ""}`}
    >
      {(events.length ? events : fallback).map((event, i) => {
        const completed =
          order.status === "Entregado" ||
          (order.status !== "Cancelado" && i < activeStep);
        const current =
          order.status !== "Cancelado" &&
          order.status !== "Entregado" &&
          i === activeStep;
        return (
          <div
            key={event.id}
            className={`timeline-event ${completed ? "complete" : current ? "current" : ""}`}
          >
            <span className="timeline-marker">
              {completed ? (
                <Check size={16} />
              ) : i === 4 ? (
                <Truck size={17} />
              ) : i === 5 ? (
                <Warehouse size={16} />
              ) : (
                i + 1
              )}
            </span>
            <div>
              <strong>{event.title}</strong>
              <small>
                {order.status === "Cancelado"
                  ? "Pedido cancelado"
                  : completed
                    ? event.time
                    : current
                      ? "En progreso"
                      : "Pendiente"}
              </small>
              {!horizontal && <p>{event.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
