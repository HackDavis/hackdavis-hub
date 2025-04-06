'use client';

import { useEffect, useState } from 'react';
import scoreTeams from '@actions/logic/scoreTeams';
import { getManyTeams } from '@actions/teams/getTeams';
import { RankTeamsResults } from '@utils/scoring/rankTeams';
import Team from '@typeDefs/team';

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

export default function RankTeamsUI() {
  const [rankingResults, setRankingResults] = useState<RankTeamsResults | null>(
    null
  );
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Get ranking results
        const results = await scoreTeams();
        setRankingResults(results);
      } catch (err) {
        setError('Error fetching data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Team Rankings</h1>

      <Tabs defaultValue={defaultTrack} className="w-full">
        <TabsList className="flex flex-wrap gap-2 mb-4">
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
