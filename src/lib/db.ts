import { Pool, QueryResultRow } from "pg";

let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;

  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/testcases";

  pool = new Pool({ connectionString });
  return pool;
}

export async function dbQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
) {
  const activePool = getPool();
  return activePool.query<T>(text, params);
}

export const bootstrapSql = `
  CREATE TABLE IF NOT EXISTS test_cases (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    author_name TEXT,
    description TEXT,
    file_name TEXT,
    data JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  ALTER TABLE test_cases
  ADD COLUMN IF NOT EXISTS author_name TEXT;

  CREATE UNIQUE INDEX IF NOT EXISTS ux_test_cases_file_name
  ON test_cases(file_name);

  CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    test_case_id INTEGER NOT NULL UNIQUE REFERENCES test_cases(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS app_users (
    id SERIAL PRIMARY KEY,
    full_name TEXT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
  );
`;
