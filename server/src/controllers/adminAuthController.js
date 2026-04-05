import jwt from "jsonwebtoken";

export function adminLogin(req, res) {
  const username = String(req.body?.username ?? "").trim();
  const password = String(req.body?.password ?? "");

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!expectedUser || !expectedPass || !secret) {
    return res.status(503).json({
      error: "Admin login is not configured (set ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_JWT_SECRET)",
    });
  }

  if (username !== expectedUser || password !== expectedPass) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ role: "admin" }, secret, { expiresIn: "12h" });
  res.json({ token });
}
