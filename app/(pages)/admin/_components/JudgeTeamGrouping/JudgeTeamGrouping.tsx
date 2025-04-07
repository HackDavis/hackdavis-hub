import matchTeams from '@actions/logic/matchTeams';
import scoreTeams from '@actions/logic/scoreTeams';
import { useFormState } from 'react-dom';
import { Button } from '@globals/components/ui/button';

import styles from './JudgeTeamGrouping.module.scss';
import { useState } from 'react';
import deleteManySubmissions from '@actions/submissions/deleteSubmission';

export default function JudgeTeamGrouping() {
  const [trackResults, scoreAction] = useFormState(scoreTeams, null);
  const [matching, setMatching] = useState('');

  return (
    <div className={styles.body}>
      <button
        onClick={async () => setMatching(JSON.stringify(await matchTeams()))}
      >
        Match Teams
      </button>
      <p>matching: {matching}</p>

      <form action={scoreAction}>
        <Button type="submit">Score Teams</Button>
        {/* interface RankTeamsResults {
  [track_name: string]: {
    team: {
      team_id: string;
      final_score: number;
      comments: string[];
    };
  }[];
} */}
        {trackResults &&
          Object.entries(trackResults).map(([trackName, teams]) => (
            <div key={trackName}>
              <h3>{trackName}</h3>
              {teams.map(
                ({
                  team,
                }: {
                  team: {
                    team_id: string;
                    final_score: number;
                    comments: string[];
                  };
                }) => (
                  <div key={team.team_id}>
                    <p>Team ID: {team.team_id}</p>
                    <p>Score: {team.final_score}</p>
                    {team.comments.length > 0 && (
                      <>
                        <p>Comments:</p>
                        <ul>
                          {team.comments.map((comment, i) => (
                            <li key={i}>{comment}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          ))}
        {/* {trackResults !== null
          ? trackResults!.map((result) => (
              <>
                <h4>{result.track}</h4>
                {result.topEntries.map((entry, i) => (
                  <div key={i} className={styles.score}>
                    <p>
                      Team No. {entry.number}, {entry.name}, {entry.score}
                    </p>
                    <p>Comments:</p>
                    <ul>
                      {entry.comments.map((comment, i) => {
                        if (comment !== undefined) {
                          return <li key={i}>{comment}</li>;
                        }
                      })}
                    </ul>
                  </div>
                ))}
              </>
            ))
          : ''} */}
      </form>

      <div className={styles.delete}>
        {/* TODO: only delete unscored? when was this used last year? */}
        <button
          onClick={async () => {
            await deleteManySubmissions();
            setMatching('Submissions deleted');
          }}
          className={styles.deleteButton}
        >
          Delete All Judge-Team Matches
        </button>
      </div>
    </div>
  );
}
