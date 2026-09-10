"use client";

import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";

export default function HomePage() {
  const { language, setLanguage } = useLanguage();
  const es = language === "es";

  return (
    <main className="min-h-screen bg-[#f1efe7] text-[#111715]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="text-5xl font-black tracking-[-0.09em]">18</Link>
        <div className="flex items-center gap-5">
          <Link href="/join/rules" className="hidden text-[10px] font-bold tracking-[.18em] sm:block">{es ? "REGLAS" : "RULES"}</Link>
          <div className="flex gap-2 text-[10px] font-bold tracking-[.12em]">
            <button onClick={() => setLanguage("en")} className={language === "en" ? "border-b border-black" : "opacity-35"}>EN</button>
            <button onClick={() => setLanguage("es")} className={language === "es" ? "border-b border-black" : "opacity-35"}>ES</button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-14 pt-12 sm:px-10 md:grid-cols-[1.05fr_.95fr] md:items-end md:pb-24 md:pt-20">
        <div>
          <p className="mb-7 text-[10px] font-bold tracking-[.3em] text-[#69736d]">PADEL COMMUNITY · BARCELONA</p>          <h1 className="max-w-3xl text-[64px] font-black leading-[.88] tracking-[-.075em] sm:text-[88px] lg:text-[112px]">{es ? <>Más que<br />un partido.</> : <>More than<br />a game.</>}</h1>
        </div>
        <div className="md:pb-2">
          <p className="max-w-sm text-lg leading-7 text-[#59625d]">{es ? "Una liga de pádel para jugar, competir y conocer gente." : "A padel league built to play, compete and meet people."}</p>
          <Link href="/join" className="mt-8 inline-flex min-w-60 items-center justify-between rounded-full bg-[#111715] px-6 py-4 text-[11px] font-bold tracking-[.16em] text-[#f1efe7]">{es ? "ÚNETE A LA LIGA" : "JOIN THE LEAGUE"}<span>→</span></Link>
        </div>
      </section>

      <section className="bg-[#273a31] text-[#f1efe7]">
        <div className="mx-auto grid max-w-7xl divide-y divide-white/15 px-6 sm:px-10 md:grid-cols-3 md:divide-x md:divide-y-0">
          <NavLink href="/league" label={es ? "CLASIFICACIÓN" : "STANDINGS"} />
          <NavLink href="/matches" label={es ? "PARTIDOS" : "MATCHES"} />
          <NavLink href="/community" label={es ? "COMUNIDAD" : "COMMUNITY"} />
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between">
        <p className="text-[10px] font-bold tracking-[.22em] text-[#69736d]">{es ? "FORMATO DE TEMPORADA" : "SEASON FORMAT"}</p>
        <p className="text-sm font-semibold tracking-[-.01em]">{es ? "Fase de grupos  →  Top 4  →  Playoffs" : "Group stage  →  Top 4  →  Playoffs"}</p>
      </section>
    </main>
  );
}
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between py-8 md:px-8 md:first:pl-0 md:last:pr-0">
      <span className="text-sm font-bold tracking-[.13em]">{label}</span>
      <span className="text-xl transition group-hover:translate-x-1">→</span>
    </Link>
  );
}
