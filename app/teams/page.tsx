"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Team = {
  id: number;
  name: string;
  player1: string;
  player2: string;
  level: number | null;
  group_name: string | null;
  status: string | null;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      const { data } = await supabase
        .from("teams")
        .select(
          "id, name, player1, player2, level, group_name, status"
        )
        .eq("status", "active")
        .order("group_name")
        .order("id");

      setTeams((data ?? []) as Team[]);
      setLoading(false);
    }

    loadTeams();
  }, []);

  const groupA = useMemo(
    () => teams.filter((team) => team.group_name === "A"),
    [teams]
  );

  const groupB = useMemo(
    () => teams.filter((team) => team.group_name === "B"),
    [teams]
  );

  const unassigned = useMemo(
    () => teams.filter((team) => !team.group_name),
    [teams]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#eee9df] text-[#24372f]">
        <div className="mx-auto max-w-4xl px-5 py-10">
          <p className="text-sm font-bold text-[#7a847e]">
            Loading teams...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eee9df] text-[#24372f]">
      <div className="mx-auto max-w-4xl px-5 pb-24 pt-7">
        <header className="flex items-center justify-between border-b border-[#24372f]/10 pb-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5f6b64] text-xs font-black text-[#d9ef54]">
              P
            </div>

            <div>
              <p className="text-[14px] font-black tracking-[0.14em]">
                PADEL
              </p>

              <p className="text-[9px] font-bold tracking-[0.34em] text-[#7a847e]">
                LEAGUE
              </p>
            </div>
          </Link>

          <Link
            href="/join"
            className="rounded-full bg-[#5f6b64] px-4 py-2 text-[10px] font-black tracking-[0.12em] text-white"
          >
            REGISTER
          </Link>
        </header>

        <section className="pt-10">
          <p className="text-[10px] font-black tracking-[0.24em] text-[#7a847e]">
            CURRENT SEASON
          </p>

          <div className="mt-3 flex items-end justify-between gap-5">
            <h1 className="text-5xl font-black tracking-[-0.055em]">
              TEAMS
            </h1>

            <p className="pb-1 text-sm font-bold text-[#7a847e]">
              {teams.length} active
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <GroupBlock
            title="GROUP A"
            teams={groupA}
          />

          <GroupBlock
            title="GROUP B"
            teams={groupB}
          />
        </section>

        {unassigned.length > 0 && (
          <section className="mt-5 rounded-[14px] bg-white p-5 shadow-none">
            <div className="flex items-center justify-between border-b border-[#24372f]/10 pb-4">
              <p className="text-[10px] font-black tracking-[0.18em] text-[#7a847e]">
                UNASSIGNED
              </p>

              <span className="text-xs font-black text-[#5f6b64]">
                {unassigned.length}
              </span>
            </div>

            <div>
              {unassigned.map((team) => (
                <TeamRow key={team.id} team={team} />
              ))}
            </div>
          </section>
        )}

        {teams.length === 0 && (
          <section className="mt-8 rounded-[14px] bg-white p-6 shadow-none">
            <p className="text-sm text-[#7a847e]">
              No active teams yet.
            </p>
          </section>
        )}

        <section className="mt-10 rounded-[14px] bg-[#d9ef54] px-6 py-7">
          <p className="text-[10px] font-black tracking-[0.18em] text-[#24372f]/50">
            REGISTRATION
          </p>

          <div className="mt-2 flex items-end justify-between gap-5">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.04em]">
                Join the league
              </h2>

              <p className="mt-2 text-sm text-[#24372f]/60">
                Register your team for the current season.
              </p>
            </div>

            <Link
              href="/join"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#24372f] text-xl text-white"
            >
              →
            </Link>
          </div>
        </section>

        <footer className="mt-10 flex items-center justify-between border-t border-[#24372f]/10 pt-5">
          <Link
            href="/"
            className="text-xs font-black tracking-[0.12em] text-[#7a847e]"
          >
            ← HOME
          </Link>

          <span className="text-[10px] font-black tracking-[0.12em] text-[#24372f]/25">
            PADEL LEAGUE
          </span>
        </footer>
      </div>
    </main>
  );
}

function GroupBlock({
  title,
  teams,
}: {
  title: string;
  teams: Team[];
}) {
  return (
    <section className="overflow-hidden rounded-[14px] bg-white shadow-none">
      <div className="flex items-center justify-between bg-[#5f6b64] px-5 py-4 text-white">
        <p className="text-xs font-black tracking-[0.18em]">
          {title}
        </p>

        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#d9ef54] px-2 text-xs font-black text-[#24372f]">
          {teams.length}
        </span>
      </div>

      <div className="px-5">
        {teams.length === 0 ? (
          <p className="py-6 text-sm text-[#7a847e]">
            No teams assigned.
          </p>
        ) : (
          teams.map((team, index) => (
            <TeamRow
              key={team.id}
              team={team}
              rank={index + 1}
            />
          ))
        )}
      </div>
    </section>
  );
}

function TeamRow({
  team,
  rank,
}: {
  team: Team;
  rank?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#24372f]/8 py-5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-4">
        {rank !== undefined && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eee9df] text-xs font-black text-[#7a847e]">
            {rank}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate font-black tracking-[-0.02em]">
            {team.name}
          </p>

          <p className="mt-1 truncate text-sm text-[#7a847e]">
            {team.player1} · {team.player2}
          </p>
        </div>
      </div>

      {team.level !== null && (
        <div className="shrink-0 rounded-full bg-[#d9ef54] px-3 py-1.5 text-xs font-black text-[#24372f]">
          {team.level}
        </div>
      )}
    </div>
  );
}