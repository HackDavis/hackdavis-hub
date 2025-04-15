import { db } from "../../jest.setup";
import { CreateEvent } from "@datalib/events/createEvent";
import { GetEvent, GetEvents } from "@datalib/events/getEvent";
import { UpdateEvent } from "@datalib/events/updateEvent";
import { DeleteEvent } from "@datalib/events/deleteEvent";
import Event from "@typeDefs/event";

let mockEvent1: Event, mockEvent2: Event;

beforeEach(async () => {
  await db.collection("events").deleteMany({});
  mockEvent1 = {
    name: "Test Event 1",
    host: "Test Host 1",
    type: "WORKSHOPS",
    location: "Test Location",
    start_time: new Date(),
    end_time: new Date(),
    tags: ["developer", "beginner"],
  };
  mockEvent2 = {
    name: "Test Event 2",
    host: "Test Host 1",
    type: "GENERAL",
    location: "Test Location",
    start_time: new Date(),
    end_time: new Date(),
    tags: ["designer", "pm"],
  };
});

describe("CREATE: events", () => {
  it("should create an event with valid details successfully", async () => {
    const { ok, body, error } = await CreateEvent(mockEvent1);
    expect(ok).toBe(true);
    expect(body).not.toBe(null);
    expect(body).toEqual(mockEvent1);
    expect(error).toBe(null);
  });

  it("should fail to create an event with no details", async () => {
    const { ok, body, error } = await CreateEvent({});
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("No Content Provided");
  });

  it("should fail to create an event with missing required fields", async () => {
    // missing name
    const tempEvent1 = { ...mockEvent1 };
    delete (tempEvent1 as any).name;

    // missing type
    const tempEvent2 = { ...mockEvent1 };
    delete (tempEvent2 as any).type;

    // missing start_time
    const tempEvent3 = { ...mockEvent1 };
    delete (tempEvent3 as any).start_time;

    for (const event of [tempEvent1, tempEvent2, tempEvent3]) {
      const res = await CreateEvent(event);
      expect(res.ok).toBe(false);
      expect(res.body).toBe(null);
      expect(res.error).not.toBe(null);
      expect(res.error).toBe("Document failed validation");
    }
  });

  it("should fail to create an event with invalid field values for type and tags", async () => {
    const tempEvent1 = { ...mockEvent1 } as any;
    tempEvent1.type = "INVALID_TYPE";

    const tempEvent2 = { ...mockEvent1 } as any;
    tempEvent2.tags = ["INVALID_TAG"];

    for (const event of [tempEvent1, tempEvent2]) {
      const { ok, body, error } = await CreateEvent(event);
      expect(ok).toBe(false);
      expect(body).toBe(null);
      expect(error).toBe("Document failed validation");
    }
  });

  it("should create an event with missing optional field host", async () => {
    const tempEvent = { ...mockEvent2 };
    delete (tempEvent as Event).host;

    const res = await CreateEvent(tempEvent);
    expect(res.ok).toBe(true);
    const insertedEvent = res.body as Event;
    delete insertedEvent._id;
    expect(res.body).toStrictEqual(insertedEvent);
    expect(res.error).toBe(null);
  });

  it("should create an event with missing optional field location", async () => {
    const tempEvent = { ...mockEvent2 };
    delete (tempEvent as Event).location;

    const res = await CreateEvent(tempEvent);
    expect(res.ok).toBe(true);
    const insertedEvent = res.body as Event;
    delete insertedEvent._id;
    expect(res.body).toStrictEqual(insertedEvent);
    expect(res.error).toBe(null);
  });

  it("should create an event with missing optional field end_time", async () => {
    const tempEvent = { ...mockEvent2 };
    delete (tempEvent as Event).end_time;

    const res = await CreateEvent(tempEvent);
    expect(res.ok).toBe(true);
    const insertedEvent = res.body as Event;
    delete insertedEvent._id;
    expect(res.body).toStrictEqual(insertedEvent);
    expect(res.error).toBe(null);
  });

  it("should create an event with missing optional field tags", async () => {
    const tempEvent = { ...mockEvent2 };
    delete (tempEvent as Event).tags;

    const res = await CreateEvent(tempEvent);
    expect(res.ok).toBe(true);
    const insertedEvent = res.body as Event;
    delete insertedEvent._id;
    expect(res.body).toStrictEqual(insertedEvent);
    expect(res.error).toBe(null);
  });

  it("should fail to create an event with end_time before start_time", async () => {
    const tempEvent = { ...mockEvent1 };
    tempEvent.start_time = new Date(2000, 2, 1, 0, 0, 0, 0);
    tempEvent.end_time = new Date(2000, 1, 1, 0, 0, 0, 0);

    const { ok, body, error } = await CreateEvent(tempEvent);
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe(
      "Failed to create event: end_time must be after start_time",
    );
  });

  it("should fail to create an event with duplicate name", async () => {
    const { ok, body, error } = await CreateEvent(mockEvent1);
    expect(ok).toBe(true);
    expect(body).toEqual(mockEvent1);
    expect(error).toBe(null);

    const duplicate = await CreateEvent(mockEvent1);
    expect(duplicate.ok).toBe(false);
    expect(duplicate.body).toBe(null);
    expect(duplicate.error).toBe("Duplicate: event already exists.");
  });

  it("should fail to create an event with duplicate tags", async () => {
    const tempEvent = { ...mockEvent1 };
    tempEvent.tags = ["pm", "pm"];

    const { ok, body, error } = await CreateEvent(tempEvent);
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("Document failed validation");
  });
});

describe("READ: events", () => {
  it("should retrieve no events from an empty database", async () => {
    const { ok, body, error } = await GetEvents({});
    expect(ok).toBe(true);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(0);
    expect(error).toBe(null);
  });

  it("should retrieve all events", async () => {
    await CreateEvent(mockEvent1);
    await CreateEvent(mockEvent2);

    const { ok, body, error } = await GetEvents({});
    expect(ok).toBe(true);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(error).toBe(null);
  });

  it("should retrieve an event by valid event ID", async () => {
    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { ok, body, error } = await GetEvent(insertedEvent._id.toString());
    expect(ok).toBe(true);
    expect(body).toStrictEqual(insertedEvent);
    expect(error).toBe(null);
  });

  it("should fail to retrieve an event with a non-existent event ID", async () => {
    const { ok, body, error } = await GetEvent("123412341234123412341234");
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("Event with id: 123412341234123412341234 not found.");
  });

  it("should fail to retrieve an event with a malformed event ID", async () => {
    const { ok, body, error } = await GetEvent("1234");
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("hex string must be 24 characters");
  });
});

describe("UPDATE: events", () => {
  it("should fail to update an event with no changes", async () => {
    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { ok, error } = await UpdateEvent(insertedEvent._id.toString(), {});
    expect(ok).toBe(false);
    expect(error).toBe("No Content Provided");
  });

  it("should update an event by valid event ID", async () => {
    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { ok, error } = await UpdateEvent(insertedEvent._id.toString(), {
      $set: { name: "Updated Event Name" },
    });
    expect(ok).toBe(true);
    expect(error).toBe(null);
  });

  it("should fail to update an event with a non-existent event ID", async () => {
    const { ok, body, error } = await UpdateEvent("123412341234123412341234", {
      $set: { name: "Updated Event Name" },
    });
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe(
      "Could not update event with ID: '123412341234123412341234'. Event does not exist or ID is incorrect.",
    );
  });

  it("should fail to update an event with end_time before start_time", async () => {
    mockEvent1.start_time = new Date(2000, 2, 1, 0, 0, 0, 0);
    mockEvent1.end_time = new Date(2000, 2, 2, 0, 0, 0, 0);
    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { ok, body, error } = await UpdateEvent(
      insertedEvent._id.toString(),
      {
        $set: { end_time: new Date("2000-01-01T00:00:00Z") },
      },
    );
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe(
      "Failed to update event: end_time must be after start_time",
    );

    const {
      ok: getOk,
      body: event,
      error: getError,
    } = await GetEvent(insertedEvent._id.toString());
    expect(getOk).toBe(true);
    expect(event).toStrictEqual(insertedEvent);
    expect(getError).toBe(null);
  });

  it("should fail to update an event with a duplicate name", async () => {
    const { body: insertedEvent1 } = await CreateEvent(mockEvent1);
    if (!insertedEvent1._id) fail();
    const { body: insertedEvent2 } = await CreateEvent(mockEvent2);

    const { ok, body, error } = await UpdateEvent(
      insertedEvent1._id.toString(),
      {
        $set: { name: insertedEvent2.name },
      },
    );
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe(
      `Duplicate: event name ${insertedEvent2.name} already in use by another event.`,
    );
  });
});

describe("DELETE: events", () => {
  it("should delete an event by valid event ID", async () => {
    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { ok, body, error } = await DeleteEvent(insertedEvent._id.toString());
    expect(ok).toBe(true);
    expect(body).toBe("Event deleted.");
    expect(error).toBe(null);
  });

  it("should fail to delete an event with a non-existent event ID", async () => {
    const { ok, body, error } = await DeleteEvent("123412341234123412341234");
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe(
      "Could not delete event with ID: '123412341234123412341234'. Event does not exist or ID is incorrect.",
    );
  });

  it("should fail to delete an event with a malformed event ID", async () => {
    const { ok, body, error } = await DeleteEvent("1234");
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("hex string must be 24 characters");
  });

  it("should fail to delete an event that has already been deleted", async () => {
    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { ok, body, error } = await DeleteEvent(insertedEvent._id.toString());
    expect(ok).toBe(true);
    expect(body).toBe("Event deleted.");
    expect(error).toBe(null);

    const {
      ok: ok2,
      body: body2,
      error: error2,
    } = await DeleteEvent(insertedEvent._id.toString());
    expect(ok2).toBe(false);
    expect(body2).toBe(null);
    expect(error2).toBe(
      `Could not delete event with ID: '${insertedEvent._id.toString()}'. Event does not exist or ID is incorrect.`,
    );
  });
});

export { mockEvent1, mockEvent2 };
