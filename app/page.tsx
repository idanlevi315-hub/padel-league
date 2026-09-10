"use client";

import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";

export default function HomePage() {
  const { language, setLanguage } = useLanguage();
  const es = language === "es";

  return (
    <main className="min-h-screen bg-[#f1efe7] text-[#101512]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="text-[44px] font-black leading-none tracking-[-0.09em]">18</Link>
        <div className="flex items-center gap-6">
          <Link href="/join/rules" className="hidden text-[10px] font-bold tracking-[.18em] sm:block">{es ? "REGLAS" : "RULES"}</Link>
          <div className="flex gap-2 text-[10px] font-bold tracking-[.12em]">
            <button onClick={() => setLanguage("en")} className={language === "en" ? "border-b border-black" : "opacity-35"}>EN</button>
            <button onClick={() => setLanguage("es")} className={language === "es" ? "border-b border-black" : "opacity-35"}>ES</button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[620px] max-w-7xl overflow-hidden px-6 pb-8 sm:px-10 md:grid-cols-[.9fr_1.1fr] md:pb-12">
        <div className="flex flex-col justify-center py-16 md:py-20">
          <p className="mb-5 text-[11px] font-bold tracking-[.28em] text-[#5f6b64]">PADEL LEAGUE · BARCELONA</p>
          <h1 className="text-[84px] font-black leading-[.8] tracking-[-.095em] sm:text-[118px] lg:text-[150px]">18</h1>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/join" className="rounded-full bg-[#101512] px-7 py-4 text-[11px] font-bold tracking-[.16em] text-[#f1efe7]">{es ? "INSCRIBIRSE" : "REGISTER"}</Link>
            <Link href="/league" className="rounded-full border border-[#101512]/20 px-7 py-4 text-[11px] font-bold tracking-[.16em]">{es ? "CLASIFICACIÓN" : "STANDINGS"}</Link>
          </div>
        </div>

        <div className="relative min-h-[500px] overflow-hidden rounded-[30px] bg-[#2d4036]">
          <div className="absolute inset-0 opacity-25" style={{backgroundImage:"linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",backgroundSize:"70px 70px"}} />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#18231e] to-transparent" />
          <div className="absolute left-[12%] top-[12%] h-[62%] w-px bg-white/20" />
          <div className="absolute right-[12%] top-[12%] h-[62%] w-px bg-white/20" />
          <div className="absolute left-[12%] right-[12%] top-[43%] h-px bg-white/35" />
          <Racket />
          <div className="absolute bottom-[13%] left-[58%] h-12 w-12 rounded-full bg-[#d9ef54] shadow-xl"><span className="flex h-full items-center justify-center text-[14px] font-black">18</span></div>
        </div>
      </section>
      <section className="border-t border-black/10">
        <div className="mx-auto grid max-w-7xl divide-y divide-black/10 px-6 sm:px-10 md:grid-cols-4 md:divide-x md:divide-y-0">
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
    <div className="absolute bottom-[8%] right-[11%] h-[390px] w-[220px] rotate-[8deg]">
      <div className="absolute left-1/2 top-0 h-[92px] w-[34px] -translate-x-1/2 rounded-full bg-[#111715]" />
      <div className="absolute left-1/2 top-[72px] h-[245px] w-[180px] -translate-x-1/2 rounded-[48%] border-[10px] border-[#111715] bg-[#171d1a] shadow-2xl">
        <div className="absolute inset-5 rounded-[48%] opacity-55" style={{backgroundImage:"radial-gradient(circle, rgba(241,239,231,.75) 0 2px, transparent 2.5px)",backgroundSize:"17px 17px"}} />
        <div className="absolute inset-0 flex items-center justify-center text-[58px] font-black tracking-[-0.08em] text-[#f1efe7]">18</div>
      </div>
      <div className="absolute bottom-0 left-1/2 h-[95px] w-[28px] -translate-x-1/2 rounded-b-xl bg-[#111715]" />
    </div>
  );
}
