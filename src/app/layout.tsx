import './globals.css';
import type { Metadata } from 'next';

// Add a link to Font Awesome CDN instead of package imports
export const metadata: Metadata = {
  title: 'Life Legacy',
  description: 'Preserve your memories and share your legacy with loved ones.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
