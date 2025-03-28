export default function JudgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[500px] min-w-[370px] ml-auto mr-auto">
      {children}
    </div>
  );
}
