"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
} from "@mui/material";
import { ContentCopy, Link } from "@mui/icons-material";

interface ShortenedUrl {
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
}

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setShortenedUrl(null);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setShortenedUrl(data);
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortenedUrl) {
      try {
        await navigator.clipboard.writeText(shortenedUrl.shortUrl);
        setCopySuccess(true);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 600,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Link sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h1" component="h1" gutterBottom>
            URL Shortener
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Transform long URLs into short, manageable links
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Enter your URL"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very-long-url..."
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ height: 48 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Shorten URL"
              )}
            </Button>
          </Box>
        </form>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {shortenedUrl && (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              mt: 3,
              backgroundColor: "success.light",
              color: "success.contrastText",
            }}
          >
            <Typography variant="h2" gutterBottom>
              Your shortened URL:
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 2,
                backgroundColor: "background.paper",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  flex: 1,
                  wordBreak: "break-all",
                  color: "primary.main",
                  fontWeight: 500,
                }}
              >
                {shortenedUrl.shortUrl}
              </Typography>
              <IconButton onClick={handleCopy} color="primary">
                <ContentCopy />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
              Original: {shortenedUrl.originalUrl}
            </Typography>
          </Paper>
        )}

        <Snackbar
          open={copySuccess}
          autoHideDuration={3000}
          onClose={() => setCopySuccess(false)}
          message="URL copied to clipboard!"
        />
      </Paper>
    </Box>
  );
}
