'use client';

import { useEffect, useState, useTransition } from 'react';
import getKnowledgeDocs, {
  KnowledgeDoc,
} from '@actions/hackbot/getKnowledgeDocs';
import saveKnowledgeDoc, {
  SaveKnowledgeDocInput,
} from '@actions/hackbot/saveKnowledgeDoc';
import deleteKnowledgeDoc from '@actions/hackbot/deleteKnowledgeDoc';
import reseedHackbot, { ReseedResult } from '@actions/hackbot/reseedHackbot';
import { HackDocType } from '@datalib/hackbot/hackbotTypes';

const DOC_TYPES: HackDocType[] = [
  'judging',
  'submission',
  'faq',
  'general',
  'track',
];

const TYPE_LABELS: Record<HackDocType, string> = {
  judging: 'Judging',
  submission: 'Submission',
  faq: 'FAQ',
  general: 'General',
  track: 'Track',
  event: 'Event',
};

const EMPTY_FORM: SaveKnowledgeDocInput = {
  type: 'general',
  title: '',
  content: '',
  url: null,
};

export default function HackbotKnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<KnowledgeDoc | null>(null);
  const [form, setForm] = useState<SaveKnowledgeDocInput>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [isSaving, startSaving] = useTransition();

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, startDeleting] = useTransition();

  // Reseed state
  const [reseedResult, setReseedResult] = useState<ReseedResult | null>(null);
  const [isReseeding, startReseeding] = useTransition();

  async function loadDocs() {
    setLoading(true);
    const res = await getKnowledgeDocs();
    if (res.ok) {
      setDocs(res.docs);
    } else {
      setLoadError(res.error ?? 'Failed to load docs');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDocs();
  }, []);

  function openCreate() {
    setEditingDoc(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(doc: KnowledgeDoc) {
    setEditingDoc(doc);
    setForm({
      id: doc.id,
      type: doc.type,
      title: doc.title,
      content: doc.content,
      url: doc.url,
    });
    setFormError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setFormError('');
  }

  function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      setFormError('Title and content are required.');
      return;
    }
    startSaving(async () => {
      const res = await saveKnowledgeDoc(form);
      if (res.ok) {
        closeModal();
        await loadDocs();
      } else {
        setFormError(res.error ?? 'Failed to save');
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this document? This cannot be undone.')) return;
    setDeletingId(id);
    startDeleting(async () => {
      await deleteKnowledgeDoc(id);
      setDeletingId(null);
      await loadDocs();
    });
  }

  function handleReseed() {
    setReseedResult(null);
    startReseeding(async () => {
      const res = await reseedHackbot();
      setReseedResult(res);
    });
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-2 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-[#005271] border-t-transparent rounded-full animate-spin" />
        Loading knowledge docs…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {loadError}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-6 max-w-5xl">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">HackBot Knowledge</h1>
          <p className="text-sm text-gray-500">
            Manage the knowledge base for HackDavis Helper. Each document is
            embedded into the vector index immediately. Events are seeded
            automatically from the events collection on each deploy.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
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
            className="text-xs underline opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Table */}
      {docs.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400 text-sm">
          No knowledge documents yet. Click{' '}
          <span className="font-medium text-gray-600">+ Add Doc</span> to create
          one.
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3 w-24">Type</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 w-48">URL</th>
                <th className="px-4 py-3 hidden md:table-cell">
                  Content preview
                </th>
                <th className="px-4 py-3 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {TYPE_LABELS[doc.type] ?? doc.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {doc.title}
                  </td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[180px]">
                    {doc.url ? (
                      <span className="font-mono text-xs">{doc.url}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                    <span className="line-clamp-2">{doc.content}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(doc)}
                        className="text-[#005271] hover:underline text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        disabled={isDeleting && deletingId === doc.id}
                        className="text-red-500 hover:underline text-xs font-medium disabled:opacity-50"
                      >
                        {isDeleting && deletingId === doc.id
                          ? 'Deleting…'
                          : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingDoc ? 'Edit Document' : 'Add Document'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Type */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      type: e.target.value as HackDocType,
                    }))
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
                <label className="text-sm font-medium text-gray-700">
                  Title
                </label>
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
                  URL{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.url ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      url: e.target.value || null,
                    }))
                  }
                  placeholder="e.g. /hackers/hub/project-info#judging"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#005271]"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Content
                </label>
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
      )}
    </div>
  );
}
