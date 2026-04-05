/*
 Temporary local helper for terminal testing.
 Converts Hackbot stream frames into readable sections.
*/

function formatEvent(event) {
  const bits = [];
  if (event.start) bits.push(event.start);
  if (event.end) bits.push(`ends ${event.end}`);
  if (event.location) bits.push(event.location);
  if (event.host) bits.push(`hosted by ${event.host}`);
  if (Array.isArray(event.tags) && event.tags.length > 0) {
    bits.push(`tags: ${event.tags.join(', ')}`);
  }

  return `- ${event.name}${bits.length ? ` | ${bits.join(' | ')}` : ''}`;
}

export async function prettyPrintHackbotResponse(response) {
  if (!response.ok || !response.body) {
    const body = await response.text().catch(() => '');
    const details = body ? `: ${body}` : '';
    throw new Error(
      `Request failed (${response.status} ${response.statusText})${details}`
    );
  }

  const decoder = new TextDecoder();
  let buffer = '';

  let assistantText = '';
  const events = [];
  const links = [];
  const errors = [];

  const handleFrame = (frameLine) => {
    const idx = frameLine.indexOf(':');
    if (idx <= 0) return;

    const frameType = frameLine.slice(0, idx);
    const payloadRaw = frameLine.slice(idx + 1);

    let payload;
    try {
      payload = JSON.parse(payloadRaw);
    } catch {
      return;
    }

    if (frameType === '0') {
      if (typeof payload === 'string') assistantText += payload;
      return;
    }

    if (frameType === '3') {
      if (typeof payload === 'string') errors.push(payload);
      return;
    }

    if (frameType !== 'a') return;
    if (!Array.isArray(payload)) return;

    for (const item of payload) {
      const toolName = item?.toolName;
      const result = item?.result;

      if (toolName === 'get_events' && Array.isArray(result?.events)) {
        for (const event of result.events) events.push(event);
      }

      if (toolName === 'provide_links' && Array.isArray(result?.links)) {
        for (const link of result.links) links.push(link);
      }
    }
  };

  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true });

    let newlineIndex = buffer.indexOf('\n');
    while (newlineIndex !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (line.length > 0) handleFrame(line);
      newlineIndex = buffer.indexOf('\n');
    }
  }

  const trailing = buffer.trim();
  if (trailing.length > 0) handleFrame(trailing);

  const out = [];

  out.push('ASSISTANT');
  out.push(assistantText.trim() || '(no assistant text)');

  if (events.length > 0) {
    out.push('');
    out.push('EVENTS');
    for (const event of events) out.push(formatEvent(event));
  }

  if (links.length > 0) {
    out.push('');
    out.push('LINKS');
    for (const link of links) {
      const label = link?.label || '(no label)';
      const url = link?.url || '(no url)';
      out.push(`- ${label}: ${url}`);
    }
  }

  if (errors.length > 0) {
    out.push('');
    out.push('ERRORS');
    for (const err of errors) out.push(`- ${err}`);
  }

  console.log(out.join('\n'));
}
