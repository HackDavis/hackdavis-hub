import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

export async function embedText(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding(EMBEDDING_MODEL),
    value: text,
  });
  return embedding;
}
