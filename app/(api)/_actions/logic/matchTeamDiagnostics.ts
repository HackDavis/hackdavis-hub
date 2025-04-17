'use server';

import matchAllTeams from '@utils/grouping/matchingAlgorithm';

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
  matchStats: { [avgQuality: string]: number };
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
      // pull only the two stats objects
      const { judgeTeamDistribution, matchStats } = matchResults;
      results[alpha] = { judgeTeamDistribution, matchStats };
    }

    return { ok: true, body: results, error: null };
  } catch (e: any) {
    return {
      ok: false,
      body: null,
      error: e.message ?? String(e),
    };
  }
}
