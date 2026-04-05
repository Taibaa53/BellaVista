import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSummary from "./pages/OrderSummary.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminMenu from "./pages/admin/AdminMenu.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminOrders />} />
          <Route path="menu" element={<AdminMenu />} />
        </Route>
      </Route>
    </Routes>
  );
}
