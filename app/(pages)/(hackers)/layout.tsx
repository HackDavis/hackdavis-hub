import HackbotWidgetWrapper from './_components/Hackbot/HackbotWidgetWrapper';

export default function HackersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <HackbotWidgetWrapper />
    </>
  );
}
