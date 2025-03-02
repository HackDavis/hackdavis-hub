import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import tracks from '../app/(api)/_data/tracks.json' assert { type: 'json' };

function shuffleSpecialties(specialties) {
  const shuffledSpecialties = [...specialties];
  for (let i = shuffledSpecialties.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledSpecialties[i], shuffledSpecialties[j]] = [
      shuffledSpecialties[j],
      shuffledSpecialties[i],
    ];
  }
  return shuffledSpecialties;
}

function generateData(collectionName, numDocuments) {
  const specialties = [...new Set(tracks.map((track) => track.type))];
  const hackerPositions = ['developer', 'designer', 'pm', 'other', 'beginner'];
  const eventTypes = ['GENERAL', 'ACTIVITIES', 'WORKSHOPS', 'MEALS'];

  let data = [];

  if (collectionName === 'users') {
    const judges = Array.from({ length: numDocuments }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      specialties: shuffleSpecialties(specialties),
      role: 'judge',
      has_checked_in: false,
    }));

    const hackers = Array.from({ length: numDocuments }, () => ({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      position: faker.helpers.arrayElement(hackerPositions),
      is_beginner: faker.datatype.boolean(),
      has_checked_in: true,
      role: 'hacker',
    }));

    data = [...judges, ...hackers];
  } else if (collectionName === 'admin') {
    data.push({
      name: 'Admin',
      email: 'admin@hackdavis.io',
      password: '$2a$10$oit1hC4hBaj9OX.WQxm3uOtb0qnPNk4iR9QhZmFm7/r1rAphAMAva',
      role: 'admin',
      has_checked_in: true,
    });
  } else if (collectionName === 'teams') {
    data = Array.from({ length: numDocuments }, () => ({
      teamNumber: faker.number.int({ min: 1, max: 200 }),
      tableNumber: faker.number.int({ min: 1, max: 200 }),
      name: faker.lorem.word(),
      tracks: faker.helpers.arrayElements(
        tracks.map((t) => t.name),
        faker.number.int({ min: 1, max: 5 })
      ),
    }));
  } else if (collectionName === 'submissions') {
    data = Array.from({ length: numDocuments }, () => {
      const randomTracks = faker.helpers.arrayElements(
        tracks.map((t) => t.name),
      );
      const scores = randomTracks.map((t) => 
        ({
          trackName: t,
          rawScores: Array.from({ length: 5 }, () =>
            faker.number.int({ min: 1, max: 5 })
          ),
          finalTrackScore: null
        })
      );

      return {
        judge_id: new ObjectId(),
        team_id: new ObjectId(),
        social_good: faker.number.int({ min: 1, max: 5 }),
        creativity: faker.number.int({ min: 1, max: 5 }),
        presentation: faker.number.int({ min: 1, max: 5 }),
        scores: scores,
        comments: Math.random() > 0.5 ? faker.lorem.sentence() : '',
        queuePosition: null,
        is_scored: faker.datatype.boolean(),
      };
    });
  } else if (collectionName === 'events') {
    data = Array.from({ length: numDocuments }, () => {
      const eventType = faker.helpers.arrayElement(eventTypes);
      const isWorkshop = eventType === 'workshop';
      const startTime = faker.date.between({
        from: '2025-04-19T00:00:00.000Z',
        to: '2025-04-20T23:59:59.999Z',
      });

      return {
        name: faker.company.catchPhrase(),
        type: eventType,
        host: isWorkshop ? faker.company.name() : '',
        location: Math.random() > 0.5 ? faker.location.street() : '',
        start_time: startTime,
        end_time: faker.date.soon({ days: 2, refDate: startTime }),
        tags: isWorkshop
          ? faker.helpers.arrayElements(hackerPositions, { min: 1 })
          : [],
      };
    });
  }

  return data;
}

export default generateData;
