const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const job = await prisma.job.findFirst();
  if(!job) return console.log('no job');
  const id = job.id;
  const res = await prisma.job.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          name: true,
          owner: {
            select: { id: true, name: true }
          }
        }
      },
      applications: {
        orderBy: [
          { aiMatchScore: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          seeker: {
            select: { id: true, name: true, email: true, avatarUrl: true, headline: true }
          }
        }
      }
    }
  });
  console.log('success', res.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
