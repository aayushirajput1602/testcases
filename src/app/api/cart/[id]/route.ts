import { NextResponse } from "next/server";
import { bootstrapSql, dbQuery } from "@/lib/db";

export const runtime = "nodejs";

function parseId(id: string) {
  const value = Number(id);
  return Number.isInteger(value) && value > 0 ? value : null;
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

    const result = await dbQuery("DELETE FROM cart_items WHERE id = $1 RETURNING id", [
      id,
    ]);

    if (!result.rows.length) {
      return NextResponse.json(
        { message: "Cart item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Removed from cart." });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to remove item.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
