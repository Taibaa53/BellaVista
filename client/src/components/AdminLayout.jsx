import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken } from "../lib/adminSession.js";

export default function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="app app-customer">
      <header className="header">
        <div className="header-inner">
          <div className="logo-row">
            <Link to="/" className="logo">
              Bella Vista
            </Link>
            <span className="admin-badge">Admin</span>
          </div>
          <nav className="nav">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              Orders
            </NavLink>
            <NavLink
              to="/admin/menu"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              Menu items
            </NavLink>
            <Link to="/" className="nav-link">
              Restaurant
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={logout}
            >
              Log out
            </button>
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Bella Vista Restaurant — Fresh ingredients, warm atmosphere.</p>
      </footer>
    </div>
  );
}
