import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your account',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
