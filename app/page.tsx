"use client";

import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";

export default function HomePage() {
  const { language, setLanguage, t } = useLanguage();

  const copy =
    language === "es"
      ? {
          rules: "REGLAMENTO",
          registrationOpen: "INSCRIPCIÓN ABIERTA",
          subtitle:
            "Partidos semanales. Dos grupos. Un campeonato.",
          register: "INSCRIBIR PAREJA",
          standings: "CLASIFICACIÓN",

          groups: "GRUPOS",
          pointsWin: "PTS / VICTORIA",
          advance: "CLASIFICAN",

          standingsTitle: "Clasificación",
          standingsText: "Grupos A y B",

          matchesTitle: "Partidos",
          matchesText: "Calendario y resultados",

          playoffsTitle: "Playoffs",
          playoffsText: "Cuadro del campeonato",

          formatLabel: "FORMATO DE LA LIGA",
          formatTitle: "Temporada",

          stage1: "Fase de grupos",
          stage1Text:
            "Cada pareja juega contra todas las parejas de su grupo.",

          stage2: "Top 4",
          stage2Text:
            "Las cuatro mejores parejas de cada grupo avanzan.",

          stage3: "Playoffs",
          stage3Text:
            "Cuartos de final, semifinales y final.",

          joinLabel: "INSCRIPCIÓN",
          joinTitle: "Únete a la liga.",
          joinText:
            "Registra tu pareja y elige tu nivel de juego.",

          admin: "ADMIN",
        }
      : {
          rules: "RULES",
          registrationOpen: "REGISTRATION OPEN",
          subtitle:
            "Weekly matches. Two groups. One championship.",
          register: "REGISTER TEAM",
          standings: "STANDINGS",

          groups: "GROUPS",
          pointsWin: "PTS / WIN",
          advance: "ADVANCE",

          standingsTitle: "Standings",
          standingsText: "Group A & B",

          matchesTitle: "Matches",
          matchesText: "Schedule & results",

          playoffsTitle: "Playoffs",
          playoffsText: "Championship bracket",

          formatLabel: "LEAGUE FORMAT",
          formatTitle: "Season",

          stage1: "Group Stage",
          stage1Text:
            "Play every team in your group.",

          stage2: "Top Four",
          stage2Text:
            "Four teams from each group qualify.",

          stage3: "Playoffs",
          stage3Text:
            "Quarterfinals, semifinals and final.",

          joinLabel: "REGISTRATION",
          joinTitle: "Join the league.",
          joinText:
            "Register your team and choose your playing level.",

          admin: "ADMIN",
        };

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#071827]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0b2638] text-white">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 top-16 h-[330px] w-[330px] rotate-12 rounded-[55px] border border-white/[0.07]" />

          <div className="absolute -right-2 top-24 h-[230px] w-[230px] rotate-12 rounded-[42px] border border-[#d8ff45]/15" />

          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#d8ff45]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 pb-9 pt-5 sm:pb-11">
          {/* HEADER */}
          <header className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <Logo />

              <div>
                <div className="text-[14px] font-black tracking-[0.14em]">
                  PADEL
                </div>

                <div className="text-[8px] font-bold tracking-[0.38em] text-white/45">
                  LEAGUE
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {/* LANGUAGE */}
              <div className="flex rounded-full border border-white/15 bg-white/[0.05] p-1">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`rounded-full px-3 py-1.5 text-[9px] font-black tracking-[0.08em] transition ${
                    language === "en"
                      ? "bg-[#d8ff45] text-[#071827]"
                      : "text-white/45 hover:text-white"
                  }`}
                >
                  EN
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage("es")}
                  className={`rounded-full px-3 py-1.5 text-[9px] font-black tracking-[0.08em] transition ${
                    language === "es"
                      ? "bg-[#d8ff45] text-[#071827]"
                      : "text-white/45 hover:text-white"
                  }`}
                >
                  ES
                </button>
              </div>

              <Link
                href="/join/rules"
                className="hidden border-b border-white/25 pb-1 text-[10px] font-black tracking-[0.12em] text-white/55 transition hover:border-[#d8ff45] hover:text-white sm:block"
              >
                {copy.rules}
              </Link>
            </div>
          </header>

          {/* HERO CONTENT */}
          <div className="mt-10 grid items-end gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#d8ff45]" />

                <span className="text-[9px] font-black tracking-[0.14em] text-white/65">
                  {copy.registrationOpen}
                </span>
              </div>

              <h1 className="mt-4 text-[48px] font-black leading-[0.88] tracking-[-0.065em] sm:text-[64px]">
                PADEL
                <br />
                LEAGUE
              </h1>

              <p className="mt-4 max-w-md text-[14px] leading-6 text-white/60">
                {copy.subtitle}
              </p>
            </div>

            <div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Link
                  href="/join"
                  className="flex min-h-[50px] flex-1 items-center justify-between rounded-full bg-[#d8ff45] px-5 text-[12px] font-black text-[#071827] transition hover:scale-[1.01]"
                >
                  {copy.register}

                  <span className="text-lg">
                    →
                  </span>
                </Link>

                <Link
                  href="/league"
                  className="flex min-h-[50px] flex-1 items-center justify-center rounded-full border border-white/20 px-5 text-[12px] font-black text-white transition hover:bg-white/10"
                >
                  {copy.standings}
                </Link>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-9 grid grid-cols-3 border-t border-white/15 pt-5">
            <HeroStat
              value="2"
              label={copy.groups}
            />

            <HeroStat
              value="3"
              label={copy.pointsWin}
            />

            <HeroStat
              value="4"
              label={copy.advance}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 pb-28">
        {/* QUICK LINKS */}
        <section className="-mt-px grid overflow-hidden rounded-b-[24px] bg-white shadow-[0_14px_40px_rgba(7,24,39,0.07)] sm:grid-cols-3">
          <HomeLink
            number="01"
            href="/league"
            title={copy.standingsTitle}
            text={copy.standingsText}
          />

          <HomeLink
            number="02"
            href="/matches"
            title={copy.matchesTitle}
            text={copy.matchesText}
          />

          <HomeLink
            number="03"
            href="/playoffs"
            title={copy.playoffsTitle}
            text={copy.playoffsText}
          />
        </section>

        {/* FORMAT */}
        <section className="py-9 sm:py-11">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="shrink-0 md:w-[200px]">
              <p className="text-[9px] font-black tracking-[0.22em] text-[#78909c]">
                {copy.formatLabel}
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">
                {copy.formatTitle}
              </h2>
            </div>

            <div className="grid flex-1 gap-3 sm:grid-cols-3">
              <Stage
                number="01"
                title={copy.stage1}
                text={copy.stage1Text}
              />

              <Stage
                number="02"
                title={copy.stage2}
                text={copy.stage2Text}
              />

              <Stage
                number="03"
                title={copy.stage3}
                text={copy.stage3Text}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden rounded-[25px] bg-[#d8ff45] px-6 py-6 sm:flex sm:items-center sm:justify-between sm:px-8">
          <div className="absolute -bottom-16 -right-10 h-44 w-44 rounded-full border-[28px] border-[#071827]/5" />

          <div className="relative">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#071827]/45">
              {copy.joinLabel}
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">
              {copy.joinTitle}
            </h2>

            <p className="mt-1 text-[13px] text-[#071827]/60">
              {copy.joinText}
            </p>
          </div>

          <Link
            href="/join"
            className="relative mt-5 inline-flex min-h-[46px] items-center gap-7 rounded-full bg-[#071827] px-5 text-[11px] font-black text-white sm:mt-0"
          >
            {copy.register}
            <span>→</span>
          </Link>
        </section>

        {/* FOOTER */}
        <footer className="mt-7 flex items-center justify-between border-t border-[#071827]/10 pt-5">
          <span className="text-[9px] font-black tracking-[0.16em] text-[#071827]/30">
            PADEL LEAGUE
          </span>

          <div className="flex items-center gap-5">
            <Link
              href="/join/rules"
              className="text-[9px] font-black tracking-[0.12em] text-[#071827]/30 transition hover:text-[#071827]"
            >
              {copy.rules}
            </Link>

            <Link
              href="/admin"
              className="text-[9px] font-black tracking-[0.12em] text-[#071827]/25 transition hover:text-[#071827]"
            >
              {copy.admin}
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Logo() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d8ff45]">
      <div className="h-5 w-3 rotate-[28deg] rounded-[50%] border-2 border-[#d8ff45]" />

      <div className="absolute bottom-[6px] right-[8px] h-[7px] w-[2px] rotate-[-32deg] bg-[#d8ff45]" />
    </div>
  );
}

function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="border-r border-white/10 px-3 first:pl-0 last:border-r-0 sm:px-5">
      <p className="text-xl font-black tracking-[-0.04em] text-[#d8ff45]">
        {value}
      </p>

      <p className="mt-1 truncate text-[8px] font-black tracking-[0.12em] text-white/35">
        {label}
      </p>
    </div>
  );
}

function HomeLink({
  number,
  href,
  title,
  text,
}: {
  number: string;
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group border-b border-[#071827]/10 px-5 py-4 transition hover:bg-[#f8f8f3] sm:border-b-0 sm:border-r sm:last:border-r-0"
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black tracking-[0.12em] text-[#78909c]">
          {number}
        </span>

        <span className="text-lg text-[#071827]/25 transition group-hover:translate-x-1 group-hover:text-[#071827]">
          →
        </span>
      </div>

      <h2 className="mt-3 text-[17px] font-black tracking-[-0.025em]">
        {title}
      </h2>

      <p className="mt-0.5 text-[12px] text-[#78909c]">
        {text}
      </p>
    </Link>
  );
}

function Stage({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[18px] bg-white p-4 shadow-[0_8px_25px_rgba(7,24,39,0.04)]">
      <span className="text-[9px] font-black tracking-[0.12em] text-[#78909c]">
        {number}
      </span>

      <h3 className="mt-2 text-[15px] font-black tracking-[-0.02em]">
        {title}
      </h3>

      <p className="mt-1 text-[12px] leading-5 text-[#78909c]">
        {text}
      </p>
    </div>
  );
}