import { db } from '../../jest.setup';
import { CreateEvent } from '@datalib/events/createEvent';

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
    console.log(`ok: ${ok}, body: ${JSON.stringify(body)}, error: ${error}`);
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
    const tempEvent3 = { ...mockEvent2 };
    delete (tempEvent3 as any).start_time;

    [tempEvent1, tempEvent2, tempEvent3].forEach(async (event) => {
      const res = await CreateEvent(event);
      expect(res.ok).toBe(false);
      expect(res.body).toBe(null);
      expect(res.error).not.toBe(null);
      expect(res.error).toBe('Document failed validation');
    });
  });
});
