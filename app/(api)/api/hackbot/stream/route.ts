import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { FEW_SHOT_EXAMPLES } from '@utils/hackbot/stream/fewShots';
import {
  validateRequestBody,
  isSimpleGreetingMessage,
  MAX_CONTEXT_HISTORY_MESSAGES,
} from '@utils/hackbot/stream/request';
import {
  fetchSessionAndDocs,
  buildProfileFromSession,
  buildContextSummary,
} from '@utils/hackbot/stream/context';
import {
  getModelConfig,
  shouldStopStreaming,
} from '@utils/hackbot/stream/model';
import {
  shouldDisableEventsToolForQuery,
  isResourcesQuery,
  isExplicitEventQuery,
} from '@utils/hackbot/stream/intent';
import {
  GET_EVENTS_INPUT_SCHEMA,
  executeGetEvents,
} from '@utils/hackbot/stream/eventsTool';
import {
  PROVIDE_LINKS_DESCRIPTION,
  PROVIDE_LINKS_INPUT_SCHEMA,
  executeProvideLinks,
} from '@utils/hackbot/stream/linksTool';
import { createResponseStream } from '@utils/hackbot/stream/responseStream';
import { getPageContext, buildSystemPrompt } from '@utils/hackbot/systemPrompt';

function normalizeGetEventsInputForQuery(input: any, query: string): any {
  const q = query.trim().toLowerCase();
  if (!q) return input;

  const asksForWorkshops = /\bworkshops?\b/.test(q);
  if (!asksForWorkshops) return input;

  // If the user explicitly asks for workshops, enforce WORKSHOPS so
  // generic schedule items (e.g. "Hacking Ends") are not returned.
  return {
    ...input,
    type: 'WORKSHOPS',
  };
}

export async function POST(request: Request) {
  try {
    const parsedBody = validateRequestBody(await request.json());
    if (parsedBody instanceof Response) return parsedBody;

    const { currentPath, sanitizedMessages, lastMessage } = parsedBody;

    const simpleGreeting = isSimpleGreetingMessage(lastMessage.content);
    const sessionDocs = await fetchSessionAndDocs(
      lastMessage.content,
      simpleGreeting
    );
    if (sessionDocs instanceof Response) return sessionDocs;

    const { session, docs } = sessionDocs;
    const profile = buildProfileFromSession(session);
    if (!profile) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contextSummary = buildContextSummary(docs);

    const pageContext = getPageContext(currentPath);
    const systemPrompt = buildSystemPrompt({ profile, pageContext });

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...FEW_SHOT_EXAMPLES,
      {
        role: 'system',
        content: `Knowledge context about HackDavis (rules, submission, judging, tracks, general info):\n\n${contextSummary}`,
      },
      ...sanitizedMessages.slice(-MAX_CONTEXT_HISTORY_MESSAGES),
    ];

    const { model, maxOutputTokens } = getModelConfig();
    const disableEventsTool = shouldDisableEventsToolForQuery(
      lastMessage.content
    );
    const resourcesQuery = isResourcesQuery(lastMessage.content);
    const explicitEventQuery = isExplicitEventQuery(lastMessage.content);
    const requireEventsTool = explicitEventQuery && !disableEventsTool;

    const tools = {
      ...(requireEventsTool
        ? {}
        : {
            provide_links: tool({
              description: PROVIDE_LINKS_DESCRIPTION,
              inputSchema: PROVIDE_LINKS_INPUT_SCHEMA,
              execute: executeProvideLinks,
            }),
          }),
      ...(disableEventsTool
        ? {}
        : {
            get_events: tool({
              description:
                'Fetch the live HackDavis event schedule from the database. Use this for ANY question about event times, locations, schedule, or what is happening when.',
              inputSchema: GET_EVENTS_INPUT_SCHEMA,
              execute: (input) =>
                executeGetEvents(
                  normalizeGetEventsInputForQuery(input, lastMessage.content),
                  profile,
                  lastMessage.content
                ),
            }),
          }),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = streamText({
      model: openai(model) as any,
      temperature: 0,
      messages: chatMessages.map((m: any) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      })),
      maxOutputTokens,
      ...(requireEventsTool ? { toolChoice: 'required' as const } : {}),
      stopWhen: (state) =>
        shouldStopStreaming(state, {
          allowProvideLinksShortCircuit: !resourcesQuery,
        }),
      tools,
    });

    const stream = createResponseStream(result, model);

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error: any) {
    console.error('[hackbot][stream] Error', error);

    if (error.status === 429) {
      return Response.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    if (error.status === 401 || error.message?.includes('API key')) {
      return Response.json(
        {
          error: 'AI service configuration error. Please contact an organizer.',
        },
        { status: 500 }
      );
    }

    return Response.json(
      { error: 'Something went wrong. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
