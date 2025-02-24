import Waterfall from './_components/Waterfall/Waterfall';

export default function HackerHub() {
  return (
    <main>
      <div>
        {/* Remove when adding vinyl or other components on top, just to see the whole flowers component */}
        <div className="h-[400px]">Spacer</div>
        <Waterfall />
      </div>
    </main>
  );
}
