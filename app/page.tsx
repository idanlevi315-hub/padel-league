"use client";

import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";

export default function HomePage() {
  const { language, setLanguage } = useLanguage();
  const es = language === "es";

  return (
    <main className="min-h-screen bg-[#eee9df] text-[#24352d]">
      <section className="relative min-h-[760px] overflow-hidden lg:min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://assets.weebora.com/images/CNA_Bwoje_0976525464.jpg')",
            filter: "saturate(.62) contrast(.92) brightness(1.02)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,239,229,.95)_0%,rgba(244,239,229,.82)_28%,rgba(244,239,229,.20)_52%,rgba(244,239,229,0)_72%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#24352d]/10 via-transparent to-white/10" />
        <header className="relative z-20 mx-auto flex max-w-[1500px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
          <Link href="/" className="text-[58px] font-black leading-none tracking-[-0.10em]">18</Link>
          <nav className="hidden items-center gap-9 text-[11px] font-semibold tracking-[.18em] lg:flex">
            <Link href="/matches">{es ? "PARTIDOS" : "PLAY"}</Link>
            <Link href="/league">{es ? "LIGA" : "LEAGUE"}</Link>
            <Link href="/community">{es ? "COMUNIDAD" : "COMMUNITY"}</Link>
            <Link href="/join/rules">{es ? "REGLAS" : "RULES"}</Link>
          </nav>
          <div className="flex items-center gap-5 text-[10px] font-bold tracking-[.14em]">
            <button onClick={() => setLanguage("en")} className={language === "en" ? "border-b border-[#24352d] pb-1" : "opacity-35"}>EN</button>
            <button onClick={() => setLanguage("es")} className={language === "es" ? "border-b border-[#24352d] pb-1" : "opacity-35"}>ES</button>
            <Link href="/join" className="hidden rounded-full bg-[#24352d] px-6 py-3 text-[#f4efe5] sm:block">{es ? "ÚNETE" : "JOIN"}</Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[640px] max-w-[1500px] items-center px-6 pb-16 pt-10 sm:px-10 lg:px-16">
          <div className="max-w-[560px]">
            <h1 className="text-[54px] font-black leading-[.9] tracking-[-.06em] text-[#24352d] sm:text-[70px] lg:text-[84px]">
              {es ? <>Más que<br />un partido</> : <>More than<br />a game</>}
            </h1>
            <p className="mt-6 text-[13px] font-semibold tracking-[.23em] text-[#40554a] sm:text-[15px]">
              PADEL COMMUNITY · BARCELONA
            </p>
            <Link
              href="/join"
              className="mt-8 inline-flex min-w-[238px] items-center justify-between rounded-full bg-[#24352d] px-7 py-4 text-[11px] font-bold tracking-[.18em] text-[#f4efe5]"
            >
              {es ? "ÚNETE A LA LIGA" : "JOIN THE LEAGUE"}
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#eee9df]">
        <div className="mx-auto grid max-w-[1500px] divide-y divide-black/10 px-6 sm:px-10 md:grid-cols-4 md:divide-x md:divide-y-0 lg:px-16">
          <NavLink href="/league" label={es ? "CLASIFICACIÓN" : "STANDINGS"} />
          <NavLink href="/matches" label={es ? "PARTIDOS" : "MATCHES"} />
          <NavLink href="/playoffs" label="PLAYOFFS" />
          <NavLink href="/community" label={es ? "COMUNIDAD" : "COMMUNITY"} />
        </div>
      </section>
    </main>
  );
}
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between py-7 md:px-7 md:first:pl-0 md:last:pr-0"
    >
      <span className="text-[11px] font-bold tracking-[.14em]">{label}</span>
      <span className="transition group-hover:translate-x-1">→</span>
    </Link>
  );
}
