export function shouldDisableEventsToolForQuery(query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;

  const factualIntent =
    /\b(judging|judged|rubric|criteria|score|scoring|weights?|points?)\b/.test(
      q
    ) ||
    /\b(deadline|deadlines|due date|cutoff|submission deadline)\b/.test(q) ||
    /\b(rule|rules|policy|policies|code of conduct|eligib(?:le|ility)|requirements?)\b/.test(
      q
    ) ||
    /\b(submit|submission|submissions|devpost|submission process|judging process)\b/.test(
      q
    ) ||
    /\b(team number|table number|team size|max team|minimum team|min team)\b/.test(
      q
    ) ||
    /\b(prize track|prize tracks|prizes?)\b/.test(q) ||
    /\b(check[- ]?in|checkin code|invite|registration)\b/.test(q);

  const eventIntent =
    /\b(schedule|event|events|workshop|workshops|activit(?:y|ies)|meal|meals|breakfast|brunch|lunch|dinner|happening)\b/.test(
      q
    );

  return factualIntent && !eventIntent;
}

export function isResourcesQuery(query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;

  const asksForResources =
    /\b(resource|resources|tools?|apis?|libraries|frameworks?|starter kit)\b/.test(
      q
    ) || /\b(figma|ui\s*kit|design\s*kit|palette|templates?)\b/.test(q);

  const asksForRoleScopedResources =
    /\b(developer|developers|dev)\b/.test(q) ||
    /\b(designer|designers|design|ui\/?ux)\b/.test(q);

  return asksForResources || asksForRoleScopedResources;
}

export function isExplicitEventQuery(query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;

  return /\b(schedule|event|events|workshop|workshops|activit(?:y|ies)|meal|meals|breakfast|brunch|lunch|dinner|happening|attend|go to)\b/.test(
    q
  );
}
