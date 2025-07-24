import ThemeRegistry from './ThemeRegistry';

export const metadata = {
  title: 'URL Shortener',
  description: 'A simple URL shortening service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}