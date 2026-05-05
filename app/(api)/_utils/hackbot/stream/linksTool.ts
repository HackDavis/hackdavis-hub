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

function getAllowedHosts(): Set<string> {
  const hosts = new Set<string>([
    'hackdavis.io',
    'hub.hackdavis.io',
    'staging-hub.hackdavis.io',
  ]);
  const baseUrl = process.env.BASE_URL;

  if (baseUrl) {
    try {
      hosts.add(new URL(baseUrl).hostname.toLowerCase());
    } catch {
      // Ignore invalid BASE_URL; fall back to static allow-list.
    }
  }

  return hosts;
}

function normalizeToRelativeHubPath(url: string): string | null {
  const raw = url.trim();
  if (!raw) return null;

  if (raw.startsWith('//')) {
    return null;
  }

  if (raw.startsWith('/')) {
    return raw.replace(/^\/+/, '/');
  }

  if (raw.startsWith('#')) {
    return `/${raw}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!getAllowedHosts().has(hostname)) {
    return null;
  }

  const path = parsed.pathname || '/';
  const search = parsed.search || '';
  const hash = parsed.hash || '';
  return `${path}${search}${hash}`;
}

export async function executeProvideLinks({
  links,
}: {
  links: Array<{ label: string; url: string }>;
}) {
  const seen = new Set<string>();
  const sanitized = links
    .map((link) => {
      const relativeUrl = normalizeToRelativeHubPath(link.url);
      if (!relativeUrl) return null;

      const label = link.label.trim().slice(0, 80);
      if (!label) return null;

      return { label, url: relativeUrl };
    })
    .filter((link): link is { label: string; url: string } => Boolean(link))
    .filter((link) => {
      if (seen.has(link.url)) return false;
      seen.add(link.url);
      return true;
    })
    .slice(0, 3);

  return { links: sanitized };
}
