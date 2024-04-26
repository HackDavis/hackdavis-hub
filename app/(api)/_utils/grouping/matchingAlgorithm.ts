import JudgeGroup from '@typeDefs/judgeGroups';
import Team from '@typeDefs/teams';
import tracks from '../../_data/tracks.json' assert { type: 'json' };
import JudgeGroupToTeam from '@typeDefs/judgeGroupToTeam';

export default function matchingAlgorithm(
  judgeGroups: JudgeGroup[],
  teams: Team[]
) {
  const filteredTeams = teams.map((team) => {
    while (team.tracks.length < 2) team.tracks.push('No Track');
    return team;
  });

  const teamAssignments = judgeGroups.map((group) => ({
    judgeGroup: group,
    teams: 0,
  }));

  const matches: JudgeGroupToTeam[] = [];

  for (const team of filteredTeams) {
    teamAssignments.sort((group1, group2) => group1.teams - group2.teams);

    for (let i = 0; i < 2; i++) {
      const chosenTrack = team.tracks[i];
      const foundTrack = tracks.find((track) => track.name === chosenTrack);
      if (foundTrack === undefined) continue;

      let idx = 0;
      while (
        idx < teamAssignments.length &&
        teamAssignments[idx].judgeGroup.type !== foundTrack.type
      ) {
        idx++;
      }

      teamAssignments[idx].teams++;

      matches.push({
        judge_group_id: {
          '*convertId': {
            id: teamAssignments[idx].judgeGroup._id,
          },
        },
        team_id: {
          '*convertId': {
            id: team._id,
          },
        },
        round: teamAssignments[idx].teams,
      });
    }
  }

  return matches;
}
