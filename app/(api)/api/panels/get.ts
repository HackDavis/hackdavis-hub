import { NextResponse, NextRequest } from "next/server";
import getQueries from "@utils/request/getQueries";
import { GetManyPanels } from "@datalib/panels/getPanels";

export async function GET(request: NextRequest) {
  const queries = await getQueries(request, "panels");
  const res = await GetManyPanels(queries);
  return NextResponse.json({ ...res }, { status: res.ok ? 200 : 500 });
}
