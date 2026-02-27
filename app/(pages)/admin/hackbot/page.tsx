import HackbotKnowledgeProvider from '../_contexts/HackbotKnowledgeContext';
import KnowledgeToolbar from '../_components/Hackbot/KnowledgeToolbar';
import KnowledgeBanners from '../_components/Hackbot/KnowledgeBanners';
import KnowledgeImportPreview from '../_components/Hackbot/KnowledgeImportPreview';
import KnowledgeTable from '../_components/Hackbot/KnowledgeTable';
import KnowledgeDocModal from '../_components/Hackbot/KnowledgeDocModal';
import KnowledgeLoadState from '../_components/Hackbot/KnowledgeLoadState';

export default function HackbotKnowledgePage() {
  return (
    <HackbotKnowledgeProvider>
      <KnowledgeLoadState>
        <div className="p-8 flex flex-col gap-6">
          <KnowledgeToolbar />
          <KnowledgeBanners />
          <KnowledgeImportPreview />
          <KnowledgeTable />
          <KnowledgeDocModal />
        </div>
      </KnowledgeLoadState>
    </HackbotKnowledgeProvider>
  );
}
