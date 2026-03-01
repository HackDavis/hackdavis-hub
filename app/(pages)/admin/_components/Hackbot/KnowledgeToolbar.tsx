'use client';

import { useRef } from 'react';
import { ImportDocInput } from '@actions/hackbot/importKnowledgeDocs';
import useHackbotKnowledge from '../../_hooks/useHackbotKnowledge';

export default function KnowledgeToolbar() {
  const {
    docs,
    isImporting,
    isClearing,
    isReseeding,
    setImportPreview,
    setImportError,
    setImportResult,
    handleClearAll,
    handleReseed,
    openCreate,
  } = useHackbotKnowledge();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError('');
    setImportPreview(null);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!Array.isArray(parsed)) {
          setImportError('JSON must be an array of documents.');
          return;
        }
        for (let i = 0; i < parsed.length; i++) {
          const d = parsed[i];
          if (!d.title || !d.content) {
            setImportError(
              `Item ${i + 1} is missing required fields "title" or "content".`
            );
            return;
          }
          if (!d.type) {
            setImportError(`Item ${i + 1} is missing "type" field.`);
            return;
          }
        }
        setImportPreview(parsed as ImportDocInput[]);
      } catch {
        setImportError('Invalid JSON file. Please check the format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">HackBot Knowledge</h1>
        <p className="text-sm text-gray-500">
          Manage the knowledge base for HackDavis Helper. Each doc is embedded
          into the vector index immediately on save. Events are served live from
          the database via tool calls — no reseeding needed for schedule
          changes.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Import JSON
        </button>

        <button
          onClick={handleClearAll}
          disabled={isClearing || docs.length === 0}
          className="border border-red-300 text-red-600 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {isClearing ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              Clearing…
            </span>
          ) : (
            'Clear All'
          )}
        </button>

        <button
          onClick={handleReseed}
          disabled={isReseeding || docs.length === 0}
          className="border border-[#005271] text-[#005271] font-semibold px-4 py-2 rounded-lg hover:bg-[#005271]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {isReseeding ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-[#005271] border-t-transparent rounded-full animate-spin" />
              Reseeding…
            </span>
          ) : (
            'Reseed All'
          )}
        </button>

        <button
          onClick={openCreate}
          className="bg-[#005271] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#003d54] transition-colors text-sm"
        >
          + Add Doc
        </button>
      </div>
    </div>
  );
}
