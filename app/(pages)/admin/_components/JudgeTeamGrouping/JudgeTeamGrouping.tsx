import matchTeams from '@actions/logic/matchTeams';
import scoreTeams from '@actions/logic/scoreTeams';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import deleteManySubmissions from '@actions/submissions/deleteSubmission';

import styles from './JudgeTeamGrouping.module.scss';

export default function JudgeTeamGrouping() {
  const [trackResults, scoreAction] = useFormState(scoreTeams, null);
  const [matching, setMatching] = useState('');
  const [submissions, setSubmissions] = useState<
    { judge_id: string; team_id: string }[]
  >([]);

  // Match teams and store the submissions locally.
  const handleMatchTeams = async () => {
    const result = await matchTeams();
    console.log('matchTeams result:', result);

    let subs: { judge_id: string; team_id: string }[] = [];
    if (typeof result === 'string') {
      // Find the start of the JSON array.
      const jsonStart = result.indexOf('[');
      if (jsonStart === -1) {
        console.error('JSON array not found in the result');
        return;
      }
      try {
        const jsonString = result.slice(jsonStart);
        subs = JSON.parse(jsonString);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return;
      }
    } else if (Array.isArray(result)) {
      subs = result;
    } else {
      console.error('Unexpected result type', result);
      return;
    }

    setSubmissions(subs);
    setMatching(JSON.stringify(subs, null, 2));
  };

  // Generate CSV content from submissions and trigger a download.
  const downloadCSV = () => {
    if (!submissions.length) {
      alert('No submissions available.');
      return;
    }
    const headers = ['judge_id', 'team_id'];
    const rows = submissions.map((sub) => `${sub.judge_id},${sub.team_id}`);
    const csvContent = headers.join(',') + '\n' + rows.join('\n');

    // Create a blob and a download link, then simulate a click.
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'submissions.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.body}>
      <button onClick={handleMatchTeams}>Match Teams</button>
      <div>
        <p>Matching:</p>
        <pre>{matching}</pre>
      </div>
      <button onClick={downloadCSV}>Download CSV</button>

      <form action={scoreAction}>
        <button type="submit">Score Teams</button>
        {trackResults !== null
          ? trackResults.map((result) => (
              <div key={result.track}>
                <h4>{result.track}</h4>
                {result.topEntries.map((entry, i) => (
                  <div key={i} className={styles.score}>
                    <p>
                      Team No. {entry.number}, {entry.name}, {entry.score}
                    </p>
                    <p>Comments:</p>
                    <ul>
                      {entry.comments.map(
                        (comment, i) =>
                          comment !== undefined && <li key={i}>{comment}</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            ))
          : ''}
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
