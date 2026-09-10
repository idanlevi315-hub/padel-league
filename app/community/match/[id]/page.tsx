/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { useLanguage } from "../../../../components/LanguageProvider";

type Player = { id: number; full_name: string; team_id: number | null; role: string | null };
type Message = { id: number; created_at: string; match_id: number; player_id: number; sender_name: string; message: string };
type Match = { id: number; week: number | null; team1: string; team2: string; status: string | null; match_date: string | null; match_time: string | null; location: string | null };

export default function MatchChatPage() {
  const params = useParams<{ id: string }>();
  const matchId = Number(params.id);
  const { language } = useLanguage();
  const [player, setPlayer] = useState<Player | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const copy = language === "es"
    ? { back: "COMUNIDAD", title: "Chat del partido", week: "JORNADA", empty: "Todavía no hay mensajes.", placeholder: "Escribe un mensaje...", send: "ENVIAR", denied: "Este chat solo está disponible para los jugadores de este partido.", register: "REGISTRARME", remove: "ELIMINAR" }
    : { back: "COMMUNITY", title: "Match Chat", week: "WEEK", empty: "No messages yet.", placeholder: "Write a message...", send: "SEND", denied: "This chat is only available to players in this match.", register: "REGISTER", remove: "DELETE" };

  useEffect(() => {
    load();
    const timer = window.setInterval(() => {
      if (!document.hidden) sync();
    }, 1500);
    return () => window.clearInterval(timer);
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function load() {
    const token = localStorage.getItem("equipo_player_token");
    if (!token || !Number.isFinite(matchId)) { setLoading(false); return; }

    const identity = await supabase.rpc("get_player_identity", { p_token: token });
    if (!identity.error && Array.isArray(identity.data) && identity.data.length) setPlayer(identity.data[0] as Player);

    const matchResult = await supabase.rpc("get_player_matches", { p_token: token });
    if (!matchResult.error) {
      setMatch(((matchResult.data ?? []) as Match[]).find((item) => item.id === matchId) ?? null);
    }

    const messageResult = await supabase.rpc("get_match_messages", { p_token: token, p_match_id: matchId });
    if (!messageResult.error) setMessages((messageResult.data ?? []) as Message[]);
    setLoading(false);
  }

  async function sync() {
    const token = localStorage.getItem("equipo_player_token");
    if (!token) return;
    const result = await supabase.rpc("get_match_messages", { p_token: token, p_match_id: matchId });
    if (!result.error) setMessages((result.data ?? []) as Message[]);
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = text.trim();
    const token = localStorage.getItem("equipo_player_token");
    if (!clean || !token || sending) return;

    setSending(true);
    setError("");
    const result = await supabase.rpc("send_match_message", { p_token: token, p_match_id: matchId, p_message: clean });
    if (result.error) { setError(result.error.message); setSending(false); return; }
    setText("");
    setSending(false);
    await sync();
  }

  async function remove(messageId: number) {
    const token = localStorage.getItem("equipo_player_token");
    if (!token) return;
    const result = await supabase.rpc("delete_match_message", { p_token: token, p_message_id: messageId });
    if (!result.error && result.data === true) setMessages((current) => current.filter((item) => item.id !== messageId));
  }

  if (!loading && (!player || !match)) {
    return (
      <main className="min-h-screen bg-[#f4f2ea] px-5 py-8 text-[#071827]">
        <div className="mx-auto max-w-3xl">
          <Link href="/community" className="text-[9px] font-black tracking-[0.14em] text-[#78909c]">← {copy.back}</Link>
          <div className="mt-8 rounded-[24px] bg-[#0b2638] p-7 text-center text-white">
            <p className="text-lg font-black">{copy.denied}</p>
            {!player && <Link href="/join" className="mt-5 inline-flex rounded-xl bg-[#d8ff45] px-5 py-3 text-[10px] font-black text-[#071827]">{copy.register}</Link>}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f2ea] pb-40 text-[#071827]">
      <header className="sticky top-0 z-30 bg-[#0b2638] text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/community" className="text-[9px] font-black tracking-[0.12em] text-white/50">← {copy.back}</Link>
          <div className="text-[13px] font-black tracking-[0.18em]">EQUIPO</div>
          <span className="max-w-[100px] truncate text-[9px] font-black text-white/45">{player?.full_name}</span>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-5">
        <p className="text-[9px] font-black tracking-[0.14em] text-[#78909c]">{match?.week ? `${copy.week} ${match.week}` : ""}</p>
        <h1 className="mt-1 text-3xl font-black tracking-[-0.05em]">{copy.title}</h1>
        <p className="mt-2 text-[14px] font-black">{match?.team1} <span className="mx-2 text-[#78909c]">VS</span> {match?.team2}</p>
        {(match?.match_date || match?.location) && (
          <p className="mt-2 text-[11px] text-[#78909c]">{[match.match_date, match.match_time?.slice(0, 5), match.location].filter(Boolean).join(" · ")}</p>
        )}

        <div className="mt-6 space-y-3">
          {loading ? <p className="py-10 text-center text-[#78909c]">...</p> : !messages.length ? (
            <div className="rounded-[20px] bg-white p-8 text-center text-[13px] text-[#78909c]">{copy.empty}</div>
          ) : messages.map((item) => {
            const own = item.player_id === player?.id;
            return (
              <div key={item.id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] rounded-[20px] px-4 py-3 ${own ? "rounded-br-[6px] bg-[#0b2638] text-white" : "rounded-bl-[6px] bg-white"}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black ${own ? "text-[#d8ff45]" : "text-[#0b2638]"}`}>{own ? "YOU" : item.sender_name}</span>
                    {own && <button type="button" onClick={() => remove(item.id)} className="text-[8px] font-black text-white/35">{copy.remove}</button>}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-[13px] leading-5">{item.message}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        {error && <p className="mt-4 text-center text-[11px] font-bold text-red-600">{error}</p>}
      </section>

      {player && match && (
        <div className="fixed bottom-[92px] left-0 right-0 z-40 px-3">
          <form onSubmit={send} className="mx-auto flex max-w-3xl gap-2 rounded-[22px] bg-white p-2 shadow-xl">
            <input value={text} onChange={(e) => setText(e.target.value)} maxLength={500} placeholder={copy.placeholder}
              className="min-w-0 flex-1 rounded-[16px] bg-[#f4f2ea] px-4 py-3.5 text-[14px] outline-none" />
            <button type="submit" disabled={sending || !text.trim()} className="rounded-[16px] bg-[#d8ff45] px-5 text-[10px] font-black disabled:opacity-35">
              {sending ? "..." : copy.send}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
