import {
  matchCanonicalTrack,
  sortTracks,
} from '@utils/csv-ingestion/csvAlgorithm';

describe('csvAlgorithm track matching', () => {
  it('matches tracks case-insensitively to canonical names', () => {
    expect(matchCanonicalTrack('best hardware hack')).toBe(
      'Best Hardware Hack'
    );
    expect(matchCanonicalTrack('Best hardware hack')).toBe(
      'Best Hardware Hack'
    );
  });

  it('does not attempt to correct spelling', () => {
    expect(matchCanonicalTrack('Best Hardwre Hack')).toBeNull();
    expect(matchCanonicalTrack('Best Entreprneurship Hack')).toBeNull();
  });

  it('ingests all opt-in tracks and does not cap length', () => {
    const tracks = sortTracks(
      'best hardware hack',
      '',
      '',
      'Best UI/UX Design; Best Entrepreneurship Hack, Best Statistical Model | Best AI/ML Hack'
    );

    expect(tracks).toEqual([
      'Best Hardware Hack',
      'Best UI/UX Design',
      'Best Entrepreneurship Hack',
      'Best Statistical Model',
      'Best AI/ML Hack',
    ]);
  });

  it('filters out excluded tracks', () => {
    const tracks = sortTracks(
      'Best Hack for Social Good',
      "Hacker's Choice Award",
      '',
      'Best Hack for Social Good, Best Hardware Hack'
    );

    expect(tracks).toEqual(['Best Hardware Hack']);
  });
});
