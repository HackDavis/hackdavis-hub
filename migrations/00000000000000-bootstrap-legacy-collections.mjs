import { up as createEvents } from './create-events.mjs';
import { up as createSubmissions } from './create-submissions.mjs';
import { up as createTeams } from './create-teams.mjs';
import { up as createUserToEvents } from './create-userToEvents.mjs';
import { up as createUsers } from './create-users.mjs';

export async function up(db) {
  await createUsers(db);
  await createEvents(db);
  await createSubmissions(db);
  await createTeams(db);
  await createUserToEvents(db);
}

export async function down() {}
