
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);

  const users = [
    {
      name: 'Administrator',
      email: 'admin@test.com',
      role: 'ADMIN',
    },
    {
      name: 'User Satu',
      email: 'user1@test.com',
      role: 'USER',
    },
    {
      name: 'User Dua',
      email: 'user2@test.com',
      role: 'USER',
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        passwordHash,
      },
    });
  }

  console.log('Default users seeded successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
