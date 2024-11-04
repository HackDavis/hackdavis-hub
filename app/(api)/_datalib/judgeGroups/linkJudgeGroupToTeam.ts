import { ObjectId } from 'mongodb';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import NoContentError from '@utils/response/NoContentError';
import HttpError from '@utils/response/HttpError';
import { NotFoundError, DuplicateError } from '@utils/response/Errors';

export const LinkManyJudgeGroupsToTeams = async (body: object[]) => {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const parsedBody = await parseAndReplace(body);

    const db = await getDatabase();
    const seenTeamIds: Set<string> = new Set();
    const seenJudgeGroupIds: Set<string> = new Set();

    for (const link of parsedBody) {
      const existingLink = await db.collection('judgeGroupToTeams').findOne({
        judge_group_id: link.judge_group_id,
        team_id: link.team_id,
      });
      if (existingLink)
        throw new DuplicateError('One or more links already exist.');
      seenTeamIds.add(link.team_id.toString());
      seenJudgeGroupIds.add(link.judge_group_id.toString());
    }

    const seenTeams = Array.from(seenTeamIds).map(
      (id: string) => new ObjectId(id)
    );

    const foundTeams = await db
      .collection('teams')
      .find({
        _id: {
          $in: seenTeams,
        },
      })
      .toArray();

    if (foundTeams.length !== seenTeamIds.size) {
      throw new NotFoundError('One or more teams not found');
    }

    const seenJudgeGroups = Array.from(seenJudgeGroupIds).map(
      (id: string) => new ObjectId(id)
    );

    const foundJudgeGroups = await db
      .collection('judgeGroups')
      .find({
        _id: {
          $in: seenJudgeGroups,
        },
      })
      .toArray();

    if (foundJudgeGroups.length !== seenJudgeGroupIds.size) {
      throw new NotFoundError('One or more judge groups not found');
    }

    const creationStatus = await db
      .collection('judgeGroupToTeams')
      .insertMany(parsedBody);

    const links = await db
      .collection('judgeGroupToTeams')
      .find({
        _id: {
          $in: Object.values(creationStatus.insertedIds).map((id: any) => id),
        },
      })
      .toArray();

    return { ok: true, body: await links, error: null, status: 201 };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const LinkJudgeGroupToTeam = async (body: {
  judge_group_id: string;
  team_id: string;
}) => {
  try {
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const parsedBody = {
      judge_group_id: new ObjectId(body.judge_group_id),
      team_id: new ObjectId(body.team_id),
    };

    const db = await getDatabase();

    const judgeGroup = await db.collection('judgeGroups').findOne({
      _id: parsedBody.judge_group_id,
    });

    if (judgeGroup === null) {
      throw new NotFoundError(
        `judge group with id: ${body.judge_group_id} not found.`
      );
    }

    const team = await db.collection('teams').findOne({
      _id: parsedBody.team_id,
    });

    if (team === null) {
      throw new NotFoundError(`team with id: ${body.team_id} not found.`);
    }

    const existingJudgeGroupToTeam = await db
      .collection('judgeGroupToTeams')
      .findOne({
        judge_group_id: parsedBody.judge_group_id,
        team_id: parsedBody.team_id,
      });

    if (existingJudgeGroupToTeam) {
      throw new DuplicateError('JudgeGroupToTeam already exists');
    }

    const creationStatus = await db
      .collection('judgeGroupToTeams')
      .insertOne(parsedBody);

    const judgeGroupToTeam = await db.collection('judgeGroupToTeams').findOne({
      _id: new ObjectId(creationStatus.insertedId),
    });

    return { ok: true, body: judgeGroupToTeam, error: null, status: 201 };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
