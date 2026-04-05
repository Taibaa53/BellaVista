import { useEffect, useMemo, useState } from "react";
import { fetchMenu } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { formatInr } from "../utils/inr.js";
import { MENU_CATEGORIES } from "../constants/menuCategories.js";
import { handleMenuImageError } from "../utils/imageFallback.js";

function MenuCard({ item, onAdd, chefsSpecial, showAdded }) {
  return (
    <article
      className={"menu-card" + (chefsSpecial ? " menu-card--special" : "")}
    >
      <div className="menu-card-image-wrap">
        {chefsSpecial && (
          <span className="chefs-special-badge">Chef&apos;s Special</span>
        )}
        <img
          src={item.image}
          alt=""
          className="menu-card-image"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleMenuImageError}
        />
      </div>
      <div className="menu-card-body">
        <h3 className="menu-card-name">{item.name}</h3>
        <p className="menu-card-price">{formatInr(item.price)}</p>
        <button
          type="button"
          className={
            "btn btn-primary btn-block menu-add-btn" +
            (showAdded ? " menu-add-btn--flash" : "")
          }
          onClick={() => onAdd(item)}
        >
          {showAdded ? "Added to cart ✓" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [flashItemId, setFlashItemId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (flashItemId == null) return;
    const t = setTimeout(() => setFlashItemId(null), 750);
    return () => clearTimeout(t);
  }, [flashItemId]);

  function handleAddToCart(item) {
    addToCart(item);
    setFlashItemId(item.id);
  }

  useEffect(() => {
    fetchMenu()
      .then(setMenu)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const { specials, grouped } = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matchesSearch = (item) =>
      !q || item.name.toLowerCase().includes(q);
    const matchesCategory = (item) =>
      categoryFilter === "All" || item.category === categoryFilter;

    const specialsList = menu.filter(
      (m) =>
        m.isChefsSpecial &&
        matchesSearch(m) &&
        matchesCategory(m)
    );

    const regular = menu.filter(
      (m) =>
        !m.isChefsSpecial &&
        matchesSearch(m) &&
        matchesCategory(m)
    );

    const map = new Map();
    for (const c of MENU_CATEGORIES) map.set(c, []);
    for (const item of regular) {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    }

    return { specials: specialsList, grouped: map };
  }, [menu, search, categoryFilter]);

  const hasAnyResults =
    specials.length > 0 ||
    MENU_CATEGORIES.some((c) => (grouped.get(c) || []).length > 0);

  if (loading) {
    return (
      <div className="page-center">
        <p className="muted">Loading menu…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-center">
        <p className="error-text">Could not load menu: {error}</p>
        <p className="muted small">
          Start the API server, set DATABASE_URL to your Supabase Postgres URL, run
          Prisma migrate deploy (or db push) and seed, then refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="page home">
      <section className="hero">
        <h1 className="hero-title">Taste the season</h1>
        <p className="hero-sub">
          Browse our menu and add favorites to your cart. Dine in or get
          delivery. Prices in Indian Rupees (₹).
        </p>
      </section>

      <div className="menu-toolbar">
        <label className="menu-search-wrap">
          <span className="sr-only">Search dishes</span>
          <input
            type="search"
            className="input menu-search-input"
            placeholder="Search by dish name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label className="menu-filter-wrap">
          <span className="menu-filter-label">Category</span>
          <select
            className="input menu-filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All categories</option>
            {MENU_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!hasAnyResults && (
        <p className="muted menu-empty">
          No dishes match your search or filter. Try clearing the search or
          choosing &quot;All categories&quot;.
        </p>
      )}

      {specials.length > 0 && (
        <section className="menu-section menu-section--specials" id="specials">
          <div className="specials-section-head">
            <h2 className="section-title section-title--specials">
              Today&apos;s Special
            </h2>
            <p className="muted specials-tagline">
              Hand-picked by our chef — limited attention each service.
            </p>
          </div>
          <div className="card-grid card-grid--specials">
            {specials.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAdd={handleAddToCart}
                chefsSpecial
                showAdded={flashItemId === item.id}
              />
            ))}
          </div>
        </section>
      )}

      {MENU_CATEGORIES.map((category) => {
        const items = grouped.get(category) || [];
        if (!items.length) return null;
        return (
          <section key={category} className="menu-section" id={category}>
            <h2 className="section-title">{category}</h2>
            <div className="card-grid">
              {items.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAdd={handleAddToCart}
                  chefsSpecial={false}
                  showAdded={flashItemId === item.id}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
