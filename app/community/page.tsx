"use client";

import Link from "next/link";
import { useLanguage } from "../../components/LanguageProvider";
import MatchChats from "../../components/MatchChats";

export default function CommunityPage() {
  const { language, setLanguage } = useLanguage();
  const es = language === "es";

  return (
    <main className="min-h-screen bg-[#eee9df] pb-28 text-[#24372f]">
      <div className="mx-auto max-w-3xl px-5 pt-7">
        <header className="flex items-center justify-between border-b border-[#5f6b64]/15 pb-4">
          <Link href="/" className="text-[34px] font-semibold tracking-[-0.06em] text-[#5f6b64]">18</Link>
          <div className="flex items-center gap-3 text-[10px] font-semibold text-[#5f6b64]">
            <button onClick={() => setLanguage("en")} className={language === "en" ? "opacity-100" : "opacity-35"}>EN</button>
            <button onClick={() => setLanguage("es")} className={language === "es" ? "opacity-100" : "opacity-35"}>ES</button>
          </div>
        </header>

        <section className="pb-8 pt-10">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-[#7a847e]">18 · BARCELONA</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">{es ? "Comunidad" : "Community"}</h1>
        </section>        <section className="border-y border-[#5f6b64]/15 py-5">
          <Link href="/community/chat" className="group flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] text-[#7a847e]">{es ? "CHAT GENERAL" : "COMMUNITY CHAT"}</p>
              <h2 className="mt-1 text-xl font-semibold">18</h2>
            </div>
            <span className="text-lg text-[#5f6b64] transition group-hover:translate-x-1">→</span>
          </Link>
        </section>

        <div className="pt-7">
          <MatchChats />
        </div>
      </div>
    </main>
  );
}
