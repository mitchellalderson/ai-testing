import pool, { ensureTable } from '../../lib/db';
import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }
  try {
    await ensureTable();
    new URL(url);
  } catch (_) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  let slug;
  for (let i = 0; i < 5; i++) {
    slug = nanoid(7);
    try {
      await pool.query('INSERT INTO urls (slug, url) VALUES ($1, $2)', [slug, url]);
      break;
    } catch (err) {
      if (err.code === '23505') continue;
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
  }
  if (!slug) {
    return res.status(500).json({ error: 'Could not generate URL slug' });
  }

  const baseUrl = process.env.BASE_URL || `${req.headers.origin}`;
  const shortUrl = `${baseUrl}/${slug}`;
  return res.status(200).json({ shortUrl });
}
