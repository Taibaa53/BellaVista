import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatInr } from "../utils/inr.js";
import { handleMenuImageError } from "../utils/imageFallback.js";

export default function Cart() {
  const { items, setQuantity, removeItem, total } = useCart();

  if (!items.length) {
    return (
      <div className="page page-narrow page-center">
        <h1 className="page-title">Your cart</h1>
        <p className="muted">Your cart is empty.</p>
        <Link to="/" className="btn btn-primary mt-lg">
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="page page-narrow">
      <h1 className="page-title">Your cart</h1>
      <ul className="cart-list">
        {items.map((line) => (
          <li key={line.menuId} className="cart-row">
            <img
              src={line.image}
              alt=""
              className="cart-thumb"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={handleMenuImageError}
            />
            <div className="cart-row-main">
              <span className="cart-name">{line.name}</span>
              <span className="muted small">{formatInr(line.price)} each</span>
            </div>
            <div
              className="cart-qty-controls"
              role="group"
              aria-label={`Quantity for ${line.name}`}
            >
              <button
                type="button"
                className="btn cart-qty-btn"
                onClick={() =>
                  setQuantity(line.menuId, line.quantity - 1)
                }
                aria-label={`Decrease ${line.name}`}
              >
                −
              </button>
              <span className="cart-qty-value" aria-live="polite">
                {line.quantity}
              </span>
              <button
                type="button"
                className="btn cart-qty-btn"
                onClick={() =>
                  setQuantity(line.menuId, line.quantity + 1)
                }
                aria-label={`Increase ${line.name}`}
              >
                +
              </button>
            </div>
            <div className="cart-line-total">
              {formatInr(line.price * line.quantity)}
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-remove"
              onClick={() => removeItem(line.menuId)}
              aria-label={`Remove ${line.name}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-footer">
        <div className="cart-total-row">
          <span>Total</span>
          <strong>{formatInr(total)}</strong>
        </div>
        <Link to="/checkout" className="btn btn-primary btn-lg btn-block">
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
