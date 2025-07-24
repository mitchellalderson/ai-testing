'use client';
import { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Link } from '@mui/material';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    setShortenedUrl(data.shortUrl);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Shortener
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Enter URL"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Shorten
          </Button>
        </Box>
        {shortenedUrl && (
          <Typography sx={{ mt: 2 }}>
            Shortened URL: {' '}
            <Link href={shortenedUrl} target="_blank" rel="noopener">
              {shortenedUrl}
            </Link>
          </Typography>
        )}
      </Box>
    </Container>
  );
}