import { NextResponse } from 'next/server';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import {
  NoContentError,
  HttpError,
  BadRequestError,
  DuplicateError,
} from '@utils/response/Errors';
import Team from 'app/_types/teams';
import tracks from '../../_data/tracks.json' assert { type: 'json' };

export const CreateManyTeams = async (body: object[]) => {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }
    const parsedBody = await parseAndReplace(body);

    const seenNumbers = new Set();
    const teamNumbers = parsedBody.map((team: { number: number }) => {
      if (seenNumbers.has(team.number)) {
        throw new DuplicateError('Request contains duplicate team number(s)');
      }
      seenNumbers.add(team.number);
      return team.number;
    });

    const db = await getDatabase();
    const existingTeams = await db
      .collection('teams')
      .find({
        number: {
          $in: teamNumbers,
        },
      })
      .toArray();

    if (existingTeams.length > 0) {
      throw new DuplicateError('Duplicate: one or more teams already exist');
    }

    parsedBody.forEach((team: Team) => {
      const seenTracks = new Set();
      team.tracks.forEach((chosenTrack) => {
        const foundTrack = tracks.find((track) => track.name === chosenTrack);
        if (foundTrack == undefined) {
          throw new BadRequestError('Invalid track');
        } else if (seenTracks.has(foundTrack.name)) {
          throw new BadRequestError('Duplicate track');
        } else if (foundTrack.name === 'Best Hack for Social Good') {
          throw new BadRequestError(
            'Remove default track: Best Hack for Social Good'
          );
        }
        seenTracks.add(chosenTrack);
      });

      // automatically add Best Hack for Social Good
      team.tracks.push('Best Hack for Social Good');
    });

    const creationStatus = await db.collection('teams').insertMany(parsedBody);

    const teams = await db
      .collection('teams')
      .find({
        _id: {
          $in: Object.values(creationStatus.insertedIds).map((id: any) => id),
        },
      })
      .toArray();

    return NextResponse.json(
      { ok: true, body: await teams, error: null },
      { status: 201 }
    );
  } catch (e) {
    const error = e as HttpError;
    return NextResponse.json(
      { ok: false, body: null, error: error.message },
      { status: error.status || 400 }
    );
  }
};
