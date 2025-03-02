'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './MusicPlayer.module.scss';
import vinyl from 'public/index/hero/vinyl.svg';
import pauseIcon from 'public/index/hero/pause-icon.svg';
import playIcon from 'public/index/hero/play-icon.svg';

// TODO: add  "Coming Soon" on mobile

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotation, setRotation] = useState(0);

  const [showTooltip, setShowTooltip] = useState(false);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const rotate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setRotation((prevRotation) => prevRotation + (deltaTime / 16.67) * 2);

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(rotate);
      }
    };

    if (isPlaying) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(rotate);
    }
    return () => cancelAnimationFrame(animationRef.current as number);
  }, [isPlaying]);

  const handleHover = () => {
    console.log('starting timer');
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 600);
  };

  const cancelHover = () => {
    console.log('ending timer');

    clearTimeout(timeoutRef.current as NodeJS.Timeout);
    setShowTooltip(false);
  };

  return (
    <div className={styles.container}>
      <Image
        src={vinyl}
        alt="vinly"
        className={styles.vinyl}
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      <p className="font-jakarta text-left text-background-secondary leading-[145%] tracking-[0.32px] w-full max-w-[400px]">COMING SOON...</p>
      <button
        className={styles.controls}
        onClick={() => setIsPlaying((prev: any) => !prev)}
        onMouseEnter={handleHover}
        onMouseLeave={cancelHover}
      >
        <Image
          src={isPlaying ? pauseIcon : playIcon}
          alt="play or pause icon"
          className={styles.icon}
        />
        <div
          className={`${styles.tooltip} ${showTooltip ? styles.active : null}`}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </div>
      </button>
    </div>
  );
}
