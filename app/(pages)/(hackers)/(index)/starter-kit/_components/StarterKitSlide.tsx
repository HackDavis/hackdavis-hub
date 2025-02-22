import { Card, CardContent } from '@globals/components/ui/card';

interface StarterKitSlideProps {
  subtitle: string;
  title: string;
  children: React.ReactNode;
}

export default function StarterKitSlide({
  title,
  subtitle,
  children,
}: StarterKitSlideProps) {
  return (
    <Card className="h-fit p-4 bg-transparent">
      <CardContent className="p-4">
        <p className="text-sm font-jakarta tracking-[0.02em]">{subtitle}</p>
        <h2 className="text-2xl font-bold font-metropolis tracking-[0.02em] mb-4">
          {title}
        </h2>
        {children}
      </CardContent>
    </Card>
  );
}
