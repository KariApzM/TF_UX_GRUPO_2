(function(){
const STORAGE_KEYS = {
  cart: "mass.cart.v2",
  seeded: "mass.cartSeeded.v2",
  order: "mass.lastOrder.v1",
  orders: "mass.orders.v1"
};
const COUPONS = { MASS10: 0.1, CASERO20: 0.2 };
function couponDiscount(code, subtotal) {
  const rate = COUPONS[code.trim().toUpperCase()];
  return rate ? round(subtotal * rate) : 0;
}
const SAMPLE_PRODUCT_ID = 1;
const DELIVERY_FEE = 5;
function parseCart(raw, validIds, stockOf) {
  if (raw == null)
    return null;
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data))
      return null;
    const out = {};
    for (const [key, value] of Object.entries(data)) {
      const id = Number(key);
      if (!validIds.includes(id))
        continue;
      if (typeof value !== "number" || !Number.isInteger(value) || value < 1)
        continue;
      out[id] = Math.min(value, Math.max(stockOf(id), 0));
      if (out[id] < 1)
        delete out[id];
    }
    return out;
  } catch {
    return null;
  }
}
function initialCart(stored, alreadySeeded) {
  if (stored)
    return { cart: stored, seeded: true };
  if (alreadySeeded)
    return { cart: {}, seeded: true };
  return { cart: { [SAMPLE_PRODUCT_ID]: 1 }, seeded: true };
}
function addQuantity(cart, id, amount, stock) {
  if (!Number.isInteger(amount) || amount < 1 || stock < 1)
    return cart;
  const next = Math.min((cart[id] ?? 0) + amount, stock);
  return { ...cart, [id]: next };
}
function setQuantity(cart, id, qty, stock) {
  if (!(id in cart))
    return cart;
  const clamped = Math.max(1, Math.min(Math.floor(qty), stock));
  return { ...cart, [id]: clamped };
}
function removeItem(cart, id) {
  const copy = { ...cart };
  delete copy[id];
  return copy;
}
function totals(rows, mode, discount = 0) {
  const subtotal = round(rows.reduce((s, r) => s + r.price * r.quantity, 0));
  const shipping = rows.length === 0 || mode === "recojo" ? 0 : DELIVERY_FEE;
  const applied = Math.min(round(discount), subtotal);
  return { subtotal, shipping, discount: applied, total: round(subtotal - applied + shipping), units: rows.reduce((s, r) => s + r.quantity, 0) };
}
const round = (n) => Math.round(n * 100) / 100;
function validateCheckout(form, cartUnits, now = new Date) {
  const e = {};
  if (cartUnits < 1)
    e.cart = "Tu carrito está vacío.";
  if (form.name.trim().length < 3)
    e.name = "Ingresa tu nombre completo.";
  if (!/^9\d{8}$/.test(form.phone.replace(/\s/g, "")))
    e.phone = "Ingresa un celular de 9 dígitos que empiece con 9.";
  if (form.mode === "domicilio" && form.address.trim().length < 5)
    e.address = "Ingresa la dirección de entrega.";
  if (!form.payment)
    e.payment = "Elige un método de pago.";
  if (form.payment === "yape" && !form.yapeApproved)
    e.yape = "Primero pulsa “Simular pago”.";
  if (form.payment === "tarjeta") {
    const c = form.card;
    if (c.holder.trim().length < 3)
      e.holder = "Ingresa el nombre del titular.";
    if (!/^\d{16}$/.test(c.number.replace(/\s/g, "")))
      e.number = "El número debe tener 16 dígitos.";
    const m = /^(\d{2})\/(\d{2})$/.exec(c.expiry);
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12)
      e.expiry = "Usa el formato MM/AA.";
    else {
      const end = new Date(2000 + Number(m[2]), Number(m[1]), 1);
      if (end <= now)
        e.expiry = "La tarjeta está vencida.";
    }
    if (!/^\d{3,4}$/.test(c.cvv))
      e.cvv = "El CVV tiene 3 o 4 dígitos.";
  }
  return e;
}
function paymentStatusFor(payment, mode) {
  if (payment === "efectivo")
    return mode === "recojo" ? "Pago pendiente al recoger" : "Pago pendiente contra entrega";
  return "Pago simulado aprobado";
}
function parseOrder(raw) {
  if (!raw)
    return null;
  try {
    const o = JSON.parse(raw);
    if (o && typeof o.id === "string" && Array.isArray(o.lines) && typeof o.total === "number")
      return o;
  } catch {}
  return null;
}
function parseOrders(raw) {
  if (!raw)
    return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data))
      return [];
    return data.filter((o) => o && typeof o.id === "string" && Array.isArray(o.lines) && typeof o.total === "number");
  } catch {
    return [];
  }
}
const paymentLabel = {
  yape: "Yape (simulado)",
  tarjeta: "Tarjeta de crédito o débito (simulada)",
  efectivo: "Efectivo"
};

globalThis.MassLogic = {STORAGE_KEYS,COUPONS,SAMPLE_PRODUCT_ID,DELIVERY_FEE,couponDiscount,parseCart,initialCart,addQuantity,setQuantity,removeItem,totals,validateCheckout,paymentStatusFor,parseOrder,parseOrders,paymentLabel};
})();
