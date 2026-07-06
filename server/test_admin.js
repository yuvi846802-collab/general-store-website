import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.user.findUnique({ where: { email: 'admin@hakeemstore.com' } });
  console.log('Admin user:', admin);
}
main().catch(console.error).finally(() => prisma.$disconnect());
