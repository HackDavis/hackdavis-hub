'use client';
import StarterKitSlide from './_components/StarterKitSlide';
import ParentCarousel from './_components/ParentCarousel/ParentCarousel';
import Image from 'next/image';
import { useState } from 'react';

export default function Page() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carousels = [
    {
      title: "✦ Let's Begin!",
      color: '#005271',
      slides: [
        {
          title: 'Hacking 101 Workshop',
          subtitle: 'JOIN US FOR OUR',
          imageSrc: '/hackers/crossing_cow.svg',
        },
        {
          title: 'In case you missed it...',
          subtitle: "HERE's A RECAP OF THE WORKSHOP",
          imageSrc: '/hackers/flag_duck.svg',
        },
      ],
    },
    {
      title: '✦ Find a Team',
      color: '#AFD157',
      slides: [
        {
          title: 'In case you missed it...',
          subtitle: "HERE's A RECAP OF THE WORKSHOP",
          imageSrc: '/hackers/flag_duck.svg',
        },
      ],
    },
    {
      title: '✦ Ideate',
      color: '#FFC53D',
      slides: [
        {
          title: 'Hacking 101 Workshop',
          subtitle: 'JOIN US FOR OUR',
          imageSrc: '/hackers/crossing_cow.svg',
        },
      ],
    },
    {
      title: '✦ Resources',
      color: '#005271',
      slides: [
        {
          title: 'Hacking 101 Workshop',
          subtitle: 'JOIN US FOR OUR',
          imageSrc: '/hackers/crossing_cow.svg',
        },
        {
          title: 'In case you missed it...',
          subtitle: "HERE's A RECAP OF THE WORKSHOP",
          imageSrc: '/hackers/flag_duck.svg',
        },
      ],
    },
  ];
  const goNext = () => {
    if (carouselIndex < carousels.length - 1) {
      setCarouselIndex(carouselIndex + 1);
    } else {
      setCarouselIndex(0);
    }
  };

  const goBack = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    } else {
      setCarouselIndex(carousels.length - 1);
    }
  };

  return (
    <main>
      <ParentCarousel
        title={carousels[carouselIndex].title}
        color={carousels[carouselIndex].color}
        totalCarousels={carousels.length}
        currentIndex={carouselIndex}
        onNavigate={(direction) => {
          if (direction === 'next') {
            goNext();
          } else {
            goBack();
          }
        }}
      >
        {carousels[carouselIndex].slides.map((slide, slideIndex) => (
          <StarterKitSlide
            key={slideIndex}
            title={slide.title}
            subtitle={slide.subtitle}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.title}
              width={100}
              height={100}
            />
          </StarterKitSlide>
        ))}
      </ParentCarousel>
    </main>
  );
}
