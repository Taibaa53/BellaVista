import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { placeOrder } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { formatInr } from "../utils/inr.js";

export default function OrderSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, total, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const form = location.state;
  if (!form || !items.length) {
    return (
      <div className="page page-narrow page-center">
        <h1 className="page-title">Order summary</h1>
        <p className="muted">Nothing to show. Start from checkout.</p>
        <Link to="/checkout" className="btn btn-primary mt-lg">
          Go to checkout
        </Link>
      </div>
    );
  }

  async function handlePlaceOrder() {
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        customerName: form.customerName,
        phone: form.phone,
        address: form.orderType === "Delivery" ? form.address : null,
        orderType: form.orderType,
        items: items.map((i) => ({
          menuId: i.menuId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        totalAmount: total,
      };
      await placeOrder(payload);
      clearCart();
      navigate("/order-success", { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page page-narrow">
      <h1 className="page-title">Review your order</h1>
      <p className="muted mb-lg">
        Confirm your details and items before placing the order.
      </p>

      <section className="summary-card">
        <h2 className="summary-heading">Customer</h2>
        <dl className="dl">
          <dt>Name</dt>
          <dd>{form.customerName}</dd>
          <dt>Phone</dt>
          <dd>{form.phone}</dd>
          <dt>Order type</dt>
          <dd>{form.orderType}</dd>
          {form.orderType === "Delivery" && (
            <>
              <dt>Address</dt>
              <dd>{form.address || "—"}</dd>
            </>
          )}
        </dl>
      </section>

      <section className="summary-card mt-lg">
        <h2 className="summary-heading">Items</h2>
        <ul className="summary-items">
          {items.map((line) => (
            <li key={line.menuId} className="summary-line">
              <span>
                {line.name} × {line.quantity}
              </span>
              <span>{formatInr(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatInr(total)}</strong>
        </div>
      </section>

      {error && <p className="error-text mt-md">{error}</p>}

      <div className="form-actions mt-lg">
        <Link to="/checkout" className="btn btn-ghost">
          Edit details
        </Link>
        <button
          type="button"
          className="btn btn-primary"
          disabled={submitting}
          onClick={handlePlaceOrder}
        >
          {submitting ? "Placing…" : "Place order"}
        </button>
      </div>
    </div>
  );
}
