const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          posts: true,
          companies: true,
          applications: true
        }
      }
    }
  });
  console.log('success', users.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
