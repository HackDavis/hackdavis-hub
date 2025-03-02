import Image, { StaticImageData } from 'next/image';
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

const devPostLink =
  'https://hackdavis-2024.devpost.com/project-gallery?_gl=1%2A50gpw%2A_gcl_au%2AMTc2MTUwMzcxOS4xNzQwODA4MTQ4%2A_ga%2AMjEwNzI2OTk2My4xNzQwODA4MTQ4%2A_ga_0YHJK3Y10M%2AMTc0MDgwODE0Ny4xLjEuMTc0MDgwODE3OS4wLjAuMA';

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

function PastProjectDisplay({
    image,
    title,
    subtitle,
    description,
  }: PastProjectDisplayProps) {
    return (
      <div className="bg-background-secondary rounded-[12px] w-full px-2 py-4 xs:px-3 md:rounded-[12px] md:p-8 2xl:p-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <div className="flex-shrink-0 aspect-[195/97] w-full md:aspect-[280/195] md:w-1/3">
            <Image
              src={image}
              alt={title}
              className="w-full h-full object-fill rounded-[12px]"
            />
          </div>
          <div className="flex flex-col gap-2 md:gap-2">
            <h2 className="text-white text-lg md:text-2xl lg:text-3xl font-bold 2xl:text-6xl">{title}</h2>
            <p className="text-[var(--hd-orange)] text-xs md:text-base lg:text-lg 2xl:text-2xl">{subtitle}</p>
            <p className="text-white text-xs md:text-base lg:text-lg 2xl:text-2xl">{description}</p>
          </div>
        </div>
      </div>
    );
  }

export default function PreviousHacks() {
    return <div className="bg-sea-background rounded-[12px] flex flex-col items-center 2xs:p-8 2xs:pb-0 p-4 pb-0 lg:p-8 lg:pb-0 gap-4 md:gap-6 lg:gap-8 2xl:gap-10 overflow-hidden">
      {pastProjects.map((project, index) => (
        <PastProjectDisplay
          key={index}
          image={project.image}
          title={project.title}
          subtitle={project.subtitle}
          description={project.description}
        />
      ))}
        <Card className="bg-transparent shadow-none border-none text-text-light w-full pt-4">
          <CardContent className="p-0 flex flex-col md:items-center md:gap-0 md:flex-row-reverse md:justify-center">
            {/* Text Container */}
            <div className="flex flex-col md:px-0">
              <p className="text-[0.5rem] xs:text-xs md:text-sm font-jakarta tracking-[0.02em]">
                YOU CAN VIEW MORE ON
              </p>
              <h2 className="text-lg xs:xl md:text-2xl font-bold font-metropolis tracking-[0.02em] mb-4">
                <a
                  href={devPostLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  DevPost
                </a>
              </h2>
            </div>
            {/* Image Container */}
            <div className="-right-8 -bottom-1 aspect-[264/170] md:w-3/5">
              <Image
                src={podium}
                alt="Cow Frog and Duck standing on a podium holding trophies"
                className="w-full h-full object-fill"
              />
            </div>
          </CardContent>
        </Card>
  </div>
}