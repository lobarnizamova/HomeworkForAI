import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VOLT // Electron Magazine & Curated Hardware Store',
  description: 'Independent electronics journalism, lab-tested hardware reviews, and direct-to-creator electron device storefront. Powered by zero-server static architecture.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}

