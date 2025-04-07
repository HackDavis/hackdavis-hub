'use client';

import { useRef, useState } from 'react';

import Link from 'next/link';
import styles from './BarChart.module.scss';

interface Line {
  style: string;
  value: number;
}

interface BarChartProps {
  data: {
    key: string;
    label: string;
    value: number;
    backgroundColor?: string;
    link?: string;
  }[];
  barHeight?: string;
  barGap?: string;
  labelMargin?: string;
  lines?: Line[];
}

export default function BarChart({
  data,
  barHeight = '40px',
  barGap = '16px',
  labelMargin = '16px',
  lines = [],
}: BarChartProps) {
  const maxDataValue = Math.max(...data.map((point) => point.value));
  const maxLineValue = Math.max(...lines.map(({ value }) => value));
  const maxValue = Math.max(maxDataValue, maxLineValue);

  const baseLines: Line[] = [
    {
      style: 'solid 1px black',
      value: 0,
    },
    ...Array.from({ length: maxValue - 1 }, (_, i) => i + 1).map((x) => ({
      style: 'solid 1px #8E8E8E',
      value: x,
    })),
  ];

  const linesToDraw = [...baseLines, ...lines];

  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartResizeObserverRef = useRef<ResizeObserver | null>(null);

  const [chartWidth, setChartWidth] = useState(0);

  const onChartResize = ([node]: ResizeObserverEntry[]) => {
    setChartWidth(node.target.getBoundingClientRect().width);
  };

  const onChartLoad = (node: HTMLDivElement | null) => {
    if (!node) {
      if (chartResizeObserverRef.current) {
        chartResizeObserverRef.current.disconnect();
      }
      return;
    }
    chartRef.current = node;
    chartResizeObserverRef.current = new ResizeObserver(onChartResize);
    chartResizeObserverRef.current.observe(node);
  };

  const labelsStyle = {
    gap: barGap,
    marginRight: labelMargin,
  };

  const labelStyle = {
    height: barHeight,
  };

  const barsStyle = {
    gap: barGap,
  };

  const unitWidth = chartWidth / maxValue;

  return (
    <div className={styles.container}>
      <div className={styles.labels} style={labelsStyle}>
        {data.map((point) => (
          <p
            className={styles.label}
            key={JSON.stringify(point)}
            style={labelStyle}
          >
            {point.label}
          </p>
        ))}
      </div>
      <div className={styles.chart_container} ref={onChartLoad}>
        <div className={styles.bars} style={barsStyle}>
          {data.map((point) => {
            const barStyle = {
              height: barHeight,
              maxWidth: `calc(${unitWidth}px * ${point.value})`,
              backgroundColor: point.backgroundColor,
            };

            return point.link ? (
              <Link
                className={styles.bar}
                key={JSON.stringify(point)}
                href={point.link}
                style={barStyle}
              >
                <p className={styles.barText}>{point.value}</p>
              </Link>
            ) : (
              <div
                className={styles.bar}
                key={JSON.stringify(point)}
                style={barStyle}
              >
                <p className={styles.barText}>{point.value}</p>
              </div>
            );
          })}
        </div>
        {linesToDraw.map(({ style, value }, index: number) => (
          <div
            key={index}
            className={styles.line_mark}
            style={{
              borderLeft: style,
              left: `calc(${unitWidth}px * ${value})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
