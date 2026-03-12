'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getUsageMetrics,
  type UsagePeriod,
  type UsageMetrics,
} from '@actions/hackbot/getUsageMetrics';

const PERIODS: { value: UsagePeriod; label: string }[] = [
  { value: '24h', label: 'Last 24 h' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export default function HackbotUsageMetrics() {
  const [period, setPeriod] = useState<UsagePeriod>('24h');
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: UsagePeriod) => {
    setLoading(true);
    try {
      setMetrics(await getUsageMetrics(p));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(period);
  }, [period, load]);

  const uncachedTokens = metrics
    ? metrics.totalPromptTokens - metrics.totalCachedTokens
    : 0;
  const hitPct = metrics ? Math.round(metrics.cacheHitRate * 100) : 0;

  return (
    <section className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">Usage Metrics</h2>
        <div className="flex gap-1">
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                period === value
                  ? 'bg-[#005271] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div
        className={`grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200 transition-opacity ${
          loading ? 'opacity-40' : 'opacity-100'
        }`}
      >
        {/* Requests */}
        <div className="px-5 py-4">
          <p className="text-xs text-gray-500 mb-1">Requests</p>
          <p className="text-2xl font-bold text-gray-800">
            {metrics ? fmt(metrics.totalRequests) : '—'}
          </p>
        </div>

        {/* Cache hit rate */}
        <div className="px-5 py-4">
          <p className="text-xs text-gray-500 mb-1">Cache hit rate</p>
          <p className="text-2xl font-bold text-[#005271]">
            {metrics ? `${hitPct}%` : '—'}
          </p>
          {metrics && metrics.totalPromptTokens > 0 && (
            <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#005271] transition-all"
                style={{ width: `${hitPct}%` }}
              />
            </div>
          )}
        </div>

        {/* Prompt tokens breakdown */}
        <div className="px-5 py-4">
          <p className="text-xs text-gray-500 mb-1">Prompt tokens</p>
          {metrics ? (
            <>
              <p className="text-2xl font-bold text-gray-800">
                {fmt(metrics.totalPromptTokens)}
              </p>
              <div className="mt-1.5 flex flex-col gap-0.5 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-sm bg-[#9EE7E5]" />
                  {fmt(metrics.totalCachedTokens)} cached
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-sm bg-gray-300" />
                  {fmt(uncachedTokens)} uncached
                </span>
              </div>
            </>
          ) : (
            <p className="text-2xl font-bold text-gray-800">—</p>
          )}
        </div>

        {/* Completion tokens */}
        <div className="px-5 py-4">
          <p className="text-xs text-gray-500 mb-1">Completion tokens</p>
          <p className="text-2xl font-bold text-gray-800">
            {metrics ? fmt(metrics.totalCompletionTokens) : '—'}
          </p>
        </div>
      </div>
    </section>
  );
}
