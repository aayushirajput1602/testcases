"use client";

import { useEffect, useState } from "react";

type TestCase = {
  id: number;
  name: string;
  description: string;
  file_name: string | null;
  data: unknown;
  created_at: string;
};

const tableColumns = [
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

function asRows(data: unknown): Record<string, unknown>[] {
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

export default function ViewTestCasesPage() {
  const [items, setItems] = useState<TestCase[]>([]);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      const response = await fetch("/api/testcases", { cache: "no-store" });
      const body = await response.json();

      if (!response.ok) {
        setError(body?.message ?? "Unable to load test cases.");
        return;
      }

      setItems(Array.isArray(body) ? body : []);
    };

    loadItems();
  }, []);

  return (
    <section className="space-y-4">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">View Test Cases</h1>
        <p className="mt-2 text-sm opacity-85">
          Browse Excel files. Click Open to view only the selected file data.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="card p-4">
        <h2 className="text-base font-semibold">Excel Test Case Files</h2>
        <div className="mt-3 space-y-2">
          {items.length === 0 && (
            <p className="rounded-md bg-muted px-3 py-2 text-sm">No test cases found.</p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
            >
              <div className="flex items-center gap-2 text-sm">
                <span aria-hidden="true">📁</span>
                <span className="font-medium">{item.file_name ?? item.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(item.id)}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Open
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {items.length === 0 && (
          <p className="card p-4 text-sm">No test cases found.</p>
        )}

        {items
          .filter((item) => item.id === selectedId)
          .map((item) => (
          <article key={item.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <span className="rounded bg-muted px-2 py-1 text-xs">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>

            <p className="mt-1 text-sm opacity-85">{item.description}</p>
            <p className="mt-1 text-xs opacity-70">
              Source file: {item.file_name ?? "Manual entry"}
            </p>

            <p className="mt-1 text-xs opacity-70">
              Total rows: {asRows(item.data).length}
            </p>

            <div className="mt-3 overflow-x-auto rounded-md border border-border bg-muted/40 p-3">
              <table className="min-w-full border-collapse text-left text-xs">
                <thead>
                  <tr>
                    {tableColumns.map((column) => (
                      <th
                        key={column}
                        className="border-b border-border px-2 py-1.5 font-semibold"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {asRows(item.data).map((row, index) => (
                    <tr key={index} className="align-top">
                      {tableColumns.map((column) => (
                        <td key={column} className="border-b border-border/60 px-2 py-1.5">
                          {String(row?.[column] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}

        {items.length > 0 && selectedId === null && (
          <p className="card p-4 text-sm">Select Open on a file to view its data.</p>
        )}
      </div>
    </section>
  );
}
