import { NextRequest } from 'next/server';
import getQueries from '@utils/request/getQueries';
import { GetUserToEvent } from '@datalib/userToEvent/getUserToEvent'; // Adjust the import path as needed

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, 'userToEvent'); // Fetch query parameters for userToEvent
  return GetUserToEvent(queries); // Call the GetUserToEvent function with the queries
}
