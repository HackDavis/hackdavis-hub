import '@globals/globals.css';
import fonts from 'app/(pages)/_globals/fonts';
import metadata from '@globals/metadata.json';

export { metadata };

export default function RootLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fonts}>{children}</body>
    </html>
  );
}
