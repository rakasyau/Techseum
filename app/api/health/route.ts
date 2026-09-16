import { NextResponse } from "next/server";
import { databaseIsReachable } from "@/lib/mongodb";
import { envHealth } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Deployment health check. Reports which dependencies are configured and
 * whether the database answers, without ever echoing a credential value.
 */
export async function GET() {
  const env = envHealth();
  const database = env.mongodb ? await databaseIsReachable() : false;
  const ok = env.mongodb && env.auth && database;

  return NextResponse.json(
    {
      ok,
      env,
      database,
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 }
  );
}
