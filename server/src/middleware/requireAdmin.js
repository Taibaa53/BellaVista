import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    return res.status(503).json({ error: "Admin auth is not configured on the server" });
  }

  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, secret);
    if (payload.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}
