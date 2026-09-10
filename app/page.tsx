"use client";

import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";

export default function HomePage() {
  const { language, setLanguage } = useLanguage();
  const es = language === "es";

  return (
    <main className="min-h-screen bg-[#eee9df] text-[#0d1210]">
      <section className="relative min-h-[760px] overflow-hidden lg:min-h-screen">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://assets.weebora.com/images/CNA_Bwoje_0976525464.jpg')", filter: "saturate(.58) contrast(.9) brightness(1.03)" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,239,229,.97)_0%,rgba(244,239,229,.90)_31%,rgba(244,239,229,.26)_53%,rgba(244,239,229,.06)_72%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#ece6da]/20 via-transparent to-white/15" />

        <header className="relative z-20 mx-auto flex max-w-[1500px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
          <Link href="/" className="text-[58px] font-black leading-none tracking-[-0.10em]">18</Link>
          <nav className="hidden items-center gap-9 text-[11px] font-semibold tracking-[.18em] lg:flex">
            <Link href="/matches">{es ? "PARTIDOS" : "PLAY"}</Link>
            <Link href="/league">{es ? "LIGA" : "LEAGUE"}</Link>
            <Link href="/community">{es ? "COMUNIDAD" : "COMMUNITY"}</Link>
            <Link href="/join/rules">{es ? "REGLAS" : "RULES"}</Link>
          </nav>          <div className="flex items-center gap-5 text-[10px] font-bold tracking-[.14em]">
            <button onClick={() => setLanguage("en")} className={language === "en" ? "border-b border-black pb-1" : "opacity-35"}>EN</button>
            <button onClick={() => setLanguage("es")} className={language === "es" ? "border-b border-black pb-1" : "opacity-35"}>ES</button>
            <Link href="/join" className="hidden rounded-full bg-[#0d1210] px-6 py-3 text-[#f4efe5] sm:block">{es ? "ÚNETE" : "JOIN"}</Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[640px] max-w-[1500px] items-center px-6 pb-16 pt-10 sm:px-10 lg:px-16">
          <div className="max-w-[620px]">
            <h1 className="text-[68px] font-black leading-[.88] tracking-[-.075em] sm:text-[90px] lg:text-[112px]">
              {es ? <>Más que<br />un partido</> : <>More than<br />a game</>}
            </h1>
            <p className="mt-7 max-w-md text-[15px] font-semibold tracking-[.25em] sm:text-[17px]">
              PADEL COMMUNITY<br />IN BARCELONA
            </p>
            <Link href="/join" className="mt-8 inline-flex min-w-[260px] items-center justify-between rounded-full bg-[#0d1210] px-7 py-4 text-[11px] font-bold tracking-[.18em] text-[#f4efe5]">
              {es ? "ÚNETE A LA LIGA" : "JOIN THE LEAGUE"}<span className="text-lg">→</span>
            </Link>
          </div>
        </div>

        <aside className="absolute right-0 top-0 z-10 hidden h-full w-[29%] bg-[#d7d0c5]/92 lg:block">
          <div className="absolute inset-y-0 left-0 w-px bg-black/10" />
          <div className="absolute right-[14%] top-[18%] text-[10px] font-semibold leading-[2.05] tracking-[.28em] text-black/70 [writing-mode:vertical-rl]">
            SAME COURT · DIFFERENT PEOPLE
          </div>
          <Racket />
        </aside>
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
    <Link href={href} className="group flex items-center justify-between py-7 md:px-7 md:first:pl-0 md:last:pr-0">
      <span className="text-[11px] font-bold tracking-[.14em]">{label}</span>
      <span className="transition group-hover:translate-x-1">→</span>
    </Link>
  );
}

function Racket() {
  return (
    <div className="absolute bottom-[7%] left-[10%] h-[500px] w-[285px] rotate-[8deg]">
      <div className="absolute left-1/2 top-0 h-[128px] w-[42px] -translate-x-1/2 rounded-full bg-[#0d1210] shadow-xl" />
      <div className="absolute left-1/2 top-[102px] h-[300px] w-[225px] -translate-x-1/2 rounded-[48%] border-[12px] border-[#0d1210] bg-[#171d1a] shadow-[0_30px_55px_rgba(0,0,0,.28)]">
        <div className="absolute inset-6 rounded-[48%] opacity-55" style={{ backgroundImage: "radial-gradient(circle, rgba(238,233,223,.86) 0 2.3px, transparent 2.8px)", backgroundSize: "19px 19px" }} />
        <div className="absolute inset-0 flex items-center justify-center text-[72px] font-black tracking-[-0.09em] text-[#eee9df]">18</div>
      </div>
      <div className="absolute bottom-0 left-1/2 h-[118px] w-[34px] -translate-x-1/2 rounded-b-2xl bg-[#0d1210]" />
      <div className="absolute bottom-[18%] -left-[8%] flex h-14 w-14 items-center justify-center rounded-full bg-[#d9ef54] text-[15px] font-black shadow-lg">18</div>
    </div>
  );
}
