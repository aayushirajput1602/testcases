import { NextResponse } from "next/server";
import { bootstrapSql, dbQuery } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbQuery(bootstrapSql);
    const result = await dbQuery(
      `SELECT id, name, author_name, description, file_name, data, created_at, updated_at
       FROM test_cases
       ORDER BY created_at DESC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to fetch test cases.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbQuery(bootstrapSql);
    const body = await request.json();
    const name = String(body?.name ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 }
      );
    }

    const authorName = String(body?.authorName ?? "").trim();
    const description = String(body?.description ?? "").trim();
    const fileName = String(body?.fileName ?? "").trim() || null;
    const data = body?.data ?? [];

    const result = await dbQuery(
      `INSERT INTO test_cases(name, author_name, description, file_name, data)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       RETURNING id, name, author_name, description, file_name, data, created_at, updated_at`,
      [name, authorName || null, description, fileName, JSON.stringify(data)]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to create test case.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
