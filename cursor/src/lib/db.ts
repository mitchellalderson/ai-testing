import { Pool } from "pg";

// Configure SSL for Render PostgreSQL
const sslConfig =
  process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false, require: true }
    : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

export interface UrlMapping {
  id: string;
  original_url: string;
  short_code: string;
  created_at: Date;
  clicks: number;
}

export async function createUrlMapping(
  originalUrl: string,
  shortCode: string
): Promise<UrlMapping> {
  const query = `
    INSERT INTO url_mappings (original_url, short_code, created_at, clicks)
    VALUES ($1, $2, NOW(), 0)
    RETURNING *
  `;

  const result = await pool.query(query, [originalUrl, shortCode]);
  return result.rows[0];
}

export async function getUrlByShortCode(
  shortCode: string
): Promise<UrlMapping | null> {
  const query = "SELECT * FROM url_mappings WHERE short_code = $1";
  const result = await pool.query(query, [shortCode]);
  return result.rows[0] || null;
}

export async function incrementClickCount(shortCode: string): Promise<void> {
  const query =
    "UPDATE url_mappings SET clicks = clicks + 1 WHERE short_code = $1";
  await pool.query(query, [shortCode]);
}

export async function initializeDatabase(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS url_mappings (
      id SERIAL PRIMARY KEY,
      original_url TEXT NOT NULL,
      short_code VARCHAR(10) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      clicks INTEGER DEFAULT 0
    );
    
    CREATE INDEX IF NOT EXISTS idx_short_code ON url_mappings(short_code);
  `;

  await pool.query(createTableQuery);
}

export default pool;
