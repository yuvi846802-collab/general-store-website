import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.heroSlide.findMany().then(res => console.log(res)).catch(e => console.error(e)).finally(() => prisma.$disconnect());
