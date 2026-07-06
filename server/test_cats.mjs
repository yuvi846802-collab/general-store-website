import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const cats = await prisma.category.findMany();
  cats.forEach(c => console.log(c.name, c.image));
  await prisma.$disconnect();
}
run();
