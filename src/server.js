import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = Fastify({
  logger: true
});

// Register plugins
await server.register(import('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
});

await server.register(import('@fastify/view'), {
  engine: {
    ejs: await import('ejs')
  },
  root: path.join(__dirname, 'views')
});

await server.register(import('@fastify/formbody'));

// Register routes
await server.register(import('./routes/api.js'), { prefix: '/api' });
await server.register(import('./routes/pages.js'));

// Start server
const start = async () => {
  try {
    await server.listen({
      port: process.env.PORT || 3000,
      host: process.env.HOST || '0.0.0.0'
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();