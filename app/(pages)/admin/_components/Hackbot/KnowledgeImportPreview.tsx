'use client';

import useHackbotKnowledge from '../../_hooks/useHackbotKnowledge';
import { TYPE_LABELS, TYPE_COLORS } from '../../_constants/hackbotKnowledge';
import type { HackDocType } from '@typeDefs/hackbot';

export default function KnowledgeImportPreview() {
  const { importPreview, isImporting, handleImport, cancelImport } =
    useHackbotKnowledge();

  return (
    <>
      {/* Import preview */}
      {importPreview && (
        <div className="border border-blue-200 rounded-xl bg-blue-50 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-blue-800">
              Import preview — {importPreview.length} document
              {importPreview.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={cancelImport}
                className="text-xs text-blue-600 underline"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="bg-[#005271] text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-[#003d54] disabled:opacity-50 transition-colors"
              >
                {isImporting ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Importing…
                  </span>
                ) : (
                  'Confirm Import'
                )}
              </button>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto flex flex-col gap-1">
            {importPreview.map((doc, i) => (
              <div
                key={i}
                className="bg-white border border-blue-100 rounded-lg px-3 py-2 text-xs flex items-start gap-2"
              >
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border shrink-0 ${
                    TYPE_COLORS[doc.type] ?? TYPE_COLORS.general
                  }`}
                >
                  {TYPE_LABELS[doc.type as HackDocType] ?? doc.type}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {doc.title}
                  </p>
                  <p className="text-gray-400 truncate">
                    {doc.content.slice(0, 80)}
                    {doc.content.length > 80 ? '…' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JSON format hint */}
      <details className="text-xs text-gray-400">
        <summary className="cursor-pointer hover:text-gray-600 select-none">
          JSON import format
        </summary>
        <pre className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-600 overflow-x-auto">{`[
  {
    "type": "general",        // judging | submission | faq | general | track | event
    "title": "Doc title",
    "content": "Full text content used for both display and semantic search.",
    "url": "/hackers/hub/..."  // optional
  }
]`}</pre>
      </details>
    </>
  );
}
