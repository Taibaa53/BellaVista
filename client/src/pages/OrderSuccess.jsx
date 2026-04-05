import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="page page-narrow page-center success-page">
      <div className="success-icon" aria-hidden>
        ✓
      </div>
      <h1 className="page-title">Order placed</h1>
      <p className="muted">
        Thank you! We have received your order. The kitchen will prepare it
        shortly.
      </p>
      <Link to="/" className="btn btn-primary mt-lg">
        Back to menu
      </Link>
    </div>
  );
}
