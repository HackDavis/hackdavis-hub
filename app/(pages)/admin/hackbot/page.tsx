'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import getKnowledgeDocs, {
  KnowledgeDoc,
} from '@actions/hackbot/getKnowledgeDocs';
import saveKnowledgeDoc, {
  SaveKnowledgeDocInput,
} from '@actions/hackbot/saveKnowledgeDoc';
import deleteKnowledgeDoc from '@actions/hackbot/deleteKnowledgeDoc';
import reseedHackbot, { ReseedResult } from '@actions/hackbot/reseedHackbot';
import importKnowledgeDocs, {
  ImportDocInput,
  ImportKnowledgeDocsResult,
} from '@actions/hackbot/importKnowledgeDocs';
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

const TYPE_COLORS: Record<string, string> = {
  judging: 'bg-purple-50 text-purple-700 border-purple-200',
  submission: 'bg-blue-50 text-blue-700 border-blue-200',
  faq: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  general: 'bg-gray-50 text-gray-700 border-gray-200',
  track: 'bg-green-50 text-green-700 border-green-200',
  event: 'bg-orange-50 text-orange-700 border-orange-200',
};

const EMPTY_FORM: SaveKnowledgeDocInput = {
  type: 'general',
  title: '',
  content: '',
  url: null,
};

type BannerState = {
  kind: 'success' | 'error';
  message: string;
} | null;

export default function HackbotKnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<BannerState>(null);

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

  // JSON import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] =
    useState<ImportKnowledgeDocsResult | null>(null);
  const [isImporting, startImporting] = useTransition();
  const [importPreview, setImportPreview] = useState<ImportDocInput[] | null>(
    null
  );
  const [importError, setImportError] = useState('');

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
        setBanner({
          kind: 'success',
          message: editingDoc
            ? 'Document updated.'
            : 'Document created and embedded.',
        });
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
      setBanner({ kind: 'success', message: 'Document deleted.' });
    });
  }

  function handleReseed() {
    setReseedResult(null);
    setBanner(null);
    startReseeding(async () => {
      const res = await reseedHackbot();
      setReseedResult(res);
    });
  }

  // ── JSON Import ───────────────────────────────────────────────────────────

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
        // Validate shape
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

    // Reset input so same file can be re-selected
    e.target.value = '';
  }

  function handleImport() {
    if (!importPreview) return;
    startImporting(async () => {
      const res = await importKnowledgeDocs(importPreview);
      setImportResult(res);
      setImportPreview(null);
      if (res.ok) {
        await loadDocs();
        setBanner({
          kind: 'success',
          message: `Imported ${res.successCount} doc${
            res.successCount !== 1 ? 's' : ''
          } successfully.`,
        });
      }
    });
  }

  function cancelImport() {
    setImportPreview(null);
    setImportError('');
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
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">HackBot Knowledge</h1>
          <p className="text-sm text-gray-500">
            Manage the knowledge base for HackDavis Helper. Each doc is embedded
            into the vector index immediately on save. Events are served live
            from the database via tool calls — no reseeding needed for schedule
            changes.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {/* Import JSON */}
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
          {/* Reseed */}
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
          {/* Add doc */}
          <button
            onClick={openCreate}
            className="bg-[#005271] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#003d54] transition-colors text-sm"
          >
            + Add Doc
          </button>
        </div>
      </div>

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

      {/* Import result */}
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

      {/* Import error */}
      {importError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {importError}
        </p>
      )}

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

      {/* Table */}
      {docs.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400 text-sm">
          No knowledge documents yet. Click{' '}
          <span className="font-medium text-gray-600">+ Add Doc</span> to create
          one, or <span className="font-medium text-gray-600">Import JSON</span>{' '}
          to bulk-import.
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3 w-28">Type</th>
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
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        TYPE_COLORS[doc.type] ?? TYPE_COLORS.general
                      }`}
                    >
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
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-400">
            {docs.length} document{docs.length !== 1 ? 's' : ''} total
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

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col gap-5 p-6 max-h-[90vh] overflow-y-auto">
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
