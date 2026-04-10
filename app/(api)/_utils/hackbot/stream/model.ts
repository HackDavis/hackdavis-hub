import { stepCountIs } from 'ai';

export function getModelConfig() {
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  const configuredMaxTokens = parseInt(
    process.env.OPENAI_MAX_TOKENS || '600',
    10
  );
  const isReasoningModel =
    /^(o1|o3|o4-mini|gpt-5(?!-chat))/.test(model) ||
    model.startsWith('codex-mini') ||
    model.startsWith('computer-use-preview');

  const maxOutputTokens = isReasoningModel
    ? Math.max(configuredMaxTokens, 4000)
    : configuredMaxTokens;

  return { model, maxOutputTokens, isReasoningModel };
}

export function shouldStopStreaming(
  state: any,
  opts?: { allowProvideLinksShortCircuit?: boolean }
): boolean {
  const { steps } = state as { steps: any[] };
  const allowProvideLinksShortCircuit =
    opts?.allowProvideLinksShortCircuit ?? true;

  if (stepCountIs(5)({ steps })) return true;
  if (!steps.length) return false;

  const toolCalls: any[] = steps[steps.length - 1].toolCalls ?? [];
  const onlyProvideLinks =
    toolCalls.length > 0 &&
    toolCalls.every((t: any) => t.toolName === 'provide_links');

  if (!allowProvideLinksShortCircuit) return false;
  if (!onlyProvideLinks) return false;
  return steps.some((s: any) => (s.text ?? '').trim().length > 0);
}
