import { validateCsvBlob } from "@utils/csv-ingestion/csvAlgorithm";

describe("csvAlgorithm validation", () => {
  it("silently ignores 'N/A' without warnings", async () => {
    const csv =
      "Table Number,Project Status,Project Title,Track #1 (Primary Track),Track #2,Track #3,Opt-In Prizes\n" +
      "12,Submitted (Gallery/Visible),Test Project,Best Beginner Hack,N/A,,\n";

    const blob = new Blob([csv], { type: "text/csv" });
    const res = await validateCsvBlob(blob);

    expect(res.ok).toBe(true);
    expect(res.report.errorRows).toBe(0);
    expect(res.report.warningRows).toBe(0);
    expect(res.report.issues).toEqual([]);
  });

  it("treats duplicate tracks as warnings (non-blocking)", async () => {
    const csv =
      "Table Number,Project Status,Project Title,Track #1 (Primary Track),Track #2,Track #3,Opt-In Prizes\n" +
      "87,Submitted (Gallery/Visible),PartyPal,Best UI/UX Design,Best UI/UX Design,,\n";

    const blob = new Blob([csv], { type: "text/csv" });
    const res = await validateCsvBlob(blob);

    expect(res.ok).toBe(true);
    expect(res.report.errorRows).toBe(0);
    expect(res.report.warningRows).toBe(1);
    expect(res.report.issues[0].severity).toBe("warning");
    expect(res.report.issues[0].duplicateTracks).toEqual(["Best UI/UX Design"]);
  });
});
