"use server";

import { validateCsvBlob } from "@utils/csv-ingestion/csvAlgorithm";

export default async function validateCSV(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) {
    return {
      ok: false,
      body: null,
      validBody: null,
      report: null,
      error: "Missing file",
    };
  }

  const data = await file.arrayBuffer();
  const blob = new Blob([data], { type: file.type });

  const res = await validateCsvBlob(blob);
  return {
    ok: res.ok,
    body: res.body,
    validBody: res.validBody,
    report: res.report,
    error: res.error,
  };
}
