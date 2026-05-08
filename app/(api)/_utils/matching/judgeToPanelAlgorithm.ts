import Panel from '@typeDefs/panel';
import User from '@typeDefs/user';

export default async function judgeToPanelAlgorithm(
  panels: Panel[],
  judges: User[],
  panelSize: number = 5
) {
  for (const panel of panels) {
    if (judges.length < panelSize) return null;

    judges = judges.sort((a, b) => {
      const domain = panel.domain ?? '';
      const aIdx = a.specialties?.indexOf(domain) ?? -1;
      const bIdx = b.specialties?.indexOf(domain) ?? -1;
      return (aIdx === -1 ? Infinity : aIdx) - (bIdx === -1 ? Infinity : bIdx);
    });

    panel.user_ids = judges
      .splice(0, panelSize)
      .map((judge) => judge._id ?? '');
  }

  return panels;
}
