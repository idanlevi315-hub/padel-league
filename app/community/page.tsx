"use client";

import Link from "next/link";
import { useLanguage } from "../../components/LanguageProvider";

export default function CommunityPage() {
  const { language, setLanguage } = useLanguage();

  const copy =
    language === "es"
      ? {
          back: "INICIO",
          title: "Comunidad",
          general: "CHAT GENERAL",
          generalTitle: "EQUIPO",
          generalText: "Chat de la comunidad",
          open: "ABRIR CHAT",
          matches: "CHATS DE PARTIDOS",
          matchesTitle: "Tus partidos",
          noMatches: "Los chats de tus partidos aparecerán aquí.",
        }
      : {
          back: "HOME",
          title: "Community",
          general: "COMMUNITY CHAT",
          generalTitle: "EQUIPO",
          generalText: "Community chat",
          open: "OPEN CHAT",
          matches: "MATCH CHATS",
          matchesTitle: "Your matches",
          noMatches: "Your match chats will appear here.",
        };

  return (
    <main className="min-h-screen bg-[#f4f2ea] pb-28 text-[#071827]">
      {/* HEADER */}
      <section className="bg-[#0b2638] text-white">
        <div className="mx-auto max-w-3xl px-5 pb-8 pt-5">
          <div className="grid grid-cols-3 items-start">
            <div className="flex justify-start pt-2">
              <Link
                href="/"
                className="text-[9px] font-black tracking-[0.16em] text-white/45 transition hover:text-white"
              >
                ← {copy.back}
              </Link>
            </div>

            <Link
              href="/"
              className="flex flex-col items-center"
            >
              <EquipoLogo className="h-[62px] w-[62px]" />

              <div className="mt-0.5 text-[13px] font-black tracking-[0.25em]">
                EQUIPO
              </div>

              <div className="mt-1 text-[7px] font-black tracking-[0.32em] text-[#d8ff45]">
                PLAY TOGETHER
              </div>
            </Link>

            <div className="flex justify-end">
              <div className="flex rounded-full border border-white/15 bg-white/[0.05] p-1">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`rounded-full px-2.5 py-1.5 text-[8px] font-black ${
                    language === "en"
                      ? "bg-[#d8ff45] text-[#071827]"
                      : "text-white/45"
                  }`}
                >
                  EN
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage("es")}
                  className={`rounded-full px-2.5 py-1.5 text-[8px] font-black ${
                    language === "es"
                      ? "bg-[#d8ff45] text-[#071827]"
                      : "text-white/45"
                  }`}
                >
                  ES
                </button>
              </div>
            </div>
          </div>

          <h1 className="mt-7 text-4xl font-black tracking-[-0.05em]">
            {copy.title}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-6">
        {/* COMMUNITY CHAT */}
        <section>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#78909c]">
            {copy.general}
          </p>

          <Link
            href="/community/chat"
            className="group mt-3 block overflow-hidden rounded-[24px] bg-[#0b2638] p-6 text-white shadow-[0_12px_35px_rgba(7,24,39,0.10)]"
          >
            <div className="flex items-center justify-between">
              <CommunityIcon />

              <span className="text-xl text-[#d8ff45] transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <h2 className="mt-7 text-2xl font-black tracking-[-0.04em]">
              {copy.generalTitle}
            </h2>

            <p className="mt-1 text-[13px] text-white/45">
              {copy.generalText}
            </p>

            <div className="mt-5 inline-flex rounded-full bg-[#d8ff45] px-4 py-2 text-[9px] font-black tracking-[0.12em] text-[#071827]">
              {copy.open}
            </div>
          </Link>
        </section>

        {/* MATCH CHATS */}
        <section className="mt-8">
          <p className="text-[9px] font-black tracking-[0.2em] text-[#78909c]">
            {copy.matches}
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            {copy.matchesTitle}
          </h2>

          <div className="mt-4 rounded-[22px] border border-[#071827]/8 bg-white px-5 py-8 text-center shadow-[0_8px_25px_rgba(7,24,39,0.04)]">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f2ea]">
              <ChatIcon />
            </div>

            <p className="mx-auto mt-4 max-w-xs text-[13px] leading-5 text-[#78909c]">
              {copy.noMatches}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function EquipoLogo({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="EQUIPO"
    >
      <path
        d="M76 15H48C27 15 14 29 14 50C14 71 27 85 48 85H76L70 71H49C36 71 29 63 29 50C29 37 36 29 49 29H70L76 15Z"
        fill="#d8ff45"
      />

      <rect
        x="24"
        y="45"
        width="18"
        height="10"
        rx="2"
        fill="#d8ff45"
      />

      <circle cx="49" cy="37" r="2.8" fill="#d8ff45" />
      <circle cx="59" cy="37" r="2.8" fill="#d8ff45" />
      <circle cx="49" cy="47" r="2.8" fill="#d8ff45" />
      <circle cx="59" cy="47" r="2.8" fill="#d8ff45" />
      <circle cx="69" cy="47" r="2.8" fill="#d8ff45" />
      <circle cx="49" cy="57" r="2.8" fill="#d8ff45" />
      <circle cx="59" cy="57" r="2.8" fill="#d8ff45" />
      <circle cx="69" cy="57" r="2.8" fill="#d8ff45" />

      <circle cx="83" cy="48" r="9" fill="#d8ff45" />

      <path
        d="M80 40C76 44 76 52 80 56"
        fill="none"
        stroke="#0b2638"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M86 40C90 44 90 52 86 56"
        fill="none"
        stroke="#0b2638"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d8ff45] text-[#071827]">
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.6-3.2 2.5-5 5.5-5s4.9 1.8 5.5 5" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M15.5 14.5c2.8-.4 4.6 1.1 5 3.5" />
      </svg>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#78909c]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  );
}