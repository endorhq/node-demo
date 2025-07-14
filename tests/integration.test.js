import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import apiRoutes from '../src/routes/api.js';

const prisma = new PrismaClient();

describe('Integration Tests', () => {
  let server;
  let testCountdownId;

  before(async () => {
    // Set up Fastify server
    server = Fastify();
    await server.register(apiRoutes, { prefix: '/api' });
    
    // Clean up test data
    await prisma.countdown.deleteMany({
      where: {
        mission: { startsWith: 'TEST_' }
      }
    });
  });

  after(async () => {
    // Clean up test data
    await prisma.countdown.deleteMany({
      where: {
        mission: { startsWith: 'TEST_' }
      }
    });
    await prisma.$disconnect();
  });

  describe('POST /api/countdowns', () => {
    test('should create a new countdown', async () => {
      const countdown = {
        mission: 'TEST_Mission_' + Date.now(),
        rocket: 'TEST_Rocket',
        launchDate: new Date(Date.now() + 86400000).toISOString(),
        description: 'Test description'
      };

      const response = await server.inject({
        method: 'POST',
        url: '/api/countdowns',
        payload: countdown
      });

      assert.strictEqual(response.statusCode, 201);
      const body = JSON.parse(response.body);
      assert.ok(body.id);
      assert.strictEqual(body.mission, countdown.mission);
      assert.strictEqual(body.rocket, countdown.rocket);
      
      testCountdownId = body.id;
    });
  });

  describe('GET /api/countdowns', () => {
    test('should return list of countdowns including test countdown', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/countdowns'
      });

      assert.strictEqual(response.statusCode, 200);
      const body = JSON.parse(response.body);
      assert.ok(Array.isArray(body));
      
      const testCountdown = body.find(c => c.id === testCountdownId);
      assert.ok(testCountdown, 'Test countdown should be in the list');
    });
  });

  describe('GET /api/countdowns/:id', () => {
    test('should return specific countdown', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/api/countdowns/${testCountdownId}`
      });

      assert.strictEqual(response.statusCode, 200);
      const body = JSON.parse(response.body);
      assert.strictEqual(body.id, testCountdownId);
      assert.ok(body.mission.startsWith('TEST_'));
    });

    test('should return 404 for non-existent countdown', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/countdowns/999999'
      });

      assert.strictEqual(response.statusCode, 404);
    });
  });

  describe('PUT /api/countdowns/:id', () => {
    test('should update countdown', async () => {
      const updatedData = {
        mission: 'TEST_Updated_Mission_' + Date.now(),
        rocket: 'TEST_Updated_Rocket',
        launchDate: new Date(Date.now() + 172800000).toISOString(),
        description: 'Updated description'
      };

      const response = await server.inject({
        method: 'PUT',
        url: `/api/countdowns/${testCountdownId}`,
        payload: updatedData
      });

      assert.strictEqual(response.statusCode, 200);
      const body = JSON.parse(response.body);
      assert.strictEqual(body.mission, updatedData.mission);
      assert.strictEqual(body.rocket, updatedData.rocket);
    });

    test('should return 404 when updating non-existent countdown', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: '/api/countdowns/999999',
        payload: {
          mission: 'TEST_Mission',
          rocket: 'TEST_Rocket',
          launchDate: new Date().toISOString()
        }
      });

      assert.strictEqual(response.statusCode, 404);
    });
  });

  describe('DELETE /api/countdowns/:id', () => {
    test('should delete countdown', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/countdowns/${testCountdownId}`
      });

      assert.strictEqual(response.statusCode, 204);

      // Verify it's deleted
      const getResponse = await server.inject({
        method: 'GET',
        url: `/api/countdowns/${testCountdownId}`
      });
      assert.strictEqual(getResponse.statusCode, 404);
    });

    test('should return 404 when deleting non-existent countdown', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/api/countdowns/999999'
      });

      assert.strictEqual(response.statusCode, 404);
    });
  });
});