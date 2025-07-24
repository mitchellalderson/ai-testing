import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  const shortCode = generateShortCode();
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`;

  try {
    await pool.query('INSERT INTO urls (original_url, short_code) VALUES ($1, $2)', [url, shortCode]);
    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}