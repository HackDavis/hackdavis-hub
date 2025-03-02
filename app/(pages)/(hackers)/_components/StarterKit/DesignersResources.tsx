import Image from 'next/image';
import { useLinkPreview } from '@app/(pages)/_hooks/useLinkPreview';

const designerResources = [
  {
    name: 'Anatomy of a design pitch',
    url: 'https://uxdesign.cc/anatomy-of-a-design-pitch-17435f3e7e0f',
  },
  {
    name: 'Human-Centered Design',
    url: 'https://www.designkit.org/human-centered-design',
  },
  {
    name: 'Human-Centered Design Process',
    url: 'https://www.usertesting.com/blog/how-ideo-uses-customer-insights-to-design-innovative-products-users-love',
  },
  {
    name: 'Figma for Beginners',
    url: 'https://www.youtube.com/playlist?list=PLXDU_eVOJTx7QHLShNqIXL1Cgbxj7HlN4',
  },
  {
    name: 'Design Features in Figma',
    url: 'https://youtube.com/playlist?list=PLXDU_eVOJTx6zk5MDarIs0asNoZqlRG23',
  },
  {
    name: 'Figma End to End',
    url: 'https://www.figma.com/resources/learn/getting-started-figma-end-to-end/',
  },
  {
    name: 'Tips for presentations (Figma)',
    url: 'https://youtu.be/yPuuiz1kT1M',
  },
  {
    name: 'Building Reusable Components',
    url: 'https://youtu.be/k8y9SRPB78Q',
  },
  {
    name: 'Prototyping & Transitions',
    url: 'https://youtu.be/-d6zNGeF59M',
  },
];

export default function DesignersResources() {
  return (
    <main className="relative h-[560px] flex flex-col items-center bg-[#123041] p-12 rounded-xl pt-24 overflow-hidden">
      <div className="w-full max-h-full overflow-y-auto pr-4 pb-6 custom-scrollbar">
        <div className="flex flex-col gap-6">
          {designerResources.map((resource) => (
            <ResourceCard key={resource.name} resource={resource} />
          ))}
        </div>
      </div>
    </main>
  );
}

function ResourceCard({
  resource,
}: {
  resource: (typeof designerResources)[0];
}) {
  // Use the custom hook
  const { preview, loading, error } = useLinkPreview(
    resource.url,
    resource.name
  );

  // Default image placeholder - a simple gradient background
  const placeholderImageStyle = {
    background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
  };

  return (
    <div className="flex flex-row bg-[#005271] rounded-xl overflow-hidden text-white font-jakarta w-full">
      <div className="relative w-[200px] min-w-[200px] h-[150px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <p>Loading...</p>
          </div>
        ) : preview.images.length > 0 ? (
          <Image
            src={preview.images[0]}
            alt={preview.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={placeholderImageStyle}
          >
            <p className="text-white text-sm font-semibold px-4 text-center">
              {error ? 'Failed to load image' : preview.title}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-xl font-bold mb-1">{preview.title}</h2>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {preview.description}
        </p>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-sm hover:underline mt-auto"
        >
          Visit Resource →
        </a>
      </div>
    </div>
  );
}
