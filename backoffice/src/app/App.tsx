import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import CatalogPage from "../pages/CatalogPage";
import ProductFormPage from "../pages/ProductFormPage";
import InventoryPage from "../pages/InventoryPage";
import PricesPage from "../pages/PricesPage";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import OrderTrackingPage from "../pages/OrderTrackingPage";
import ReportsPage from "../pages/ReportsPage";
export default function App() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/catalogo"
          element={<CatalogPage key={location.search} />}
        />
        <Route path="/catalogo/nuevo" element={<ProductFormPage key="new" />} />
        <Route
          path="/catalogo/:productId/editar"
          element={<ProductFormPage key={location.pathname} />}
        />
        <Route path="/precios" element={<PricesPage />} />
        <Route path="/inventario" element={<InventoryPage />} />
        <Route path="/pedidos" element={<OrdersPage key={location.search} />} />
        <Route
          path="/pedidos/:orderId"
          element={<OrderDetailPage key={location.pathname} />}
        />
        <Route
          path="/pedidos/:orderId/seguimiento"
          element={<OrderTrackingPage key={location.pathname} />}
        />
        <Route path="/reportes" element={<ReportsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
