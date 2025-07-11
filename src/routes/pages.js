import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function routes(fastify, options) {
  // Homepage - List all countdowns
  fastify.get('/', async (request, reply) => {
    try {
      const countdowns = await prisma.countdown.findMany({
        where: {
          launchDate: {
            gte: new Date()
          }
        },
        orderBy: { launchDate: 'asc' }
      });
      
      return reply.view('index.ejs', { countdowns });
    } catch (error) {
      reply.code(500).send('Failed to load countdowns');
    }
  });

  // Create countdown form
  fastify.get('/create', async (request, reply) => {
    return reply.view('create.ejs');
  });

  // Handle form submission
  fastify.post('/create', async (request, reply) => {
    try {
      const { mission, rocket, launchDate, description } = request.body;
      
      // Validation
      if (!mission || !rocket || !launchDate) {
        return reply.code(400).send('Mission, rocket, and launch date are required');
      }
      
      const launchDateObj = new Date(launchDate);
      if (isNaN(launchDateObj.getTime())) {
        return reply.code(400).send('Invalid launch date format');
      }
      
      await prisma.countdown.create({
        data: {
          mission: mission.trim(),
          rocket: rocket.trim(),
          launchDate: launchDateObj,
          description: description ? description.trim() : null
        }
      });
      
      return reply.redirect('/');
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send('Failed to create countdown');
    }
  });

  // View single countdown
  fastify.get('/countdown/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const countdown = await prisma.countdown.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!countdown) {
        return reply.code(404).send('Countdown not found');
      }
      
      return reply.view('countdown.ejs', { countdown });
    } catch (error) {
      reply.code(500).send('Failed to load countdown');
    }
  });

  // Edit countdown form
  fastify.get('/edit/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const countdown = await prisma.countdown.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!countdown) {
        return reply.code(404).send('Countdown not found');
      }
      
      return reply.view('edit.ejs', { countdown });
    } catch (error) {
      reply.code(500).send('Failed to load countdown');
    }
  });

  // Handle edit form submission
  fastify.post('/edit/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { mission, rocket, launchDate, description } = request.body;
      
      await prisma.countdown.update({
        where: { id: parseInt(id) },
        data: {
          mission,
          rocket,
          launchDate: new Date(launchDate),
          description
        }
      });
      
      return reply.redirect('/');
    } catch (error) {
      reply.code(500).send('Failed to update countdown');
    }
  });

  // Delete countdown
  fastify.post('/delete/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      await prisma.countdown.delete({
        where: { id: parseInt(id) }
      });
      
      return reply.redirect('/');
    } catch (error) {
      reply.code(500).send('Failed to delete countdown');
    }
  });
}