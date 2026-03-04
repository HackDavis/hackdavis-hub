import { EventType } from '@typeDefs/event';

export interface ScheduleEventStyle {
  bgColor: string;
  textColor: string;
  addButtonColor?: string;
  addButtonHoverColor?: string;
  addButtonOutline?: string;
}

export const SCHEDULE_EVENT_STYLES: Record<EventType, ScheduleEventStyle> = {
  GENERAL: {
    bgColor: '#CCFFFE',
    textColor: '#003D3D',
  },
  ACTIVITIES: {
    bgColor: '#FFE2D5',
    textColor: '#52230C',
    addButtonColor: '#FFD5C2',
    addButtonHoverColor: '#000000',//'#FFCCB5',
    addButtonOutline: '#FF9A6C',
  },
  WORKSHOPS: {
    bgColor: '#E9FBBA',
    textColor: '#1A3819',
    addButtonColor: '#D1F76E',
    addButtonHoverColor: '#000000',//'#C3F345',
    //addButtonOutline: '',
  },
  MEALS: {
    bgColor: '#FFE7B2',
    textColor: '#572700',
  },
  RECOMMENDED: {
    bgColor: '#CCFFFE',
    textColor: '#003D3D',
  },
};
