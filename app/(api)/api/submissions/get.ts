import { NextRequest, NextResponse } from "next/server";

import getQueries from "@utils/request/getQueries";
import { GetManySubmissions } from "@datalib/submissions/getSubmissions";

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, "submissions");
  const res = await GetManySubmissions(queries);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
