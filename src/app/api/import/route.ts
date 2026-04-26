import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { bootstrapSql, dbQuery } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await dbQuery(bootstrapSql);
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        { message: "Please upload at least one Excel file." },
        { status: 400 }
      );
    }

    const inserted = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const firstSheet = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheet];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const rawName = file.name.replace(/\.[^/.]+$/, "");
      const name = rawName || "Imported Test Case";

      const result = await dbQuery(
        `INSERT INTO test_cases(name, description, file_name, data)
         VALUES ($1, $2, $3, $4::jsonb)
         ON CONFLICT (file_name)
         DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           data = EXCLUDED.data,
           updated_at = NOW()
         RETURNING id, name, description, file_name, data, created_at, updated_at`,
        [
          name,
          `Imported from ${file.name}`,
          file.name,
          JSON.stringify(rows),
        ]
      );

      inserted.push(result.rows[0]);
    }

    return NextResponse.json({
      message: "Files imported successfully.",
      count: inserted.length,
      records: inserted,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to import files.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
