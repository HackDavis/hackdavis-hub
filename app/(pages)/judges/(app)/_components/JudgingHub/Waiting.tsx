const tips = [
  "🔋 Charge your phone!",
  "👋 Say hi to other judges!",
  "🍿 Grab a snack and water!",
];

const TipCard = (tip: string) => {
  return (
    <div className="flex text-xl items-center justify-center bg-white rounded-[16px] py-[20px]">
      {tip}
    </div>
  );
};

export default function Waiting() {
  return (
    <div className="flex flex-col px-[20px] bg-[#f2f2f7] gap-4 py-8">
      <h3 className="font-bold text-2xl">
        While you're waiting, feel free to...
      </h3>
      <div className="flex flex-col gap-4">
        {tips.map((tip, index) => (
          <div key={index}>{TipCard(tip)}</div>
        ))}
      </div>
    </div>
  );
}
