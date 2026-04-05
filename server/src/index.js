import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });
import cors from "cors";
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

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/menu", menuRoutes);
app.post("/order", createOrder);
app.post("/admin/login", adminLogin);
app.get("/orders", requireAdmin, listOrders);
app.post("/admin/menu", requireAdmin, createMenuItem);
app.put("/admin/menu/:id", requireAdmin, updateMenuItem);
app.delete("/admin/menu/:id", requireAdmin, deleteMenuItem);

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
