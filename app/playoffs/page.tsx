/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

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
  result_status: string;
  status: string;
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
  name: string;
  group: "A" | "B";
  wins: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
};

export default function PlayoffsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setMessage("");

    const teamsResponse = await supabase
      .from("teams")
      .select("id, name, group_name, status")
      .eq("status", "active");

    if (teamsResponse.error) {
      setMessage(
        "Error loading teams: " + teamsResponse.error.message
      );
      setLoading(false);
      return;
    }

    const matchesResponse = await supabase
      .from("matches")
      .select(`
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
      `);

    if (matchesResponse.error) {
      setMessage(
        "Error loading matches: " +
          matchesResponse.error.message
      );
      setLoading(false);
      return;
    }

    setTeams((teamsResponse.data ?? []) as Team[]);
    setMatches((matchesResponse.data ?? []) as Match[]);
    setLoading(false);
  }

  const groupMatches = useMemo(() => {
    return matches.filter(
      (match) =>
        match.phase === "group" &&
        match.result_status === "confirmed"
    );
  }, [matches]);

  const playoffMatches = useMemo(() => {
    return matches.filter(
      (match) => match.phase === "playoff"
    );
  }, [matches]);

  const standings = useMemo(() => {
    const table = new Map<string, Standing>();

    for (const team of teams) {
      if (
        team.group_name !== "A" &&
        team.group_name !== "B"
      ) {
        continue;
      }

      if (!team.name) {
        continue;
      }

      table.set(team.name, {
        name: team.name,
        group: team.group_name,
        wins: 0,
        setsWon: 0,
        setsLost: 0,
        gamesWon: 0,
        gamesLost: 0,
      });
    }

    for (const match of groupMatches) {
      if (match.status === "not_played") {
        continue;
      }

      const team1 = table.get(match.team1);
      const team2 = table.get(match.team2);

      if (!team1 || !team2) {
        continue;
      }

      if (match.winner === match.team1) {
        team1.wins++;
      } else if (match.winner === match.team2) {
        team2.wins++;
      }

      if (match.status === "walkover") {
        continue;
      }

      const sets = [
        [match.set1_team1, match.set1_team2],
        [match.set2_team1, match.set2_team2],
        [match.set3_team1, match.set3_team2],
      ];

      for (const [score1, score2] of sets) {
        if (score1 === null || score2 === null) {
          continue;
        }

        team1.gamesWon += score1;
        team1.gamesLost += score2;

        team2.gamesWon += score2;
        team2.gamesLost += score1;

        if (score1 > score2) {
          team1.setsWon++;
          team2.setsLost++;
        } else if (score2 > score1) {
          team2.setsWon++;
          team1.setsLost++;
        }
      }
    }

    function sortGroup(group: "A" | "B") {
      return Array.from(table.values())
        .filter((team) => team.group === group)
        .sort((a, b) => {
          if (b.wins !== a.wins) {
            return b.wins - a.wins;
          }

          const setDiffA = a.setsWon - a.setsLost;
          const setDiffB = b.setsWon - b.setsLost;

          if (setDiffB !== setDiffA) {
            return setDiffB - setDiffA;
          }

          const gameDiffA =
            a.gamesWon - a.gamesLost;

          const gameDiffB =
            b.gamesWon - b.gamesLost;

          if (gameDiffB !== gameDiffA) {
            return gameDiffB - gameDiffA;
          }

          const headToHead = groupMatches.find(
            (match) =>
              (match.team1 === a.name &&
                match.team2 === b.name) ||
              (match.team1 === b.name &&
                match.team2 === a.name)
          );

          if (headToHead?.winner === a.name) {
            return -1;
          }

          if (headToHead?.winner === b.name) {
            return 1;
          }

          return a.name.localeCompare(b.name);
        });
    }

    return {
      A: sortGroup("A"),
      B: sortGroup("B"),
    };
  }, [teams, groupMatches]);

  function findPlayoffMatch(
    round: string,
    slot: number
  ) {
    return playoffMatches.find(
      (match) =>
        match.playoff_round === round &&
        match.bracket_slot === slot
    );
  }

  const A = standings.A;
  const B = standings.B;

  const qf1 = findPlayoffMatch("quarterfinal", 1);
  const qf2 = findPlayoffMatch("quarterfinal", 2);
  const qf3 = findPlayoffMatch("quarterfinal", 3);
  const qf4 = findPlayoffMatch("quarterfinal", 4);

  const sf1 = findPlayoffMatch("semifinal", 1);
  const sf2 = findPlayoffMatch("semifinal", 2);

  const finalMatch = findPlayoffMatch("final", 1);

  function projectedTeam(
    group: Standing[],
    index: number
  ) {
    return group[index]?.name ?? "TBD";
  }

  function playoffTeam(
    match: Match | undefined,
    position: 1 | 2,
    fallback: string
  ) {
    if (!match) {
      return fallback;
    }

    return position === 1
      ? match.team1
      : match.team2;
  }

  function scoreText(match: Match | undefined) {
    if (!match) {
      return null;
    }

    if (match.result_status !== "confirmed") {
      return null;
    }

    const sets: string[] = [];

    if (
      match.set1_team1 !== null &&
      match.set1_team2 !== null
    ) {
      sets.push(
        `${match.set1_team1}-${match.set1_team2}`
      );
    }

    if (
      match.set2_team1 !== null &&
      match.set2_team2 !== null
    ) {
      sets.push(
        `${match.set2_team1}-${match.set2_team2}`
      );
    }

    if (
      match.set3_team1 !== null &&
      match.set3_team2 !== null
    ) {
      sets.push(
        `${match.set3_team1}-${match.set3_team2}`
      );
    }

    if (match.status === "walkover") {
      return "WO";
    }

    if (match.status === "retired") {
      return sets.length > 0
        ? `${sets.join(", ")} RET`
        : "RET";
    }

    return sets.length > 0
      ? sets.join(", ")
      : null;
  }

  const champion =
    finalMatch?.result_status === "confirmed" &&
    finalMatch.winner
      ? finalMatch.winner
      : "Winner Final";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f2ea] text-[#071827]">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <p className="text-sm font-bold text-[#78909c]">
            Loading playoffs...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#071827]">
      <div className="mx-auto max-w-7xl px-5 pb-28 pt-7">

        <header className="flex items-center justify-between border-b border-[#071827]/10 pb-5">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b2638] text-xs font-black text-[#d8ff45]">
              P
            </div>

            <div>
              <p className="text-[14px] font-black tracking-[0.14em]">
                PADEL
              </p>

              <p className="text-[9px] font-bold tracking-[0.34em] text-[#78909c]">
                LEAGUE
              </p>
            </div>
          </Link>

          <Link
            href="/matches"
            className="rounded-full bg-[#0b2638] px-4 py-2 text-[10px] font-black tracking-[0.12em] text-white"
          >
            MATCHES
          </Link>
        </header>

        <section className="pt-9">
          <p className="text-[10px] font-black tracking-[0.24em] text-[#78909c]">
            CHAMPIONSHIP
          </p>

          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-5xl font-black tracking-[-0.055em] md:text-6xl">
                PLAYOFFS
              </h1>

              <p className="mt-3 text-sm font-bold text-[#78909c]">
                Quarterfinals → Semifinals → Final →
                Champion
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StageStat
                value="8"
                label="TEAMS"
              />

              <StageStat
                value="7"
                label="MATCHES"
              />

              <StageStat
                value="1"
                label="CHAMPION"
                highlight
              />
            </div>
          </div>
        </section>

        {message && (
          <div className="mt-8 rounded-[24px] bg-[#fff0ee] p-5 text-sm font-bold text-[#b42318]">
            {message}
          </div>
        )}

        <section className="mt-9 rounded-[28px] bg-[#0b2638] p-4 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] text-white/40">
                KNOCKOUT BRACKET
              </p>

              <p className="mt-1 text-lg font-black text-white">
                Championship path
              </p>
            </div>

            <div className="rounded-full bg-[#d8ff45] px-4 py-2 text-[10px] font-black tracking-[0.12em] text-[#071827]">
              TOP 4 EACH GROUP
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden lg:block">
            <div className="rounded-[22px] bg-[#102f43] px-4 py-5">

              <div className="grid grid-cols-[minmax(0,1.35fr)_28px_minmax(0,1.12fr)_28px_minmax(0,1.08fr)_20px_minmax(0,0.82fr)] text-center">
                <RoundTitle title="QUARTERFINALS" />
                <div />
                <RoundTitle title="SEMIFINALS" />
                <div />
                <RoundTitle title="FINAL" />
                <div />
                <RoundTitle title="CHAMPION" />
              </div>

              <div className="mt-5 grid grid-cols-[minmax(0,1.35fr)_28px_minmax(0,1.12fr)_28px_minmax(0,1.08fr)_20px_minmax(0,0.82fr)]">

                {/* QUARTERFINALS */}
                <div className="flex h-[760px] min-w-0 flex-col justify-between py-2">
                  <MatchCard
                    code="QF1"
                    seed1="A1"
                    team1={playoffTeam(
                      qf1,
                      1,
                      projectedTeam(A, 0)
                    )}
                    seed2="B4"
                    team2={playoffTeam(
                      qf1,
                      2,
                      projectedTeam(B, 3)
                    )}
                    match={qf1}
                    score={scoreText(qf1)}
                  />

                  <MatchCard
                    code="QF2"
                    seed1="B2"
                    team1={playoffTeam(
                      qf2,
                      1,
                      projectedTeam(B, 1)
                    )}
                    seed2="A3"
                    team2={playoffTeam(
                      qf2,
                      2,
                      projectedTeam(A, 2)
                    )}
                    match={qf2}
                    score={scoreText(qf2)}
                  />

                  <MatchCard
                    code="QF3"
                    seed1="A2"
                    team1={playoffTeam(
                      qf3,
                      1,
                      projectedTeam(A, 1)
                    )}
                    seed2="B3"
                    team2={playoffTeam(
                      qf3,
                      2,
                      projectedTeam(B, 2)
                    )}
                    match={qf3}
                    score={scoreText(qf3)}
                  />

                  <MatchCard
                    code="QF4"
                    seed1="B1"
                    team1={playoffTeam(
                      qf4,
                      1,
                      projectedTeam(B, 0)
                    )}
                    seed2="A4"
                    team2={playoffTeam(
                      qf4,
                      2,
                      projectedTeam(A, 3)
                    )}
                    match={qf4}
                    score={scoreText(qf4)}
                  />
                </div>

                {/* QF CONNECTORS */}
                <div className="relative h-[760px]">
                  <BracketConnector
                    top="9%"
                    height="24%"
                  />

                  <BracketConnector
                    top="67%"
                    height="24%"
                  />
                </div>

                {/* SEMIFINALS */}
                <div className="flex h-[760px] min-w-0 flex-col justify-around">
                  <FutureMatchCard
                    code="SF1"
                    team1={
                      sf1?.team1 ??
                      qf1?.winner ??
                      "Winner QF1"
                    }
                    team2={
                      sf1?.team2 ??
                      qf2?.winner ??
                      "Winner QF2"
                    }
                    match={sf1}
                    score={scoreText(sf1)}
                  />

                  <FutureMatchCard
                    code="SF2"
                    team1={
                      sf2?.team1 ??
                      qf3?.winner ??
                      "Winner QF3"
                    }
                    team2={
                      sf2?.team2 ??
                      qf4?.winner ??
                      "Winner QF4"
                    }
                    match={sf2}
                    score={scoreText(sf2)}
                  />
                </div>

                {/* SF CONNECTOR */}
                <div className="relative h-[760px]">
                  <BracketConnector
                    top="25%"
                    height="50%"
                  />
                </div>

                {/* FINAL */}
                <div className="flex h-[760px] min-w-0 items-center">
                  <FutureMatchCard
                    code="CHAMPIONSHIP FINAL"
                    team1={
                      finalMatch?.team1 ??
                      sf1?.winner ??
                      "Winner SF1"
                    }
                    team2={
                      finalMatch?.team2 ??
                      sf2?.winner ??
                      "Winner SF2"
                    }
                    match={finalMatch}
                    score={scoreText(finalMatch)}
                    final
                  />
                </div>

                {/* FINAL CONNECTOR */}
                <div className="flex h-[760px] items-center">
                  <div className="w-full border-t-2 border-[#d8ff45]" />
                </div>

                {/* CHAMPION */}
                <div className="flex h-[760px] min-w-0 items-center">
                  <ChampionCard champion={champion} />
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE / TABLET */}
          <div className="space-y-7 lg:hidden">

            <div>
              <RoundTitle title="QUARTERFINALS" />

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <MatchCard
                  code="QF1"
                  seed1="A1"
                  team1={playoffTeam(
                    qf1,
                    1,
                    projectedTeam(A, 0)
                  )}
                  seed2="B4"
                  team2={playoffTeam(
                    qf1,
                    2,
                    projectedTeam(B, 3)
                  )}
                  match={qf1}
                  score={scoreText(qf1)}
                />

                <MatchCard
                  code="QF2"
                  seed1="B2"
                  team1={playoffTeam(
                    qf2,
                    1,
                    projectedTeam(B, 1)
                  )}
                  seed2="A3"
                  team2={playoffTeam(
                    qf2,
                    2,
                    projectedTeam(A, 2)
                  )}
                  match={qf2}
                  score={scoreText(qf2)}
                />

                <MatchCard
                  code="QF3"
                  seed1="A2"
                  team1={playoffTeam(
                    qf3,
                    1,
                    projectedTeam(A, 1)
                  )}
                  seed2="B3"
                  team2={playoffTeam(
                    qf3,
                    2,
                    projectedTeam(B, 2)
                  )}
                  match={qf3}
                  score={scoreText(qf3)}
                />

                <MatchCard
                  code="QF4"
                  seed1="B1"
                  team1={playoffTeam(
                    qf4,
                    1,
                    projectedTeam(B, 0)
                  )}
                  seed2="A4"
                  team2={playoffTeam(
                    qf4,
                    2,
                    projectedTeam(A, 3)
                  )}
                  match={qf4}
                  score={scoreText(qf4)}
                />
              </div>
            </div>

            <DownArrow />

            <div>
              <RoundTitle title="SEMIFINALS" />

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FutureMatchCard
                  code="SF1"
                  team1={
                    sf1?.team1 ??
                    qf1?.winner ??
                    "Winner QF1"
                  }
                  team2={
                    sf1?.team2 ??
                    qf2?.winner ??
                    "Winner QF2"
                  }
                  match={sf1}
                  score={scoreText(sf1)}
                />

                <FutureMatchCard
                  code="SF2"
                  team1={
                    sf2?.team1 ??
                    qf3?.winner ??
                    "Winner QF3"
                  }
                  team2={
                    sf2?.team2 ??
                    qf4?.winner ??
                    "Winner QF4"
                  }
                  match={sf2}
                  score={scoreText(sf2)}
                />
              </div>
            </div>

            <DownArrow />

            <div className="mx-auto max-w-md">
              <RoundTitle title="FINAL" />

              <div className="mt-4">
                <FutureMatchCard
                  code="CHAMPIONSHIP FINAL"
                  team1={
                    finalMatch?.team1 ??
                    sf1?.winner ??
                    "Winner SF1"
                  }
                  team2={
                    finalMatch?.team2 ??
                    sf2?.winner ??
                    "Winner SF2"
                  }
                  match={finalMatch}
                  score={scoreText(finalMatch)}
                  final
                />
              </div>
            </div>

            <DownArrow />

            <div className="mx-auto max-w-md">
              <RoundTitle title="CHAMPION" />

              <div className="mt-4">
                <ChampionCard champion={champion} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-[1.4fr_1fr]">

          <div className="rounded-[28px] bg-white p-6 shadow-[0_14px_35px_rgba(7,24,39,0.06)]">
            <p className="text-[10px] font-black tracking-[0.2em] text-[#78909c]">
              QUALIFICATION
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
              Top four from each group
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#78909c]">
              The final group standings determine the
              eight playoff seeds. Group A and Group B
              cross in the quarterfinals.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SeedPair left="A1" right="B4" />
              <SeedPair left="B2" right="A3" />
              <SeedPair left="A2" right="B3" />
              <SeedPair left="B1" right="A4" />
            </div>
          </div>

          <div className="rounded-[28px] bg-[#d8ff45] p-6">
            <p className="text-[10px] font-black tracking-[0.2em] text-[#071827]/50">
              CHAMPIONSHIP EVENT
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
              Final day
            </h2>

            <div className="mt-5 space-y-3">
              <EventLine text="Championship match" />
              <EventLine text="Prize ceremony" />
              <EventLine text="Food" />
              <EventLine text="Community gathering" />
            </div>
          </div>
        </section>

        <footer className="mt-10 flex items-center justify-between border-t border-[#071827]/10 pt-5">
          <Link
            href="/matches"
            className="text-xs font-black tracking-[0.12em] text-[#78909c]"
          >
            ← MATCHES
          </Link>

          <Link
            href="/league"
            className="text-xs font-black tracking-[0.12em] text-[#071827]"
          >
            STANDINGS →
          </Link>
        </footer>
      </div>
    </main>
  );
}

function StageStat({
  value,
  label,
  highlight = false,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[18px] px-4 py-3 ${
        highlight
          ? "bg-[#d8ff45]"
          : "bg-white"
      }`}
    >
      <p className="text-xl font-black tracking-[-0.03em]">
        {value}
      </p>

      <p
        className={`mt-1 text-[8px] font-black tracking-[0.16em] ${
          highlight
            ? "text-[#071827]/50"
            : "text-[#78909c]"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function RoundTitle({
  title,
}: {
  title: string;
}) {
  return (
    <p className="text-center text-[9px] font-black tracking-[0.18em] text-white/40">
      {title}
    </p>
  );
}

function MatchCard({
  code,
  seed1,
  team1,
  seed2,
  team2,
  match,
  score,
}: {
  code: string;
  seed1: string;
  team1: string;
  seed2: string;
  team2: string;
  match?: Match;
  score: string | null;
}) {
  const confirmed =
    match?.result_status === "confirmed";

  return (
    <div className="w-full rounded-[18px] bg-white p-3 text-[#071827] shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[9px] font-black tracking-[0.15em] text-[#78909c]">
          {code}
        </p>

        {confirmed && (
          <span className="rounded-full bg-[#d8ff45] px-2 py-0.5 text-[8px] font-black tracking-[0.08em]">
            FINAL
          </span>
        )}
      </div>

      <TeamRow
        seed={seed1}
        name={team1}
        winner={match?.winner === team1}
      />

      <div className="my-2 border-t border-[#071827]/10" />

      <TeamRow
        seed={seed2}
        name={team2}
        winner={match?.winner === team2}
      />

      {score && (
        <div className="mt-2 rounded-[10px] bg-[#f4f2ea] px-2 py-1.5 text-center">
          <p className="text-[11px] font-black">
            {score}
          </p>
        </div>
      )}
    </div>
  );
}

function FutureMatchCard({
  code,
  team1,
  team2,
  match,
  score,
  final = false,
}: {
  code: string;
  team1: string;
  team2: string;
  match?: Match;
  score: string | null;
  final?: boolean;
}) {
  return (
    <div
      className={`w-full rounded-[18px] bg-white p-3 text-[#071827] shadow-[0_12px_28px_rgba(0,0,0,0.14)] ${
        final
          ? "ring-2 ring-[#d8ff45]"
          : ""
      }`}
    >
      <p className="mb-2 text-center text-[9px] font-black tracking-[0.15em] text-[#78909c]">
        {code}
      </p>

      <FutureTeam
        name={team1}
        winner={match?.winner === team1}
      />

      <div className="my-2 border-t border-[#071827]/10" />

      <FutureTeam
        name={team2}
        winner={match?.winner === team2}
      />

      {score && (
        <div className="mt-2 rounded-[10px] bg-[#f4f2ea] px-2 py-1.5 text-center">
          <p className="text-[11px] font-black">
            {score}
          </p>
        </div>
      )}
    </div>
  );
}

function TeamRow({
  seed,
  name,
  winner,
}: {
  seed: string;
  name: string;
  winner: boolean;
}) {
  const isTbd = name === "TBD";

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="flex h-7 min-w-9 items-center justify-center rounded-[8px] bg-[#d8ff45] px-2 text-[10px] font-black">
        {seed}
      </span>

      <span
        className={`min-w-0 flex-1 truncate text-[12px] font-black ${
          isTbd ? "text-[#78909c]" : ""
        }`}
      >
        {name}
      </span>

      {winner && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d8ff45] text-[10px] font-black">
          ✓
        </span>
      )}
    </div>
  );
}

function FutureTeam({
  name,
  winner,
}: {
  name: string;
  winner: boolean;
}) {
  const future = name.startsWith("Winner");

  return (
    <div
      className={`flex min-w-0 items-center rounded-[11px] px-3 py-2 text-[12px] font-black ${
        winner
          ? "bg-[#d8ff45]"
          : "bg-[#f4f2ea]"
      } ${
        future
          ? "text-[#78909c]"
          : ""
      }`}
    >
      <span className="min-w-0 flex-1 truncate">
        {name}
      </span>

      {winner && (
        <span className="ml-2 shrink-0">
          ✓
        </span>
      )}
    </div>
  );
}

function ChampionCard({
  champion,
}: {
  champion: string;
}) {
  return (
    <div className="w-full min-w-0 rounded-[20px] bg-[#d8ff45] p-4 text-center text-[#071827] shadow-[0_16px_35px_rgba(0,0,0,0.18)]">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#071827]">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="#d8ff45"
          strokeWidth="1.8"
        >
          <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
          <path d="M6 5H4v2a4 4 0 0 0 4 4" />
          <path d="M18 5h2v2a4 4 0 0 1-4 4" />
          <path d="M12 12v5" />
          <path d="M8 20h8" />
          <path d="M9 17h6" />
        </svg>
      </div>

      <p className="mt-3 text-[9px] font-black tracking-[0.18em] text-[#071827]/50">
        CHAMPION
      </p>

      <p className="mt-1 break-words text-sm font-black leading-tight tracking-[-0.02em]">
        {champion}
      </p>
    </div>
  );
}

function BracketConnector({
  top,
  height,
}: {
  top: string;
  height: string;
}) {
  return (
    <div
      className="absolute left-0 w-full"
      style={{ top, height }}
    >
      <div className="absolute left-0 top-0 w-1/2 border-t-2 border-[#d8ff45]/35" />

      <div className="absolute bottom-0 left-0 w-1/2 border-t-2 border-[#d8ff45]/35" />

      <div className="absolute bottom-0 left-1/2 top-0 border-r-2 border-[#d8ff45]/35" />

      <div className="absolute left-1/2 top-1/2 w-1/2 border-t-2 border-[#d8ff45]/35" />
    </div>
  );
}

function DownArrow() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center">
        <div className="h-7 w-px bg-[#d8ff45]/50" />
        <div className="h-2 w-2 rotate-45 border-b-2 border-r-2 border-[#d8ff45]/50" />
      </div>
    </div>
  );
}

function SeedPair({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[16px] bg-[#f4f2ea] px-4 py-3">
      <span className="rounded-[9px] bg-[#0b2638] px-2.5 py-1 text-xs font-black text-[#d8ff45]">
        {left}
      </span>

      <span className="text-xs font-black text-[#78909c]">
        VS
      </span>

      <span className="rounded-[9px] bg-[#0b2638] px-2.5 py-1 text-xs font-black text-[#d8ff45]">
        {right}
      </span>
    </div>
  );
}

function EventLine({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#071827]/10 pb-3 last:border-b-0 last:pb-0">
      <div className="h-2 w-2 rounded-full bg-[#071827]" />

      <p className="text-sm font-black">
        {text}
      </p>
    </div>
  );}