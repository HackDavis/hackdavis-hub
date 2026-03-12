'use server';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';

export type UsagePeriod = '24h' | '7d' | '30d';

export interface UsageMetrics {
  totalRequests: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalCachedTokens: number;
  /** 0–1 fraction of prompt tokens that were served from cache */
  cacheHitRate: number;
}

export async function getUsageMetrics(
  period: UsagePeriod = '24h'
): Promise<UsageMetrics> {
  const hours = period === '24h' ? 24 : period === '7d' ? 168 : 720;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const db = await getDatabase();
  const [result] = await db
    .collection('hackbot_usage')
    .aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          totalPromptTokens: { $sum: '$promptTokens' },
          totalCompletionTokens: { $sum: '$completionTokens' },
          totalCachedTokens: { $sum: '$cachedPromptTokens' },
        },
      },
    ])
    .toArray();

  if (!result) {
    return {
      totalRequests: 0,
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalCachedTokens: 0,
      cacheHitRate: 0,
    };
  }

  return {
    totalRequests: result.totalRequests,
    totalPromptTokens: result.totalPromptTokens,
    totalCompletionTokens: result.totalCompletionTokens,
    totalCachedTokens: result.totalCachedTokens,
    cacheHitRate:
      result.totalPromptTokens > 0
        ? result.totalCachedTokens / result.totalPromptTokens
        : 0,
  };
}
