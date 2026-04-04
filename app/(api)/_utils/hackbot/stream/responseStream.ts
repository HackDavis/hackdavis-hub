import { getDatabase } from '@utils/mongodb/mongoClient.mjs';

export function createResponseStream(
  result: any,
  model: string
): ReadableStream {
  const enc = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let finishPromptTokens = 0;
      let finishCompletionTokens = 0;
      let finishCachedTokens = 0;
      let streamError: string | null = null;

      const enq = (line: string) => controller.enqueue(enc.encode(line));

      let suppressText = false;

      try {
        for await (const part of result.fullStream) {
          if (part?.type === 'text-delta') {
            if (!suppressText) {
              enq(`0:${JSON.stringify(part.text ?? '')}\n`);
            }
          } else if (part?.type === 'tool-call') {
            enq(
              `9:${JSON.stringify([
                {
                  toolCallId: part.toolCallId,
                  toolName: part.toolName,
                  state: 'call',
                },
              ])}\n`
            );
          } else if (part?.type === 'tool-result') {
            suppressText = true;
            enq(
              `a:${JSON.stringify([
                {
                  toolCallId: part.toolCallId,
                  toolName: part.toolName,
                  state: 'result',
                  result: part.output,
                },
              ])}\n`
            );
          } else if (part?.type === 'error') {
            console.error(
              '[hackbot][stream] OpenAI error in stream:',
              part.error
            );
            streamError = (part.error as any)?.message ?? 'OpenAI server error';
            break;
          } else if (part?.type === 'finish') {
            finishPromptTokens = part.totalUsage?.inputTokens ?? 0;
            finishCompletionTokens = part.totalUsage?.outputTokens ?? 0;
            finishCachedTokens =
              part.totalUsage?.inputTokenDetails?.cacheReadTokens ?? 0;
          } else if (part?.type === 'finish-step' && finishPromptTokens === 0) {
            finishPromptTokens = part.usage?.inputTokens ?? 0;
            finishCompletionTokens = part.usage?.outputTokens ?? 0;
            finishCachedTokens =
              part.usage?.inputTokenDetails?.cacheReadTokens ?? 0;
          }
        }

        if (streamError) {
          enq(
            `3:${JSON.stringify('Something went wrong. Please try again.')}\n`
          );
        }
        controller.close();
      } catch (e) {
        console.error('[hackbot][stream] fullStream error', e);
        controller.error(e);
        return;
      }

      if (finishPromptTokens > 0) {
        getDatabase()
          .then((db) =>
            db.collection('hackbot_usage').insertOne({
              timestamp: new Date(),
              model,
              promptTokens: finishPromptTokens,
              completionTokens: finishCompletionTokens,
              cachedPromptTokens: finishCachedTokens,
            })
          )
          .catch((err) =>
            console.error('[hackbot][stream] usage insert failed', err)
          );
      }
    },
  });
}
