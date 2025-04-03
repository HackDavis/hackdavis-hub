import { getDatabase } from '@utils/mongodb/mongoClient.mjs';
import { ObjectId } from 'mongodb';
import { HttpError, NotFoundError } from '@utils/response/Errors';

export const CreatePanel = async (trackName: string, trackType: string) => {
  try {
    if (!['tech', 'business', 'design'].includes(trackType)) {
      throw new HttpError(
        `Invalid track type: ${trackType}. Must be one of: tech, business, design`
      );
    }

    const db = await getDatabase();

    const existingPanel = await db
      .collection('panels')
      .findOne({ track: trackName });
    if (existingPanel) {
      throw new HttpError(
        `A panel with track name "${trackName}" already exists`
      );
    }
    const result = await db.collection('panels').insertOne({
      track: trackName,
      type: trackType,
      users: [],
    });

    if (!result.acknowledged) {
      throw new HttpError('Failed to create panel');
    }

    const newPanel = await db
      .collection('panels')
      .findOne({ _id: result.insertedId });

    return { ok: true, body: newPanel, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};

export const DeletePanel = async (panelId: string) => {
  try {
    const db = await getDatabase();

    const panel = await db
      .collection('panels')
      .findOne({ _id: new ObjectId(panelId) });
    if (!panel) {
      throw new NotFoundError(`Panel with id ${panelId} not found`);
    }

    const result = await db
      .collection('panels')
      .deleteOne({ _id: new ObjectId(panelId) });

    if (result.deletedCount === 0) {
      throw new HttpError('Failed to delete panel');
    }

    return {
      ok: true,
      message: `Panel "${panel.track}" successfully deleted`,
      error: null,
    };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, message: null, error: error.message };
  }
};

export const AssignJudgesToPanels = async () => {
  try {
    const db = await getDatabase();

    const panels = await db.collection('panels').find({}).toArray();

    const judges = await db
      .collection('users')
      .find({ role: 'judge' })
      .toArray();

    const assignedJudgeIds = new Set<string>();

    for (const panel of panels) {
      const panelType = panel.type;

      const assignedJudges = await findBestJudgesForPanel(
        judges,
        panelType,
        5,
        assignedJudgeIds
      );

      if (assignedJudges.length > 0) {
        await db
          .collection('panels')
          .updateOne({ _id: panel._id }, { $set: { users: assignedJudges } });
      }
    }

    return { ok: true, message: 'Judges successfully assigned to panels' };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, error: error.message };
  }
};

const findBestJudgesForPanel = async (
  judges: any[],
  panelType: string,
  maxJudges: number,
  assignedJudgeIds: Set<string>
) => {
  const availableJudges = judges.filter(
    (judge) => !assignedJudgeIds.has(judge._id.toString())
  );

  if (availableJudges.length === 0) {
    return [];
  }

  const assignedJudges = [];

  for (let priorityLevel = 0; priorityLevel < 3; priorityLevel++) {
    if (assignedJudges.length >= maxJudges) break;

    const matchingJudges = availableJudges.filter(
      (judge) =>
        judge.specialties &&
        judge.specialties[priorityLevel] === panelType &&
        !assignedJudgeIds.has(judge._id.toString())
    );

    const shuffled = [...matchingJudges].sort(() => 0.5 - Math.random());

    for (const judge of shuffled) {
      if (assignedJudges.length >= maxJudges) break;

      assignedJudges.push({
        _id: judge._id,
        name: judge.name,
        email: judge.email,
        role: judge.role,
        specialties: judge.specialties,
        has_checked_in: judge.has_checked_in || false,
      });

      assignedJudgeIds.add(judge._id.toString());
    }
  }

  if (assignedJudges.length < maxJudges) {
    const remainingJudges = availableJudges.filter(
      (judge) => !assignedJudgeIds.has(judge._id.toString())
    );

    const shuffled = [...remainingJudges].sort(() => 0.5 - Math.random());

    for (const judge of shuffled) {
      if (assignedJudges.length >= maxJudges) break;

      assignedJudges.push({
        _id: judge._id,
        name: judge.name,
        email: judge.email,
        role: judge.role,
        specialties: judge.specialties,
        has_checked_in: judge.has_checked_in || false,
      });

      assignedJudgeIds.add(judge._id.toString());
    }
  }

  return assignedJudges;
};

export const GetAllPanels = async () => {
  try {
    const db = await getDatabase();
    const panels = await db.collection('panels').find({}).toArray();

    return { ok: true, body: panels, error: null };
  } catch (e) {
    const error = e as HttpError;
    return { ok: false, body: null, error: error.message };
  }
};
