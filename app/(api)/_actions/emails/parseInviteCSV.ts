import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import { JudgeInviteData } from '@typeDefs/emails';

const emailSchema = z.string().email();

interface ParseResult {
  ok: true;
  body: JudgeInviteData[];
}

interface ParseError {
  ok: false;
  error: string;
}

export default function parseInviteCSV(
  csvText: string
): ParseResult | ParseError {
  try {
    if (!csvText.trim()) {
      return { ok: false, error: 'CSV file is empty.' };
    }

    const rows: string[][] = parse(csvText, {
      trim: true,
      skip_empty_lines: true,
    });

    if (rows.length === 0) {
      return { ok: false, error: 'CSV file has no rows.' };
    }

    // Detect and skip header row
    const firstRow = rows[0].map((cell) => cell.toLowerCase());
    const hasHeader =
      firstRow.some((cell) => cell.includes('first')) ||
      firstRow.some((cell) => cell.includes('email'));
    const dataRows = hasHeader ? rows.slice(1) : rows;

    if (dataRows.length === 0) {
      return { ok: false, error: 'CSV has a header but no data rows.' };
    }

    const results: JudgeInviteData[] = [];
    const errors: string[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNum = hasHeader ? i + 2 : i + 1;

      if (row.length < 3) {
        errors.push(`Row ${rowNum}: expected 3 columns (First Name, Last Name, Email), got ${row.length}.`);
        continue;
      }

      const [firstName, lastName, email] = row;

      if (!firstName) {
        errors.push(`Row ${rowNum}: First Name is empty.`);
        continue;
      }
      if (!lastName) {
        errors.push(`Row ${rowNum}: Last Name is empty.`);
        continue;
      }

      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        errors.push(`Row ${rowNum}: "${email}" is not a valid email address.`);
        continue;
      }

      results.push({ firstName, lastName, email });
    }

    if (errors.length > 0) {
      return { ok: false, error: errors.join('\n') };
    }

    return { ok: true, body: results };
  } catch (e) {
    const error = e as Error;
    return { ok: false, error: `Failed to parse CSV: ${error.message}` };
  }
}
