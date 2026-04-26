import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";
import pg from "pg";

const { Pool } = pg;

const expectedFiles = [
  "Login_TestCases.xlsx",
  "Signup_TestCases.xlsx",
  "Cart_TestCases.xlsx",
  "Payment_TestCases.xlsx",
  "Search_TestCases.xlsx",
  "Profile_TestCases.xlsx",
  "Order_TestCases.xlsx",
  "Admin_TestCases.xlsx",
];

const expectedColumns = [
  "ID",
  "Module",
  "TestCase",
  "Step",
  "ExpectedResult",
  "ActualResult",
  "Status",
  "Priority",
  "Date",
];

const downloadsPath = "C:/Users/hp/Downloads";

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/testcases";

const pool = new Pool({ connectionString: databaseUrl });

function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
}

function normalizeRecord(record) {
  const entries = Object.entries(record).map(([key, value]) => [
    normalizeHeader(key),
    value,
  ]);
  const map = Object.fromEntries(entries);

  return {
    id_text: map.id?.toString().trim() || "",
    module: map.module?.toString().trim() || "",
    test_case: map.testcase?.toString().trim() || "",
    step: map.step?.toString().trim() || "",
    expected_result: map.expectedresult?.toString().trim() || "",
    actual_result: map.actualresult?.toString().trim() || "",
    status: map.status?.toString().trim() || "",
    priority: map.priority?.toString().trim() || "",
    date_text: map.date?.toString().trim() || "",
  };
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS imported_testcases (
        pk_id BIGSERIAL PRIMARY KEY,
        source_file TEXT NOT NULL,
        id_text TEXT,
        module TEXT,
        test_case TEXT,
        step TEXT,
        expected_result TEXT,
        actual_result TEXT,
        status TEXT,
        priority TEXT,
        date_text TEXT,
        imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query("DELETE FROM imported_testcases;");

    let insertedRows = 0;

    for (const file of expectedFiles) {
      const fullPath = path.join(downloadsPath, file);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found: ${fullPath}`);
      }

      const workbook = xlsx.readFile(fullPath);
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const jsonRows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

      if (!jsonRows.length) {
        continue;
      }

      const firstRowKeys = Object.keys(jsonRows[0]);
      const normalizedHeaders = firstRowKeys.map(normalizeHeader);
      const missing = expectedColumns
        .map(normalizeHeader)
        .filter((h) => !normalizedHeaders.includes(h));

      if (missing.length) {
        throw new Error(
          `Missing required columns in ${file}: ${missing.join(", ")}`
        );
      }

      for (const row of jsonRows) {
        const normalized = normalizeRecord(row);
        await client.query(
          `
          INSERT INTO imported_testcases(
            source_file,
            id_text,
            module,
            test_case,
            step,
            expected_result,
            actual_result,
            status,
            priority,
            date_text
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        `,
          [
            file,
            normalized.id_text,
            normalized.module,
            normalized.test_case,
            normalized.step,
            normalized.expected_result,
            normalized.actual_result,
            normalized.status,
            normalized.priority,
            normalized.date_text,
          ]
        );
        insertedRows += 1;
      }
    }

    await client.query("COMMIT");
    console.log(
      `Import successful. Inserted ${insertedRows} rows into imported_testcases.`
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Import failed:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
