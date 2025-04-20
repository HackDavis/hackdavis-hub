import csv from 'csv-parser';
import trackData from '@data/db_validation_data.json' assert { type: 'json' };
import { Readable } from 'stream';
import ParsedRecord from '@typeDefs/parsedRecord';

const filteredTracks = [
  'Best Hack for Social Good',
  "Hacker's Choice Award",
  'NA',
];
const validTracks: string[] = trackData.tracks.filter(
  (t) => !filteredTracks.includes(t)
);

function sortTracks(
  track1: string,
  track2: string,
  track3: string,
  chosentracks: string
): string[] {
  const initialTracks = [track1, track2, track3]
    .map((t) => t.trim())
    .filter(
      (t) =>
        validTracks.includes(t) &&
        t !== 'Best Hack for Social Good' &&
        t !== "Hacker's Choice Award"
    ); // explicitly filter it out again

  const existingTrackSet = new Set(initialTracks);

  if (chosentracks.length > 1) {
    chosentracks
      .split(',')
      .map((t) => t.trim())
      .forEach((track) => {
        if (
          validTracks.includes(track) &&
          !existingTrackSet.has(track) &&
          track !== 'Best Hack for Social Good' // explicitly filter it out
        ) {
          initialTracks.push(track);
          existingTrackSet.add(track);
        }
      });
  }

  if (initialTracks.length > 4) {
    initialTracks.length = 4;
  }

  return initialTracks;
}

export default async function csvAlgorithm(
  blob: Blob
): Promise<{ ok: boolean; body: ParsedRecord[] | null; error: string | null }> {
  try {
    const parsePromise = new Promise<ParsedRecord[]>((resolve, reject) => {
      const output: ParsedRecord[] = [];

      const parseBlob = async () => {
        const buffer = Buffer.from(await blob.arrayBuffer());
        const stream = Readable.from(buffer.toString());
        // let i = 0;
        stream
          .pipe(csv())
          .on('data', (data) => {
            if (
              data['Table Number'] !== '' &&
              data['Project Status'] === 'Submitted (Gallery/Visible)'
            ) {
              const track1 = data['Track #1 (Primary Track)'] ?? '';
              const track2 = data['Track #2'] ?? '';
              const track3 = data['Track #3'] ?? '';
              const optIns = data['Opt-In Prizes'] ?? '';

              const tracksInOrder = sortTracks(track1, track2, track3, optIns);

              output.push({
                name: data['Project Title'],
                teamNumber: parseInt(data['Table Number']),
                tableNumber: 0, // doing it later (on end)
                tracks: tracksInOrder,
                active: true,
              });
            }
          })
          .on('end', () => {
            const bestHardwareTeams = output.filter((team) =>
              team.tracks.includes('Best Hardware Hack')
            );
            const otherTeams = output.filter(
              (team) => !team.tracks.includes('Best Hardware Hack')
            );

            const orderedTeams = [...bestHardwareTeams, ...otherTeams];

            orderedTeams.forEach((team, index) => {
              team.tableNumber = index + 1;
            });

            resolve(orderedTeams);
          })
          .on('error', (error) => reject(error));
      };
      parseBlob().catch(reject);
    });

    const results: ParsedRecord[] = await parsePromise;

    return { ok: true, body: results, error: null };
  } catch (e) {
    const error = e as Error;
    return { ok: false, body: null, error: error.message };
  }
}
