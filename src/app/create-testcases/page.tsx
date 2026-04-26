"use client";

import { FormEvent, useEffect, useState } from "react";

type TestCase = {
  id: number;
  name: string;
  author_name?: string | null;
  description: string;
  data: unknown;
};

export default function CreateTestCasesPage() {
  const [items, setItems] = useState<TestCase[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [description, setDescription] = useState("");
  const [jsonData, setJsonData] = useState("[]");
  const [message, setMessage] = useState("");

  const loadItems = async () => {
    const response = await fetch("/api/testcases", { cache: "no-store" });
    const body = await response.json();
    setItems(Array.isArray(body) ? body : []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setId(null);
    setName("");
    setAuthorName("");
    setDescription("");
    setJsonData("[]");
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    let parsedData: unknown;
    try {
      parsedData = JSON.parse(jsonData);
    } catch {
      setMessage("Data must be valid JSON.");
      return;
    }

    const method = id ? "PUT" : "POST";
    const endpoint = id ? `/api/testcases/${id}` : "/api/testcases";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, authorName, description, data: parsedData }),
    });

    const body = await response.json();
    if (!response.ok) {
      setMessage(body?.message ?? "Request failed.");
      return;
    }

    setMessage(id ? "Updated successfully." : "Created successfully.");
    resetForm();
    await loadItems();
  };

  const onEdit = (item: TestCase) => {
    setId(item.id);
    setName(item.name);
    setAuthorName(item.author_name ?? "");
    setDescription(item.description ?? "");
    setJsonData(JSON.stringify(item.data ?? [], null, 2));
  };

  const onDelete = async (itemId: number) => {
    const response = await fetch(`/api/testcases/${itemId}`, {
      method: "DELETE",
    });
    const body = await response.json();
    setMessage(body?.message ?? "Deleted.");
    await loadItems();
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Manual Test Case Creation</h1>
        <p className="mt-2 text-sm opacity-85">
          Create, update, and delete test cases manually.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Test case name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Author name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <textarea
            placeholder="JSON data, e.g. [{ step: 1, expected: ok }]"
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            className="h-36 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              {id ? "Update" : "Create"}
            </button>
            {id && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {message && <p className="mt-3 text-sm text-primary">{message}</p>}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Existing Test Cases</h2>
        <div className="mt-3 space-y-2">
          {items.length === 0 && (
            <p className="rounded-md bg-muted px-3 py-2 text-sm">No data available.</p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                {item.author_name && (
                  <p className="text-xs opacity-70">Author: {item.author_name}</p>
                )}
                <p className="text-sm opacity-80">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="rounded-md border border-red-400 px-3 py-1.5 text-xs text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
