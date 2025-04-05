interface LoaderProps {
  modal?: boolean;
  message?: string;
}

export default function Loader({ modal = false, message = '' }: LoaderProps) {
  return (
    <div
      className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center bg-[rgba(136, 136, 136, 0.50)] backdrop-blur ${
        modal ? '' : 'min-w-screen min-h-screen'
      }`}
    >
      <h3>{message}</h3>
      <div className="border-8 border-solid border-[#F3F3F3] border-t-background-secondary rounded-[50%] w-[40px] h-[40px] animate-spin" />
    </div>
  );
}
