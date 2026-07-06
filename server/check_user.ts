import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'yuvrajpaajisardar@gmail.com';
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (user) {
    console.log("User found:", user.email);
    const isValid = await bcrypt.compare('admin123', user.password);
    console.log("Password 'admin123' is valid?", isValid);
  } else {
    console.log("User not found!");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
