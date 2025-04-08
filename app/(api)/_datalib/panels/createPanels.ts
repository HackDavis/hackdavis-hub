import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import {
  HttpError,
  DuplicateError,
  NoContentError,
  BadRequestError,
} from '@utils/response/Errors';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import { categorizedTracks } from '@data/tracks';
import type Panel from '@typeDefs/panel';

const validTracks = Object.values(categorizedTracks).map((track) => track.name);

export const CreatePanel = async (trackName: string) => {
  try {
    if (!validTracks.includes(trackName)) {
      throw new HttpError(`Invalid track: ${trackName}.`);
    }

    const db = await getDatabase();

    const existingPanel = await db
      .collection('panels')
      .findOne({ track: trackName });
    if (existingPanel) {
      throw new DuplicateError(
        `A panel already exists for track: ${trackName}`
      );
    }

    const result = await db.collection('panels').insertOne({
      track: trackName,
      domain: categorizedTracks[trackName].domain,
      user_ids: [],
    });

    if (!result.acknowledged) {
      throw new HttpError(
        'Internal Server Error: Failed to create panel in DB'
      );
    }

    const panel = await db
      .collection('panels')
      .findOne({ _id: result.insertedId });

    return { ok: true, body: panel, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const CreateManyPanels = async (body: object) => {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }
    const parsedBody = await parseAndReplace(body);

    const seenTracks = new Set();
    const panelTracks = parsedBody.map((panel: Panel) => {
      if (seenTracks.has(panel.track)) {
        throw new BadRequestError('Request contains duplicate track(s)');
      }
      seenTracks.add(panel.track);
      return panel.track;
    });

    const db = await getDatabase();
    const existingPanels = await db
      .collection('panels')
      .find({ track: { $in: panelTracks } })
      .toArray();

    if (existingPanels.length > 0) {
      throw new DuplicateError('Duplicate: one or more panels already exist');
    }

    parsedBody.forEach(async (panel: Panel) => {
      const seenJudges = new Set();
      panel.user_ids.forEach((judge) => {
        if (seenJudges.has(judge)) {
          throw new BadRequestError(
            `Request contains duplicate user_ids for track: ${panel.track}`
          );
        }
        seenJudges.add(judge);
      });
    });

    const creationStatus = await db.collection('panels').insertMany(parsedBody);

    const createdPanels = await db
      .collection('panels')
      .find({
        _id: { $in: Object.values(creationStatus.insertedIds).map((id) => id) },
      })
      .toArray();

    return { ok: true, body: createdPanels, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
