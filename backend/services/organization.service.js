import { prisma } from "../utils/prisma.js";

export function listOrganizations() {
  return prisma.organization.findMany({
    include: {
      creator: { select: { id: true, email: true, name: true } },
      _count: { select: { mediaItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createOrganization(data, userId) {
  return prisma.organization.create({
    data: {
      name: data.name,
      code: data.code || null,
      description: data.description || null,
      status: data.status || "active",
      createdBy: userId,
    },
  });
}

export async function updateOrganization(id, data) {
  return prisma.organization.update({
    where: { id },
    data: {
      name: data.name,
      code: data.code || null,
      description: data.description || null,
      status: data.status || "active",
    },
  });
}

export async function deleteOrganization(id) {
  return prisma.organization.delete({ where: { id } });
}
