import { useLinkPreview } from '@hooks/useLinkPreview';
export interface resource_type {
  name: string;
  url: string;
}

export default function ResourceCard({
  resource,
  default_img_path,
}: {
  resource: resource_type;
  default_img_path: string;
}) {
  // Use the custom hook
  const { preview, loading, error } = useLinkPreview(
    resource.url,
    resource.name
  );

  return (
    <div className="flex flex-row flex-wrap md:flex-nowrap bg-[#005271] rounded-lg md:rounded-xl p-2 xs:p-4 md:p-0 2xs:gap-4 md:gap-0 overflow-hidden text-white font-jakarta w-full">
      <div className="relative w-full aspect-video md:w-1/4 md:aspect-auto rounded-lg overflow-clip bg-secondary">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* using image here since we would need to add all the link
                previews to the next config
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                preview.images.length > 0 ? preview.images[0] : default_img_path
              }
              alt={preview.title}
              className="absolute h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="py-2 md:p-4 flex flex-col flex-1 w-full md:max-w-3/4">
        <h2 className="text-lg md:text-xl font-bold mb-1">{preview.title}</h2>
        <p className="text-gray-300 text-xs md:text-sm mb-3 line-clamp-2">
          {preview.description}
        </p>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row justify-center items-center px-4 md:px-6 py-2 gap-2.5 w-[90px] md:w-[107px] h-[36px] md:h-[42px] bg-[#9EE7E5] rounded-[50px] text-black text-xs md:text-sm font-medium hover:opacity-90 transition-opacity mt-auto"
        >
          Watch
        </a>
      </div>
    </div>
  );
}
