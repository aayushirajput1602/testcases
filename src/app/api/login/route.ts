import { randomBytes, scryptSync } from "node:crypto";
import { NextResponse } from "next/server";
import { bootstrapSql, dbQuery } from "@/lib/db";

export const runtime = "nodejs";

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export async function POST(request: Request) {
  try {
    await dbQuery(bootstrapSql);
    const body = await request.json();

    const fullName = String(body?.fullName ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);

    const result = await dbQuery(
      `INSERT INTO app_users(full_name, email, password_hash, last_login_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (email)
       DO UPDATE SET
         full_name = EXCLUDED.full_name,
         password_hash = EXCLUDED.password_hash,
         last_login_at = NOW(),
         updated_at = NOW()
       RETURNING id, full_name, email, created_at, updated_at, last_login_at`,
      [fullName || null, email, passwordHash]
    );

    const response = NextResponse.json(
      {
        message: "User details saved successfully.",
        user: result.rows[0],
      },
      { status: 201 }
    );

    response.cookies.set("tcm_session", randomBytes(24).toString("hex"), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set("tcm_user_email", email, {
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
        message: "Unable to save user details.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
