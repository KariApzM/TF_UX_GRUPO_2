import { useState } from "react";
import { History } from "lucide-react";
import { useData } from "../../app/AppDataProvider";
import { Modal, Button, EmptyState } from "../ui";
export default function InventoryDialog({
  mode,
  initialId,
  historyId,
  onClose,
}: {
  mode: "adjust" | "transfer" | "history";
  initialId: string;
  historyId: string | null;
  onClose: () => void;
}) {
  const { state, dispatch, notify } = useData();
  const [id, setId] = useState(initialId);
  const [quantity, setQuantity] = useState(
    mode === "transfer"
      ? 1
      : state.inventory.find((i) => i.productId === initialId)!.stock,
  );
  const [note, setNote] = useState("");
  const [target, setTarget] = useState("Almacén trasero");
  const [error, setError] = useState("");
  return (
    <Modal
      title={
        mode === "history"
          ? "Libro de Kardex"
          : mode === "transfer"
            ? "Transferencia de inventario"
            : "Actualizar stock"
      }
      onClose={() => onClose()}
    >
      {mode === "history" ? (
        <div className="movement-list">
          {state.movements
            .filter((m) => !historyId || m.productId === historyId)
            .map((m) => (
              <div key={m.id}>
                <History size={20} />
                <div>
                  <strong>
                    {state.products.find((p) => p.id === m.productId)?.name}
                  </strong>
                  <small>
                    {m.type} · {m.time}
                  </small>
                  <small>{m.note}</small>
                </div>
                <b>
                  {m.quantity > 0 ? "+" : ""}
                  {m.quantity}
                </b>
              </div>
            ))}
          {!state.movements.some(
            (m) => !historyId || m.productId === historyId,
          ) && <EmptyState title="Sin movimientos para este producto" />}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const item = state.inventory.find((i) => i.productId === id)!;
            if (mode === "transfer") {
              if (quantity > item.stock - item.reserved) {
                setError(
                  "La cantidad supera el stock disponible sin reservar.",
                );
                return;
              }
              dispatch({
                type: "STOCK",
                productId: id,
                stock: item.stock - quantity,
                note: `Transferencia a ${target}: ${note}`,
              });
              notify(
                "Transferencia registrada · unidades descontadas del recinto de origen",
              );
            } else {
              if (quantity < item.reserved) {
                setError(
                  "El stock no puede ser menor a la cantidad reservada.",
                );
                return;
              }
              dispatch({
                type: "STOCK",
                productId: id,
                stock: quantity,
                note,
              });
              notify("Stock actualizado");
            }
            onClose();
          }}
        >
          <label>
            Producto
            <select
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                if (mode === "adjust")
                  setQuantity(
                    state.inventory.find((i) => i.productId === e.target.value)!
                      .stock,
                  );
              }}
            >
              {state.products.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {mode === "transfer"
              ? "Unidades a transferir"
              : "Nuevo stock actual"}
            <input
              type="number"
              min={mode === "transfer" ? 1 : 0}
              step="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </label>
          {mode === "transfer" && (
            <label>
              Destino
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option>Almacén trasero</option>
                <option>Tienda #104 Canto Grande</option>
                <option>CEDI Lurín</option>
              </select>
            </label>
          )}
          <label>
            Motivo / observación
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
              placeholder="Indica el motivo del movimiento"
            />
          </label>
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <Button variant="secondary" type="button" onClick={() => onClose()}>
              Cancelar
            </Button>
            <Button type="submit">Guardar movimiento</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
