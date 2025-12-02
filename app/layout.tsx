import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SPOTS - Pitch Deck',
  description: 'Opening doors to experiences, communities, people, meaning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

