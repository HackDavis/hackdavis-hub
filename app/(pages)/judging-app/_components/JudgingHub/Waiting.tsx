const tips = [
  '🔋 Charge your phone!',
  '👋 Say hi to other judges!',
  '🍿 Grab a snack and water!',
];

const TipCard = (tip: string) => {
  return (
    <div className="tw-flex tw-text-xl tw-items-center tw-justify-center tw-bg-white tw-rounded-[16px] tw-py-[20px]">
      {tip}
    </div>
  );
};

export default function Waiting() {
  return (
    <div className="tw-flex tw-flex-col tw-p-4  tw-bg-[#f2f2f7] tw-gap-4 tw-py-8">
      <h3 className="tw-font-bold tw-text-2xl">
        While you're waiting, feel free to...
      </h3>
      <div className="tw-flex tw-flex-col tw-gap-4">
        {tips.map((tip, index) => (
          <div key={index}>{TipCard(tip)}</div>
        ))}
      </div>
    </div>
  );
}
