import User from '@typeDefs/user';

function createGroups(judgeArray: User[], groupType: string) {
  const groupArray: { type: string; judge_ids: object }[] = [];

  if (judgeArray.length % 2 === 0) {
    while (judgeArray.length > 0) {
      const judge1 = judgeArray.shift();
      const judge2 = judgeArray.pop();

      groupArray.push({
        type: groupType,
        judge_ids: {
          '*convertIds': {
            ids: [judge1?._id, judge2?._id],
          },
        },
      });
    }
  } else {
    while (judgeArray.length > 3) {
      const judge1 = judgeArray.shift();
      const judge2 = judgeArray.shift();
      groupArray.push({
        type: groupType,
        judge_ids: {
          '*convertIds': {
            ids: [judge1?._id, judge2?._id],
          },
        },
      });
    }

    const judge1 = judgeArray.shift();
    const judge2 = judgeArray.shift();
    const judge3 = judgeArray.shift();
    groupArray.push({
      type: groupType,
      judge_ids: {
        '*convertIds': {
          ids: [judge1?._id, judge2?._id, judge3?._id],
        },
      },
    });
  }
  return groupArray;
}

export default function groupingAlgorithm(judges: User[]) {
  judges = judges.filter((judge) => judge.role === 'judge');
  const techJudges = judges.filter(
    (judge) => judge.specialties?.includes('tech')
  );
  const desJudges = judges.filter(
    (judge) => judge.specialties?.includes('design')
  );
  const businessJudges = judges.filter(
    (judge) => judge.specialties?.includes('business')
  );

  // desJudges.push(...businessJudges.splice(0, desJudges.length));

  const Tgroups = createGroups(techJudges, 'tech');
  const Dgroups = createGroups(desJudges, 'design');
  const Ggroups = createGroups(businessJudges, 'business');

  const groups: { type: string; judge_ids: object }[] = [
    ...Tgroups,
    ...Dgroups,
    ...Ggroups,
  ];

  return groups;
}
