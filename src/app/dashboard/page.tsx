import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("tcm_session");

  if (!isLoggedIn) {
    redirect("/login");
  }

  const cards = [
    {
      title: "Manual Test Case Creation",
      description: "Create, update, and delete test cases from a simple form.",
      href: "/create-testcases",
      cta: "Open CRUD",
    },
    {
      title: "Manual Import of Test Cases",
      description:
        "Upload Excel files. Each file is stored as one test case in PostgreSQL.",
      href: "/import-testcases",
      cta: "Open Import",
    },
    {
      title: "Cart System",
      description:
        "Select test cases and keep them in a working cart for quick access.",
      href: "/cart",
      cta: "Open Cart",
    },
    {
      title: "View Test Cases",
      description:
        "Browse all saved test cases and inspect file details and parsed data.",
      href: "/view-testcases",
      cta: "Open Viewer",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="card p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Test Case Manager
        </h1>
        <p className="mt-3 max-w-3xl text-sm opacity-85 sm:text-base">
          Test Case Manager is a centralized platform that helps teams create,
          manage, and track test cases with ease.
        </p>
        <p className="mt-2 max-w-3xl text-sm opacity-85 sm:text-base">
          From authoring and importing test cases to organizing execution-ready
          sets, it gives QA and development teams one reliable place to plan,
          collaborate, and maintain testing quality.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <article key={card.href} className="card p-5 sm:p-6">
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm opacity-85">{card.description}</p>
            <Link
              href={card.href}
              className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {card.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
