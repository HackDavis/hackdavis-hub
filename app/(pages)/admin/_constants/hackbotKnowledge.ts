import type { HackDocType } from '@typeDefs/hackbot';
import type { SaveKnowledgeDocInput } from '@actions/hackbot/saveKnowledgeDoc';

export const DOC_TYPES: HackDocType[] = [
  'judging',
  'submission',
  'faq',
  'general',
  'track',
];

export const TYPE_LABELS: Record<HackDocType, string> = {
  judging: 'Judging',
  submission: 'Submission',
  faq: 'FAQ',
  general: 'General',
  track: 'Track',
  event: 'Event',
};

export const TYPE_COLORS: Record<string, string> = {
  judging: 'bg-purple-50 text-purple-700 border-purple-200',
  submission: 'bg-blue-50 text-blue-700 border-blue-200',
  faq: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  general: 'bg-gray-50 text-gray-700 border-gray-200',
  track: 'bg-green-50 text-green-700 border-green-200',
  event: 'bg-orange-50 text-orange-700 border-orange-200',
};

export const EMPTY_FORM: SaveKnowledgeDocInput = {
  type: 'general',
  title: '',
  content: '',
  url: null,
};
