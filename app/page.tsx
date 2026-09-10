"use client";

import Link from "next/link";
import { useLanguage } from "../components/LanguageProvider";

export default function HomePage() {
  const { language, setLanguage } = useLanguage();
  const es = language === "es";

  return (
    <main className="min-h-screen bg-[#eee9df] text-[#5f6b64]">
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
          <div className="flex items-center gap-5 text-[11px] font-semibold tracking-[.08em]">
            <Link href="/join/rules">{es ? "Reglas" : "Rules"}</Link>
            <button onClick={() => setLanguage("en")} className={language === "en" ? "font-bold" : "opacity-40"}>EN</button>
            <button onClick={() => setLanguage("es")} className={language === "es" ? "font-bold" : "opacity-40"}>ES</button>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[660px] max-w-[1500px] items-center px-6 pb-20 sm:px-10 lg:px-16">
          <div className="max-w-[540px]">
            <div className="text-[58px] font-bold leading-none tracking-[-0.055em] sm:text-[68px]">18</div>
            <h1 className="mt-2 text-[46px] font-semibold leading-[0.96] tracking-[-0.045em] sm:text-[58px] lg:text-[66px]">
              {es ? <>Más que<br />un partido</> : <>More than<br />a game</>}
            </h1>

            <p className="mt-5 text-[13px] font-semibold tracking-[.12em] sm:text-[14px]">
              {es ? "Comunidad de pádel · Barcelona" : "Padel community · Barcelona"}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/join" className="rounded-full bg-[#5f6b64] px-7 py-4 text-[12px] font-semibold text-[#f4efe5]">
                {es ? "Únete a la liga" : "Join the league"}
              </Link>
              <Link href="/league" className="rounded-full border border-[#5f6b64]/30 px-7 py-4 text-[12px] font-semibold">
                {es ? "Clasificación" : "Standings"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
