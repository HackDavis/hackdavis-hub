'use client';

import useHackbotKnowledge from '../../_hooks/useHackbotKnowledge';
import { TYPE_LABELS, TYPE_COLORS } from '../../_constants/hackbotKnowledge';

export default function KnowledgeTable() {
  const { docs, isDeleting, deletingId, openEdit, handleDelete } =
    useHackbotKnowledge();

  if (docs.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400 text-sm">
        No knowledge documents yet. Click{' '}
        <span className="font-medium text-gray-600">+ Add Doc</span> to create
        one, or <span className="font-medium text-gray-600">Import JSON</span>{' '}
        to bulk-import.
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden w-full">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3 w-64">URL</th>
            <th className="px-4 py-3 hidden md:table-cell">Content preview</th>
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
  );
}
