export default function JudgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen max-w-[500px] min-w-[370px] ml-auto mr-auto bg-[#FAFAFF]">
      {children}
    </div>
  );
}
