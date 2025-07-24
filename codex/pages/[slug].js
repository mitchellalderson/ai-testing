import pool, { ensureTable } from '../lib/db';

// This page uses server-side props to redirect based on slug
export async function getServerSideProps({ params }) {
  const { slug } = params;
  try {
    await ensureTable();
    const result = await pool.query('SELECT url FROM urls WHERE slug = $1', [slug]);
    if (result.rowCount > 0) {
      return {
        redirect: {
          destination: result.rows[0].url,
          permanent: false,
        },
      };
    }
  } catch (err) {
    console.error(err);
  }
  return { notFound: true };
}

export default function SlugPage() {
  // This component is never rendered because redirection happens server-side.
  return null;
}
