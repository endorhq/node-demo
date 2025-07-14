import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const maxRetries = 120; // 2 minutes with 1 second intervals
let retries = 0;

// Get database URL from environment or use default
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/rocket_countdown';
// Get the database URL
const dbName = databaseUrl.split('/').pop();

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createDatabaseIfNeeded() {
  // First connect to the default 'postgres' database
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: baseUrl
      }
    }
  });

  try {
    // Check if our database exists
    const result = await prisma.$queryRaw`
      SELECT 1 FROM pg_database WHERE datname = ${dbName}
    `;
    
    if (result.length === 0) {
      console.log(`Creating database '${dbName}'...`);
      await prisma.$executeRawUnsafe(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } else {
      console.log(`Database '${dbName}' already exists`);
    }
  } catch (error) {
    // If we can't even connect to postgres database, the server isn't ready
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function waitForDatabase() {
  console.log(`Waiting for PostgreSQL server at ${databaseUrl}`);
  
  // First, wait for PostgreSQL server to be ready
  while (retries < maxRetries) {
    try {
      await createDatabaseIfNeeded();
      break; // Server is ready and database exists
    } catch (error) {
      retries++;
      
      if (retries % 10 === 0) {
        console.log(`Still waiting for PostgreSQL server... (${retries}/${maxRetries})`);
        console.log(`Error: ${error.message}`);
      }
      
      await sleep(1000);
    }
  }
  
  if (retries >= maxRetries) {
    console.error('❌ PostgreSQL server connection timeout');
    process.exit(1);
  }
  
  // Now verify we can connect to our specific database
  console.log(`Verifying connection to database '${dbName}'...`);
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database is ready and accepting connections!');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Could not connect to database:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run the wait function
waitForDatabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});