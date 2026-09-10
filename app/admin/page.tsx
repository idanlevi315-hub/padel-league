import Link from "next/link";

const adminSections = [
  {
    title: "Teams",
    description:
      "Registrations, waiting list and group assignments.",
    href: "/admin/teams",
    icon: "T",
  },
  {
    title: "Matches",
    description:
      "Create the group schedule and manage matches.",
    href: "/admin/matches",
    icon: "M",
  },
  {
    title: "Results",
    description:
      "Review pending or disputed match results.",
    href: "/admin/results",
    icon: "R",
  },
  {
    title: "Playoffs",
    description:
      "Create and manage the championship bracket.",
    href: "/admin/playoff",
    icon: "P",
  },
  {
    title: "Community Chat",
    description:
      "Moderate messages and clear the community chat.",
    href: "/admin/community",
    icon: "C",
  },
  {
    title: "League Settings",
    description:
      "Capacity, registration and season status.",
    href: "/admin/settings",
    icon: "S",
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#24372f] px-5 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-black tracking-[0.2em] text-[#d9ef54]">
          18
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
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5f6b64] text-sm font-black text-[#d9ef54]">
                  {section.icon}
                </div>

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

        <section className="mt-8 rounded-3xl border border-[#d9ef54]/20 bg-[#d9ef54]/10 p-5">
          <p className="text-xs font-black tracking-widest text-[#d9ef54]">
            PUBLIC LEAGUE
          </p>

          <div className="mt-4 grid grid-cols-4 gap-3">
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

            <PublicLink
              href="/community"
              label="Community"
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