export type HackDocType = 'event' | 'track' | 'judging' | 'submission';

export interface HackDoc {
  id: string;
  type: HackDocType;
  title: string;
  text: string;
  url?: string;
}
