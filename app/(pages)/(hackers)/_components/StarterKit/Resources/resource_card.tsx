import { useLinkPreview } from '@app/(pages)/_hooks/useLinkPreview';
export interface resource_type {
  name: string;
  url: string;
}

export default function ResourceCard({
  resource,
}: {
  resource: resource_type;
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
      <div className="relative w-[200px] min-w-[200px] ">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <p>Loading...</p>
          </div>
        ) : preview.images.length > 0 ? (
          <div className="relative w-full h-full">
            {/* using image here since we would need to add all the link
                previews to the next config
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.images[0]}
              alt={preview.title}
              className="w-full h-full object-cover"
            />
          </div>
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
          className="flex flex-row justify-center items-center px-6 py-2 gap-2.5 w-[107px] h-[42px] bg-[#9EE7E5] rounded-[50px] text-black text-sm font-medium hover:opacity-90 transition-opacity mt-auto"
        >
          Watch
        </a>
      </div>
    </div>
  );
}
