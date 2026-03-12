'use client';

import { ReactNode } from 'react';
import useHackbotKnowledge from '../../_hooks/useHackbotKnowledge';

export default function KnowledgeLoadState({
  children,
}: {
  children: ReactNode;
}) {
  const { loading, loadError } = useHackbotKnowledge();

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

  return <>{children}</>;
}
