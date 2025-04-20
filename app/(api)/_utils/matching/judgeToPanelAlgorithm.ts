import Panel from '@typeDefs/panel';
import User from '@typeDefs/user';

export default async function judgeToPanelAlgorithm(
  panels: Panel[],
  judges: User[],
  panelSize: number = 5
) {
  for (const panel of panels) {
    if (judges.length < panelSize) return null;

    judges = judges.sort(
      (a, b) =>
        (a.specialties?.indexOf(panel.domain) ?? 0) -
        (b.specialties?.indexOf(panel.domain) ?? 0)
    );

    panel.user_ids = judges
      .splice(0, panelSize)
      .map((judge) => judge._id ?? '');
  }

  return panels;
}
