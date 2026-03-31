import { retrieveContext } from '@datalib/hackbot/getHackbotContext';
import { auth } from '@/auth';
import type {
  HackerProfile,
  HackbotSessionDocsResult,
} from '@typeDefs/hackbot';

export async function fetchSessionAndDocs(
  lastMessageContent: string,
  isSimpleGreeting: boolean
): Promise<HackbotSessionDocsResult | Response> {
  const [sessionResult, docsResult] = await Promise.allSettled([
    auth(),
    isSimpleGreeting
      ? Promise.resolve({ docs: [] })
      : retrieveContext(lastMessageContent),
  ]);

  if (sessionResult.status === 'rejected') {
    console.error('[hackbot][stream] Auth error', sessionResult.reason);
    return Response.json(
      { error: 'Authentication unavailable. Please try again.' },
      { status: 500 }
    );
  }

  if (docsResult.status === 'rejected') {
    console.error(
      '[hackbot][stream] Context retrieval error',
      docsResult.reason
    );
    return Response.json(
      { error: 'Search backend unavailable. Please contact an organizer.' },
      { status: 500 }
    );
  }

  return {
    session: sessionResult.value,
    docs: docsResult.value.docs,
  };
}

export function buildProfileFromSession(
  session: unknown
): HackerProfile | null {
  const sessionUser = (session as any)?.user as any;
  if (!sessionUser) return null;

  return {
    name: sessionUser.name ?? undefined,
    position: sessionUser.position ?? undefined,
    is_beginner: sessionUser.is_beginner ?? undefined,
  };
}

export function buildContextSummary(
  docs: HackbotSessionDocsResult['docs']
): string {
  if (!docs.length) return 'No additional knowledge context found.';

  return docs
    .map((d, index) => {
      const header = `${index + 1}) [type=${d.type}, title="${d.title}"${
        d.url ? `, url="${d.url}"` : ''
      }]`;
      return `${header}\n${d.text}`;
    })
    .join('\n\n');
}
