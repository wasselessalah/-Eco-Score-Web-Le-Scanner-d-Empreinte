import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Éco-Score Web — Le Scanner d\'Empreinte',
  description: 'Analyze any website\'s carbon footprint instantly. Measure energy consumption, CO₂ emissions, and get actionable optimization recommendations for a more sustainable web.',
  keywords: ['eco-score', 'carbon footprint', 'web sustainability', 'green web', 'CO2', 'performance'],
  openGraph: {
    title: 'Éco-Score Web — Le Scanner d\'Empreinte',
    description: 'Measure your website\'s carbon footprint and build a more sustainable web.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[var(--color-bg)] font-sans antialiased flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
