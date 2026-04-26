import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await dbQuery<{ now: string }>("SELECT NOW()::text AS now");
    return NextResponse.json(
      {
        status: "ok",
        database: "connected",
        timestamp: result.rows[0]?.now ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
