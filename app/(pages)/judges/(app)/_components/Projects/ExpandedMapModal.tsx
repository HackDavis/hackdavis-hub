import Image from 'next/image';
import closeIcon from '@public/judges/projects/x.svg';
import venueMap from '@public/judges/projects/venueMap2026.svg';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default function ExpandedMapModal({
  setMapExpanded,
}: {
  setMapExpanded: (expanded: boolean) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={() => setMapExpanded(false)}
    >
      <div
        className="relative mx-4 h-[calc(100dvh-44px)] w-full max-w-[370px] overflow-hidden rounded-[32px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setMapExpanded(false)}
          className="absolute top-4 right-4 z-20 bg-black text-white rounded-full w-[36px] h-[36px] flex items-center justify-center"
          aria-label="Close map"
        >
          <Image src={closeIcon} alt="Close" width={15} height={15} />
        </button>

        <TransformWrapper
          initialScale={2.25}
          minScale={1.5}
          maxScale={6}
          centerOnInit
          limitToBounds={true}
          panning={{ disabled: false }}
        >
          {() => (
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    transform: 'rotate(90deg)',
                    transformOrigin: 'center',
                    width: '100vh',
                    height: '100vw',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    src={venueMap}
                    alt="first floor map"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                    draggable={false}
                  />
                </div>
              </div>
            </TransformComponent>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
}
