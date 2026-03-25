import { prisma } from "../utils/prisma.js";
import { verifyToken } from "../utils/jwt.js";

function getTokenFromHeader(header = "") {
  if (!header.startsWith("Bearer ")) return null;
  return header.slice(7);
}

export async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req.headers.authorization);
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}
