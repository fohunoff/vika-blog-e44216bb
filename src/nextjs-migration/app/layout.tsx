
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Подключаем шрифт Inter
const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Мой блог',
  description: 'Персональный блог о жизни, вкусной еде, путешествиях и уютных местах',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
