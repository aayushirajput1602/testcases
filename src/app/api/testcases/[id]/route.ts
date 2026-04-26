import { NextResponse } from "next/server";
import { bootstrapSql, dbQuery } from "@/lib/db";

export const runtime = "nodejs";

function parseId(id: string) {
  const value = Number(id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbQuery(bootstrapSql);
    const params = await context.params;
    const id = parseId(params.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid id." }, { status: 400 });
    }

    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const authorName = String(body?.authorName ?? "").trim();
    const description = String(body?.description ?? "").trim();
    const data = body?.data ?? [];

    if (!name) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 }
      );
    }

    const result = await dbQuery(
      `UPDATE test_cases
       SET name = $1,
           author_name = $2,
           description = $3,
           data = $4::jsonb,
           updated_at = NOW()
         WHERE id = $5
         RETURNING id, name, author_name, description, file_name, data, created_at, updated_at`,
        [name, authorName || null, description, JSON.stringify(data), id]
    );

    if (!result.rows.length) {
      return NextResponse.json(
        { message: "Test case not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to update test case.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbQuery(bootstrapSql);
    const params = await context.params;
    const id = parseId(params.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid id." }, { status: 400 });
    }

    const result = await dbQuery("DELETE FROM test_cases WHERE id = $1 RETURNING id", [
      id,
    ]);

    if (!result.rows.length) {
      return NextResponse.json(
        { message: "Test case not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully." });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to delete test case.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
