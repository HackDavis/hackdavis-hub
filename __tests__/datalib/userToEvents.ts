import { db } from "../../jest.setup";
import { LinkUserToEvent } from "@datalib/userToEvents/linkUserToEvent";
import { GetUserToEvents } from "@datalib/userToEvents/getUserToEvent";
import { mockEvent1, mockEvent2 } from "./events";
import { mockAdmin, mockHacker, mockJudge } from "./users";
import { CreateUser } from "@datalib/users/createUser";
import { CreateEvent } from "@datalib/events/createEvent";
import { DeleteUserToEvent } from "@datalib/userToEvents/deleteUserToEvent";
import { prepareIdsInQuery } from "@utils/request/parseAndReplace";

beforeEach(async () => {
  await db.collection("userToEvents").deleteMany({});
  await db.collection("users").deleteMany({});
  await db.collection("events").deleteMany({});
});

describe("CREATE: userToEvents", () => {
  it("should successfully link a hacker user to an event", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { ok, body, error } = await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });
    expect(ok).toBe(true);
    expect(body.user_id.toString()).toBe(insertedUser._id.toString());
    expect(body.event_id.toString()).toBe(insertedEvent._id.toString());
    expect(error).toBe(null);
  });

  it("should fail to link a judge user to an event", async () => {
    const { body: insertedUser } = await CreateUser(mockJudge);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { ok, body, error } = await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("Unauthorized: only hackers can be linked to events.");
  });

  it("should fail to link an admin user to an event", async () => {
    const { body: insertedUser } = await CreateUser(mockAdmin);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { ok, body, error } = await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("Unauthorized: only hackers can be linked to events.");
  });

  it("should fail to link a user to a non-existent event", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { ok, body, error } = await LinkUserToEvent(
      await prepareIdsInQuery({
        user_id: insertedUser._id,
        event_id: "123412341234123412341234",
      }),
    );
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("event with id: 123412341234123412341234 not found.");
  });

  it("should fail to link a user to a non-existent user", async () => {
    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { ok, body, error } = await LinkUserToEvent(
      await prepareIdsInQuery({
        user_id: "123412341234123412341234",
        event_id: insertedEvent._id,
      }),
    );
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("user with id: 123412341234123412341234 not found.");
  });

  it("should be able to link multiple users to an event", async () => {
    const mockHacker2 = { ...mockHacker };
    mockHacker2.email = "test@test.com";

    const { body: insertedUser1 } = await CreateUser({ ...mockHacker });
    if (!insertedUser1._id) fail();

    const { body: insertedUser2 } = await CreateUser(mockHacker2);
    if (!insertedUser2._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    await LinkUserToEvent({
      user_id: insertedUser1._id,
      event_id: insertedEvent._id,
    });

    const { ok, error } = await LinkUserToEvent({
      user_id: insertedUser2._id,
      event_id: insertedEvent._id,
    });
    expect(ok).toBe(true);
    expect(error).toBe(null);
  });

  it("should be able to link multiple events to a user", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { body: insertedEvent1 } = await CreateEvent(mockEvent1);
    if (!insertedEvent1._id) fail();

    const { body: insertedEvent2 } = await CreateEvent(mockEvent2);
    if (!insertedEvent2._id) fail();

    await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent1._id,
    });

    const { ok, error } = await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent2._id,
    });
    expect(ok).toBe(true);
    expect(error).toBe(null);
  });
});

describe("READ: userToEvents", () => {
  it("should retrieve the right user-to-events by valid link ID", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { body: insertedLink } = await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });
    if (!insertedLink._id) fail();

    const { ok, body, error } = await GetUserToEvents({
      _id: insertedLink._id,
    });
    expect(ok).toBe(true);
    expect(body).not.toBe(null);
    expect(body[0].user_id.toString()).toBe(insertedUser._id.toString());
    expect(body[0].event_id.toString()).toBe(insertedEvent._id.toString());
    expect(error).toBe(null);
  });

  it("should retrieve the right user-to-events by valid user ID", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });

    const { ok, body, error } = await GetUserToEvents({
      user_id: insertedUser._id,
    });
    expect(ok).toBe(true);
    expect(body).not.toBe(null);
    expect(body[0].user_id.toString()).toBe(insertedUser._id.toString());
    expect(body[0].event_id.toString()).toBe(insertedEvent._id.toString());
    expect(error).toBe(null);
  });

  it("should retrieve the right user-to-events by valid event ID", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });

    const { ok, body, error } = await GetUserToEvents({
      event_id: insertedEvent._id,
    });
    expect(ok).toBe(true);
    expect(body).not.toBe(null);
    expect(body[0].user_id.toString()).toBe(insertedUser._id.toString());
    expect(body[0].event_id.toString()).toBe(insertedEvent._id.toString());
    expect(error).toBe(null);
  });

  it("should fail to retrieve a link with invalid user ID", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });

    const { ok, body, error } = await GetUserToEvents(
      await prepareIdsInQuery({
        user_id: "123412341234123412341234",
      }),
    );
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("No matching userToEvent found for the provided query.");
  });

  it("should fail to retrieve a link with invalid event ID", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });

    const { ok, body, error } = await GetUserToEvents(
      await prepareIdsInQuery({
        event_id: "123412341234123412341234",
      }),
    );
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("No matching userToEvent found for the provided query.");
  });

  it("should fail to retrieve a link with invalid link ID", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });

    const { ok, body, error } = await GetUserToEvents(
      await prepareIdsInQuery({
        _id: "123412341234123412341234",
      }),
    );
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("No matching userToEvent found for the provided query.");
  });
});

describe("DELETE: userToEvents", () => {
  it("should unlink a user from an event by valid user ID and event ID", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });

    const { ok, body, error } = await DeleteUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });
    expect(ok).toBe(true);
    expect(body).toBe("userToEvent deleted.");
    expect(error).toBe(null);
  });

  it("should fail to unlink a user with an invalid user ID", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });

    const { ok, body, error } = await DeleteUserToEvent(
      await prepareIdsInQuery({
        user_id: "123412341234123412341234",
        event_id: insertedEvent._id,
      }),
    );
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("No matching userToEvent found for the provided query.");
  });

  it("should fail to unlink a event with an invalid event ID", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });

    const { ok, body, error } = await DeleteUserToEvent(
      await prepareIdsInQuery({
        user_id: insertedUser._id,
        event_id: "123412341234123412341234",
      }),
    );
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("No matching userToEvent found for the provided query.");
  });

  it("should fail to unlink a user if they are not linked to the event", async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { body: insertedEvent } = await CreateEvent(mockEvent1);
    if (!insertedEvent._id) fail();

    const { body: insertedEventExtra } = await CreateEvent(mockEvent2);
    if (!insertedEventExtra._id) fail();

    await LinkUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEvent._id,
    });

    const { ok, body, error } = await DeleteUserToEvent({
      user_id: insertedUser._id,
      event_id: insertedEventExtra._id,
    });
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe("No matching userToEvent found for the provided query.");
  });
});

// describe('testing parse and replace', () => {
//   it('should parse and replace', async () => {
//     const body = {
//       user_id: {
//         '*convertId': {
//           id: '123412341234123412341234',
//         },
//       },
//     };
//     const parsed = await parseAndReplace(body);
//     expect(parsed.user_id).toBeInstanceOf(ObjectId);
//   });
// });
