import { prisma } from "../lib/prisma.js";

const MENU_CATEGORIES = [
  "Starters",
  "Main Course",
  "Desserts",
  "Beverages",
];

function validateMenuBody(body) {
  const name = String(body?.name ?? "").trim();
  const category = body?.category;
  const image = String(body?.image ?? "").trim();
  const price = Number(body?.price);
  const isChefsSpecial = Boolean(body?.isChefsSpecial);

  if (!name) return { error: "name is required" };
  if (!MENU_CATEGORIES.includes(category)) {
    return { error: "category must be one of: " + MENU_CATEGORIES.join(", ") };
  }
  if (!image) return { error: "image URL is required" };
  if (Number.isNaN(price) || price <= 0) return { error: "price must be a positive number" };

  return {
    data: { name, category, price, image, isChefsSpecial },
  };
}

export async function getMenu(_req, res, next) {
  try {
    const items = await prisma.menu.findMany({ orderBy: { name: "asc" } });
    res.json(items);
  } catch (e) {
    next(e);
  }
}

export async function createMenuItem(req, res, next) {
  try {
    const parsed = validateMenuBody(req.body);
    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }
    const item = await prisma.menu.create({ data: parsed.data });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
}

export async function updateMenuItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "invalid id" });
    }
    const parsed = validateMenuBody(req.body);
    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }
    const item = await prisma.menu.update({
      where: { id },
      data: parsed.data,
    });
    res.json(item);
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "Dish not found" });
    }
    next(e);
  }
}

export async function deleteMenuItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "invalid id" });
    }
    await prisma.menu.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "Dish not found" });
    }
    next(e);
  }
}
