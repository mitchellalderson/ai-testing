# URL Shortener

A simple URL shortener built with Next.js and Material UI.

## Setup

1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Postgres credentials and BASE_URL
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Docker

Build and run with Docker:
```bash
docker build -t url-shortener .
docker run -e DATABASE_URL=... -e BASE_URL=... -p 3000:3000 url-shortener
```

## Docker Compose

Start both the Postgres database and the app with one command:
```bash
docker-compose up --build
```
