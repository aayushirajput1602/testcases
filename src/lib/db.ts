import { Pool, QueryResultRow } from "pg";

let pool: Pool | null = null;

function emptyQueryResult<T extends QueryResultRow = QueryResultRow>() {
  return {
    command: "",
    rowCount: 0,
    oid: 0,
    rows: [] as T[],
    fields: [],
  };
}

function isIgnorableBootstrapError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const maybePgError = error as {
    code?: string;
    message?: string;
  };

  // Some hosted databases disallow CREATE/ALTER in runtime connections.
  // In that case, keep serving requests if schema already exists.
  if (maybePgError.code === "42501") return true;
  return /permission denied|must be owner|not permitted/i.test(
    maybePgError.message ?? ""
  );
}

function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DATABASE_URL is not set in production environment.");
    }

    pool = new Pool({
      connectionString: "postgresql://postgres:postgres@localhost:5432/testcases",
    });
    return pool;
  }

  const sslRequiredByUrl = /sslmode=require/i.test(connectionString);
  const sslRequiredByEnv = process.env.PGSSLMODE === "require";
  const shouldUseSsl =
    sslRequiredByUrl || sslRequiredByEnv || process.env.NODE_ENV === "production";

  pool = new Pool({
    connectionString,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
  });
  return pool;
}

export async function dbQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
) {
  const activePool = getPool();
  try {
    return await activePool.query<T>(text, params);
  } catch (error) {
    if (text === bootstrapSql && isIgnorableBootstrapError(error)) {
      return emptyQueryResult<T>();
    }
    throw error;
  }
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
