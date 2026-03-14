import parseInviteCSV from './parseInviteCSV';
import createLimiter from './createLimiter';
import { InviteData, InviteResult, BulkInviteResponse } from '@typeDefs/emails';

export interface BulkInviteConfig<
  TData extends InviteData,
  TResult extends InviteResult,
> {
  label: string;
  preprocess?: (items: TData[]) => Promise<{
    remaining: TData[];
    earlyResults: TResult[];
  }>;
  processOne: (item: TData) => Promise<TResult>;
  concurrency?: number;
}

export default async function processBulkInvites<
  TData extends InviteData,
  TResult extends InviteResult,
>(
  csvText: string,
  config: BulkInviteConfig<TData, TResult>
): Promise<BulkInviteResponse<TResult>> {
  const { label, preprocess, processOne, concurrency } = config;

  // Parse CSV
  const parsed = parseInviteCSV(csvText);
  if (!parsed.ok) {
    return {
      ok: false,
      results: [],
      successCount: 0,
      failureCount: 0,
      error: parsed.error,
    };
  }

  const allItems = parsed.body as TData[];

  // Optional preprocess (e.g. batch duplicate check)
  let remaining = allItems;
  const results: TResult[] = [];
  let successCount = 0;
  let failureCount = 0;

  if (preprocess) {
    const preprocessed = await preprocess(allItems);
    remaining = preprocessed.remaining;
    for (const r of preprocessed.earlyResults) {
      results.push(r);
      if (r.success) successCount++;
      else failureCount++;
    }
  }

  // Process all items concurrently (with optional outer limiter)
  const limiter = concurrency ? createLimiter(concurrency) : null;

  await Promise.allSettled(
    remaining.map(async (item) => {
      try {
        const result = limiter
          ? await limiter(() => processOne(item))
          : await processOne(item);
        results.push(result);
        if (result.success) successCount++;
        else failureCount++;
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : 'Unknown error';
        console.error(
          `[Bulk ${label} Invites] Failed: ${item.email}`,
          errorMsg
        );
        results.push({
          email: item.email,
          success: false,
          error: errorMsg,
        } as TResult);
        failureCount++;
      }
    })
  );

  return {
    ok: failureCount === 0,
    results,
    successCount,
    failureCount,
    error:
      failureCount > 0 ? `${failureCount} invite(s) failed to send.` : null,
  };
}
