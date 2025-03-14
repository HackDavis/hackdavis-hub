import { prizes } from '@datalib/prizes/getPrizes';

export default function PrizeTracks() {
  return (
    <main className="flex flex-col gap-4 h-screen">
      <Header />
      <FilterRow />
    </main>
  );
}

function Header() {
  return (
    <div className="flex flex-col">
      <h3>CHECK OUT OUR</h3>
      <h1>Prize Tracks</h1>
    </div>
  );
}

interface FilterItem {
  track: string;
  color: string;
}

function FilterRow() {
  const filters: FilterItem[] = [
    { track: 'ALL', color: '#C3F0EF' },
    { track: 'GENERAL', color: '#FFDBCA' },
    { track: 'TECHNICAL', color: '#CDE396' },
    { track: 'DESIGN', color: '#FFDC86' },
    { track: 'BUSINESS', color: '#D5CBE9' },
    { track: 'NONPROFIT', color: '#D5CBE9' },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {filters.map((filter, index) => {
        const track = filter.track;
        const color = filter.color;
        return (
          <div
            key={index}
            className="px-8 py-2 border-2 rounded-3xl border-dashed"
            style={{ borderColor: color }}
          >
            {track}
          </div>
        );
      })}
    </div>
  );
}
