export default function JudgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen max-w-[500px] min-w-[370px] ml-auto mr-auto bg-[#F2F2F7]">
      {children}
    </div>
  );
}
