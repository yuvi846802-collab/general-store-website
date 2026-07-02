const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 12);
  
  const user = await prisma.user.upsert({
    where: { email: "yuvrajpaajisardar@gmail.com" },
    update: {
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isVerified: true
    },
    create: {
      firstName: "Yuvraj",
      lastName: "Singh",
      name: "Yuvraj Singh",
      email: "yuvrajpaajisardar@gmail.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isVerified: true,
      phone: "9999999999",
      verificationToken: "verified",
    }
  });
  
  console.log("Successfully created/updated admin:", user.email);
}

createAdmin().catch(console.error).finally(() => prisma.$disconnect());
