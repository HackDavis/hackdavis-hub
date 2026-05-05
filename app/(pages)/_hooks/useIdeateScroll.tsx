'use client';

import type { StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Responsibility {
  dark_icon: StaticImageData;
  light_icon: StaticImageData;
  title: string;
  description: string;
}

export default function useIdeateScroll({
  title,
  responsibilities,
}: {
  title: string;
  responsibilities: Responsibility[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchYRef = useRef<number>(0);
  const enterFromTop = useRef<boolean | null>(true);
  const scrollPosRef = useRef<number>(0);
  const [responsibilityIndex, setResponsibilityIndex] = useState(0);
  const [scrollPos, setScrollPos] = useState<number | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getMaxHeight = () => scrollRef.current?.clientHeight ?? 0;
    const getMinHeight = () => getMaxHeight() / 8;
    const getCurrentScrollPos = () => scrollPosRef.current || getMinHeight();

    const setTouchAction = (value: string) => {
      if (!sectionRef.current) return;
      sectionRef.current.style.touchAction = value;
    };

    const snapToIndex = (index: number) => {
      const maxHeight = getMaxHeight();
      if (!maxHeight) return;

      const positions = [
        maxHeight / 8,
        (maxHeight * 3) / 8,
        (maxHeight * 21) / 32,
        maxHeight,
      ];

      const target = positions[index] ?? positions[0];
      scrollPosRef.current = target;
      setScrollPos(target);
    };

    const snapToNearest = (pos: number) => {
      const maxHeight = getMaxHeight();
      if (!maxHeight) return;

      const positions = [
        maxHeight / 8,
        (maxHeight * 3) / 8,
        (maxHeight * 21) / 32,
        maxHeight,
      ];

      let closest = positions[0];
      for (const p of positions) {
        if (Math.abs(pos - p) < Math.abs(pos - closest)) {
          closest = p;
        }
      }

      scrollPosRef.current = closest;
      setScrollPos(closest);
    };

    const updateScrollPos = (delta: number) => {
      const maxHeight = getMaxHeight();
      const next = Math.min(
        Math.max(getMinHeight(), getCurrentScrollPos() + delta),
        maxHeight
      );

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => snapToNearest(next), 100);

      scrollPosRef.current = next;
      setScrollPos(next);
    };

    const onScroll = (e: WheelEvent) => {
      if (!scrollRef.current) return;

      const midpoint =
        (scrollRef.current.getBoundingClientRect().top +
          scrollRef.current.getBoundingClientRect().bottom) /
        2;
      const minHeight = getMinHeight();
      const maxHeight = getMaxHeight();
      const currentScrollPos = getCurrentScrollPos();

      if (
        midpoint > window.innerHeight / 2 - 50 &&
        midpoint < window.innerHeight / 2 + 50
      ) {
        updateScrollPos(e.deltaY);

        if (enterFromTop.current === true && currentScrollPos !== maxHeight) {
          if (e.cancelable) e.preventDefault();
          else setTouchAction('none');
        } else if (
          enterFromTop.current === false &&
          currentScrollPos !== minHeight
        ) {
          if (e.cancelable) e.preventDefault();
          else setTouchAction('none');
        } else if (
          enterFromTop.current === true &&
          currentScrollPos === maxHeight + 5
        ) {
          enterFromTop.current = false;
        } else if (
          enterFromTop.current === false &&
          currentScrollPos === minHeight - 5
        ) {
          enterFromTop.current = true;
        }
      } else if (
        currentScrollPos !== maxHeight &&
        currentScrollPos !== minHeight
      ) {
        if (e.cancelable) e.preventDefault();
        else setTouchAction('none');
        updateScrollPos(e.deltaY);
      } else {
        if (midpoint < window.innerHeight / 2 - 50) {
          enterFromTop.current = false;
        } else if (midpoint > window.innerHeight / 2 + 50) {
          enterFromTop.current = true;
        } else {
          enterFromTop.current = null;
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!scrollRef.current) return;

      const midpoint =
        (scrollRef.current.getBoundingClientRect().top +
          scrollRef.current.getBoundingClientRect().bottom) /
        2;
      const minHeight = getMinHeight();
      const maxHeight = getMaxHeight();
      const deltaY = touchYRef.current - e.touches[0].clientY;
      touchYRef.current = e.touches[0].clientY;
      const currentScrollPos = getCurrentScrollPos();

      if (
        midpoint > window.innerHeight / 2 - 50 &&
        midpoint < window.innerHeight / 2 + 50
      ) {
        updateScrollPos(deltaY);

        if (enterFromTop.current === true && currentScrollPos !== maxHeight) {
          if (e.cancelable) e.preventDefault();
          else setTouchAction('none');
        } else if (
          enterFromTop.current === false &&
          currentScrollPos !== minHeight
        ) {
          if (e.cancelable) e.preventDefault();
          else setTouchAction('none');
        } else {
          setTouchAction('auto');
        }
      } else if (
        currentScrollPos !== maxHeight &&
        currentScrollPos !== minHeight
      ) {
        if (e.cancelable) e.preventDefault();
        else setTouchAction('none');
        updateScrollPos(deltaY);
      } else {
        if (midpoint < window.innerHeight / 2 - 50) {
          enterFromTop.current = false;
        } else if (midpoint > window.innerHeight / 2 + 50) {
          enterFromTop.current = true;
        } else {
          enterFromTop.current = null;
        }
      }
    };

    const onTouchEnd = () => {
      touchYRef.current = 0;
      setTouchAction('auto');
    };

    window.addEventListener('wheel', onScroll, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });

    const listeners = responsibilities.map((_, index) => {
      const id = `${title}responsibility-${index}`;
      const element = document.getElementById(id);
      const listener = () => snapToIndex(index);
      if (element) element.addEventListener('click', listener);
      return { element, listener };
    });

    return () => {
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      listeners.forEach(({ element, listener }) => {
        element?.removeEventListener('click', listener);
      });
    };
  }, [responsibilities, title]);

  useEffect(() => {
    if (!scrollRef.current) return;
    if (!scrollPos) {
      const initial = (scrollRef.current.clientHeight * 1) / 8;
      scrollPosRef.current = initial;
      setScrollPos(initial);
    }

    const maxHeight = scrollRef.current?.clientHeight || 50;
    const positions = [
      (maxHeight * 1) / 8,
      (maxHeight * 3) / 8,
      (maxHeight * 21) / 32,
      maxHeight,
    ];
    const minScrollHeight = (scrollRef.current.clientHeight * 1) / 8;

    let min = 0;
    for (let i = 1; i < positions.length; i += 1) {
      if (
        Math.abs((scrollPos ?? minScrollHeight) - positions[i]) <
        Math.abs((scrollPos ?? minScrollHeight) - positions[min])
      ) {
        min = i;
      }
    }

    setResponsibilityIndex(min);
  }, [scrollPos]);

  return {
    sectionRef,
    scrollRef,
    responsibilityIndex,
    scrollPos,
  };
}
