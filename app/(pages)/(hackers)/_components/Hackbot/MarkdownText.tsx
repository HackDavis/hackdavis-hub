'use client';

/** Renders a single line, converting **bold** and *italic* to JSX. */
function renderInline(line: string, key: number) {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(line)) !== null) {
    if (match.index > last) parts.push(line.slice(last, match.index));
    if (match[2] !== undefined) {
      parts.push(<strong key={i++}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      parts.push(<em key={i++}>{match[3]}</em>);
    }
    last = match.index + match[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return <span key={key}>{parts}</span>;
}

/** Renders markdown text with **bold**, *italic*, and line breaks. */
export default function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {renderInline(line, i)}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
