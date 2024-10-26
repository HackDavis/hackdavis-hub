'use client';
import styles from './Category.module.scss';

export default function Category({ category }: { category: string }) {
  return <div className={styles.category}>in category {category}</div>;
}
