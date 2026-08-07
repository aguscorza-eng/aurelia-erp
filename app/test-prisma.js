const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Conectando...");

  const total = await prisma.product.count();
  console.log("Total:", total);

  const products = await prisma.product.findMany();
  console.log(products);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });