import { redirect } from "next/navigation";
import { getUrlByShortCode, incrementClickCount } from "@/lib/db";
import { Typography, Box, Paper, Button } from "@mui/material";
import Link from "next/link";

interface PageProps {
  params: {
    shortCode: string;
  };
}

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = params;

  try {
    const urlMapping = await getUrlByShortCode(shortCode);

    if (!urlMapping) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              maxWidth: 500,
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography variant="h1" component="h1" gutterBottom>
              404
            </Typography>
            <Typography variant="h2" gutterBottom>
              Short URL Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The short URL you're looking for doesn't exist or has been
              removed.
            </Typography>
            <Link href="/" passHref>
              <Button variant="contained" size="large">
                Create a Short URL
              </Button>
            </Link>
          </Paper>
        </Box>
      );
    }

    // Increment click count asynchronously
    incrementClickCount(shortCode).catch(console.error);

    // Redirect to the original URL
    redirect(urlMapping.original_url);
  } catch (error: any) {
    // Don't log NEXT_REDIRECT errors as they are normal redirect behavior
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error; // Re-throw to allow the redirect to work
    }

    console.error("Database error:", error);

    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            maxWidth: 500,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant="h1" component="h1" gutterBottom>
            Error
          </Typography>
          <Typography variant="h2" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We encountered an error while trying to redirect you.
          </Typography>
          <Link href="/" passHref>
            <Button variant="contained" size="large">
              Go Home
            </Button>
          </Link>
        </Paper>
      </Box>
    );
  }
}
