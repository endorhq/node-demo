import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function routes(fastify, options) {
  // Get all countdowns
  fastify.get('/countdowns', async (request, reply) => {
    try {
      const countdowns = await prisma.countdown.findMany({
        orderBy: { launchDate: 'asc' }
      });
      return countdowns;
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch countdowns' });
    }
  });

  // Get single countdown
  fastify.get('/countdowns/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const countdown = await prisma.countdown.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!countdown) {
        return reply.code(404).send({ error: 'Countdown not found' });
      }
      
      return countdown;
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch countdown' });
    }
  });

  // Create countdown
  fastify.post('/countdowns', async (request, reply) => {
    try {
      const { mission, rocket, launchDate, description } = request.body;
      
      // Validation
      if (!mission || !rocket || !launchDate) {
        return reply.code(400).send({ error: 'Mission, rocket, and launch date are required' });
      }
      
      const launchDateObj = new Date(launchDate);
      if (isNaN(launchDateObj.getTime())) {
        return reply.code(400).send({ error: 'Invalid launch date format' });
      }
      
      const countdown = await prisma.countdown.create({
        data: {
          mission,
          rocket,
          launchDate: launchDateObj,
          description
        }
      });
      
      reply.code(201).send(countdown);
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to create countdown' });
    }
  });

  // Update countdown
  fastify.put('/countdowns/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { mission, rocket, launchDate, description } = request.body;
      
      // Validation
      if (!mission || !rocket || !launchDate) {
        return reply.code(400).send({ error: 'Mission, rocket, and launch date are required' });
      }
      
      const launchDateObj = new Date(launchDate);
      if (isNaN(launchDateObj.getTime())) {
        return reply.code(400).send({ error: 'Invalid launch date format' });
      }
      
      const countdown = await prisma.countdown.update({
        where: { id: parseInt(id) },
        data: {
          mission,
          rocket,
          launchDate: launchDateObj,
          description
        }
      });
      
      return countdown;
    } catch (error) {
      if (error.code === 'P2025') {
        return reply.code(404).send({ error: 'Countdown not found' });
      }
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to update countdown' });
    }
  });

  // Delete countdown
  fastify.delete('/countdowns/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      await prisma.countdown.delete({
        where: { id: parseInt(id) }
      });
      
      reply.code(204).send();
    } catch (error) {
      if (error.code === 'P2025') {
        return reply.code(404).send({ error: 'Countdown not found' });
      }
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to delete countdown' });
    }
  });
}