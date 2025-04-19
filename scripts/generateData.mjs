import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import data from '../app/_data/db_validation_data.json' with { type: 'json' };

const specialties = [...new Set(data.domains)];
const tracks = [...new Set(data.tracks)];

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
  const hackerPositions = ['developer', 'designer', 'pm', 'other'];
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
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_HASHED_PASSWORD,
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
      active: true,
    }));
  } else if (collectionName === 'submissions') {
    data = Array.from({ length: numDocuments }, () => {
      const randomTracks = faker.helpers.arrayElements(
        tracks.map((t) => t.name),
        faker.number.int({ min: 1, max: 6 })
      );
      const scores = randomTracks.map((t) => ({
        trackName: t,
        rawScores: Array.from({ length: 5 }, () =>
          faker.number.int({ min: 1, max: 5 })
        ),
        finalTrackScore: null,
      }));
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
      const isWorkshop = eventType === 'WORKSHOPS';
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
          ? faker.helpers.arrayElements([...hackerPositions, 'beginner'], {
              min: 1,
            })
          : [],
      };
    });
  } else if (collectionName === 'panels') {
    const trackNames = tracks;

    const trackTypes = trackNames.reduce((acc, trackName) => {
      acc[trackName] = faker.helpers.arrayElement(specialties);
      return acc;
    }, {});

    data = trackNames.map((trackName) => ({
      track: trackName,
      domain: trackTypes[trackName],
      user_ids: [],
    }));
  } else if (collectionName === 'announcements') {
    data = Array.from({ length: numDocuments }, () => ({
      title: faker.company.catchPhrase(),
      description: faker.commerce.productDescription(),
      time: faker.date.between({
        from: '2025-04-19T00:00:00.000Z',
        to: '2025-04-20T23:59:59.999Z',
      }),
    }));
  } else if (collectionName === 'rollouts') {
    data = Array.from({ length: numDocuments }, () => {
      return {
        component_key: 'judge-check-in',
        // component_key: 'hackers-choice-link',
        rollout_time: Date.now() + 1 * 60 * 1000,
        rollback_time: Date.now() + 2 * 60 * 1000,
      };
    });
  }

  return data;
}

export default generateData;
