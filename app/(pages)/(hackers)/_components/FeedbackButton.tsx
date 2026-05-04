export default function FeedbackButton() {
  return (
    <a
      href="https://forms.gle/DVYARWyFM58iWqNZA"
      target="_blank"
      rel="noreferrer"
      aria-label="Open feedback form"
      className="group fixed bottom-4 left-0 z-50 rounded-r-xl border border-slate-200 bg-white px-2.5 py-3 text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
    >
      <span className="flex items-center gap-1.5">
        <span className="origin-center whitespace-nowrap text-[10px] font-medium tracking-[0.18em] [writing-mode:vertical-rl] rotate-180 uppercase">
          Feedback
        </span>
      </span>
    </a>
  );
}
