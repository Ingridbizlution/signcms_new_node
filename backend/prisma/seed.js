import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@signcms.local";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123456";
  const name = process.env.SEED_ADMIN_NAME || "SignCMS Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, 10),
        name,
        role: "admin",
      },
    });
    console.log(`Seeded admin user: ${email} / ${password}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
