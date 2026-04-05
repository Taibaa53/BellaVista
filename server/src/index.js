import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Only load dotenv from file in local development
if (process.env.NODE_ENV !== "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.join(__dirname, "..", ".env") });
}

import menuRoutes from "./routes/menuRoutes.js";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "./controllers/menuController.js";
import { createOrder, listOrders } from "./controllers/orderController.js";
import { adminLogin } from "./controllers/adminAuthController.js";
import { requireAdmin } from "./middleware/requireAdmin.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true }));
app.use(express.json());

// Create an API router to handle the /api prefix from Vercel
const apiRouter = express.Router();

apiRouter.get("/health", (_req, res) => res.json({ ok: true }));
apiRouter.use("/menu", menuRoutes);
apiRouter.post("/order", createOrder);
apiRouter.post("/admin/login", adminLogin);
apiRouter.get("/orders", requireAdmin, listOrders);
apiRouter.post("/admin/menu", requireAdmin, createMenuItem);
apiRouter.put("/admin/menu/:id", requireAdmin, updateMenuItem);
apiRouter.delete("/admin/menu/:id", requireAdmin, deleteMenuItem);

// Mount the API router on /api
app.use("/api", apiRouter);

// Fallback for direct routes (if any)
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`API http://localhost:${PORT}`);
  });
}
