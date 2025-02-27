'use client';
import { ParentCarousel } from '../../_components/StarterKit/ParentCarousel';
import StarterKitSlide from '../../_components/StarterKit/StarterKitSlide';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="w-full" style={{ backgroundColor: '#95DAEE' }}>
      <ParentCarousel>
        <div>
          <h1>Hello</h1>
        </div>
      </ParentCarousel>
    </main>
  );
}
