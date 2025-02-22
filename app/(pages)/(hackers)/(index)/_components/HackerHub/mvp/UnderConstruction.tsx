import Image from 'next/image';
import cow_tada from '@/public/hackers/cow_tada.svg';

export default function UnderConstruction() {
  return (
    <main>
      <div>Under Construction</div>
      <div className="p-8 bg-green flex items-center justify-center">
        <Image src={cow_tada} alt="Cow Tada" />
      </div>
    </main>
  );
}
