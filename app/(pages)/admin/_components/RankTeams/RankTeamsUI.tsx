'use client';

import { useEffect, useState } from 'react';
import scoreTeams from '@actions/logic/scoreTeams';
import { getManyTeams } from '@actions/teams/getTeams';
import { RankTeamsResults } from '@utils/scoring/rankTeams';
import Team from '@typeDefs/team';
import { TrackScore } from '@typeDefs/submission';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@pages/_globals/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@pages/_globals/components/ui/tabs';
import { Badge } from '@pages/_globals/components/ui/badge';
import { Button } from '@pages/_globals/components/ui/button';
import { Download } from 'lucide-react';
import { getManySubmissions } from '@actions/submissions/getSubmission';
import Submission from '@typeDefs/submission';

export default function RankTeamsUI() {
  const [rankingResults, setRankingResults] = useState<RankTeamsResults | null>(
    null
  );
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [questionsByTrack, setQuestionsByTrack] = useState<
    Record<string, string[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        // Get team info to map IDs to names
        const teamsResponse = await getManyTeams();
        if (teamsResponse.ok) {
          const teamsById: Record<string, Team> = {};
          teamsResponse.body.forEach((team: Team) => {
            if (team._id) {
              teamsById[team._id] = team;
            }
          });
          setTeams(teamsById);
        }

        // Get submissions to extract question data
        const submissionsResponse = await getManySubmissions();
        if (submissionsResponse.ok) {
          setSubmissions(submissionsResponse.body);

          // Extract unique questions for each track
          const questions: Record<string, Set<string>> = {};
          submissionsResponse.body.forEach((submission: Submission) => {
            submission.scores.forEach((trackScore: TrackScore) => {
              if (!questions[trackScore.trackName]) {
                questions[trackScore.trackName] = new Set();
              }

              Object.keys(trackScore.rawScores).forEach((question) => {
                questions[trackScore.trackName].add(question);
              });
            });
          });

          // Convert Sets to Arrays
          const questionsByTrack: Record<string, string[]> = {};
          Object.keys(questions).forEach((track) => {
            questionsByTrack[track] = Array.from(questions[track]);
          });

          setQuestionsByTrack(questionsByTrack);
        }

        // Get ranking results
        const results = await scoreTeams();
        setRankingResults(results);

        // Set default active track
        if (results && Object.keys(results).length > 0) {
          setActiveTrack(Object.keys(results)[0]);
        }
      } catch (err) {
        setError('Error fetching data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get question scores for a specific team
  const getQuestionScores = (trackName: string, teamId: string) => {
    // Get all submissions for this team
    const teamSubmissions = submissions.filter((sub) => sub.team_id === teamId);

    // Initialize score map
    const questionScores: Record<string, number> = {};
    const questions = questionsByTrack[trackName] || [];

    questions.forEach((question) => {
      questionScores[question] = 0;
    });

    // Sum up scores from all submissions
    teamSubmissions.forEach((submission) => {
      const trackScore = submission.scores.find(
        (score) => score.trackName === trackName
      );
      if (trackScore) {
        Object.entries(trackScore.rawScores).forEach(([question, score]) => {
          if (questionScores[question] !== undefined) {
            questionScores[question] += score;
          }
        });
      }
    });

    return questionScores;
  };

  const exportAsCSV = () => {
    if (!rankingResults || !activeTrack) return;

    const trackResults = rankingResults[activeTrack];
    const questions = questionsByTrack[activeTrack] || [];

    // Create CSV header
    let csvContent =
      'Rank,Team Name,Team ID,Table Number,Team Number,Score,' +
      questions.join(',') +
      ',Comments\n';

    // Add data rows
    trackResults.forEach((result, index) => {
      const team = teams[result.team.team_id];
      const teamName = team ? team.name : 'Unknown Team';
      const tableNumber = team ? team.tableNumber : 'N/A';
      const teamNumber = team ? team.teamNumber : 'N/A';
      const comments = result.team.comments.join(' | ').replace(/"/g, '""');

      // Get question scores
      const questionScores = getQuestionScores(
        activeTrack,
        result.team.team_id
      );
      const questionColumns = questions
        .map((q) => questionScores[q] || 0)
        .join(',');

      csvContent += `${index + 1},"${teamName}",${
        result.team.team_id
      },${tableNumber},${teamNumber},${result.team.final_score.toFixed(
        2
      )},${questionColumns},"${comments}"\n`;
    });

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTrack}_rankings.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsJSON = () => {
    if (!rankingResults || !activeTrack) return;

    const trackResults = rankingResults[activeTrack];
    const questions = questionsByTrack[activeTrack] || [];

    // Create formatted data with team info
    const exportData = trackResults.map((result, index) => {
      const team = teams[result.team.team_id];

      // Get question scores
      const questionScores = getQuestionScores(
        activeTrack,
        result.team.team_id
      );

      // Create an object with question scores
      const questionData: Record<string, number> = {};
      questions.forEach((question) => {
        questionData[question] = questionScores[question] || 0;
      });

      return {
        rank: index + 1,
        team_id: result.team.team_id,
        team_name: team ? team.name : 'Unknown Team',
        table_number: team ? team.tableNumber : null,
        team_number: team ? team.teamNumber : null,
        score: result.team.final_score,
        question_scores: questionData,
        comments: result.team.comments,
      };
    });

    // Create and download the file
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTrack}_rankings.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export ALL track data as JSON in original format
  const exportAllAsJSON = () => {
    if (!rankingResults) return;

    // Create and download the file with the original structure
    const jsonContent = JSON.stringify(rankingResults, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'all_rankings.json');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export ALL track data as CSV
  const exportAllAsCSV = () => {
    if (!rankingResults) return;

    // Create CSV header with all possible questions
    const allQuestions = Object.values(questionsByTrack).flat();
    let csvContent =
      'Track,Rank,Team Name,Team ID,Table Number,Team Number,Score,' +
      allQuestions.join(',') +
      ',Comments\n';

    // Loop through each track
    Object.keys(rankingResults).forEach((trackName) => {
      const trackResults = rankingResults[trackName];
      const trackQuestions = questionsByTrack[trackName] || [];

      // Add data rows for this track
      trackResults.forEach((result, index) => {
        const team = teams[result.team.team_id];
        const teamName = team ? team.name : 'Unknown Team';
        const tableNumber = team ? team.tableNumber : 'N/A';
        const teamNumber = team ? team.teamNumber : 'N/A';
        const comments = result.team.comments.join(' | ').replace(/"/g, '""');

        // Get question scores for this team in this track
        const questionScores = getQuestionScores(
          trackName,
          result.team.team_id
        );

        // Build the question columns - leaving empty cells for questions not in this track
        const questionColumns = allQuestions
          .map((q) =>
            trackQuestions.includes(q) ? questionScores[q] || 0 : ''
          )
          .join(',');

        csvContent += `"${trackName}",${index + 1},"${teamName}",${
          result.team.team_id
        },${tableNumber},${teamNumber},${result.team.final_score.toFixed(
          2
        )},${questionColumns},"${comments}"\n`;
      });
    });

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'all_rankings.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-red-700">{error}</p>
      </div>
    );
  }

  // If no results yet
  if (!rankingResults || Object.keys(rankingResults).length === 0) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800">
          No Results Available
        </h3>
        <p className="mt-2 text-yellow-700">
          There are no ranking results available yet. Please make sure teams and
          submissions exist.
        </p>
      </div>
    );
  }

  // Get all track names to use as tabs
  const trackNames = Object.keys(rankingResults);
  const defaultTrack = trackNames[0];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Team Rankings</h1>

        <div className="flex flex-wrap gap-2">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportAsCSV}
              disabled={!activeTrack}
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportAsJSON}
              disabled={!activeTrack}
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={exportAllAsCSV}
              disabled={!rankingResults}
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export ALL CSV
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={exportAllAsJSON}
              disabled={!rankingResults}
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export ALL JSON
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue={defaultTrack}
        className="w-full"
        onValueChange={(value) => setActiveTrack(value)}
      >
        <TabsList className="flex overflow-x-auto gap-2 mb-4">
          {trackNames.map((trackName) => (
            <TabsTrigger
              key={trackName}
              value={trackName}
              className="px-3 py-2"
            >
              {trackName}
            </TabsTrigger>
          ))}
        </TabsList>

        {trackNames.map((trackName) => (
          <TabsContent key={trackName} value={trackName} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{trackName} Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rankingResults[trackName].length > 0 ? (
                    rankingResults[trackName].map((result, index) => {
                      const team = teams[result.team.team_id];
                      const questionScores = getQuestionScores(
                        trackName,
                        result.team.team_id
                      );
                      const questions = questionsByTrack[trackName] || [];

                      return (
                        <div
                          key={result.team.team_id}
                          className="flex items-start gap-4 p-4 border rounded-lg"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 font-bold rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {team
                                    ? team.name
                                    : `Team ID: ${result.team.team_id}`}
                                </h3>
                                {team && (
                                  <p className="text-gray-500 text-sm mt-1">
                                    Table #{team.tableNumber} | Team #
                                    {team.teamNumber}
                                  </p>
                                )}
                              </div>
                              <Badge variant="secondary" className="ml-2">
                                Score: {result.team.final_score.toFixed(2)}
                              </Badge>
                            </div>

                            {questions.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700">
                                  Question Scores:
                                </p>
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {questions.map((question) => (
                                    <div
                                      key={question}
                                      className="text-sm p-2 bg-gray-50 rounded flex justify-between"
                                    >
                                      <span className="font-medium">
                                        {question}:
                                      </span>
                                      <span>
                                        {questionScores[question] || 0}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.team.comments.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700">
                                  Judge Comments:
                                </p>
                                <ul className="mt-2 space-y-2">
                                  {result.team.comments.map((comment, i) => (
                                    <li
                                      key={i}
                                      className="text-sm p-2 bg-gray-50 rounded"
                                    >
                                      "{comment}"
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500">
                      No teams ranked for this track yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
