import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createMenuItem,
  deleteMenuItem,
  fetchMenu,
  updateMenuItem,
} from "../../api.js";
import { getAdminToken } from "../../lib/adminSession.js";
import { MENU_CATEGORIES } from "../../constants/menuCategories.js";
import { formatInr } from "../../utils/inr.js";
import { handleMenuImageError } from "../../utils/imageFallback.js";

const emptyForm = () => ({
  name: "",
  category: MENU_CATEGORIES[0],
  price: "",
  image: "",
  isChefsSpecial: false,
});

export default function AdminMenu() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [tableError, setTableError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setListError("");
    setTableError("");
    setLoading(true);
    try {
      const data = await fetchMenu();
      setItems(data);
    } catch (e) {
      setListError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    setForm(emptyForm());
    setEditingId(null);
    setFormError("");
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      price: String(Math.round(item.price)),
      image: item.image,
      isChefsSpecial: Boolean(item.isChefsSpecial),
    });
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = getAdminToken();
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    setFormError("");
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      image: form.image.trim(),
      isChefsSpecial: form.isChefsSpecial,
    };

    try {
      if (editingId != null) {
        await updateMenuItem(token, editingId, payload);
      } else {
        await createMenuItem(token, payload);
      }
      await load();
      resetForm();
    } catch (err) {
      setFormError(err.message);
      if (!getAdminToken()) navigate("/admin/login", { replace: true });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row) {
    if (
      !window.confirm(
        `Remove "${row.name}" from the menu? This cannot be undone.`
      )
    ) {
      return;
    }
    const token = getAdminToken();
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    setTableError("");
    setDeletingId(row.id);
    try {
      await deleteMenuItem(token, row.id);
      if (editingId === row.id) resetForm();
      await load();
    } catch (err) {
      setTableError(err.message);
      if (!getAdminToken()) navigate("/admin/login", { replace: true });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page admin-menu-page">
      <h1 className="page-title">Menu items</h1>
      <p className="muted admin-page-desc mb-lg">
        Add dishes, edit prices and details, or remove items from the menu.
        Seeded dishes stay until you change or delete them.
      </p>

      <section className="summary-card admin-menu-form-card mb-lg">
        <h2 className="summary-heading">
          {editingId != null ? "Edit dish" : "Add new dish"}
        </h2>
        <form className="form admin-menu-form" onSubmit={handleSubmit}>
          <div className="admin-menu-form-grid">
            <label className="label">
              Name
              <input
                className="input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </label>
            <label className="label">
              Category
              <select
                className="input"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                {MENU_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="label">
              Price (₹)
              <input
                className="input"
                type="number"
                min={1}
                step={1}
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                required
              />
            </label>
            <label className="label admin-menu-checkbox">
              <input
                type="checkbox"
                checked={form.isChefsSpecial}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    isChefsSpecial: e.target.checked,
                  }))
                }
              />
              Chef&apos;s Special
            </label>
            <label className="label admin-menu-field-full">
              Image URL
              <input
                className="input"
                type="url"
                value={form.image}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.value }))
                }
                placeholder="https://…"
                required
              />
            </label>
          </div>
          {formError && <p className="error-text">{formError}</p>}
          <div className="form-actions admin-menu-form-actions">
            {editingId != null && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel edit
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? "Saving…"
                : editingId != null
                  ? "Save changes"
                  : "Add dish"}
            </button>
          </div>
        </form>
      </section>

      <h2 className="section-title section-title--admin-table">All dishes</h2>
      {loading && <p className="muted">Loading menu…</p>}
      {listError && <p className="error-text">{listError}</p>}
      {tableError && <p className="error-text mb-lg">{tableError}</p>}

      {!loading && !listError && (
        <div className="table-wrap">
          <table className="orders-table admin-menu-table">
            <thead>
              <tr>
                <th className="admin-menu-col-thumb" />
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Special</th>
                <th className="admin-menu-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="muted">
                    No dishes yet.
                  </td>
                </tr>
              )}
              {items.map((row) => (
                <tr key={row.id}>
                  <td>
                    <img
                      src={row.image}
                      alt=""
                      className="admin-menu-thumb"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={handleMenuImageError}
                    />
                  </td>
                  <td className="cell-strong">{row.name}</td>
                  <td>{row.category}</td>
                  <td>{formatInr(row.price)}</td>
                  <td>{row.isChefsSpecial ? "Yes" : "—"}</td>
                  <td>
                    <div className="admin-menu-actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => startEdit(row)}
                        disabled={deletingId === row.id}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm admin-menu-delete"
                        onClick={() => handleDelete(row)}
                        disabled={deletingId === row.id || saving}
                      >
                        {deletingId === row.id ? "Removing…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
