"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = storedTheme ? storedTheme === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", initialDark);
    setDark(initialDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-md border-2 border-white/80 bg-[#ecfff5] px-3 py-2 text-sm font-bold text-black shadow-md transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      style={{ color: "#000000" }}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      {mounted ? (dark ? "🌙" : "☀️") : "☀️"}
    </button>
  );
}
