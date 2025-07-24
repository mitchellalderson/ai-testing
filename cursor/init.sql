-- Create the url_mappings table
CREATE TABLE IF NOT EXISTS url_mappings (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  clicks INTEGER DEFAULT 0
);

-- Create index for fast lookup
CREATE INDEX IF NOT EXISTS idx_short_code ON url_mappings(short_code); 