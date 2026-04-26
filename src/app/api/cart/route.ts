import { NextResponse } from "next/server";
import { bootstrapSql, dbQuery } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbQuery(bootstrapSql);
    const result = await dbQuery(
      `SELECT ci.id,
              ci.test_case_id,
              ci.created_at,
              tc.name,
              tc.description,
              tc.file_name
       FROM cart_items ci
       INNER JOIN test_cases tc ON tc.id = ci.test_case_id
       ORDER BY ci.created_at DESC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to fetch cart items.",
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
    const testCaseId = Number(body?.testCaseId);

    if (!Number.isInteger(testCaseId) || testCaseId <= 0) {
      return NextResponse.json(
        { message: "Valid testCaseId is required." },
        { status: 400 }
      );
    }

    const result = await dbQuery(
      `INSERT INTO cart_items(test_case_id)
       VALUES ($1)
       ON CONFLICT (test_case_id) DO NOTHING
       RETURNING id, test_case_id, created_at`,
      [testCaseId]
    );

    if (!result.rows.length) {
      return NextResponse.json(
        { message: "Test case is already in cart." },
        { status: 200 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to add to cart.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await dbQuery(bootstrapSql);
    await dbQuery("DELETE FROM cart_items");
    return NextResponse.json({ message: "Cart cleared." });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to clear cart.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
