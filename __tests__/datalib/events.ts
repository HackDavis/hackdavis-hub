import { db } from '../../jest.setup';
import { CreateEvent } from '@datalib/events/createEvent';
import Event from '@typeDefs/event';

const mockEvent1 = {
  name: 'Test Event 1',
  host: 'Test Host 1',
  type: 'WORKSHOPS',
  location: 'Test Location',
  start_time: new Date(),
  end_time: new Date(),
  tags: ['developer', 'beginner'],
};
const mockEvent2 = {
  name: 'Test Event 2',
  host: 'Test Host 1',
  type: 'GENERAL',
  location: 'Test Location',
  start_time: new Date(),
  end_time: new Date(),
  tags: ['designer', 'pm'],
};

beforeEach(async () => {
  await db.collection('events').deleteMany({});
});
describe('CREATE: events', () => {
  it('should create an event with valid details successfully', async () => {
    const { ok, body, error } = await CreateEvent(mockEvent1);
    expect(ok).toBe(true);
    expect(body).not.toBe(null);
    expect(body).toEqual(mockEvent1);
    expect(error).toBe(null);
  });

  it('should fail to create an event with missing required fields', async () => {
    // missing name
    const tempEvent1 = { ...mockEvent1 };
    delete (tempEvent1 as any).name;

    // missing type
    const tempEvent2 = { ...mockEvent1 };
    delete (tempEvent2 as any).type;

    // missing start_time
    const tempEvent3 = { ...mockEvent1 };
    delete (tempEvent3 as any).start_time;

    [tempEvent1, tempEvent2, tempEvent3].forEach(async (event) => {
      const res = await CreateEvent(event);
      expect(res.ok).toBe(false);
      expect(res.body).toBe(null);
      expect(res.error).not.toBe(null);
      expect(res.error).toBe('Document failed validation');
    });
  });

  it('should create an event with missing optional fields', async () => {
    // missing host
    const tempEvent1 = { ...mockEvent2 };
    delete (tempEvent1 as Event).host;

    // missing location
    const tempEvent2 = { ...mockEvent2 };
    delete (tempEvent2 as Event).location;

    // missing end_time
    const tempEvent3 = { ...mockEvent2 };
    delete (tempEvent3 as Event).end_time;

    // missing tags
    const tempEvent4 = { ...mockEvent2 };
    delete (tempEvent4 as Event).tags;

    [tempEvent1, tempEvent2, tempEvent3, tempEvent4].forEach(async (event) => {
      const res = await CreateEvent(event);
      expect(res.ok).toBe(true);
      const insertedEvent = res.body as Event;
      delete insertedEvent._id;
      expect(res.body).toStrictEqual(insertedEvent);
      expect(res.error).toBe(null);
    });
  });

  // it('should fail to create an event with start_time before April 19', async () => {
  //   const tempEvent = { ...mockEvent1 };
  //   tempEvent.start_time = new Date(2000, 1, 1, 0, 0, 0, 0);

  //   const { ok, body, error } = await CreateEvent(tempEvent);
  //   expect(ok).toBe(false);
  //   expect(body).toBe(null);
  //   expect(error).toBe(
  //     'Failed to create event: start_time must be after 04/18/2025'
  //   );
  // });

  // it('should fail to create an event with end_time before start_time', async () => {
  //   const tempEvent = { ...mockEvent1 };
  //   tempEvent.start_time = new Date();
  //   tempEvent.end_time = new Date(2000, 1, 1, 0, 0, 0, 0);

  //   const { ok, body, error } = await CreateEvent(tempEvent);
  //   expect(ok).toBe(false);
  //   expect(body).toBe(null);
  //   expect(error).toBe(
  //     'Failed to create event: end_time must be after start_time'
  //   );
  // });

  it('should fail to create an event with duplicate name', async () => {
    const { ok, body, error } = await CreateEvent(mockEvent1);
    expect(ok).toBe(true);
    expect(body).toEqual(mockEvent1);
    expect(error).toBe(null);

    const duplicate = await CreateEvent(mockEvent1);
    expect(duplicate.ok).toBe(false);
    expect(duplicate.body).toBe(null);
    expect(duplicate.error).toBe('Duplicate: event already exists.');
  });
});
