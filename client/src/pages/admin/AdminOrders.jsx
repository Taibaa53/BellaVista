import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../../api.js";
import { getAdminToken } from "../../lib/adminSession.js";
import { formatInr } from "../../utils/inr.js";

function formatItemsCell(items) {
  if (!Array.isArray(items)) return JSON.stringify(items);
  return items.map((i) => `${i.name} ×${i.quantity}`).join(", ");
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await fetchOrders(token);
      setOrders(data);
    } catch (e) {
      setError(e.message);
      if (!getAdminToken()) {
        navigate("/admin/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="page admin-page">
      <div className="admin-page-head">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="muted admin-page-desc">
            New orders also trigger an email to{" "}
            <code className="inline-code">ADMIN_EMAIL</code> when SMTP is
            configured.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={load}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {loading && <p className="muted mb-lg">Loading…</p>}
      {error && !loading && <p className="error-text mb-lg">{error}</p>}

      {!loading && !error && (
        <div className="table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    No orders yet.
                  </td>
                </tr>
              )}
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <div className="cell-strong">{o.customerName}</div>
                    <div className="small muted">{o.phone}</div>
                    {o.address && (
                      <div className="small muted">{o.address}</div>
                    )}
                  </td>
                  <td className="items-cell">{formatItemsCell(o.items)}</td>
                  <td>{formatInr(o.totalAmount)}</td>
                  <td>{o.orderType}</td>
                  <td className="nowrap">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
