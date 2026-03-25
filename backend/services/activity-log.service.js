import { prisma } from "../utils/prisma.js";

export async function createActivityLog(data) {
  return prisma.activityLog.create({
    data,
  });
}
