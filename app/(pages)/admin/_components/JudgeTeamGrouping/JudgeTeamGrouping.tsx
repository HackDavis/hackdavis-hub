import matchTeams from '@actions/logic/matchTeams';
import scoreTeams from '@actions/logic/scoreTeams';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import deleteManySubmissions from '@actions/submissions/deleteSubmission';
import JudgeToTeam from '@typeDefs/judgeToTeam';
import styles from './JudgeTeamGrouping.module.scss';

interface JudgeTeamDistribution {
  sum: number;
  count: number;
  average: number;
  min: number;
  max: number;
  numJudges: number;
  numTeams: number;
}

interface MatchQualityStats {
  sum: number;
  average: number;
  min: number;
  max: number;
  count: number;
  teamTracks: string[];
  judgeTracks: string[];
}

interface FullMatchData {
  judgeToTeam: JudgeToTeam[];
  extraAssignmentsMap: Record<string, number>;
  judgeTeamDistribution: JudgeTeamDistribution;
  matchQualityStats: Record<string, MatchQualityStats>;
  [key: string]: any;
}

export default function JudgeTeamGrouping() {
  const [trackResults, scoreAction] = useFormState(scoreTeams, null);
  const [matching, setMatching] = useState('');
  const [submissions, setSubmissions] = useState<JudgeToTeam[]>([]);
  const [fullMatchData, setFullMatchData] = useState<FullMatchData | null>(
    null
  );
  const [alpha, setAlpha] = useState<number>(4);
  const [showSubmissions, setShowSubmissions] = useState<boolean>(false);
  const [showMatching, setShowMatching] = useState<boolean>(false);

  // Match teams and store the submissions locally.
  const handleMatchTeams = async () => {
    const result = await matchTeams({ alpha });
    let matchData: any = {};
    if (result.ok) {
      matchData = result.body;
      const { judgeToTeam: subs, ...otherMatchData } = matchData;

      setSubmissions(subs);
      setFullMatchData(matchData);
      setMatching(JSON.stringify(otherMatchData, null, 2));
      setShowSubmissions(true);
      setShowMatching(true);
    } else {
      matchData = result.error;
      setMatching(matchData);
      setShowMatching(true);
    }
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
    fullMatchData.judgeToTeam.forEach((sub: JudgeToTeam) => {
      csvContent += `${sub.judge_id},${sub.team_id}\n`;
    });

    csvContent += '\n';

    // Teams With No Tracks Section
    csvContent += 'Teams With No Tracks\n';
    csvContent += 'team_id,num_rounds\n';
    Object.entries(fullMatchData.extraAssignmentsMap).forEach(
      ([teamId, numRounds]: [string, number]) => {
        csvContent += `${teamId},${numRounds}\n`;
      }
    );
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

    csvContent += 'Match Stats\n';
    csvContent += 'value,count\n';
    for (const value in fullMatchData.matchStats) {
      const count = fullMatchData.matchQualityStats[value];
      csvContent += `${value},${count}\n`;
    }
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
      <div>
        <label htmlFor="alphaInput" style={{ paddingLeft: 5, marginLeft: 10 }}>
          Alpha value (default 4):
        </label>
        <input
          id="alphaInput"
          type="number"
          value={alpha}
          onChange={(e) => setAlpha(Number(e.target.value))}
          placeholder="Alpha value (default 4)"
          style={{ paddingLeft: 5, marginLeft: 10, marginTop: '20px' }}
        />
      </div>
      <div className={styles.body}>
        <button
          onClick={handleMatchTeams}
          style={{ marginTop: '10px', outline: '1px solid black' }}
        >
          Match Teams
        </button>
        <button
          onClick={downloadCSV}
          style={{ marginTop: '10px', outline: '1px solid black' }}
        >
          Download CSV
        </button>
      </div>

      <div>
        <h4
          onClick={() => setShowSubmissions(!showSubmissions)}
          style={{ cursor: 'pointer' }}
        >
          Submissions {showSubmissions ? '▲' : '▼'}
        </h4>
        {showSubmissions && (
          <div className={styles.collapsible}>
            <pre>{JSON.stringify(submissions, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h4
          onClick={() => setShowMatching(!showMatching)}
          style={{ cursor: 'pointer' }}
        >
          Match Data {showMatching ? '▲' : '▼'}
        </h4>
        {showMatching && (
          <div className={styles.collapsible}>
            <pre>{matching}</pre>
          </div>
        )}
      </div>

      <form action={scoreAction}>
        <button
          type="submit"
          style={{ marginTop: '10px', outline: '1px solid black' }}
        >
          Score Teams
        </button>
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
