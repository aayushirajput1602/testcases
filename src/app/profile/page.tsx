"use client";

import { FormEvent, useEffect, useState } from "react";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("/api/profile", { method: "GET" });
      const body = await response.json();

      if (response.ok && body?.profile) {
        setFullName(body.profile.full_name ?? "");
        setEmail(body.profile.email ?? "");
      } else {
        setMessage(body?.message ?? "Unable to fetch profile.");
      }

      setFetching(false);
    };

    fetchProfile();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email }),
    });

    const body = await response.json();

    if (!response.ok) {
      setMessage(body?.message ?? "Unable to update profile.");
    } else {
      setMessage(body?.message ?? "Profile updated successfully.");
      if (body?.profile?.email) {
        setEmail(body.profile.email);
      }
    }

    setLoading(false);
  };

  if (fetching) {
    return (
      <section className="mx-auto max-w-lg">
        <div className="card p-6">
          <p className="text-sm opacity-85">Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="mt-2 text-sm opacity-85">
          Update your account details saved in the backend.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {message ? <p className="mt-3 text-sm text-primary">{message}</p> : null}
      </div>
    </section>
  );
}
