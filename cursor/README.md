# URL Shortener

A simple and elegant URL shortener built with Next.js, Material-UI, and PostgreSQL.

## Features

- 🔗 Shorten long URLs into compact, shareable links
- 📊 Click tracking for analytics
- 🎨 Minimalist design with Material-UI
- 🚀 Fast and responsive Next.js frontend
- 🗄️ PostgreSQL database for reliable storage
- 🐳 Docker support for easy deployment

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Library**: Material-UI (MUI)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Deployment**: Docker

## Getting Started

### Prerequisites

- Node.js 18 or later
- PostgreSQL (or use Docker)
- npm or yarn

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update the `.env.local` file with your database configuration:

   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/urlshortener_db
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Set up the database**

   Create a PostgreSQL database and run the migration:

   ```bash
   npm run db:migrate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. **Run with Docker Compose**

   ```bash
   docker-compose up -d
   ```

   This will start both the application and PostgreSQL database.

### Manual Docker Build

1. **Build the Docker image**

   ```bash
   docker build -t url-shortener .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL=postgresql://username:password@your-db-host:5432/urlshortener_db \
     -e NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
     url-shortener
   ```

## Environment Variables

| Variable               | Description                          | Required |
| ---------------------- | ------------------------------------ | -------- |
| `DATABASE_URL`         | PostgreSQL connection string         | Yes      |
| `NEXT_PUBLIC_BASE_URL` | Base URL for shortened links         | Yes      |
| `NODE_ENV`             | Environment (development/production) | No       |

## Database Schema

The application uses a single table `url_mappings`:

```sql
CREATE TABLE url_mappings (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  clicks INTEGER DEFAULT 0
);
```

## API Endpoints

### POST /api/shorten

Shorten a URL.

**Request:**

```json
{
  "url": "https://example.com/very-long-url"
}
```

**Response:**

```json
{
  "shortCode": "abc123",
  "originalUrl": "https://example.com/very-long-url",
  "shortUrl": "http://localhost:3000/abc123"
}
```

### GET /[shortCode]

Redirect to the original URL and increment click count.

## Deployment

### Production Deployment

1. Set up a PostgreSQL database
2. Set environment variables:
   - `DATABASE_URL`: Your production database URL
   - `NEXT_PUBLIC_BASE_URL`: Your production domain
   - `NODE_ENV=production`
3. Build and deploy using Docker or your preferred hosting platform

### Vercel Deployment

1. Connect your repository to Vercel
2. Set up a PostgreSQL database (e.g., Vercel Postgres, Supabase, or Neon)
3. Configure environment variables in Vercel dashboard
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
