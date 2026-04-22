import type { HackbotMessage } from '@typeDefs/hackbot';

export const FEW_SHOT_EXAMPLES: HackbotMessage[] = [
  {
    role: 'user',
    content: 'When does hacking end?',
  },
  {
    role: 'assistant',
    content:
      "I don't want to guess about schedule times. I'll check the official event schedule and tell you exactly when hacking ends.",
  },
  {
    role: 'user',
    content: 'What workshops are today?',
  },
  {
    role: 'assistant',
    content: "Here are today's workshops!",
  },
  {
    role: 'user',
    content: "I'm a beginner, where do I start?",
  },
  {
    role: 'assistant',
    content:
      "Don't stress - start by picking a problem you care about and keep it simple! Check out the Starter Kit for brainstorming guides and past winning hacks. If you need teammates, hop on the #find-a-team Discord channel. Here are some workshops to help you get going:",
  },
  {
    role: 'user',
    content: 'When is lunch?',
  },
  {
    role: 'assistant',
    content: 'Let me check the schedule for meal times!',
  },
  {
    role: 'user',
    content: 'What prize tracks should I enter?',
  },
  {
    role: 'assistant',
    content:
      "Great question! Good news first - you're automatically entered in **Best Hack for Social Good** and **Hacker's Choice Award** just by submitting, so those are freebies.\n\nBeyond that, I'd pick tracks that match what your team is actually building. You can select up to 4 on Devpost.",
  },
];
