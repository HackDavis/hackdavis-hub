'use server';

import matchAllTeams from '@utils/grouping/matchingAlgorithm';
import JudgeToTeam from '@typeDefs/judgeToTeam';

export type DiagnosticResult = {
  judgeTeamDistribution: {
    sum: number;
    count: number;
    average: number;
    min: number;
    max: number;
    numJudges: number;
    numTeams: number;
  };
  matchStats: Record<string, number>;
  judgeToTeam: JudgeToTeam[];
};

export default async function matchTeamsDiagnostics(options: {
  minAlpha: number;
  maxAlpha: number;
}): Promise<{
  ok: boolean;
  body: Record<number, DiagnosticResult> | null;
  error: string | null;
}> {
  try {
    const { minAlpha, maxAlpha } = options;
    const results: Record<number, DiagnosticResult> = {};

    for (
      let alpha = minAlpha;
      alpha <= maxAlpha + 1e-9; // guard against float imprecision
      alpha = Math.round((alpha + 0.5) * 10) / 10
    ) {
      const matchResults = await matchAllTeams({ alpha });
      const { judgeTeamDistribution, matchStats, judgeToTeam } = matchResults;
      results[alpha] = {
        judgeTeamDistribution,
        matchStats,
        judgeToTeam,
      };
    }

    return { ok: true, body: JSON.parse(JSON.stringify(results)), error: null };
  } catch (e: any) {
    return {
      ok: false,
      body: null,
      error: e.message ?? String(e),
    };
  }
}
