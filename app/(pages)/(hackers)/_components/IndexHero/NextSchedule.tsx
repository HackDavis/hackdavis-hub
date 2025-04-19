// import styles from './IndexHeroContent.module.scss'; // using styling from other file...
// import location_icon from '@public/hackers/hero/location_icon.svg';
// import Image from 'next/image';
// import Link from 'next/link';
// import { LuArrowUpRight } from 'react-icons/lu';
import useNextSchedule from '@pages/(hackers)/_components/DOE/_hooks/useNextSchedule';
import CalendarItem from '../Schedule/CalendarItem';

export default function NextSchedule() {
  const { event, attendeeCount, inPersonalSchedule } = useNextSchedule();

  if (!event) {
    return null; // Don't render anything if there's no upcoming event
  }

  return (
    <>
      <CalendarItem
        event={event}
        attendeeCount={attendeeCount}
        inPersonalSchedule={inPersonalSchedule}
      />
    </>
  );
}
