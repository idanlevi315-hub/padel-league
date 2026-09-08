"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

type Team = {
  id: number;
  name: string;
  group_name: string | null;
  status: string | null;
};

type Match = {
  id: number;
  team1: string;
  team2: string;
  winner: string | null;
  result_status: string | null;
  status: string | null;
  phase: string | null;
  playoff_round: string | null;
  bracket_slot: number | null;
  set1_team1: number | null;
  set1_team2: number | null;
  set2_team1: number | null;
  set2_team2: number | null;
  set3_team1: number | null;
  set3_team2: number | null;
};

type Standing = {
  team: string;
  wins: number;
  setsFor: number;
  setsAgainst: number;
  gamesFor: number;
  gamesAgainst: number;
};

export default function AdminPlayoffPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);

    const { data: teamsData } = await supabase
      .from("teams")
      .select("id, name, group_name, status")
      .eq("status", "active")
      .order("id");

    const { data: matchesData } = await supabase
      .from("matches")
      .select(
        `
        id,
        team1,
        team2,
        winner,
        result_status,
        status,
        phase,
        playoff_round,
        bracket_slot,
        set1_team1,
        set1_team2,
        set2_team1,
        set2_team2,
        set3_team1,
        set3_team2
        `
      )
      .order("id");

    setTeams((teamsData ?? []) as Team[]);
    setMatches((matchesData ?? []) as Match[]);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const groupMatches = useMemo(
    () => matches.filter((match) => match.phase === "group"),
    [matches]
  );

  const playoffMatches = useMemo(
    () => matches.filter((match) => match.phase === "playoff"),
    [matches]
  );

  function calculateStandings(groupName: string) {
    const groupTeams = teams.filter(
      (team) => team.group_name === groupName
    );

    const table: Standing[] = groupTeams.map((team) => ({
      team: team.name,
      wins: 0,
      setsFor: 0,
      setsAgainst: 0,
      gamesFor: 0,
      gamesAgainst: 0,
    }));

    const byName = new Map(table.map((row) => [row.team, row]));

    const confirmedMatches = groupMatches.filter(
      (match) =>
        match.result_status === "confirmed" &&
        byName.has(match.team1) &&
        byName.has(match.team2)
    );

    for (const match of confirmedMatches) {
      const team1 = byName.get(match.team1);
      const team2 = byName.get(match.team2);

      if (!team1 || !team2) continue;

      if (match.winner === match.team1) {
        team1.wins += 1;
      }

      if (match.winner === match.team2) {
        team2.wins += 1;
      }

      const sets = [
        [match.set1_team1, match.set1_team2],
        [match.set2_team1, match.set2_team2],
        [match.set3_team1, match.set3_team2],
      ];

      for (const [score1, score2] of sets) {
        if (score1 === null || score2 === null) continue;

        team1.gamesFor += score1;
        team1.gamesAgainst += score2;

        team2.gamesFor += score2;
        team2.gamesAgainst += score1;

        if (score1 > score2) {
          team1.setsFor += 1;
          team2.setsAgainst += 1;
        } else if (score2 > score1) {
          team2.setsFor += 1;
          team1.setsAgainst += 1;
        }
      }
    }

    return table.sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      const setDiffA = a.setsFor - a.setsAgainst;
      const setDiffB = b.setsFor - b.setsAgainst;

      if (setDiffB !== setDiffA) {
        return setDiffB - setDiffA;
      }

      const gameDiffA = a.gamesFor - a.gamesAgainst;
      const gameDiffB = b.gamesFor - b.gamesAgainst;

      if (gameDiffB !== gameDiffA) {
        return gameDiffB - gameDiffA;
      }

      return a.team.localeCompare(b.team);
    });
  }

  const groupA = calculateStandings("A");
  const groupB = calculateStandings("B");

  const quarterfinals = playoffMatches.filter(
    (match) => match.playoff_round === "quarterfinal"
  );

  const allGroupMatchesConfirmed =
    groupMatches.length > 0 &&
    groupMatches.every(
      (match) => match.result_status === "confirmed"
    );

  async function createQuarterfinals() {
    setMessage("");

    if (groupA.length < 4 || groupB.length < 4) {
      setMessage(
        "You need at least four active teams in Group A and Group B."
      );
      return;
    }

    if (!allGroupMatchesConfirmed) {
      setMessage(
        "All group-stage matches must be confirmed before creating the playoffs."
      );
      return;
    }

    if (quarterfinals.length > 0) {
      setMessage("Quarterfinals already exist.");
      return;
    }

    setCreating(true);

    const rows = [
      {
        week: 1001,
        team1: groupA[0].team,
        team2: groupB[3].team,
        status: "scheduled",
        result_status: "scheduled",
        phase: "playoff",
        playoff_round: "quarterfinal",
        bracket_slot: 1,
      },
      {
        week: 1001,
        team1: groupB[1].team,
        team2: groupA[2].team,
        status: "scheduled",
        result_status: "scheduled",
        phase: "playoff",
        playoff_round: "quarterfinal",
        bracket_slot: 2,
      },
      {
        week: 1001,
        team1: groupA[1].team,
        team2: groupB[2].team,
        status: "scheduled",
        result_status: "scheduled",
        phase: "playoff",
        playoff_round: "quarterfinal",
        bracket_slot: 3,
      },
      {
        week: 1001,
        team1: groupB[0].team,
        team2: groupA[3].team,
        status: "scheduled",
        result_status: "scheduled",
        phase: "playoff",
        playoff_round: "quarterfinal",
        bracket_slot: 4,
      },
    ];

    const { error } = await supabase
      .from("matches")
      .insert(rows);

    if (error) {
      setMessage(`Error: ${error.message}`);
      setCreating(false);
      return;
    }

    setMessage("Quarterfinals created successfully.");
    setCreating(false);
    await loadData();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020b12] p-6 text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020b12] text-white">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="border-b border-white/10 pb-6">
          <p className="text-xs font-black tracking-[0.22em] text-[#c7ff37]">
            ADMIN
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Playoffs
          </h1>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <StandingTable
            title="GROUP A"
            standings={groupA}
          />

          <StandingTable
            title="GROUP B"
            standings={groupB}
          />
        </div>

        <section className="mt-8 border border-white/10 bg-[#071827] p-6">
          <p className="text-xs font-black tracking-[0.18em] text-white/40">
            PLAYOFF STATUS
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <StatusItem
              label="Group A Teams"
              value={`${groupA.length}/4`}
            />

            <StatusItem
              label="Group B Teams"
              value={`${groupB.length}/4`}
            />

            <StatusItem
              label="Quarterfinals"
              value={`${quarterfinals.length}/4`}
            />
          </div>

          <button
            type="button"
            onClick={createQuarterfinals}
            disabled={creating}
            className="mt-7 w-full bg-[#c7ff37] px-5 py-4 font-black text-[#020b12] disabled:opacity-40"
          >
            {creating
              ? "CREATING..."
              : "CREATE QUARTERFINALS"}
          </button>

          {message && (
            <p className="mt-4 text-sm text-white/60">
              {message}
            </p>
          )}
        </section>

        <div className="mt-8 flex gap-6">
          <Link
            href="/playoffs"
            className="text-sm font-black text-[#c7ff37]"
          >
            VIEW PUBLIC BRACKET →
          </Link>

          <Link
            href="/admin"
            className="text-sm font-bold text-white/40"
          >
            ← ADMIN
          </Link>
        </div>
      </div>
    </main>
  );
}

function StandingTable({
  title,
  standings,
}: {
  title: string;
  standings: Standing[];
}) {
  return (
    <div className="border border-white/10 bg-[#071827] p-5">
      <h2 className="text-sm font-black tracking-[0.18em] text-white/50">
        {title}
      </h2>

      <div className="mt-4">
        {standings.length === 0 && (
          <p className="text-sm text-white/30">
            No teams assigned.
          </p>
        )}

        {standings.map((row, index) => (
          <div
            key={row.team}
            className="flex items-center justify-between border-t border-white/10 py-3 first:border-t-0"
          >
            <div className="flex items-center gap-4">
              <span className="w-5 text-sm font-black text-[#c7ff37]">
                {index + 1}
              </span>

              <span className="font-bold">
                {row.team}
              </span>
            </div>

            <span className="text-sm text-white/40">
              {row.wins} W
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-white/10 pt-4">
      <p className="text-3xl font-black text-[#c7ff37]">
        {value}
      </p>

      <p className="mt-1 text-xs font-bold text-white/35">
        {label}
      </p>
    </div>
  );
}