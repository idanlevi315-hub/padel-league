import Link from "next/link";

const adminSections = [
  {
    title: "Teams",
    description:
      "Registrations, waiting list and group assignments.",
    href: "/admin/teams",
    icon: "👥",
  },
  {
    title: "Matches",
    description:
      "Create the group schedule and manage matches.",
    href: "/admin/matches",
    icon: "🎾",
  },
  {
    title: "Results",
    description:
      "Review pending or disputed match results.",
    href: "/admin/results",
    icon: "✓",
  },
  {
    title: "Playoffs",
    description:
      "Create and manage the championship bracket.",
    href: "/admin/playoff",
    icon: "🏆",
  },
  {
    title: "League Settings",
    description:
      "Capacity, registration and season status.",
    href: "/admin/settings",
    icon: "⚙️",
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#071827] px-5 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-black tracking-widest text-lime-300">
          PADEL LEAGUE
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Admin
        </h1>

        <p className="mt-2 text-white/50">
          Manage the league from one place.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-3xl bg-white p-5 text-black shadow-lg transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">
                  {section.icon}
                </span>

                <span className="text-xl text-gray-300 transition group-hover:text-black">
                  →
                </span>
              </div>

              <h2 className="mt-5 text-xl font-black">
                {section.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {section.description}
              </p>
            </Link>
          ))}
        </div>

        <section className="mt-8 rounded-3xl border border-lime-300/20 bg-lime-300/10 p-5">
          <p className="text-xs font-black tracking-widest text-lime-300">
            PUBLIC LEAGUE
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <PublicLink
              href="/league"
              label="Standings"
            />

            <PublicLink
              href="/matches"
              label="Matches"
            />

            <PublicLink
              href="/playoffs"
              label="Playoffs"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function PublicLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl bg-white/10 px-3 py-3 text-center text-xs font-bold text-white transition hover:bg-white/20"
    >
      {label}
    </Link>
  );
}