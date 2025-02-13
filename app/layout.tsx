import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
