import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../../api.js";
import { getAdminToken, setAdminToken } from "../../lib/adminSession.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getAdminToken()) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { token } = await adminLogin(username.trim(), password);
      setAdminToken(token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app app-customer">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            Bella Vista
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">
              Menu
            </Link>
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="page page-narrow admin-login-main">
          <div className="summary-card admin-login-card">
            <h1 className="page-title">Staff login</h1>
            <p className="muted mb-lg">
              Sign in to view orders. Customers use the main site — no account
              needed.
            </p>
            <form className="form" onSubmit={handleSubmit}>
              <label className="label">
                Username
                <input
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>
              <label className="label">
                Password
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>
              {error && <p className="error-text">{error}</p>}
              <button
                type="submit"
                className="btn btn-primary btn-block mt-md"
                disabled={submitting}
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
            <p className="muted small mt-lg text-center">
              <Link to="/" className="nav-link-inline">
                ← Back to restaurant
              </Link>
            </p>
          </div>
        </div>
      </main>
      <footer className="footer">
        <p>Bella Vista Restaurant — Fresh ingredients, warm atmosphere.</p>
      </footer>
    </div>
  );
}
