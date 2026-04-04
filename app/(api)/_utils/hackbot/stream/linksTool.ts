import { z } from 'zod';

export const PROVIDE_LINKS_DESCRIPTION =
  'Surface 1-3 relevant links from the knowledge context for the user. Call this AFTER generating your full text response - never before. Skip it entirely for greetings, off-topic refusals, and pure event-schedule answers (event cards already carry links).';

export const PROVIDE_LINKS_INPUT_SCHEMA = z.object({
  links: z
    .array(
      z.object({
        label: z
          .string()
          .describe(
            'Short user-friendly label. Strip prefixes like "FAQ:", "Prize Track:", "Starter Kit:". Max 40 chars.'
          ),
        url: z
          .string()
          .describe('URL exactly as it appears in the knowledge context.'),
      })
    )
    .max(3)
    .describe(
      '1-3 links most relevant to the response. Omit any that are only loosely related.'
    ),
});

export async function executeProvideLinks({
  links,
}: {
  links: Array<{ label: string; url: string }>;
}) {
  return { links };
}
