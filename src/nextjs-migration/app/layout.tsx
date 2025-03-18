
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Мой блог',
    default: 'Мой блог',
  },
  description: 'Персональный блог о жизни, идеях и опыте',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-white text-blog-black">
        {children}
      </body>
    </html>
  );
}
