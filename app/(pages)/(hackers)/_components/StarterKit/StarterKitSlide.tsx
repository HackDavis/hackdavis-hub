import { Card, CardContent } from '@globals/components/ui/card';

interface StarterKitSlideProps {
  subtitle: string;
  title: string;
  children: React.ReactNode;
  route?: string;
}

export default function StarterKitSlide({
  title,
  subtitle,
  children,
  route = 'starter-kit',
}: StarterKitSlideProps) {
  return (
    <Card className="h-fit w-full p-0 bg-transparent shadow-none border-none text-text-dark">
      <CardContent className="p-0">
        <p
          className={`text-[0.5rem] xs:text-xs font-jakarta tracking-[0.02em] ${
            route === 'starter-kit' ? 'md:text-sm' : 'md:text-lg'
          }`}
        >
          {subtitle}
        </p>
        <h2
          className={`text-lg xs:xl font-bold font-metropolis tracking-[0.02em]  ${
            route === 'starter-kit' ? 'md:text-2xl mb-4' : 'md:text-4xl'
          }`}
        >
          {title}
        </h2>
        {children}
      </CardContent>
    </Card>
  );
}
