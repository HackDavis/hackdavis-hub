import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import {
  HackerInviteData,
  HackerAdmissionType,
  HACKER_ADMISSION_TYPES,
} from '@typeDefs/emails';

const emailSchema = z.string().email();

const VALID_TYPES = new Set<string>(HACKER_ADMISSION_TYPES);

function normalizeType(raw: string): HackerAdmissionType | null {
  const normalized = raw.trim().toLowerCase().replace(/[- ]/g, '_');
  return VALID_TYPES.has(normalized)
    ? (normalized as HackerAdmissionType)
    : null;
}

interface ParseResult {
  ok: true;
  body: HackerInviteData[];
}

interface ParseError {
  ok: false;
  error: string;
}

/**
 * Parses a hacker admissions CSV with columns:
 *   First Name, Last Name, Email, Type
 *
 * Type must be one of: accept, waitlist_accept, waitlist, reject
 */
export default function parseHackerAdmissionsCSV(
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

    const firstRow = rows[0].map((cell) => cell.toLowerCase());
    const hasHeader =
      firstRow.some((cell) => cell.includes('first')) ||
      firstRow.some((cell) => cell.includes('email'));
    const dataRows = hasHeader ? rows.slice(1) : rows;

    if (dataRows.length === 0) {
      return { ok: false, error: 'CSV has a header but no data rows.' };
    }

    const results: HackerInviteData[] = [];
    const errors: string[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNum = hasHeader ? i + 2 : i + 1;

      if (row.length < 4) {
        errors.push(
          `Row ${rowNum}: expected 4 columns (First Name, Last Name, Email, Type), got ${row.length}.`
        );
        continue;
      }

      const [firstName, lastName, email, typeRaw] = row;

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

      const admissionType = normalizeType(typeRaw ?? '');
      if (!admissionType) {
        errors.push(
          `Row ${rowNum}: "${typeRaw}" is not a valid type. Must be one of: ${HACKER_ADMISSION_TYPES.join(
            ', '
          )}.`
        );
        continue;
      }

      results.push({ firstName, lastName, email, admissionType });
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
