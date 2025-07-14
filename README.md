# Rocket Launch Countdown Admin 🚀

A space-themed NodeJS demo application for managing rocket launch countdowns. Built with Fastify and Prisma, featuring a clean and simple interface for creating, viewing, and managing countdown timers for upcoming rocket launches.

It uses [Endor](https://docs.endor.dev/cli/overview/) to run a Postgres database for development. You do not need to install any additional software, as Endor is like any other Node dependency.

## Features

- ✅ Create and manage rocket launch countdowns
- ✅ Live countdown timers with days, hours, minutes, and seconds
- ✅ RESTful API for programmatic access
- ✅ Simple, responsive web interface
- ✅ No authentication required (simplified admin panel)
- ✅ PostgreSQL database support via Prisma ORM

## Tech Stack

- **Backend**: Node.js with Fastify
- **Database**: PostgreSQL with Prisma ORM. Run with Endor
- **Frontend**: Plain HTML, CSS, and JavaScript (no frameworks)
- **Template Engine**: EJS
- **Testing**: Node.js built-in test runner

## Prerequisites

- Node.js 20+ 
- npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/endorhq/node-demo.git
cd node-demo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Generate Prisma client:
```bash
npm run db:generate
```

5. Start the application and the database:
```bash
npm run dev
```

6. Push database schema:
```bash
npm run db:push
```

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Documentation

### Endpoints

#### GET /api/countdowns
Get all countdowns sorted by launch date.

**Response:**
```json
[
  {
    "id": 1,
    "mission": "Artemis III",
    "rocket": "SLS Block 1B",
    "launchDate": "2025-12-01T14:00:00.000Z",
    "description": "First crewed lunar landing mission",
    "createdAt": "2025-01-11T10:00:00.000Z",
    "updatedAt": "2025-01-11T10:00:00.000Z"
  }
]
```

#### GET /api/countdowns/:id
Get a specific countdown by ID.

#### POST /api/countdowns
Create a new countdown.

**Request body:**
```json
{
  "mission": "Mission Name",
  "rocket": "Rocket Type",
  "launchDate": "2025-12-01T14:00:00Z",
  "description": "Optional mission description"
}
```

#### PUT /api/countdowns/:id
Update an existing countdown.

#### DELETE /api/countdowns/:id
Delete a countdown.

## Testing

Run the test suite:
```bash
npm test
```

## Database Schema

You can find it on the `prisma/schema.prisma` file.

## License

MIT
