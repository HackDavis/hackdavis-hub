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
) {
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
    (track) => track !== 'NA' && validTracks.includes(track)
  );
  return tracksInOrder;
}

export default async function csvAlgorithm(blob: Blob) {
  try {
    const parsePromise = new Promise<ParsedRecord[]>((resolve, reject) => {
      const output: ParsedRecord[] = [];

      const parseBlob = async () => {
        const buffer = Buffer.from(await blob.arrayBuffer());
        const stream = Readable.from(buffer.toString());

        stream
          .pipe(csv())
          .on('data', (data) => {
            if (data['Table Number'] !== '') {
              const track1 = data['Track #1'].trim();
              const track2 = data['Track #2'].trim();
              const track3 = data['Track #3'].trim();

              const tracksInOrder: string[] = sortTracks(
                track1,
                track2,
                track3,
                data['Opt-In Prizes']
              );

              output.push({
                name: data['Project Title'],
                teamNumber: parseInt(data['Table Number']),
                tableNumber: 0,
                tracks: tracksInOrder,
                active: false,
              });
            }
          })
          .on('end', () => {
            resolve(output);
          })
          .on('error', (error) => reject(error));
      };
      parseBlob().catch(reject);
    });

    const results = await parsePromise;
    console.log(results);

    return { ok: true, body: results, error: null };
  } catch (e) {
    const error = e as Error;
    return { ok: false, body: null, error: error.message };
  }
}
