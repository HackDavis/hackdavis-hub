import { Card, CardContent } from '@/components/ui/card';

interface StartKitCardProps {
  subtitle: string;
  title: string;
  children: React.ReactNode;
}

export default function StartKitCard({
  title,
  subtitle,
  children,
}: StartKitCardProps) {
  return (
    <Card className="tw-border tw-border-black tw-h-fit tw-p-4 tw-bg-transparent">
      <CardContent className="tw-p-4">
        <p className="tw-text-sm tw-font-metropolis">{subtitle}</p>
        <h2 className="tw-text-3xl tw-font-semibold tw-font-metropolis">
          {title}
        </h2>
        {children}
      </CardContent>
    </Card>
  );
}
