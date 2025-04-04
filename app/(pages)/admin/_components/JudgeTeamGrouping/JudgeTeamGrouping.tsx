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
  // New state to store the full match data
  const [fullMatchData, setFullMatchData] = useState<any>(null);

  // Match teams and store the submissions locally.
  const handleMatchTeams = async () => {
    const result = await matchTeams();
    console.log('matchTeams result:', result);

    let matchData: any = {};
    if (typeof result === 'string') {
      try {
        matchData = JSON.parse(result);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return;
      }
    } else {
      matchData = result;
    }

    // Extract submissions and the rest of the match data.
    const { submissions: subs, ...otherMatchData } = matchData;

    // Store submissions for CSV download.
    setSubmissions(subs);
    // Store full match data for full CSV export.
    setFullMatchData(matchData);
    // Display all match data except the submissions.
    setMatching(JSON.stringify(otherMatchData, null, 2));
  };

  // Generate full CSV content from all match data and trigger a download.
  const downloadCSV = () => {
    if (!fullMatchData) {
      alert('No match data available.');
      return;
    }

    let csvContent = '';

    // Submissions Section
    csvContent += 'Submissions\n';
    csvContent += 'judge_id,team_id\n';
    fullMatchData.submissions.forEach(
      (sub: { judge_id: string; team_id: string }) => {
        csvContent += `${sub.judge_id},${sub.team_id}\n`;
      }
    );
    csvContent += '\n';

    // Teams With No Tracks Section
    csvContent += 'Teams With No Tracks\n';
    csvContent += 'team_id\n';
    fullMatchData.teamsWithNoTracks.forEach((teamId: string) => {
      csvContent += `${teamId}\n`;
    });
    csvContent += '\n';

    // Judge Team Distribution Section
    csvContent += 'Judge Team Distribution\n';
    csvContent += 'Metric,Value\n';
    const dist = fullMatchData.judgeTeamDistribution;
    csvContent += `sum,${dist.sum}\n`;
    csvContent += `count,${dist.count}\n`;
    csvContent += `average,${dist.average}\n`;
    csvContent += `min,${dist.min}\n`;
    csvContent += `max,${dist.max}\n`;
    csvContent += `num_teams,${dist.numTeams}\n`;
    csvContent += `num_judges,${dist.numJudges}\n`;
    csvContent += '\n';

    // Match Quality Stats Section
    csvContent += 'Match Quality Stats\n';
    csvContent += 'team_id,sum,average,min,max,count\n';
    for (const teamId in fullMatchData.matchQualityStats) {
      const stats = fullMatchData.matchQualityStats[teamId];
      csvContent += `${teamId},${stats.sum},${stats.average},${stats.min},${stats.max},${stats.count}\n`;
    }

    // Create a blob and a download link, then simulate a click.
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `match_data_${dist.numTeams}t_${dist.numJudges}j.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.body}>
      <button onClick={handleMatchTeams}>Match Teams</button>
      <div>
        <p>Match Data (excluding submissions):</p>
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
