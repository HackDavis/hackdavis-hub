'use client';

export function Star({
  width,
  height,
  fill,
}: {
  width: number;
  height: number;
  fill: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill={fill}
    >
      <path
        d="M8.91626 0.928763C9.28853 -0.0772846 10.7115 -0.0772851 11.0837 0.928763L13.0567 6.26059C13.1737 6.57688 13.4231 6.82627 13.7394 6.94331L19.0712 8.91626C20.0773 9.28853 20.0773 10.7115 19.0712 11.0837L13.7394 13.0567C13.4231 13.1737 13.1737 13.4231 13.0567 13.7394L11.0837 19.0712C10.7115 20.0773 9.28853 20.0773 8.91626 19.0712L6.94331 13.7394C6.82627 13.4231 6.57689 13.1737 6.26059 13.0567L0.928763 11.0837C-0.0772846 10.7115 -0.0772851 9.28853 0.928763 8.91626L6.26059 6.94331C6.57688 6.82627 6.82627 6.57689 6.94331 6.26059L8.91626 0.928763Z"
        fill={fill}
      />
    </svg>
  );
}

export function Chevron({
  width,
  height,
  fill,
}: {
  width: number;
  height: number;
  fill: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill={fill}
    >
      <g clipPath="url(#clip0_2216_1155)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.8166 16.9276L9.38823 7.49924L11.7449 5.14258L19.9949 13.3926L28.2449 5.14258L30.6016 7.49924L21.1732 16.9276C20.8607 17.24 20.4368 17.4156 19.9949 17.4156C19.553 17.4156 19.1291 17.24 18.8166 16.9276Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}
