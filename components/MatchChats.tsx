"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "./LanguageProvider";

type Match = {
  id: number;
  week: number | null;
  team1: string;
  team2: string;
  status: string | null;
  match_date: string | null;
  match_time: string | null;
  location: string | null;
};

export default function MatchChats() {
  const { language } = useLanguage();
  const [matches, setMatches] = useState<Match[]>([]);
  const [registered, setRegistered] = useState<boolean | null>(null);

  const copy = language === "es"
    ? { title: "Tus partidos", empty: "Tus chats aparecerán cuando tengas partidos programados.", register: "REGÍSTRATE PARA VER TUS PARTIDOS", week: "JORNADA", match: "PARTIDO" }
    : { title: "Your matches", empty: "Your chats will appear when you have scheduled matches.", register: "REGISTER TO SEE YOUR MATCHES", week: "WEEK", match: "MATCH" };

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("equipo_player_token");
      if (!token) {
        setRegistered(false);
        return;
      }

      const identity = await supabase.rpc("get_player_identity", { p_token: token });
      if (identity.error || !Array.isArray(identity.data) || !identity.data.length) {
        setRegistered(false);
        return;
      }

      setRegistered(true);
      const result = await supabase.rpc("get_player_matches", { p_token: token });
      if (!result.error) setMatches((result.data ?? []) as Match[]);
    }

    load();
  }, []);

  return (
    <section className="mt-8">
      <p className="text-[9px] font-black tracking-[0.2em] text-[#7a847e]">MATCH CHATS</p>
      <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">{copy.title}</h2>
      <div className="mt-4 space-y-3">
        {registered === false ? (
          <Link href="/join" className="block rounded-[22px] bg-white px-5 py-7 text-center text-[11px] font-black text-[#5f6b64] shadow-sm">
            {copy.register} →
          </Link>
        ) : matches.length ? (
          matches.map((match) => (
            <Link key={match.id} href={`/community/match/${match.id}`} className="block rounded-[22px] bg-white p-5 shadow-sm transition hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black tracking-[0.14em] text-[#7a847e]">
                  {match.week ? `${copy.week} ${match.week}` : copy.match}
                </span>
                <span className="text-[#5f6b64]">→</span>
              </div>
              <p className="mt-3 text-[16px] font-black">{match.team1}</p>
              <p className="my-1 text-[9px] font-black text-[#7a847e]">VS</p>
              <p className="text-[16px] font-black">{match.team2}</p>
              {(match.match_date || match.location) && (
                <p className="mt-3 text-[11px] text-[#7a847e]">
                  {[match.match_date, match.match_time?.slice(0, 5), match.location].filter(Boolean).join(" · ")}
                </p>
              )}
            </Link>
          ))
        ) : (
          <div className="rounded-[22px] border border-[#24372f]/8 bg-white px-5 py-8 text-center shadow-sm">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#eee9df] text-[#7a847e]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
            </div>
            <p className="mx-auto mt-4 max-w-xs text-[13px] leading-5 text-[#7a847e]">{copy.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}
