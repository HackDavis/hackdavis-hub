import { ObjectId } from 'mongodb';
import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import isBodyEmpty from '@utils/request/isBodyEmpty';
import parseAndReplace from '@utils/request/parseAndReplace';
import {
  NoContentError,
  HttpError,
  NotFoundError,
  DuplicateError,
  BadRequestError,
} from '@utils/response/Errors';

export const CreateJudgeGroup = async (body: object) => {
  try {
    // empty
    if (isBodyEmpty(body)) {
      throw new NoContentError();
    }

    const parsedBody = await parseAndReplace(body);
    const db = await getDatabase();

    const judge_ids = parsedBody.judge_ids;
    if (judge_ids.length == 0) {
      throw new BadRequestError('No judge IDs specified in this group.');
    }

    // judges dont exist
    const judges = await db
      .collection('judges')
      .find({
        _id: { $in: judge_ids },
      })
      .toArray();
    if (judges.length !== judge_ids.length) {
      throw new NotFoundError('One or more judges not found.');
    }

    const existingGrouping = judges.some((judge: { judge_group_id: string }) =>
      judge.judge_group_id ? true : false
    );

    // duplicate
    if (existingGrouping) {
      throw new DuplicateError(
        'Duplicate: judge group with these judges already exists.'
      );
    }

    const creationStatus = await db.collection('judgeGroups').insertOne({
      type: parsedBody.type,
      judge_ids: judge_ids,
    });

    const judge_group = await db.collection('judgeGroups').findOne({
      _id: new ObjectId(creationStatus.insertedId),
    });

    const judgeGroupId = new ObjectId(creationStatus.insertedId);

    // update judges
    await db
      .collection('judges')
      .updateMany(
        { _id: { $in: judge_ids } },
        { $set: { judge_group_id: judgeGroupId } }
      );

    return { ok: true, body: judge_group, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
