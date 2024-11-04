import matchTeams from '@actions/logic/matchTeams';
import groupJudges from '@actions/logic/groupJudges';
import deleteManyJudgeGroups from '@actions/judgeGroups/deleteJudgeGroup';
import deleteManyJudgeGroupsToTeams from '@actions/judgeGroupsToTeams/deleteJudgeGroupToTeam';
import scoreTeams from '@actions/logic/scoreTeams';
import { useFormState } from 'react-dom';

import styles from './JudgeTeamGrouping.module.scss';
import { useState } from 'react';

export default function JudgeTeamGrouping() {
  const [trackResults, scoreAction] = useFormState(scoreTeams, null);
  const [grouping, setGrouping] = useState('');
  const [matching, setMatching] = useState('');

  return (
    <div className={styles.body}>
      <button
        onClick={async () => setGrouping(JSON.stringify(await groupJudges()))}
      >
        Group Judges
      </button>
      <p>groups: {grouping}</p>

      <button
        onClick={async () => setMatching(JSON.stringify(await matchTeams()))}
      >
        Match Teams
      </button>
      <p>matching: {matching}</p>

      <form action={scoreAction}>
        <button type="submit">Score Teams</button>
        {trackResults !== null
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
          : ''}
      </form>

      <div className={styles.delete}>
        <button
          onClick={async () => {
            await deleteManyJudgeGroups();
            setGrouping('groups deleted');
          }}
          className={styles.deleteButton}
        >
          Delete All Judge Groups
        </button>

        <button
          onClick={async () => {
            await deleteManyJudgeGroupsToTeams();
            setMatching('links deleted');
          }}
          className={styles.deleteButton}
        >
          Delete All Links
        </button>
      </div>
    </div>
  );
}
