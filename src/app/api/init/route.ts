import { NextResponse } from "next/server";
import { bootstrapSql, dbQuery } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbQuery(bootstrapSql);
    return NextResponse.json({ message: "Database initialized successfully." });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to initialize database.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
