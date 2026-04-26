import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { bootstrapSql, dbQuery } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await dbQuery(bootstrapSql);

    const cookieStore = await cookies();
    const decodedEmail = cookieStore.get("tcm_user_email")?.value ?? "";

    if (!decodedEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await dbQuery<{
      full_name: string | null;
      email: string;
    }>(
      `SELECT full_name, email FROM app_users WHERE email = $1 LIMIT 1`,
      [decodedEmail]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: result.rows[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to fetch profile.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbQuery(bootstrapSql);

    const cookieStore = await cookies();
    const currentEmail = cookieStore.get("tcm_user_email")?.value ?? "";

    if (!currentEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const fullName = String(body?.fullName ?? "").trim();
    const nextEmail = String(body?.email ?? "")
      .trim()
      .toLowerCase();

    if (!nextEmail) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const updated = await dbQuery<{
      full_name: string | null;
      email: string;
    }>(
      `UPDATE app_users
       SET full_name = $1,
           email = $2,
           updated_at = NOW()
       WHERE email = $3
       RETURNING full_name, email`,
      [fullName || null, nextEmail, currentEmail]
    );

    if (!updated.rows[0]) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json(
      {
        message: "Profile updated successfully.",
        profile: updated.rows[0],
      },
      { status: 200 }
    );

    response.cookies.set("tcm_user_email", updated.rows[0].email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to update profile.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
