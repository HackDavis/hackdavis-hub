import JudgeGroup from '@typeDefs/judgeGroup';
import Team from '@typeDefs/team';
import tracks from '../../_data/tracks.json' assert { type: 'json' };
import JudgeGroupToTeam from '@typeDefs/judgeToTeam';

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

    let pairedGroup = '';
    for (let i = 0; i < 2; i++) {
      const chosenTrack = team.tracks[i];
      const foundTrack = tracks.find((track) => track.name === chosenTrack);
      if (foundTrack === undefined) continue;

      let idx = 0;
      while (
        idx < teamAssignments.length &&
        (teamAssignments[idx].judgeGroup.type !== foundTrack.type ||
          pairedGroup === teamAssignments[idx].judgeGroup._id)
      ) {
        idx++;
      }

      if (idx < teamAssignments.length) {
        teamAssignments[idx].teams++;

        matches.push({
          judge_id: {
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

        pairedGroup = teamAssignments[idx].judgeGroup._id ?? '';
      }
    }
  }

  return matches;
}
