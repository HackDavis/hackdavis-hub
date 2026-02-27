'use client';

import useHackbotKnowledge from '../../_hooks/useHackbotKnowledge';

export default function KnowledgeBanners() {
  const {
    banner,
    setBanner,
    reseedResult,
    setReseedResult,
    clearResult,
    setClearResult,
    importResult,
    setImportResult,
    importError,
  } = useHackbotKnowledge();

  return (
    <>
      {/* Global banner */}
      {banner && (
        <div
          className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm border ${
            banner.kind === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <span>{banner.message}</span>
          <button
            onClick={() => setBanner(null)}
            className="text-xs underline opacity-70 hover:opacity-100 ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Reseed result */}
      {reseedResult && (
        <div
          className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm border ${
            reseedResult.ok
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <span>
            {reseedResult.ok
              ? `Reseeded ${reseedResult.successCount} doc${
                  reseedResult.successCount !== 1 ? 's' : ''
                } successfully.`
              : reseedResult.error ??
                `${reseedResult.failureCount} doc(s) failed to reseed.`}
          </span>
          <button
            onClick={() => setReseedResult(null)}
            className="text-xs underline opacity-70 hover:opacity-100 ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Clear result — error only (success goes via banner) */}
      {clearResult && !clearResult.ok && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <span>Failed to clear: {clearResult.error}</span>
          <button
            onClick={() => setClearResult(null)}
            className="text-xs underline opacity-70 hover:opacity-100 ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Import result — error only (success goes via banner) */}
      {importResult && !importResult.ok && (
        <div className="flex flex-col gap-1 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <div className="flex items-center justify-between">
            <span>
              {importResult.successCount} imported, {importResult.failureCount}{' '}
              failed.
            </span>
            <button
              onClick={() => setImportResult(null)}
              className="text-xs underline opacity-70 hover:opacity-100 ml-4"
            >
              Dismiss
            </button>
          </div>
          {importResult.failures.length > 0 && (
            <ul className="mt-1 text-xs list-disc list-inside space-y-0.5">
              {importResult.failures.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Import parse error */}
      {importError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {importError}
        </p>
      )}
    </>
  );
}
