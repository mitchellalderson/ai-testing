import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { initDatabase, saveUrl } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const shortCode = nanoid(8);
    
    await saveUrl(url, shortCode);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${shortCode}`;

    return NextResponse.json({
      originalUrl: url,
      shortUrl,
      shortCode,
    });

  } catch (error) {
    console.error('Error shortening URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}