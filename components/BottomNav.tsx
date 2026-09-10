"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageProvider";

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useLanguage();

  if (
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname === "/login"
  ) {
    return null;
  }

  const labels =
    language === "es"
      ? {
          home: "Inicio",
          standings: "Clasificación",
          matches: "Partidos",
          playoffs: "Playoffs",
          community: "Comunidad",
        }
      : {
          home: "Home",
          standings: "Standings",
          matches: "Matches",
          playoffs: "Playoffs",
          community: "Community",
        };

  const items = [
    {
      href: "/",
      label: labels.home,
      icon: HomeIcon,
    },
    {
      href: "/league",
      label: labels.standings,
      icon: StandingsIcon,
    },
    {
      href: "/matches",
      label: labels.matches,
      icon: MatchesIcon,
    },
    {
      href: "/playoffs",
      label: labels.playoffs,
      icon: PlayoffsIcon,
    },
    {
      href: "/community",
      label: labels.community,
      icon: CommunityIcon,
    },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-[520px] -translate-x-1/2">
      <div className="grid grid-cols-5 rounded-[22px] border border-black/10 bg-[#111715]/95 p-2 shadow-[0_18px_50px_rgba(17,23,21,0.20)] backdrop-blur-xl">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[58px] flex-col items-center justify-center gap-1.5 rounded-[16px] transition ${
                active
                  ? "bg-[#d9ef54] text-[#111715]"
                  : "text-white/45 hover:text-white"
              }`}
            >
              <Icon active={active} />

              <span className="max-w-full truncate px-1 text-[8px] font-black tracking-[0.04em] sm:text-[9px] sm:tracking-[0.06em]">
                {item.label.toUpperCase()}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({
  active,
}: {
  active: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function StandingsIcon({
  active,
}: {
  active: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 20V11" />
      <path d="M12 20V4" />
      <path d="M19 20v-6" />
      <path d="M3 20h18" />
    </svg>
  );
}

function MatchesIcon({
  active,
}: {
  active: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
      />

      <path d="M7 3v4" />
      <path d="M17 3v4" />
      <path d="M3 10h18" />
      <path d="M8 14h2" />
      <path d="M14 14h2" />
      <path d="M8 17h2" />
      <path d="M14 17h2" />
    </svg>
  );
}

function PlayoffsIcon({
  active,
}: {
  active: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
      <path d="M6 5H4v2a4 4 0 0 0 4 4" />
      <path d="M18 5h2v2a4 4 0 0 1-4 4" />
      <path d="M12 12v5" />
      <path d="M8 20h8" />
      <path d="M9 17h6" />
    </svg>
  );
}

function CommunityIcon({
  active,
}: {
  active: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.6-3.2 2.5-5 5.5-5s4.9 1.8 5.5 5" />

      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.5 14.5c2.8-.4 4.6 1.1 5 3.5" />
    </svg>
  );
}