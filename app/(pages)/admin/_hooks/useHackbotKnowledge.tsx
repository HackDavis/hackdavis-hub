import { useContext } from 'react';
import { HackbotKnowledgeContext } from '../_contexts/HackbotKnowledgeContext';

export default function useHackbotKnowledge() {
  const context = useContext(HackbotKnowledgeContext);
  if (!context) {
    throw new Error(
      'useHackbotKnowledge must be used within a HackbotKnowledgeProvider'
    );
  }
  return context;
}
