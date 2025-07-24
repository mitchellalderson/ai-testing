import { useState } from 'react';
import { TextField, Button, Container, Typography, Link } from '@mui/material';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setShortUrl(data.shortUrl);
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        URL Shortener
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Shorten
        </Button>
      </form>
      {shortUrl && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Shortened URL:{' '}
          <Link href={shortUrl} target="_blank" rel="noopener">
            {shortUrl}
          </Link>
        </Typography>
      )}
    </Container>
  );
}
