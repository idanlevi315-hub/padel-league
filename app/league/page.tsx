"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { useLanguage } from "../../components/LanguageProvider";

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
  set1_team1: number | null;
  set1_team2: number | null;
  set2_team1: number | null;
  set2_team2: number | null;
  set3_team1: number | null;
  set3_team2: number | null;
};

type Standing = {
  team: string;
  played: number;
  wins: number;
  losses: number;
  setsFor: number;
  setsAgainst: number;
  gamesFor: number;
  gamesAgainst: number;
  points: number;
};

type PageCopy = {
  loading: string;
  matches: string;
  currentSeason: string;
  standings: string;
  topAdvance: string;
  groupA: string;
  groupB: string;
  rankingOrder: string;
  wins: string;
  setDifference: string;
  gameDifference: string;
  headToHead: string;
  scoring: string;
  pointsForWin: string;
  scoringText: string;
  home: string;
  playoffs: string;
  team: string;
  played: string;
  won: string;
  lost: string;
  sets: string;
  points: string;
  noTeams: string;
};

export default function LeaguePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const { language } = useLanguage();

  const copy: PageCopy =
    language === "es"
      ? {
          loading: "Cargando clasificación...",
          matches: "PARTIDOS",
          currentSeason: "TEMPORADA ACTUAL",
          standings: "CLASIFICACIÓN",
          topAdvance: "Top 4 clasifican",
          groupA: "GRUPO A",
          groupB: "GRUPO B",

          rankingOrder: "ORDEN DE CLASIFICACIÓN",
          wins: "Victorias",
          setDifference: "Diferencia de sets",
          gameDifference: "Diferencia de juegos",
          headToHead: "Enfrentamiento directo",

          scoring: "PUNTUACIÓN",
          pointsForWin: "3 puntos por victoria",
          scoringText:
            "Las derrotas y los partidos NO JUGADOS dan 0 puntos. Las victorias por incomparecencia dan 3 puntos sin crear un resultado artificial.",

          home: "INICIO",
          playoffs: "PLAYOFFS",

          team: "PAREJA",
          played: "J",
          won: "V",
          lost: "D",
          sets: "SETS",
          points: "PTS",

          noTeams: "No hay parejas asignadas.",
        }
      : {
          loading: "Loading standings...",
          matches: "MATCHES",
          currentSeason: "CURRENT SEASON",
          standings: "STANDINGS",
          topAdvance: "Top 4 advance",
          groupA: "GROUP A",
          groupB: "GROUP B",

          rankingOrder: "RANKING ORDER",
          wins: "Wins",
          setDifference: "Set difference",
          gameDifference: "Game difference",
          headToHead: "Head-to-head",

          scoring: "SCORING",
          pointsForWin: "3 points for a win",
          scoringText:
            "Losses and NOT PLAYED matches give 0 points. Walkovers give 3 points without creating an artificial score.",

          home: "HOME",
          playoffs: "PLAYOFFS",

          team: "TEAM",
          played: "P",
          won: "W",
          lost: "L",
          sets: "SETS",
          points: "PTS",

          noTeams: "No teams assigned.",
        };

  useEffect(() => {
    async function loadData() {
      const { data: teamsData } = await supabase
        .from("teams")
        .select("id, name, group_name, status")
        .eq("status", "active")
        .order("id");

      const { data: matchesData } = await supabase
        .from("matches")
        .select(`
          id,
          team1,
          team2,
          winner,
          result_status,
          status,
          phase,
          set1_team1,
          set1_team2,
          set2_team1,
          set2_team2,
          set3_team1,
          set3_team2
        `)
        .eq("phase", "group")
        .order("id");

      setTeams((teamsData ?? []) as Team[]);
      setMatches((matchesData ?? []) as Match[]);
      setLoading(false);
    }

    loadData();
  }, []);

  const groupA = useMemo(
    () => calculateStandings("A", teams, matches),
    [teams, matches]
  );

  const groupB = useMemo(
    () => calculateStandings("B", teams, matches),
    [teams, matches]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#eee9df] text-[#24372f]">
        <div className="mx-auto max-w-5xl px-5 py-10">
          <p className="text-sm font-bold text-[#7a847e]">
            {copy.loading}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eee9df] text-[#24372f]">
      <div className="mx-auto max-w-5xl px-5 pb-28 pt-7">
        {/* HEADER */}
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
            href="/matches"
            className="rounded-full bg-[#5f6b64] px-4 py-2 text-[10px] font-black tracking-[0.12em] text-white"
          >
            {copy.matches}
          </Link>
        </header>

        {/* TITLE */}
        <section className="pt-10">
          <p className="text-[10px] font-black tracking-[0.24em] text-[#7a847e]">
            {copy.currentSeason}
          </p>

          <div className="mt-3 flex items-end justify-between gap-5">
            <h1 className="text-4xl font-black tracking-[-0.055em] sm:text-5xl">
              {copy.standings}
            </h1>

            <p className="pb-1 text-sm font-bold text-[#7a847e]">
              {copy.topAdvance}
            </p>
          </div>
        </section>

        {/* TABLES */}
        <section className="mt-10 grid gap-6 xl:grid-cols-2">
          <StandingsTable
            title={copy.groupA}
            standings={groupA}
            labels={copy}
          />

          <StandingsTable
            title={copy.groupB}
            standings={groupB}
            labels={copy}
          />
        </section>

        {/* RANKING */}
        <section className="mt-8 rounded-[14px] bg-white p-6 shadow-none">
          <p className="text-[10px] font-black tracking-[0.18em] text-[#7a847e]">
            {copy.rankingOrder}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <RankingRule
              number="1"
              text={copy.wins}
            />

            <RankingRule
              number="2"
              text={copy.setDifference}
            />

            <RankingRule
              number="3"
              text={copy.gameDifference}
            />

            <RankingRule
              number="4"
              text={copy.headToHead}
            />
          </div>
        </section>

        {/* SCORING */}
        <section className="mt-6 rounded-[14px] bg-[#5f6b64] px-6 py-7 text-white">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-black tracking-[0.18em] text-white/40">
                {copy.scoring}
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.035em]">
                {copy.pointsForWin}
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-white/55">
                {copy.scoringText}
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#d9ef54] text-2xl font-black text-[#24372f]">
              3
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 flex items-center justify-between border-t border-[#24372f]/10 pt-5">
          <Link
            href="/"
            className="text-xs font-black tracking-[0.12em] text-[#7a847e]"
          >
            ← {copy.home}
          </Link>

          <Link
            href="/playoffs"
            className="text-xs font-black tracking-[0.12em] text-[#24372f]"
          >
            {copy.playoffs} →
          </Link>
        </footer>
      </div>
    </main>
  );
}

function calculateStandings(
  groupName: string,
  teams: Team[],
  matches: Match[]
) {
  const groupTeams = teams.filter(
    (team) =>
      team.group_name === groupName &&
      Boolean(team.name)
  );

  const table: Standing[] = groupTeams.map((team) => ({
    team: team.name,
    played: 0,
    wins: 0,
    losses: 0,
    setsFor: 0,
    setsAgainst: 0,
    gamesFor: 0,
    gamesAgainst: 0,
    points: 0,
  }));

  const byName = new Map(
    table.map((row) => [row.team, row])
  );

  const relevantMatches = matches.filter(
    (match) =>
      match.result_status === "confirmed" &&
      byName.has(match.team1) &&
      byName.has(match.team2)
  );

  for (const match of relevantMatches) {
    const team1 = byName.get(match.team1);
    const team2 = byName.get(match.team2);

    if (!team1 || !team2) {
      continue;
    }

    const normalizedStatus = (
      match.status ?? ""
    ).toLowerCase();

    if (normalizedStatus === "not_played") {
      continue;
    }

    if (
      normalizedStatus === "walkover" ||
      normalizedStatus === "wo"
    ) {
      if (match.winner === match.team1) {
        team1.played += 1;
        team2.played += 1;

        team1.wins += 1;
        team2.losses += 1;

        team1.points += 3;
      }

      if (match.winner === match.team2) {
        team1.played += 1;
        team2.played += 1;

        team2.wins += 1;
        team1.losses += 1;

        team2.points += 3;
      }

      continue;
    }

    if (match.winner === match.team1) {
      team1.played += 1;
      team2.played += 1;

      team1.wins += 1;
      team2.losses += 1;

      team1.points += 3;
    } else if (match.winner === match.team2) {
      team1.played += 1;
      team2.played += 1;

      team2.wins += 1;
      team1.losses += 1;

      team2.points += 3;
    }

    const sets = [
      [match.set1_team1, match.set1_team2],
      [match.set2_team1, match.set2_team2],
      [match.set3_team1, match.set3_team2],
    ];

    for (const [score1, score2] of sets) {
      if (
        score1 === null ||
        score2 === null
      ) {
        continue;
      }

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
    /* 1. WINS */
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }

    /* 2. SET DIFFERENCE */
    const setDiffA =
      a.setsFor - a.setsAgainst;

    const setDiffB =
      b.setsFor - b.setsAgainst;

    if (setDiffB !== setDiffA) {
      return setDiffB - setDiffA;
    }

    /* 3. GAME DIFFERENCE */
    const gameDiffA =
      a.gamesFor - a.gamesAgainst;

    const gameDiffB =
      b.gamesFor - b.gamesAgainst;

    if (gameDiffB !== gameDiffA) {
      return gameDiffB - gameDiffA;
    }

    /* 4. HEAD-TO-HEAD */
    const headToHead = relevantMatches.find(
      (match) =>
        (match.team1 === a.team &&
          match.team2 === b.team) ||
        (match.team1 === b.team &&
          match.team2 === a.team)
    );

    if (headToHead?.winner === a.team) {
      return -1;
    }

    if (headToHead?.winner === b.team) {
      return 1;
    }

    /* FINAL FALLBACK */
    return (a.team ?? "").localeCompare(
      b.team ?? ""
    );
  });
}

function StandingsTable({
  title,
  standings,
  labels,
}: {
  title: string;
  standings: Standing[];
  labels: PageCopy;
}) {
  return (
    <section className="overflow-hidden rounded-[14px] bg-white shadow-none">
      <div className="flex items-center justify-between bg-[#5f6b64] px-5 py-4 text-white">
        <p className="text-xs font-black tracking-[0.18em]">
          {title}
        </p>

        <span className="rounded-full bg-[#d9ef54] px-3 py-1 text-xs font-black text-[#24372f]">
          {standings.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr className="border-b border-[#24372f]/10 text-left">
              <th className="px-4 py-4 text-[10px] font-black tracking-[0.14em] text-[#7a847e]">
                #
              </th>

              <th className="px-4 py-4 text-[10px] font-black tracking-[0.14em] text-[#7a847e]">
                {labels.team}
              </th>

              <th className="px-3 py-4 text-center text-[10px] font-black tracking-[0.14em] text-[#7a847e]">
                {labels.played}
              </th>

              <th className="px-3 py-4 text-center text-[10px] font-black tracking-[0.14em] text-[#7a847e]">
                {labels.won}
              </th>

              <th className="px-3 py-4 text-center text-[10px] font-black tracking-[0.14em] text-[#7a847e]">
                {labels.lost}
              </th>

              <th className="px-3 py-4 text-center text-[10px] font-black tracking-[0.14em] text-[#7a847e]">
                {labels.sets}
              </th>

              <th className="px-3 py-4 text-center text-[10px] font-black tracking-[0.14em] text-[#7a847e]">
                {labels.points}
              </th>
            </tr>
          </thead>

          <tbody>
            {standings.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-8 text-sm text-[#7a847e]"
                >
                  {labels.noTeams}
                </td>
              </tr>
            )}

            {standings.map((row, index) => {
              const qualifies = index < 4;

              return (
                <tr
                  key={row.team}
                  className="border-b border-[#24372f]/8 last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                        qualifies
                          ? "bg-[#d9ef54] text-[#24372f]"
                          : "bg-[#eee9df] text-[#7a847e]"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </td>

                  <td className="px-4 py-4 font-black">
                    {row.team}
                  </td>

                  <td className="px-3 py-4 text-center text-sm text-[#7a847e]">
                    {row.played}
                  </td>

                  <td className="px-3 py-4 text-center text-sm font-black">
                    {row.wins}
                  </td>

                  <td className="px-3 py-4 text-center text-sm text-[#7a847e]">
                    {row.losses}
                  </td>

                  <td className="px-3 py-4 text-center text-sm text-[#7a847e]">
                    {row.setsFor}-{row.setsAgainst}
                  </td>

                  <td className="px-3 py-4 text-center">
                    <span className="rounded-full bg-[#5f6b64] px-3 py-1.5 text-sm font-black text-white">
                      {row.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RankingRule({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eee9df] text-xs font-black text-[#7a847e]">
        {number}
      </div>

      <span className="text-sm font-bold">
        {text}
      </span>
    </div>
  );
}