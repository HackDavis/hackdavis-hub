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
    <Card className="h-fit w-full p-0 bg-transparent shadow-none border-none text-text-dark">
      <CardContent className="p-0">
        <p className="text-[0.5rem] xs:text-xs md:text-sm font-jakarta tracking-[0.02em]">{subtitle}</p>
        <h2 className="text-lg xs:xl md:text-2xl font-bold font-metropolis tracking-[0.02em] mb-4">
          {title}
        </h2>
        {children}
      </CardContent>
    </Card>
  );
}
