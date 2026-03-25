import path from "node:path";
import { prisma } from "../utils/prisma.js";

export function listMedia({ type, organizationId }) {
  return prisma.mediaItem.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(organizationId ? { organizationId } : {}),
    },
    include: {
      creator: { select: { id: true, email: true, name: true } },
      organization: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createMedia({ file, body, userId }) {
  if (!file) {
    const err = new Error("File is required");
    err.status = 400;
    throw err;
  }

  const relativeFilePath = path.relative(process.cwd(), file.path).replaceAll("\\", "/");

  return prisma.mediaItem.create({
    data: {
      name: body.name || file.originalname,
      type: body.type || detectMediaType(file.mimetype),
      mimeType: file.mimetype,
      filePath: relativeFilePath,
      fileUrl: `/${relativeFilePath}`,
      fileSize: file.size,
      tags: body.tags || null,
      description: body.description || null,
      organizationId: body.organizationId || null,
      createdBy: userId,
    },
  });
}

export async function deleteMedia(id) {
  return prisma.mediaItem.delete({ where: { id } });
}

function detectMediaType(mimeType = "") {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "music";
  return "file";
}
