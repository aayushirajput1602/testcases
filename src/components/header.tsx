import Link from "next/link";
import { cookies } from "next/headers";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("tcm_session");
  const userEmail = cookieStore.get("tcm_user_email")?.value ?? "";

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/30 bg-[#145c34] text-white backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-300" />
          <Link href="/" className="text-base font-bold tracking-tight text-white sm:text-lg">
            Testcase Manager
          </Link>
          {!isLoggedIn ? (
            <span className="ml-2 rounded-full bg-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-900">
              4.9
            </span>
          ) : null}
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
          {isLoggedIn ? (
            <>
              <ThemeToggle />
              <Link
                href="/dashboard"
                className="rounded-md border-2 border-white/80 bg-[#ecfff5] px-3 py-1.5 text-xs font-bold text-black shadow-md transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:px-4 sm:py-2 sm:text-sm"
                style={{ color: "#000000" }}
              >
                Home
              </Link>
              <details className="relative">
                <summary
                  className="list-none cursor-pointer rounded-md border-2 border-white/80 bg-[#ecfff5] px-3 py-1.5 text-xs font-bold text-black shadow-md transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:px-4 sm:py-2 sm:text-sm"
                  style={{ color: "#000000" }}
                >
                  <span className="inline-block max-w-28 truncate align-middle sm:max-w-44">
                    {userEmail || "Account"}
                  </span>
                </summary>
                <div className="absolute right-0 z-50 mt-2 w-44 rounded-md border border-emerald-200 bg-white p-1 shadow-lg sm:w-52">
                  <Link
                    href="/profile"
                    className="block rounded px-3 py-2 text-sm font-semibold text-black transition hover:bg-emerald-100 hover:text-black"
                    style={{ color: "#000000" }}
                  >
                    Edit Profile
                  </Link>
                  <a
                    href="/logout"
                    className="block rounded px-3 py-2 text-sm font-semibold text-black transition hover:bg-emerald-100 hover:text-black"
                    style={{ color: "#000000" }}
                  >
                    Logout
                  </a>
                </div>
              </details>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border-2 border-white/80 bg-[#ecfff5] px-3 py-1.5 text-xs font-bold text-black shadow-md transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:px-4 sm:py-2 sm:text-sm"
                style={{ color: "#000000" }}
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="rounded-md border-2 border-white/80 bg-[#bff4d8] px-3 py-1.5 text-xs font-bold text-black shadow-md transition hover:-translate-y-0.5 hover:bg-[#ecfff5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:px-4 sm:py-2 sm:text-sm"
                style={{ color: "#000000" }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
