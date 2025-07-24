'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function getOriginalUrl(shortCode: string) {
  try {
    const { rows } = await pool.query('SELECT original_url FROM urls WHERE short_code = $1', [shortCode]);
    if (rows.length > 0) {
      return rows[0].original_url;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function ShortCodePage({ params }: { params: { shortCode: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      const originalUrl = await getOriginalUrl(params.shortCode);
      if (originalUrl) {
        window.location.href = originalUrl;
      } else {
        setError('URL not found');
      }
      setLoading(false);
    };
    fetchUrl();
  }, [params.shortCode]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return null;
}