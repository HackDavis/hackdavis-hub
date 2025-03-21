import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import '@globals/globals.scss';
import metadataJSON from '@globals/metadata.json';
import fonts from './_globals/fonts';

export const metadata: Metadata = metadataJSON;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fonts} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
