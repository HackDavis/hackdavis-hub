import {
  matchCanonicalTrack,
  sortTracks,
} from "@utils/csv-ingestion/csvAlgorithm";

describe("csvAlgorithm track matching", () => {
  it("matches tracks case-insensitively to canonical names", () => {
    expect(matchCanonicalTrack("best hardware hack")).toBe(
      "Best Hardware Hack"
    );
    expect(matchCanonicalTrack("Best hardware hack")).toBe(
      "Best Hardware Hack"
    );
  });

  it("does not attempt to correct spelling", () => {
    expect(matchCanonicalTrack("Best Hardwre Hack")).toBeNull();
    expect(matchCanonicalTrack("Best Assistive Technlogy")).toBeNull();
  });

  it("ingests all opt-in tracks and does not cap length", () => {
    const tracks = sortTracks(
      "best hardware hack",
      "",
      "",
      "Best Use of Gemini API; Best Use of MongoDB Atlas, Best Use of Vectara | Best Use of Auth0"
    );

    expect(tracks).toEqual([
      "Best Hardware Hack",
      "Best Use of Gemini API",
      "Best Use of MongoDB Atlas",
      "Best Use of Vectara",
      "Best Use of Auth0",
    ]);
  });

  it("filters out excluded tracks", () => {
    const tracks = sortTracks(
      "Best Hack for Social Good",
      "Hacker's Choice Award",
      "",
      "Best Hack for Social Good, Best Hardware Hack"
    );

    expect(tracks).toEqual(["Best Hardware Hack"]);
  });
});
