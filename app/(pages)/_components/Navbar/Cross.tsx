interface CrossProps {
  width?: string;
  height?: string;
}

export default function Cross({ width = '100%', height = '100%' }: CrossProps) {
  return (
    <svg
      style={{ width, height }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="2.00037"
        y1="21.0921"
        x2="21.0922"
        y2="2.00017"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="1.5"
        y1="-1.5"
        x2="28.5"
        y2="-1.5"
        transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 21.2133 23.2134)"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
