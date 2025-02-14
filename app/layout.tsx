import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: 'Spectrum',
  description: 'A modular content platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
        <SpeedInsights />
      </body>
    </html>
  );
}
