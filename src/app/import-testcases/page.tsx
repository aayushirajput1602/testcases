"use client";

import { FormEvent, useState } from "react";

export default function ImportTestCasesPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!files?.length) {
      setMessage("Please select at least one file.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    const response = await fetch("/api/import", {
      method: "POST",
      body: formData,
    });

    const body = await response.json();
    if (!response.ok) {
      setMessage(body?.message ?? "Import failed.");
    } else {
      setMessage(`${body?.count ?? 0} file(s) imported successfully.`);
    }

    setLoading(false);
  };

  return (
    <section className="space-y-4">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Manual Import of Test Cases</h1>
        <p className="mt-2 text-sm opacity-85">
          Upload .xlsx/.xls files. Each Excel file is saved as one test case.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full rounded-md border border-border bg-background p-2 text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Importing..." : "Import Files"}
          </button>
        </form>

        {message && <p className="mt-3 text-sm text-primary">{message}</p>}
      </div>
    </section>
  );
}
