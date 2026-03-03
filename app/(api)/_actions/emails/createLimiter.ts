/**
 * Returns an async function that enforces at most `concurrency` simultaneous
 * calls. Each slot is released as soon as its fn resolves/rejects, so the
 * pool is always kept as full as possible — no batch-boundary idle time.
 */
export default function createLimiter(concurrency: number) {
  let active = 0;
  const queue: (() => void)[] = [];

  return async function run<T>(fn: () => Promise<T>): Promise<T> {
    if (active >= concurrency) {
      await new Promise<void>((resolve) => queue.push(resolve));
    }
    active++;
    try {
      return await fn();
    } finally {
      active--;
      queue.shift()?.();
    }
  };
}
