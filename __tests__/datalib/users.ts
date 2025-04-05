import { db } from '../../jest.setup';
import { CreateUser } from '@datalib/users/createUser';
import { GetUser, GetManyUsers } from '@datalib/users/getUser';
import { UpdateUser } from '@datalib/users/updateUser';
import { DeleteUser } from '@datalib/users/deleteUser';
import User from '@typeDefs/user';
import tracks from '@apidata/tracks.json';

let mockAdmin: User, mockJudge: User, mockHacker: User;

beforeEach(async () => {
  await db.collection('users').deleteMany({});
  mockAdmin = {
    name: 'Admin',
    email: 'admin@smith.com',
    password: 'test_admin_password',
    role: 'admin',
    has_checked_in: true,
  };
  mockJudge = {
    name: 'Judge Smith',
    email: 'judge@smith.com',
    password: 'test_judge_password',
    role: 'judge',
    specialties: [...new Set(tracks.map((track) => track.type))],
    has_checked_in: false,
  };
  mockHacker = {
    name: 'Hacker Lee',
    email: 'hacker@lee.com',
    password: 'test_hacker_password',
    role: 'hacker',
    position: 'developer',
    is_beginner: false,
    has_checked_in: true,
  };
});

describe('CREATE: users', () => {
  it('should fail to create a user with no details', async () => {
    const { ok, body, error } = await CreateUser({});
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe('No Content Provided');
  });

  it('should throw an error when required fields are missing', async () => {
    // missing name
    const tempUser1 = { ...mockAdmin };
    delete (tempUser1 as any).name;

    // missing email
    const tempUser2 = { ...mockAdmin };
    delete (tempUser2 as any).email;

    // missing password
    const tempUser3 = { ...mockAdmin };
    delete (tempUser3 as any).password;

    // missing role
    const tempUser4 = { ...mockAdmin };
    delete (tempUser4 as any).role;

    // missing has_checked_in
    const tempUser5 = { ...mockAdmin };
    delete (tempUser5 as any).has_checked_in;

    for (const user of [
      tempUser1,
      tempUser2,
      tempUser3,
      tempUser4,
      tempUser5,
    ]) {
      const res = await CreateUser(user);
      expect(res.ok).toBe(false);
      expect(res.body).toBe(null);
      expect(res.error).not.toBe(null);
      user !== tempUser3
        ? expect(res.error).toBe('Document failed validation')
        : expect(res.error).toBe('Missing password');
    }
  });

  it('should create an admin user successfully', async () => {
    const { ok, body, error } = await CreateUser(mockAdmin);
    expect(ok).toBe(true);
    expect(body).not.toBe(null);
    expect(body).toEqual(mockAdmin);
    expect(error).toBe(null);
  });

  it('should hash the password', async () => {
    const { ok, body, error } = await CreateUser({ ...mockAdmin });
    expect(ok).toBe(true);
    expect(body).not.toBe(null);
    expect(body.password).not.toBe(mockAdmin.password);
    expect(error).toBe(null);
  });

  it('should create a judge user successfully', async () => {
    const { ok, body, error } = await CreateUser(mockJudge);
    expect(error).toBe(null);
    expect(ok).toBe(true);
    expect(body).not.toBe(null);
    expect(body).toEqual(mockJudge);
  });

  it('should create a hacker user successfully', async () => {
    const { ok, body, error } = await CreateUser(mockHacker);
    expect(error).toBe(null);
    expect(ok).toBe(true);
    expect(body).not.toBe(null);
    expect(body).toEqual(mockHacker);
  });

  it('should throw error when a second admin is added', async () => {
    const { ok, body, error } = await CreateUser(mockAdmin);
    expect(error).toBe(null);
    expect(ok).toBe(true);
    expect(body).not.toBe(null);
    expect(body).toEqual(mockAdmin);

    const mockAdmin2 = { ...mockAdmin };
    mockAdmin2.email = 'admin2@smith.com';
    const {
      ok: ok2,
      body: body2,
      error: error2,
    } = await CreateUser(mockAdmin2);
    expect(ok2).toBe(false);
    expect(body2).toBe(null);
    expect(error2).toBe('Duplicate: admin already exists');
  });

  it('should fail to create a user with duplicate email', async () => {
    const { ok, body, error } = await CreateUser(mockAdmin);
    expect(error).toBe(null);
    expect(ok).toBe(true);
    expect(body).not.toBe(null);
    expect(body).toEqual(mockAdmin);

    const { ok: ok2, body: body2, error: error2 } = await CreateUser(mockAdmin);
    expect(ok2).toBe(false);
    expect(body2).toBe(null);
    expect(error2).toBe('Duplicate: user already exists.');
  });

  it('should fail to create a judge user missing specialties', async () => {
    const tempJudge = { ...mockJudge };
    delete (tempJudge as any).specialties;

    const { ok, body, error } = await CreateUser(tempJudge);
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe(
      'Judge user is missing specialties or has has_checked_in set to true'
    );
  });

  it('should fail to create a hacker user missing position', async () => {
    const tempHacker = { ...mockHacker };
    delete (tempHacker as any).position;
    const { ok, body, error } = await CreateUser(tempHacker);
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe('Hacker user is missing position or is_beginner');
  });

  it('should fail to create a hacker user missing is_beginner', async () => {
    const tempHacker = { ...mockHacker };
    delete (tempHacker as any).is_beginner;
    const { ok, body, error } = await CreateUser(tempHacker);
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe('Hacker user is missing position or is_beginner');
  });

  it('should fail to create a judge user with has_checked_in = true', async () => {
    const tempJudge = { ...mockJudge };
    tempJudge.has_checked_in = true;
    const { ok, body, error } = await CreateUser(tempJudge);
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe(
      'Judge user is missing specialties or has has_checked_in set to true'
    );
  });

  it('should not allow invalid roles', async () => {
    const tempUser = { ...mockAdmin };
    tempUser.role = 'foo';
    const { ok, body, error } = await CreateUser(tempUser);
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe('Document failed validation');
  });

  it('should fail to create a judge user with duplication in specialties', async () => {
    const tempUser = { ...mockJudge };
    tempUser.specialties = ['tech', 'tech', 'design'];
    const { ok, body, error } = await CreateUser(tempUser);
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe('Document failed validation');
  });
});

describe('READ: users', () => {
  it('should retrieve no users from an empty database', async () => {
    const { ok, body, error } = await GetManyUsers({});
    expect(ok).toBe(true);
    expect(body).toEqual([]);
    expect(error).toBe(null);
  });

  it('should retrieve all users', async () => {
    await CreateUser(mockAdmin);
    await CreateUser(mockHacker);
    await CreateUser(mockJudge);

    const { ok, body, error } = await GetManyUsers({});
    expect(ok).toBe(true);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(3);
    expect(error).toBe(null);
  });

  it('should retrieve a user by valid user ID', async () => {
    const { body: insertedUser } = await CreateUser(mockAdmin);
    if (!insertedUser._id) fail();

    const { ok, body, error } = await GetUser(insertedUser._id?.toString());
    expect(ok).toBe(true);
    expect(body).toEqual(mockAdmin);
    expect(error).toBe(null);
  });

  it('should fail to retrieve a user by non-existent user ID', async () => {
    const { ok, body, error } = await GetUser('123412341234123412341234');
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe('user with id: 123412341234123412341234 not found.');
  });

  it('should successfully filter by judge role', async () => {
    await CreateUser(mockAdmin);
    await CreateUser(mockHacker);
    await CreateUser(mockJudge);

    const { ok, body, error } = await GetManyUsers({ role: 'judge' });
    expect(ok).toBe(true);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(1);
    expect(error).toBe(null);
  });

  it('should successfully filter by hacker role', async () => {
    await CreateUser(mockAdmin);
    await CreateUser(mockHacker);
    await CreateUser(mockJudge);

    const { ok, body, error } = await GetManyUsers({ role: 'hacker' });
    expect(ok).toBe(true);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(1);
    expect(error).toBe(null);
  });

  it('should successfully filter by has_checked_in', async () => {
    await CreateUser(mockAdmin);
    await CreateUser(mockHacker);
    await CreateUser(mockJudge);

    const { ok, body, error } = await GetManyUsers({ has_checked_in: true });
    expect(ok).toBe(true);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(error).toBe(null);
  });

  it('should return an empty array when no users match the query', async () => {
    await CreateUser(mockAdmin);
    await CreateUser(mockHacker);
    await CreateUser(mockJudge);

    const { ok, body, error } = await GetManyUsers({ is_beginner: true });
    expect(ok).toBe(true);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(0);
    expect(error).toBe(null);
  });
});

describe('UPDATE: users', () => {
  it('should fail to update a user with no changes', async () => {
    const { body: insertedUser } = await CreateUser(mockAdmin);
    if (!insertedUser._id) fail();

    const { ok, error } = await UpdateUser(insertedUser._id.toString(), {});
    expect(ok).toBe(false);
    expect(error).toBe('No Content Provided');
  });

  it('should successfully update an existing user', async () => {
    const { body: insertedUser } = await CreateUser(mockJudge);
    if (!insertedUser._id) fail();

    const { ok, error } = await UpdateUser(insertedUser._id.toString(), {
      $set: { has_checked_in: true },
    });
    expect(ok).toBe(true);
    expect(error).toBe(null);
  });

  it('should fail to udpate a user with invalid user ID', async () => {
    const { ok, error } = await UpdateUser('123412341234123412341234', {
      $set: { has_checked_in: true },
    });
    expect(ok).toBe(false);
    expect(error).toBe('user with id: 123412341234123412341234 not found.');
  });

  it('should fail to update a user with a duplicate email', async () => {
    const { body: insertedUser1 } = await CreateUser(mockHacker);
    if (!insertedUser1._id) fail();
    const { body: insertedUser2 } = await CreateUser(mockJudge);

    const { ok, body, error } = await UpdateUser(insertedUser1._id.toString(), {
      $set: { email: insertedUser2.email },
    });
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe(
      `Duplicate: user email ${insertedUser2.email} already in use by another user.`
    );
  });

  it('should fail to update a user role to admin if an admin already exists', async () => {
    await CreateUser(mockAdmin);
    const { body: insertedUser1 } = await CreateUser(mockHacker);
    if (!insertedUser1._id) fail();

    const { ok, body, error } = await UpdateUser(insertedUser1._id.toString(), {
      $set: { role: 'admin' },
    });
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe(`Duplicate: Only one admin is allowed.`);
  });

  // TODO: brandon, please move the hashing from resetPassword to updateUser and then uncomment this test ty
  //   it('should hash the new password', async () => {
  //     const { body: insertedUser } = await CreateUser(mockHacker);
  //     if (!insertedUser._id) fail();

  //     const { ok, error } = await UpdateUser(insertedUser._id.toString(), {
  //       $set: { password: 'newPassword' },
  //     });
  //     expect(ok).toBe(true);
  //     expect(error).toBe(null);

  //     const { body: updatedUser } = await GetUser(insertedUser._id.toString());
  //     expect(updatedUser.password).not.toBe(insertedUser.password);
  //     expect(updatedUser.password).not.toBe('newPassword');
  //   });
});

describe('DELETE: users', () => {
  it('should successfully delete a user by valid user ID', async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { ok, body, error } = await DeleteUser(insertedUser._id.toString());
    expect(ok).toBe(true);
    expect(body).toBe('user deleted');
    expect(error).toBe(null);
  });

  it('should fail to delete a user with a invalid user ID', async () => {
    const { ok, body, error } = await DeleteUser('123412341234123412341234');
    expect(ok).toBe(false);
    expect(body).toBe(null);
    expect(error).toBe('user with id: 123412341234123412341234 not found.');
  });

  it('should fail to delete a user that has already been deleted', async () => {
    const { body: insertedUser } = await CreateUser(mockHacker);
    if (!insertedUser._id) fail();

    const { ok, body, error } = await DeleteUser(insertedUser._id.toString());
    expect(ok).toBe(true);
    expect(body).toBe('user deleted');
    expect(error).toBe(null);

    const {
      ok: ok2,
      body: body2,
      error: error2,
    } = await DeleteUser(insertedUser._id.toString());
    expect(ok2).toBe(false);
    expect(body2).toBe(null);
    expect(error2).toBe(
      `user with id: ${insertedUser._id.toString()} not found.`
    );
  });
});

export { mockHacker, mockJudge, mockAdmin };
