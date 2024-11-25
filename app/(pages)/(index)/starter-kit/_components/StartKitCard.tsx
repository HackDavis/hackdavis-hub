import { Card } from '@/components/ui/card';

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
    <Card>
      <p>{subtitle}</p>
      <h2>{title}</h2>
      {children}
    </Card>
  );
}
