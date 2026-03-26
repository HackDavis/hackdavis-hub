import createLimiter from '@actions/emails/createLimiter';

describe('createLimiter', () => {
  it('runs tasks up to the concurrency limit in parallel', async () => {
    const limiter = createLimiter(2);
    const running: string[] = [];
    const log: string[] = [];

    const task = (id: string, ms: number) =>
      limiter(async () => {
        running.push(id);
        log.push(`start:${id}(concurrent:${running.length})`);
        await new Promise((r) => setTimeout(r, ms));
        running.splice(running.indexOf(id), 1);
        log.push(`end:${id}`);
        return id;
      });

    const results = await Promise.all([
      task('a', 50),
      task('b', 50),
      task('c', 10),
    ]);

    expect(results).toEqual(['a', 'b', 'c']);
    // a and b start concurrently (concurrent:1 then concurrent:2)
    // c waits until one finishes, so it starts at concurrent:1 or concurrent:2
    // The key invariant: concurrent count never exceeds 2
    for (const entry of log) {
      const match = entry.match(/concurrent:(\d+)/);
      if (match) {
        expect(Number(match[1])).toBeLessThanOrEqual(2);
      }
    }
  });

  it('returns the resolved value from the wrapped function', async () => {
    const limiter = createLimiter(1);
    const result = await limiter(() => Promise.resolve(42));
    expect(result).toBe(42);
  });

  it('propagates rejections', async () => {
    const limiter = createLimiter(1);
    await expect(
      limiter(() => Promise.reject(new Error('boom')))
    ).rejects.toThrow('boom');
  });

  it('releases the slot on rejection so subsequent tasks run', async () => {
    const limiter = createLimiter(1);
    await limiter(() => Promise.reject(new Error('fail'))).catch(() => {});
    const result = await limiter(() => Promise.resolve('ok'));
    expect(result).toBe('ok');
  });

  it('processes all items with concurrency 1 (serial)', async () => {
    const limiter = createLimiter(1);
    const order: number[] = [];

    await Promise.all(
      [1, 2, 3].map((n) =>
        limiter(async () => {
          order.push(n);
          await new Promise((r) => setTimeout(r, 10));
        })
      )
    );

    expect(order).toEqual([1, 2, 3]);
  });
});
