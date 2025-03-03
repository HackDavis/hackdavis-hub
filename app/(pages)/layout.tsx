import type { Metadata } from 'next';
import '@globals/globals.scss';
import metadataJSON from '@app/(pages)/_globals/metadata.json';
import fonts from './_globals/fonts';
import { SessionProvider } from 'next-auth/react';
//import Navbar from '@app/(pages)/_components/Navbar/Navbar';
// import { Suspense } from 'react';

export const metadata: Metadata = metadataJSON;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fonts} antialiased`}>
        {/* <Suspense>
          <Navbar />
        </Suspense> */}
        <SessionProvider> {children}</SessionProvider>
      </body>
    </html>
  );
}
