import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fix() {
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@hakeemstore.com' }
  });
  console.log('Current admin role:', adminUser?.role);
  
  if (adminUser && adminUser.role !== 'ADMIN') {
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { role: 'ADMIN' }
    });
    console.log('Fixed admin role to ADMIN');
  }
  
  const products = await prisma.product.findMany();
  console.log('Total products:', products.length);
}

fix()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
