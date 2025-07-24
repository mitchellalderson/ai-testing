# URL Shortener

A simple URL shortening service built with Next.js, Material-UI, and PostgreSQL.

## Features

- Shorten long URLs into compact, shareable links
- Clean, minimalist interface using Material-UI
- PostgreSQL database for persistent storage
- Click tracking for shortened URLs
- Docker support for easy deployment

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy `.env.local` and update the PostgreSQL connection details if needed.

3. Start a PostgreSQL database (or use Docker):
```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=urlshortener -p 5432:5432 -d postgres:15-alpine
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Deployment with Docker

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

This will start both the application and PostgreSQL database.

## API Endpoints

- `POST /api/shorten` - Create a shortened URL
- `GET /[shortCode]` - Redirect to original URL

## Database Schema

The application uses a single `urls` table:
- `id` - Primary key
- `original_url` - The original long URL
- `short_code` - The generated short code
- `created_at` - Timestamp when created
- `click_count` - Number of times the short URL was accessed