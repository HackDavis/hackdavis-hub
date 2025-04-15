import User from '@typeDefs/user';
import Team from '@typeDefs/team';
import Submission from '@typeDefs/submission';
// import data from '@data/db_validation_data.json' assert { type: 'json' };
export default function matchingAlgorithm(judges: User[], teams: Team[]) {
  teams.map((team) => {
    while (team.tracks.length < 2) team.tracks.push('No Track');
    return team;
  });

  judges.map((group) => ({
    judgeGroup: group,
    teams: 0,
  }));

  const matches: Submission[] = [];

  // for (const team of filteredTeams) {
  //   teamAssignments.sort((group1, group2) => group1.teams - group2.teams);

  //   let pairedGroup = '';
  //   for (let i = 0; i < 2; i++) {
  // const chosenTrack = team.tracks[i];
  // const foundTrack = tracks.find((track) => track === chosenTrack);
  // if (foundTrack === undefined) continue;

  // let idx = 0;
  // while (
  //   idx < teamAssignments.length &&
  //   // teamAssignments[idx].judgeGroup.type !== foundTrack.type ||
  //   pairedGroup === teamAssignments[idx].judgeGroup._id
  // ) {
  //   idx++;
  // }

  // if (idx < teamAssignments.length) {
  //   teamAssignments[idx].teams++;

  // matches.push({
  //   judge_id: {
  //     '*convertId': {
  //       id: teamAssignments[idx].judgeGroup._id,
  //     },
  //   },
  //   team_id: {
  //     '*convertId': {
  //       id: team._id,
  //     },
  //   },
  //   round: teamAssignments[idx].teams,
  // });

  //       pairedGroup = teamAssignments[idx].judgeGroup._id ?? '';
  //     }
  //   }
  // }

  return matches;
}
