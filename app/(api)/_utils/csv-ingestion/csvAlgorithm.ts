import csv from 'csv-parser';
import trackData from '@data/db_validation_data.json' assert { type: 'json' };
import { Readable } from 'stream';
import ParsedRecord from '@typeDefs/parsedRecord';

const validTracks: string[] = trackData.tracks.filter(
  (t) => t !== 'Best Hack for Social Good'
);

function sortTracks(
  track1: string,
  track2: string,
  track3: string,
  chosentracks: string
): string[] {
  let tracksInOrder: string[] = [track1, track2, track3];

  if (chosentracks.length > 1) {
    const otherTracks = chosentracks
      .split(',')
      .map((track: string) => track.trim())
      .filter(
        (track: string) =>
          validTracks.includes(track) && !tracksInOrder.includes(track)
      );

    const uniqueTracks = [...new Set(otherTracks)];

    tracksInOrder.push(...uniqueTracks);
  }

  if (tracksInOrder.length > 4) {
    tracksInOrder.length = 4;
  }

  tracksInOrder = tracksInOrder.filter(
    (track: string) => track !== 'NA' && validTracks.includes(track)
  );
  return tracksInOrder;
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

        stream
          .pipe(csv())
          .on('data', (data) => {
            if (
              data['Table Number'] !== '' &&
              data['Project Status'] === 'Submitted (Gallery/Visible)'
            ) {
              console.log(data);
              const track1: string = data['Track #1 (Primary Track)'].trim();
              const track2: string = data['Track #2'].trim();
              const track3: string = data['Track #3'].trim();

              const tracksInOrder: string[] = sortTracks(
                track1,
                track2,
                track3,
                data['Opt-In Prizes']
              );

              output.push({
                name: data['Project Title'],
                teamNumber: parseInt(data['Table Number']),
                tableNumber: 0, // will be assigned later during ordering
                tracks: tracksInOrder,
                active: false,
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
    console.log(results);

    return { ok: true, body: results, error: null };
  } catch (e) {
    const error = e as Error;
    return { ok: false, body: null, error: error.message };
  }
}
