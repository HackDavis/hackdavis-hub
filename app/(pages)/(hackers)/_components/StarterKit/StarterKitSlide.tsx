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
    <Card className="tw-h-fit tw-p-4 tw-bg-transparent">
      <CardContent className="tw-p-4">
        <p className="tw-text-sm tw-font-jakarta tw-tracking-[0.02em]">
          {subtitle}
        </p>
        <h2 className="tw-text-2xl tw-font-bold tw-font-metropolis tw-tracking-[0.02em] tw-mb-4">
          {title}
        </h2>
        {children}
      </CardContent>
    </Card>
  );
}
