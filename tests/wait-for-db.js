import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const maxRetries = 30;
let retries = 0;

async function waitForDatabase() {
  while (retries < maxRetries) {
    try {
      await prisma.$connect();
      console.log('Database is ready!');
      await prisma.$disconnect();
      process.exit(0);
    } catch (error) {
      retries++;
      console.log(`Waiting for database... (${retries}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.error('Database connection timeout');
  process.exit(1);
}

waitForDatabase();