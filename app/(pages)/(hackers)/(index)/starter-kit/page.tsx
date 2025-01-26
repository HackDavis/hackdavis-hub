import StarterKitSlide from './_components/StarterKitSlide';
import ParentCarousel from './_components/ParentCarousel';
import Image from 'next/image';

export default function Page() {
  return (
    <main>
      <div>Start Kit Page</div>
      <ParentCarousel title="✦ Let's Begin!" color="#005271">
        <StarterKitSlide
          title="Hacking 101 Workshop"
          subtitle="JOIN US FOR OUR"
        >
          <Image
            src="/hackers/crossing_cow.svg"
            alt="Example Image"
            width={100}
            height={100}
          />
        </StarterKitSlide>
      </ParentCarousel>
      {/* <StarterKitSlide title="Hacking 101 Workshop" subtitle="JOIN US FOR OUR">
        <Image
          src="/hackers/crossing_cow.svg"
          alt="Example Image"
          width={100}
          height={100}
        />
      </StarterKitSlide>
      <StarterKitSlide
        title="In case you missed it..."
        subtitle="HERE's A RECAP OF THE WORKSHOP"
      >
        <Image
          src="/hackers/flag_duck.svg"
          alt="Example Image"
          width={100}
          height={100}
        />
      </StarterKitSlide> */}
    </main>
  );
}
