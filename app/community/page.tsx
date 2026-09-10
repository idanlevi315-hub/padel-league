"use client";

import Link from "next/link";
import { useLanguage } from "../../components/LanguageProvider";
import MatchChats from "../../components/MatchChats";

export default function CommunityPage() {
  const { language, setLanguage } = useLanguage();

  const copy = language === "es"
    ? { back: "INICIO", title: "Comunidad", general: "CHAT GENERAL", text: "Chat de la comunidad", open: "ABRIR CHAT" }
    : { back: "HOME", title: "Community", general: "COMMUNITY CHAT", text: "Community chat", open: "OPEN CHAT" };

  return (
    <main className="min-h-screen bg-[#f4f2ea] pb-28 text-[#071827]">
      <section className="bg-[#0b2638] text-white">
        <div className="mx-auto max-w-3xl px-5 pb-8 pt-5">
          <div className="grid grid-cols-3 items-center">
            <Link href="/" className="text-[9px] font-black tracking-[0.16em] text-white/45">
              ← {copy.back}
            </Link>

            <Link href="/" className="text-center">
              <div className="text-[15px] font-black tracking-[0.25em]">EQUIPO</div>
              <div className="mt-1 text-[7px] font-black tracking-[0.32em] text-[#d8ff45]">PLAY TOGETHER</div>
            </Link>

            <div className="flex justify-end">
              <div className="flex rounded-full border border-white/15 bg-white/[0.05] p-1">
                <button type="button" onClick={() => setLanguage("en")}
                  className={`rounded-full px-2.5 py-1.5 text-[8px] font-black ${language === "en" ? "bg-[#d8ff45] text-[#071827]" : "text-white/45"}`}>
                  EN
                </button>
                <button type="button" onClick={() => setLanguage("es")}
                  className={`rounded-full px-2.5 py-1.5 text-[8px] font-black ${language === "es" ? "bg-[#d8ff45] text-[#071827]" : "text-white/45"}`}>
                  ES
                </button>
              </div>
            </div>
          </div>

          <h1 className="mt-7 text-4xl font-black tracking-[-0.05em]">{copy.title}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-6">
        <p className="text-[9px] font-black tracking-[0.2em] text-[#78909c]">{copy.general}</p>

        <Link href="/community/chat"
          className="group mt-3 block overflow-hidden rounded-[24px] bg-[#0b2638] p-6 text-white shadow-[0_12px_35px_rgba(7,24,39,0.10)]">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d8ff45] text-[#071827]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 19c.6-3.2 2.5-5 5.5-5s4.9 1.8 5.5 5" />
                <circle cx="17" cy="9" r="2.3" />
                <path d="M15.5 14.5c2.8-.4 4.6 1.1 5 3.5" />
              </svg>
            </div>
            <span className="text-xl text-[#d8ff45] transition group-hover:translate-x-1">→</span>
          </div>

          <h2 className="mt-7 text-2xl font-black tracking-[-0.04em]">EQUIPO</h2>
          <p className="mt-1 text-[13px] text-white/45">{copy.text}</p>
          <div className="mt-5 inline-flex rounded-full bg-[#d8ff45] px-4 py-2 text-[9px] font-black tracking-[0.12em] text-[#071827]">
            {copy.open}
          </div>
        </Link>

        <MatchChats />
      </div>
    </main>
  );
}
