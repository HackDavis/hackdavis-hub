'use client';

import Link from 'next/link';
// import Category from './Category';
import styles from './ProjectsCard.module.scss';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

interface ProjectsCardProps {
  team_id: string;
  num: number;
  name: string;
  categories: string[];
}

export default function ProjectsCard({
  team_id,
  num,
  name,
  categories,
}: ProjectsCardProps) {
  // const renderCategory = (category: string) => {
  //   return <div className={styles.category}>{category}</div>;
  // };

  // const extraCategories = (extra: number) => {
  //   return <div className={styles.extra}>{extra}+</div>;
  // };

  // const renderCategories = (categories: string[]) => {
  //   const size: number = categories.length;
  //   if (size == 0) {
  //     return <></>;
  //   } else if (size == 1) {
  //     return (
  //       <div className={styles.categoriesContainer}>
  //         {/* <Category category={categories[0]} />; */}
  //         {renderCategory(categories[0])}
  //       </div>
  //     );
  //   } else if (size == 2) {
  //     return (
  //       <div className={styles.categoriesContainer}>
  //         {renderCategory(categories[0])}
  //         {renderCategory(categories[1])}
  //       </div>
  //     );
  //   } else if (size > 2) {
  //     return (
  //       <div className={styles.categoriesContainer}>
  //         {renderCategory(categories[0])}
  //         {renderCategory(categories[1])}
  //         {extraCategories(size - 2)}
  //       </div>
  //     );
  //   }
  //   return <></>;
  // };

  const [emblaRef, _] = useEmblaCarousel(
    {
      loop: false,
      align: 'start',
      dragFree: true,
      skipSnaps: true,
      watchDrag: true,
    },
    [WheelGesturesPlugin()]
  );

  return (
    <Link href={`/judges/scoring/${team_id}`} className={styles.card}>
      <div className={styles.teamNumber}>{num}</div>
      <div className={styles.text}>
        <div className={styles.teamName}>{name} </div>
        <div ref={emblaRef}>
          <div className={styles.categoriesContainer}>
            {categories.map((category, index) => {
              return (
                <div key={index} className={styles.category}>
                  {category}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}
