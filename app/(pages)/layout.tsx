import type { Metadata } from 'next';
import { ClientSessionProvider } from './_components/ClientSessionProvider/ClientSessionProvider';
import '@globals/globals.scss';
import metadataJSON from '@globals/metadata.json';
import fonts from './_globals/fonts';
import { auth } from '@/auth';

export const metadata: Metadata = metadataJSON;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${fonts} antialiased`}>
        <ClientSessionProvider session={session}>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}
