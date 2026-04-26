"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const body = await response.json();
    if (!response.ok) {
      const errorDetails = body?.error ? ` (${body.error})` : "";
      setMessage((body?.message ?? "Unable to save user details.") + errorDetails);
    } else {
      setMessage(body?.message ?? "Saved successfully.");
      router.push("/dashboard");
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <section className="relative -mx-4 overflow-hidden px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="live-bubbles" aria-hidden>
        <span className="live-bubble bubble-1" />
        <span className="live-bubble bubble-3" />
        <span className="live-bubble bubble-5" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(187,247,208,0.52)_0,transparent_45%),radial-gradient(circle_at_85%_75%,rgba(167,243,208,0.52)_0,transparent_40%)] dark:bg-[radial-gradient(circle_at_15%_25%,rgba(34,84,56,0.58)_0,transparent_45%),radial-gradient(circle_at_85%_75%,rgba(24,58,40,0.58)_0,transparent_40%)]" />

      <div className="card relative mx-auto max-w-md p-6 shadow-lg backdrop-blur-sm">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-2 text-sm opacity-85">
          Enter user details. They will be stored in PostgreSQL.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm transition focus:border-primary focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm transition focus:border-primary focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm transition focus:border-primary focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Login"}
          </button>
        </form>

        {message && <p className="mt-3 text-sm text-primary">{message}</p>}
      </div>
    </section>
  );
}
