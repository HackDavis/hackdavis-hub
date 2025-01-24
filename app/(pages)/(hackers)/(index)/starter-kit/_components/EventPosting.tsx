import { Card, CardContent } from '@globals/components/ui/card';
import styles from './EventPosting.module.scss'

interface EventPostingProps {
  location: string;
  title: string;
  children: React.ReactNode;
}

export default function EventPosting({
  title,
  location,
  children,
}: EventPostingProps) {
  return (
    <div className={styles.EventContainer}>
        <h1> meow </h1>
    </div>
    // <Card className="tw-h-fit tw-p-4 tw-bg-transparent">
    //   <CardContent className="tw-p-4">
    //     <p className="tw-text-sm tw-font-jakarta tw-tracking-[0.02em]">
    //       {location}
    //     </p>
    //     <h2 className="tw-text-2xl tw-font-bold tw-font-metropolis tw-tracking-[0.02em] tw-mb-4">
    //       {title}
    //     </h2>
    //     {children}
    //   </CardContent>
    // </Card>
  );
}
