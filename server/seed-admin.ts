import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const email = 'yuvrajpaajisardar@gmail.com';

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isVerified: true
    },
    create: {
      email,
      password: hashedPassword,
      firstName: 'Yuvraj',
      lastName: 'Singh',
      name: 'Yuvraj Singh',
      role: 'SUPER_ADMIN',
      isVerified: true
    }
  });
  console.log('Admin user updated:', user.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
