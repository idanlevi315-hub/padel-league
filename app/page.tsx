"use client";

import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";

export default function HomePage() {
  const { language, setLanguage } = useLanguage();
  const es = language === "es";

  return (
    <main className="min-h-screen bg-[#eee9df] text-[#24372f]">
      <section className="relative min-h-[760px] overflow-hidden lg:min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://assets.weebora.com/images/CNA_Bwoje_0976525464.jpg')",
            filter: "saturate(.58) contrast(.9) brightness(1.03)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,239,229,.97)_0%,rgba(244,239,229,.88)_31%,rgba(244,239,229,.28)_54%,rgba(244,239,229,.06)_74%)]" />

        <header className="relative z-20 mx-auto flex max-w-[1500px] items-center justify-end px-6 py-7 sm:px-10 lg:px-16">
          <div className="flex items-center gap-5 text-[11px] font-semibold">
            <Link href="/join/rules">{es ? "Reglas" : "Rules"}</Link>
            <button onClick={() => setLanguage("en")} className={language === "en" ? "font-bold" : "opacity-40"}>EN</button>
            <button onClick={() => setLanguage("es")} className={language === "es" ? "font-bold" : "opacity-40"}>ES</button>
          </div>
        </header>
        <div className="relative z-10 mx-auto flex min-h-[660px] max-w-[1500px] items-center px-6 pb-20 sm:px-10 lg:px-16">
          <div className="max-w-[560px]">
            <div className="text-[64px] font-black leading-none tracking-[-0.08em] sm:text-[76px]">18</div>
            <h1 className="mt-4 text-[54px] font-black leading-[0.93] tracking-[-0.06em] sm:text-[68px] lg:text-[78px]">
              {es ? <>Más que<br />un partido</> : <>More than<br />a game</>}
            </h1>

            <p className="mt-6 text-[14px] font-semibold sm:text-[15px]">
              {es ? "Comunidad de pádel · Barcelona" : "Padel community · Barcelona"}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/join" className="rounded-full bg-[#24372f] px-7 py-4 text-[12px] font-semibold text-[#f4efe5]">
                {es ? "Únete a la liga" : "Join the league"}
              </Link>
              <Link href="/league" className="rounded-full border border-[#24372f]/25 px-7 py-4 text-[12px] font-semibold">
                {es ? "Clasificación" : "Standings"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#eee9df]">
        <div className="mx-auto grid max-w-[1500px] divide-y divide-black/10 px-6 sm:px-10 md:grid-cols-4 md:divide-x md:divide-y-0 lg:px-16">
          <NavLink href="/league" label={es ? "Clasificación" : "Standings"} />
          <NavLink href="/matches" label={es ? "Partidos" : "Matches"} />
          <NavLink href="/playoffs" label="Playoffs" />
          <NavLink href="/community" label={es ? "Comunidad" : "Community"} />
        </div>
      </section>
    </main>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between py-7 md:px-7 md:first:pl-0 md:last:pr-0">
      <span className="text-[12px] font-semibold">{label}</span>
      <span className="transition group-hover:translate-x-1">→</span>
    </Link>
  );
}
