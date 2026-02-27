export type HackDocType =
  | 'event'
  | 'track'
  | 'judging'
  | 'submission'
  | 'faq'
  | 'general';

export interface HackDoc {
  id: string;
  type: HackDocType;
  title: string;
  text: string;
  url?: string;
}
