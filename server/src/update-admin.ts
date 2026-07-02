import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating Admin Password...');

  const email = 'admin@hakeemstore.com';
  const newPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  console.log('Admin password updated successfully!');
  console.log(`Email: ${email}`);
  console.log(`New Password: ${newPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
