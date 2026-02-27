'use client';

import {
  createContext,
  useEffect,
  useState,
  useTransition,
  ReactNode,
} from 'react';
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
import clearKnowledgeDocs, {
  ClearKnowledgeDocsResult,
} from '@actions/hackbot/clearKnowledgeDocs';
import { EMPTY_FORM } from '../_constants/hackbotKnowledge';

// ── Types ────────────────────────────────────────────────────────────────────

export type BannerState = {
  kind: 'success' | 'error';
  message: string;
} | null;

export type HackbotKnowledgeContextValue = {
  // Docs
  docs: KnowledgeDoc[];
  loading: boolean;
  loadError: string;

  // Banner
  banner: BannerState;
  setBanner: (b: BannerState) => void;

  // Modal
  modalOpen: boolean;
  editingDoc: KnowledgeDoc | null;
  form: SaveKnowledgeDocInput;
  setForm: React.Dispatch<React.SetStateAction<SaveKnowledgeDocInput>>;
  formError: string;
  isSaving: boolean;
  openCreate: () => void;
  openEdit: (doc: KnowledgeDoc) => void;
  closeModal: () => void;
  handleSave: () => void;

  // Delete
  deletingId: string | null;
  isDeleting: boolean;
  handleDelete: (id: string) => void;

  // Reseed
  reseedResult: ReseedResult | null;
  setReseedResult: (r: ReseedResult | null) => void;
  isReseeding: boolean;
  handleReseed: () => void;

  // Import
  importResult: ImportKnowledgeDocsResult | null;
  setImportResult: (r: ImportKnowledgeDocsResult | null) => void;
  isImporting: boolean;
  importPreview: ImportDocInput[] | null;
  setImportPreview: (p: ImportDocInput[] | null) => void;
  importError: string;
  setImportError: (e: string) => void;
  handleImport: () => void;
  cancelImport: () => void;

  // Clear
  clearResult: ClearKnowledgeDocsResult | null;
  setClearResult: (r: ClearKnowledgeDocsResult | null) => void;
  isClearing: boolean;
  handleClearAll: () => void;
};

// ── Context ──────────────────────────────────────────────────────────────────

export const HackbotKnowledgeContext =
  createContext<HackbotKnowledgeContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export default function HackbotKnowledgeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [banner, setBanner] = useState<BannerState>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<KnowledgeDoc | null>(null);
  const [form, setForm] = useState<SaveKnowledgeDocInput>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [isSaving, startSaving] = useTransition();

  // Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, startDeleting] = useTransition();

  // Reseed
  const [reseedResult, setReseedResult] = useState<ReseedResult | null>(null);
  const [isReseeding, startReseeding] = useTransition();

  // Import
  const [importResult, setImportResult] =
    useState<ImportKnowledgeDocsResult | null>(null);
  const [isImporting, startImporting] = useTransition();
  const [importPreview, setImportPreview] = useState<ImportDocInput[] | null>(
    null
  );
  const [importError, setImportError] = useState('');

  // Clear
  const [clearResult, setClearResult] =
    useState<ClearKnowledgeDocsResult | null>(null);
  const [isClearing, startClearing] = useTransition();

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

  function handleClearAll() {
    if (
      !confirm(
        'Delete ALL knowledge docs? This removes everything from hackbot_knowledge and hackbot_docs. This cannot be undone.'
      )
    )
      return;
    setClearResult(null);
    setBanner(null);
    startClearing(async () => {
      const res = await clearKnowledgeDocs();
      setClearResult(res);
      if (res.ok) {
        await loadDocs();
        setBanner({
          kind: 'success',
          message: `Cleared ${res.deletedKnowledge} knowledge doc${
            res.deletedKnowledge !== 1 ? 's' : ''
          } and ${res.deletedEmbeddings} embedding${
            res.deletedEmbeddings !== 1 ? 's' : ''
          }.`,
        });
        setClearResult(null);
      }
    });
  }

  const value: HackbotKnowledgeContextValue = {
    docs,
    loading,
    loadError,
    banner,
    setBanner,
    modalOpen,
    editingDoc,
    form,
    setForm,
    formError,
    isSaving,
    openCreate,
    openEdit,
    closeModal,
    handleSave,
    deletingId,
    isDeleting,
    handleDelete,
    reseedResult,
    setReseedResult,
    isReseeding,
    handleReseed,
    importResult,
    setImportResult,
    isImporting,
    importPreview,
    setImportPreview,
    importError,
    setImportError,
    handleImport,
    cancelImport,
    clearResult,
    setClearResult,
    isClearing,
    handleClearAll,
  };

  return (
    <HackbotKnowledgeContext.Provider value={value}>
      {children}
    </HackbotKnowledgeContext.Provider>
  );
}
