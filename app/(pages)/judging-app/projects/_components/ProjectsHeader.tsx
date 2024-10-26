'use client';

// import { useState } from 'react';
import styles from './ProjectsHeader.module.scss';
import { CiMap } from 'react-icons/ci';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsHeader({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}) {
  const figmaLink =
    'https://www.figma.com/proto/9frZI5Kc9f2c8o4ZIZG8fX/Judging-Table-Map?page-id=0:1&type=design&node-id=1-4&viewport=134,164,0.69&t=Jfp4HXeR7nRs3B6R-1&scaling=min-zoom&mode=design';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          style={{
            display: 'flex',
          }}
        >
          <Link href="/judges">
            <Image
              src="/judges/hub/back-arrow.svg"
              alt=""
              height={50}
              width={50}
              quality={100}
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain',
                marginTop: '-7px',
              }}
            />
          </Link>
          <div className={styles.header_title}>Projects</div>
        </div>

        <div>
          <Link href={figmaLink} target="_blank">
            <div className={styles.header_map}>
              <CiMap className={styles.header_map_icon} />
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.projectType}>
        <div
          className={`${styles.title} ${activeTab ? '' : `${styles.selected}`}`}
          onClick={() => setActiveTab(0)}
        >
          Unjudged
        </div>
        <div> | </div>
        <div
          className={`${styles.title} ${activeTab ? `${styles.selected}` : ''}`}
          onClick={() => setActiveTab(1)}
        >
          Scored
        </div>
      </div>
    </div>
  );
}
