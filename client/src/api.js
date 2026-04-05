import { clearAdminToken } from "./lib/adminSession.js";

const base = import.meta.env.VITE_API_URL || "/api";

async function handle(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export function fetchMenu() {
  return fetch(`${base}/menu`).then(handle);
}

export function placeOrder(body) {
  return fetch(`${base}/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(handle);
}

export function adminLogin(username, password) {
  return fetch(`${base}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then(handle);
}

export function fetchOrders(token) {
  return fetch(`${base}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (res) => {
    if (res.status === 401) {
      clearAdminToken();
    }
    return handle(res);
  });
}

export function createMenuItem(token, body) {
  return fetch(`${base}/admin/menu`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then(async (res) => {
    if (res.status === 401) clearAdminToken();
    return handle(res);
  });
}

export function updateMenuItem(token, id, body) {
  return fetch(`${base}/admin/menu/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then(async (res) => {
    if (res.status === 401) clearAdminToken();
    return handle(res);
  });
}

export function deleteMenuItem(token, id) {
  return fetch(`${base}/admin/menu/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (res) => {
    if (res.status === 401) clearAdminToken();
    if (res.status === 204) return null;
    return handle(res);
  });
}
