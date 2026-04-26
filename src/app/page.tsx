import Link from "next/link";
import { DemoAssistant } from "@/components/demo-assistant";

export default function Home() {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <section className="relative overflow-hidden border-b border-border/50 bg-[radial-gradient(circle_at_20%_20%,#e9fff0_0,#f7fff9_35%,#f3fff7_65%,#eefff5_100%)] dark:bg-[radial-gradient(circle_at_20%_20%,#0b1c14_0,#08140e_35%,#0d2017_65%,#0b1a13_100%)]">
          <div className="live-bubbles" aria-hidden>
            <span className="live-bubble bubble-1" />
            <span className="live-bubble bubble-2" />
            <span className="live-bubble bubble-3" />
            <span className="live-bubble bubble-4" />
            <span className="live-bubble bubble-5" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(26,99,60,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,99,60,0.08)_1px,transparent_1px)] bg-size-[56px_56px] opacity-60 dark:bg-[linear-gradient(to_right,rgba(110,210,155,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(110,210,155,0.08)_1px,transparent_1px)]" />
          <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-12 h-64 w-64 rounded-full bg-green-200/35 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mx-auto inline-flex items-center rounded-full border border-emerald-200 bg-white/90 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-100">
                AI-Powered Test Case Assistant
              </p>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 dark:text-emerald-50 sm:text-6xl">
                Your Central
                <span className="block text-primary">Test Case Manager</span>
              </h1>

              <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-700 dark:text-emerald-100/90">
                Discover, create, and manage high-quality test cases with one
                organized workspace built for QA and development teams.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-700 dark:text-emerald-50">
                <span className="rounded-full bg-white/95 px-4 py-2 shadow-sm ring-1 ring-emerald-100 dark:bg-emerald-950/70 dark:ring-emerald-800">
                  50K+ Test Runs Tracked
                </span>
                <span className="rounded-full bg-white/95 px-4 py-2 shadow-sm ring-1 ring-emerald-100 dark:bg-emerald-950/70 dark:ring-emerald-800">
                  10K+ Cases Managed
                </span>
                <span className="rounded-full bg-white/95 px-4 py-2 shadow-sm ring-1 ring-emerald-100 dark:bg-emerald-950/70 dark:ring-emerald-800">
                  Team Ready
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  Start Managing
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-border bg-white/90 px-6 py-3 text-base font-bold text-slate-800 transition hover:-translate-y-0.5 hover:bg-muted dark:border-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-50 dark:hover:bg-emerald-900/70"
                >
                  Sign In
                </Link>
              </div>
            </div>

            <DemoAssistant />
          </div>
        </section>

        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_75%_30%,#e8fff0_0,#f4fff8_48%,#f0fff6_100%)] px-4 py-12 dark:bg-[radial-gradient(circle_at_75%_30%,#0d2117_0,#0b1b13_48%,#09160f_100%)] sm:px-6 lg:px-8">
          <div className="live-bubbles" aria-hidden>
            <span className="live-bubble bubble-2" />
            <span className="live-bubble bubble-4" />
            <span className="live-bubble bubble-5" />
          </div>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-emerald-50 sm:text-4xl">
                Why Choose Test Case Manager?
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-base text-slate-700 dark:text-emerald-100/90 sm:text-lg">
                Everything your team needs to write, organize, and scale test
                coverage with confidence.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <article className="rounded-2xl border border-emerald-100 bg-white/95 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:border-emerald-900/70 dark:bg-[#11281c] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <h3 className="text-xl font-bold text-slate-900 dark:text-emerald-50">AI Case Drafting</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-700 dark:text-emerald-100/85">
                  Generate case structures with clear steps, expected outcomes,
                  and reusable templates.
                </p>
                <p className="mt-4 text-sm font-semibold text-emerald-600">
                  10,000+ cases drafted monthly
                </p>
              </article>

              <article className="rounded-2xl border border-sky-100 bg-white/95 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:border-emerald-900/70 dark:bg-[#11281c] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <h3 className="text-xl font-bold text-slate-900 dark:text-emerald-50">Smart Organization</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-700 dark:text-emerald-100/85">
                  Group related scenarios into carts and maintain release-ready
                  bundles for faster execution.
                </p>
                <p className="mt-4 text-sm font-semibold text-sky-600">
                  Save 5+ hours per sprint
                </p>
              </article>

              <article className="rounded-2xl border border-fuchsia-100 bg-white/95 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:border-emerald-900/70 dark:bg-[#11281c] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <h3 className="text-xl font-bold text-slate-900 dark:text-emerald-50">Full Visibility</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-700 dark:text-emerald-100/85">
                  Track every saved case, imported file, and update history in one
                  centralized viewer.
                </p>
                <p className="mt-4 text-sm font-semibold text-fuchsia-600">
                  Built for QA and dev collaboration
                </p>
              </article>
            </div>

            <div className="mt-10 rounded-3xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-10 text-center text-white shadow-[0_18px_48px_rgba(10,120,82,0.3)] sm:px-10">
              <h3 className="text-3xl font-extrabold">Ready to Improve Test Quality?</h3>
              <p className="mx-auto mt-3 max-w-3xl text-lg text-emerald-50">
                Join teams who streamline testcase creation, tracking, and
                collaboration with one efficient platform.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="rounded-xl bg-emerald-900 px-6 py-3 text-base font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-950"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-white/80 bg-white/10 px-6 py-3 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Watch Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-xl font-bold">Test Case Manager</p>
            <p className="text-sm text-slate-300">
              © 2026 Test Case Manager. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
  );
}
