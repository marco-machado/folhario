import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Folhário — Meu Jardim Orgânico Inteligente',
  description: 'Seu primeiro guia de cuidados com plantas, sem jargões e com identificador de IA.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-gray-50/50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
