import crypto from "node:crypto";
import { prisma } from "../utils/prisma.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function register({ email, password, name }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("Email already exists");
    err.status = 409;
    throw err;
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      name,
      role: "admin",
    },
  });

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  return { token, user: sanitizeUser(user) };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  return { token, user: sanitizeUser(user) };
}

export async function me(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return sanitizeUser(user);
}

export async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { message: "If the email exists, a reset link has been generated." };
  }

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt },
  });

  return {
    message: "Reset link generated.",
    resetUrl: `/reset-password?token=${token}`,
    token,
  };
}

export async function resetPassword({ token, password }) {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    const err = new Error("Invalid or expired reset token");
    err.status = 400;
    throw err;
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash: await hashPassword(password) },
  });

  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return { message: "Password updated successfully." };
}
