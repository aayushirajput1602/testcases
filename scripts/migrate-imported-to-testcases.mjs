import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/testcases",
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_cases (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        file_name TEXT,
        data JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`DROP INDEX IF EXISTS ux_test_cases_file_name;`);
    await client.query(`
      CREATE UNIQUE INDEX ux_test_cases_file_name
      ON test_cases(file_name);
    `);

    await client.query(`
      INSERT INTO test_cases(name, description, file_name, data)
      SELECT
        regexp_replace(source_file, '\\.[^.]+$', '') AS name,
        'Imported from ' || source_file AS description,
        source_file AS file_name,
        jsonb_agg(
          jsonb_build_object(
            'ID', id_text,
            'Module', module,
            'TestCase', test_case,
            'Step', step,
            'ExpectedResult', expected_result,
            'ActualResult', actual_result,
            'Status', status,
            'Priority', priority,
            'Date', date_text
          )
          ORDER BY pk_id
        ) AS data
      FROM imported_testcases
      GROUP BY source_file
      ON CONFLICT (file_name) DO UPDATE
      SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        data = EXCLUDED.data,
        updated_at = NOW();
    `);

    const result = await client.query(`
      SELECT file_name, jsonb_array_length(data) AS row_count
      FROM test_cases
      WHERE file_name IS NOT NULL
      ORDER BY file_name;
    `);

    console.table(result.rows);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
