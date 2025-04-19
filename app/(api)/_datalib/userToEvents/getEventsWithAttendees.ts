// app/(api)/_actions/events/getEventsWithAttendees.ts
'use server';

import { getDatabase } from '@utils/mongodb/mongoClient.mjs';

export async function GetEventsWithAttendees() {
  try {
    const db = await getDatabase();

    // This is an aggregation pipeline that will get all events
    // and count how many users are registered for each event
    const eventsWithAttendees = await db
      .collection('events')
      .aggregate([
        {
          $lookup: {
            from: 'userToEvents',
            localField: '_id',
            foreignField: 'event_id',
            as: 'attendees',
          },
        },
        {
          $addFields: {
            attendeeCount: { $size: '$attendees' },
          },
        },
        {
          $project: {
            attendees: 0, // Remove the full attendees array to keep response small
          },
        },
      ])
      .toArray();

    return {
      ok: true,
      body: eventsWithAttendees,
      error: null,
    };
  } catch (error: any) {
    return {
      ok: false,
      body: null,
      error: error.message || 'Failed to fetch events with attendees',
    };
  }
}
