import Image, { StaticImageData } from 'next/image';
import StarterKitSlide from '../StarterKit/StarterKitSlide';
import patientSimImage from '@public/hackers/starter-kit/ideate/patient_sim_ai.png';
import nomadImage from '@public/hackers/starter-kit/ideate/nomad.png';
import podium from '@public/hackers/starter-kit/ideate/podium.svg';
import { Card, CardContent } from '@globals/components/ui/card';

interface PastProjectDisplayProps {
  image: StaticImageData;
  title: string;
  subtitle: string;
  description: string;
}

const pastProjects: PastProjectDisplayProps[] = [
  {
    image: patientSimImage,
    title: 'PatientSimAI',
    subtitle: 'Best Hack for Social Good',
    description:
      'PatientSimAI is a web app using AI and GPT-4 to simulate patient interactions, aiding clinical training, enhancing medical education, and building practical skills.',
  },
  {
    image: nomadImage,
    title: 'nomad /\\',
    subtitle: 'Best Hack for Social Good',
    description:
      'Users can place pins for homeless individuals or lost animals, alerting organizations to assist. The app also encourages donations, volunteering, and offers local business rewards.',
  },
];

export default function Ideate() {
  function PastProjectDisplay({
    image,
    title,
    subtitle,
    description,
  }: PastProjectDisplayProps) {
    return (
      <div className="bg-background-secondary w-[calc(100vw*219/375)] aspect-[219/232] rounded-[6px] p-4 mt-[15px] mb-[15px] mx-auto md:w-[calc(100vw*971/1440)] md:aspect-[971/231] md:rounded-[12px] md:p-[18px]">
        <div className="flex flex-col gap-[16px] md:flex-row md:items-center md:gap-[32px]">
          <div className="flex-shrink-0 mx-auto md:mx-0 aspect-[195/97] w-[calc(100vw*195/375)] md:aspect-[280/195] md:w-[calc(100vw*280/1440)] pt-1">
            <Image
              src={image}
              alt={title}
              className="w-full h-full object-fill rounded-[12px]"
            />
          </div>
          <div className="flex flex-col gap-[4px] md:gap-[calc(100vw*8/1440)] mx-auto">
            <h2 className="text-white text-2xl font-bold">{title}</h2>
            <p className="text-[#FFC53D] text-base">{subtitle}</p>
            <p className="text-white text-xs pb-[8px]">{description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-12 xl:gap-16">
      {/* ensure the content, esp text, within each component horizontally lines up with the content inside other components */}
      <StarterKitSlide
        title="Previous Winning Hacks"
        subtitle="YOU CAN REFERENCE"
      >
        <div className="bg-sea-background rounded-[12px] flex flex-col">
          <div className="items-center pt-[20px]">
            {pastProjects.map((project, index) => (
              <PastProjectDisplay
                key={index}
                image={project.image}
                title={project.title}
                subtitle={project.subtitle}
                description={project.description}
              />
            ))}
            <div className="flex flex-col gap-8 md:gap-12 xl:gap-16 items-center">
              <Card className="h-fit bg-transparent shadow-none border-none text-text-light w-[calc(100vw*219/375)] md:w-[calc(100vw*971/1440)]">
                <CardContent className="p-0 flex flex-col md:items-center md:gap-0 md:flex-row-reverse md:justify-center">
                  {/* Text Container */}
                  <div className="flex flex-col md:px-0">
                    <p className="text-[0.5rem] xs:text-xs md:text-sm font-jakarta tracking-[0.02em]">
                      YOU CAN VIEW MORE ON
                    </p>
                    <h2 className="text-lg xs:xl md:text-2xl font-bold font-metropolis tracking-[0.02em] mb-4">
                      DevPost
                    </h2>
                  </div>
                  {/* Image Container */}
                  <div className="right-[-30px] bottom-[-5px] aspect-[264/170] md:h-[calc(100vw*399/1440)]">
                    <Image
                      src={podium}
                      alt="Cow Frog and Duck standing on a podium holding trophies"
                      className="w-full h-full object-fill"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </StarterKitSlide>
    </div>
  );
}
