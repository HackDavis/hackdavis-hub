const TITO_API_TOKEN = process.env.TITO_API_TOKEN;
const TITO_ACCOUNT_SLUG = process.env.TITO_ACCOUNT_SLUG;
const TITO_EVENT_SLUG = process.env.TITO_EVENT_SLUG;

export async function TitoRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!TITO_API_TOKEN || !TITO_ACCOUNT_SLUG || !TITO_EVENT_SLUG) {
    throw new Error('Missing Tito API configuration in environment variables');
  }

  const baseUrl = `https://api.tito.io/v3/${TITO_ACCOUNT_SLUG}/${TITO_EVENT_SLUG}`;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Token token=${TITO_API_TOKEN}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    const retryAfter = response.headers.get('Retry-After');
    const error = new Error(`Tito API ${response.status}: ${errorText}`);
    if (retryAfter) (error as any).retryAfter = retryAfter;
    throw error;
  }

  // DELETE responses may return 204 No Content
  if (response.status === 204) return {} as T;

  return response.json();
}
