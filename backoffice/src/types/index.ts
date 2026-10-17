export type ProductCategory =
  | "Abarrotes"
  | "Lácteos y Huevos"
  | "Limpieza del Hogar"
  | "Golosinas y Snacks"
  | "Conservas"
  | "Bebidas";
export type ProductStatus = "Activo" | "Inactivo";
export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: ProductCategory;
  brand: string;
  description: string;
  supplier: string;
  regularPrice: number;
  massPrice: number;
  status: ProductStatus;
  image: string;
  promotion: boolean;
}
export type StockStatus = "Óptimo" | "Por reponer" | "Agotado" | "Sobre-stock";
export interface InventoryItem {
  productId: string;
  stock: number;
  reserved: number;
  min: number;
  max: number;
  location: string;
}
export interface InventoryMovement {
  id: string;
  productId: string;
  type: string;
  quantity: number;
  time: string;
  note: string;
}
export interface Price {
  productId: string;
  regularPrice: number;
  massPrice: number;
}
export interface Promotion {
  id: string;
  name: string;
  start: string;
  end: string;
  enabled: boolean;
}
export type OrderStatus =
  "Pendiente" | "En preparación" | "En ruta" | "Entregado" | "Cancelado";
export type OrderPriority = "Alta" | "Normal" | "Baja";
export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}
export interface Order {
  id: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  storeId: string;
  status: OrderStatus;
  priority: OrderPriority;
  items: OrderItem[];
  notes: string;
  driver: string;
  vehicle: string;
  eta: string;
}
export type TrackingStatus = "Completado" | "Actual" | "Pendiente";
export interface TrackingEvent {
  kind?: "incident";
  id: string;
  orderId: string;
  title: string;
  time: string;
  description: string;
  status: TrackingStatus;
}
export interface Store {
  id: string;
  name: string;
  address: string;
}
export interface User {
  name: string;
  email: string;
  role: string;
}
export interface Notification {
  id: string;
  title: string;
  read: boolean;
}
