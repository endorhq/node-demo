import { PrismaClient } from '@prisma/client';

const maxRetries = 120; // 2 minutes with 1 second intervals
let retries = 0;

// Get database URL from environment or use default
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/rocket_countdown';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForDatabase() {
  console.log(`Waiting for database at ${databaseUrl}`);
  
  // Create a new Prisma client for each attempt to avoid connection pooling issues
  while (retries < maxRetries) {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      },
      log: retries > 30 ? ['error'] : [] // Only log errors after 30 attempts
    });
    
    try {
      // Try a simple query to check if database is ready
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database is ready!');
      await prisma.$disconnect();
      process.exit(0);
    } catch (error) {
      retries++;
      
      // Log progress every 10 attempts
      if (retries % 10 === 0) {
        console.log(`Still waiting for database... (${retries}/${maxRetries})`);
      }
      
      // Disconnect to clean up any partial connections
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        // Ignore disconnect errors
      }
      
      // Wait before next attempt
      await sleep(1000);
    }
  }
  
  console.error('❌ Database connection timeout after', maxRetries, 'seconds');
  process.exit(1);
}

// Run the wait function
waitForDatabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});