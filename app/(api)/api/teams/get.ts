import { NextRequest, NextResponse } from "next/server";

import getQueries from "@utils/request/getQueries";
import { GetManyTeams } from "@datalib/teams/getTeam";

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, "teams");
  const res = await GetManyTeams(queries);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
