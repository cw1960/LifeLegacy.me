import './globals.css';
import './tailwind.css';
import type { Metadata } from 'next';

// Add a link to Font Awesome CDN instead of package imports
export const metadata: Metadata = {
  title: 'LifeLegacy.me - Digital Estate Planning',
  description: 'Simplified digital estate planning for professionals to offer as a value-added service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-slate-50 to-slate-100">
        {children}
      </body>
    </html>
  );
}
