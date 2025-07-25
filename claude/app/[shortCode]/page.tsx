import { redirect } from 'next/navigation';
import { getUrlByShortCode, incrementClickCount } from '@/lib/db';

export default async function RedirectPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const { shortCode } = params;

  try {
    const urlRecord = await getUrlByShortCode(shortCode);

    if (!urlRecord) {
      redirect('/404');
    }

    await incrementClickCount(shortCode);

    redirect(urlRecord.original_url);
  } catch (error) {
    // Don't catch NEXT_REDIRECT errors - they are expected
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Error redirecting:', error);
    redirect('/404');
  }
}