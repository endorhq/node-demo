import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.countdown.deleteMany();

  // Sample countdown data
  const countdowns = [
    {
      mission: 'Artemis III',
      rocket: 'SLS Block 1B',
      launchDate: new Date('2026-09-15T14:00:00Z'),
      description: 'First crewed lunar landing mission of the Artemis program, targeting the lunar South Pole region.'
    },
    {
      mission: 'Europa Clipper',
      rocket: 'Falcon Heavy',
      launchDate: new Date('2025-10-10T16:30:00Z'),
      description: 'NASA mission to study Jupiter\'s moon Europa and investigate its potential habitability.'
    },
    {
      mission: 'Starship Flight 7',
      rocket: 'Starship/Super Heavy',
      launchDate: new Date('2025-03-20T13:00:00Z'),
      description: 'Seventh integrated test flight of SpaceX\'s Starship vehicle, attempting orbital velocity.'
    },
    {
      mission: 'VIPER',
      rocket: 'Falcon Heavy',
      launchDate: new Date('2025-11-01T20:00:00Z'),
      description: 'NASA\'s Volatiles Investigating Polar Exploration Rover mission to search for water ice at the Moon\'s South Pole.'
    },
    {
      mission: 'Polaris Dawn',
      rocket: 'Falcon 9',
      launchDate: new Date('2025-04-12T10:00:00Z'),
      description: 'First commercial spacewalk mission, reaching the highest Earth orbit since Apollo.'
    }
  ];

  // Insert sample data
  for (const countdown of countdowns) {
    await prisma.countdown.create({
      data: countdown
    });
  }

  console.log(`Seeded ${countdowns.length} countdowns`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });