import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Checkout() {
  const navigate = useNavigate();
  const { items } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderType, setOrderType] = useState("Dine-in");

  if (!items.length) {
    return (
      <div className="page page-narrow page-center">
        <h1 className="page-title">Checkout</h1>
        <p className="muted">Your cart is empty.</p>
        <Link to="/" className="btn btn-primary mt-lg">
          Browse menu
        </Link>
      </div>
    );
  }

  function handleReview(e) {
    e.preventDefault();
    navigate("/order-summary", {
      replace: false,
      state: {
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: orderType === "Delivery" ? address.trim() : "",
        orderType,
      },
    });
  }

  return (
    <div className="page page-narrow">
      <h1 className="page-title">Order details</h1>
      <p className="muted mb-lg">
        Fill in your details. You will review everything on the next step.
      </p>
      <form className="form" onSubmit={handleReview}>
        <label className="label">
          Name
          <input
            className="input"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            autoComplete="name"
          />
        </label>
        <label className="label">
          Phone number
          <input
            className="input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
          />
        </label>
        <fieldset className="fieldset">
          <legend className="legend">Order type</legend>
          <label className="radio-row">
            <input
              type="radio"
              name="orderType"
              checked={orderType === "Dine-in"}
              onChange={() => setOrderType("Dine-in")}
            />
            Dine-in
          </label>
          <label className="radio-row">
            <input
              type="radio"
              name="orderType"
              checked={orderType === "Delivery"}
              onChange={() => setOrderType("Delivery")}
            />
            Delivery
          </label>
        </fieldset>
        {orderType === "Delivery" && (
          <label className="label">
            Delivery address
            <textarea
              className="input textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required={orderType === "Delivery"}
              rows={3}
              placeholder="Street, city, notes for driver…"
            />
          </label>
        )}
        <div className="form-actions">
          <Link to="/cart" className="btn btn-ghost">
            Back to cart
          </Link>
          <button type="submit" className="btn btn-primary">
            Review order
          </button>
        </div>
      </form>
    </div>
  );
}
