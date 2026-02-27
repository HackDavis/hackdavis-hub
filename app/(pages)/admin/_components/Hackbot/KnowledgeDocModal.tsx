'use client';

import { RxCross1 } from 'react-icons/rx';
import useHackbotKnowledge from '../../_hooks/useHackbotKnowledge';
import {
  DOC_TYPES,
  TYPE_LABELS,
} from '../../_contexts/HackbotKnowledgeContext';
import type { HackDocType } from '@typeDefs/hackbot';

export default function KnowledgeDocModal() {
  const {
    modalOpen,
    editingDoc,
    form,
    setForm,
    formError,
    isSaving,
    closeModal,
    handleSave,
  } = useHackbotKnowledge();

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col gap-5 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editingDoc ? 'Edit Document' : 'Add Document'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <RxCross1 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({ ...f, type: e.target.value as HackDocType }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005271]"
            >
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. Judging Process Overview"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005271]"
            />
          </div>

          {/* URL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.url ?? ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, url: e.target.value || null }))
              }
              placeholder="e.g. /project-info#judging"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#005271]"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              placeholder="Write the knowledge content here. This text is used for both display and semantic search."
              rows={8}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#005271]"
            />
          </div>

          {formError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {formError}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={closeModal}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#005271] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#003d54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              'Save & Embed'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
