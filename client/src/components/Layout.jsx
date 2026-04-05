import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Layout() {
  const { count, cartPulse } = useCart();
  const [badgePop, setBadgePop] = useState(false);

  useEffect(() => {
    if (cartPulse <= 0) return;
    setBadgePop(true);
    const t = setTimeout(() => setBadgePop(false), 550);
    return () => clearTimeout(t);
  }, [cartPulse]);

  return (
    <div className="app app-customer">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            Bella Vista
          </Link>
          <nav className="nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              Menu
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                "nav-link cart-link" + (isActive ? " active" : "")
              }
            >
              Cart
              {count > 0 && (
                <span className={"badge" + (badgePop ? " badge--pop" : "")}>
                  {count}
                </span>
              )}
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Bella Vista Restaurant — Fresh ingredients, warm atmosphere.</p>
        <Link to="/admin/login" className="footer-admin-link">
          Admin login
        </Link>
      </footer>
    </div>
  );
}
