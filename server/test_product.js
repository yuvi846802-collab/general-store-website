import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const category = await prisma.category.findFirst();
    if (!category) {
      console.log('No category found');
      return;
    }
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Test Description",
        price: 100,
        categoryId: category.id,
        image: "",
      }
    });
    console.log('Product created successfully:', product);
  } catch (err) {
    console.error('Error creating product:', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
