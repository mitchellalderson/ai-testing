import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'urlshortener',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
});

export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_code VARCHAR(10) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        click_count INTEGER DEFAULT 0
      )
    `);
  } finally {
    client.release();
  }
}

export async function saveUrl(originalUrl: string, shortCode: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *',
      [originalUrl, shortCode]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getUrlByShortCode(shortCode: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM urls WHERE short_code = $1',
      [shortCode]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function incrementClickCount(shortCode: string) {
  const client = await pool.connect();
  try {
    await client.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
      [shortCode]
    );
  } finally {
    client.release();
  }
}

export { pool };