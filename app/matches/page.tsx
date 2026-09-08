"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Match = {
  id: number;
  week: number | null;
  team1: string;
  team2: string;
  status: string;
  result_status: string;
  winner: string | null;

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

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("matches")
      .select(`
        id,
        week,
        team1,
        team2,
        status,
        result_status,
        winner,
        phase,
        playoff_round,
        bracket_slot,
        set1_team1,
        set1_team2,
        set2_team1,
        set2_team2,
        set3_team1,
        set3_team2
      `)
      .order("week", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      setMessage("Error loading matches: " + error.message);
      setLoading(false);
      return;
    }

    setMatches((data ?? []) as Match[]);
    setLoading(false);
  }

  const groupMatches = useMemo(
    () =>
      matches.filter(
        (match) =>
          !match.phase ||
          match.phase === "group"
      ),
    [matches]
  );

  const quarterfinals = useMemo(
    () =>
      matches
        .filter(
          (match) =>
            match.phase === "playoff" &&
            match.playoff_round === "quarterfinal"
        )
        .sort(
          (a, b) =>
            (a.bracket_slot ?? 0) -
            (b.bracket_slot ?? 0)
        ),
    [matches]
  );

  const semifinals = useMemo(
    () =>
      matches
        .filter(
          (match) =>
            match.phase === "playoff" &&
            match.playoff_round === "semifinal"
        )
        .sort(
          (a, b) =>
            (a.bracket_slot ?? 0) -
            (b.bracket_slot ?? 0)
        ),
    [matches]
  );

  const finals = useMemo(
    () =>
      matches.filter(
        (match) =>
          match.phase === "playoff" &&
          match.playoff_round === "final"
      ),
    [matches]
  );

  const groupByWeek = useMemo(() => {
    const weeks = new Map<number, Match[]>();

    for (const match of groupMatches) {
      const week = match.week ?? 0;

      if (!weeks.has(week)) {
        weeks.set(week, []);
      }

      weeks.get(week)!.push(match);
    }

    return Array.from(weeks.entries()).sort(
      (a, b) => a[0] - b[0]
    );
  }, [groupMatches]);

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#071827]">
      <div className="mx-auto max-w-5xl px-5 pb-24 pt-7">
        <header className="flex items-center justify-between border-b border-[#071827]/10 pb-5">
          <Link href="/" className="flex items-center gap-3">
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
            href="/league"
            className="rounded-full bg-[#0b2638] px-4 py-2 text-[10px] font-black tracking-[0.12em] text-white"
          >
            STANDINGS
          </Link>
        </header>

        <section className="pt-10">
          <p className="text-[10px] font-black tracking-[0.24em] text-[#78909c]">
            CURRENT SEASON
          </p>

          <div className="mt-3 flex items-end justify-between gap-5">
            <h1 className="text-5xl font-black tracking-[-0.055em]">
              MATCHES
            </h1>

            <p className="pb-1 text-sm font-bold text-[#78909c]">
              {matches.length} total
            </p>
          </div>
        </section>

        {loading && (
          <section className="mt-10 rounded-[24px] bg-white p-6 shadow-[0_14px_35px_rgba(7,24,39,0.06)]">
            <p className="text-sm font-bold text-[#78909c]">
              Loading matches...
            </p>
          </section>
        )}

        {message && (
          <section className="mt-8 rounded-[24px] bg-[#fff0ee] p-5 text-sm font-bold text-[#b42318]">
            {message}
          </section>
        )}

        {!loading && !message && (
          <>
            <section className="mt-10">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] text-[#78909c]">
                    GROUP STAGE
                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                    League Matches
                  </h2>
                </div>

                <div className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#78909c] shadow-[0_8px_24px_rgba(7,24,39,0.05)]">
                  {groupMatches.length}
                </div>
              </div>

              {groupMatches.length === 0 ? (
                <EmptyCard text="No group-stage matches yet." />
              ) : (
                <div className="mt-7 space-y-10">
                  {groupByWeek.map(
                    ([week, weekMatches]) => (
                      <section key={week}>
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-9 min-w-9 items-center justify-center rounded-full bg-[#0b2638] px-3 text-xs font-black text-[#d8ff45]">
                            {week}
                          </div>

                          <div>
                            <p className="text-[10px] font-black tracking-[0.18em] text-[#78909c]">
                              WEEK
                            </p>

                            <p className="text-sm font-black">
                              Match Week {week}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {weekMatches.map((match) => (
                            <MatchCard
                              key={match.id}
                              match={match}
                            />
                          ))}
                        </div>
                      </section>
                    )
                  )}
                </div>
              )}
            </section>

            <section className="mt-14 border-t border-[#071827]/10 pt-10">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] text-[#78909c]">
                    CHAMPIONSHIP
                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
                    Playoffs
                  </h2>
                </div>

                <Link
                  href="/playoffs"
                  className="text-xs font-black tracking-[0.12em] text-[#071827]"
                >
                  FULL BRACKET →
                </Link>
              </div>

              <div className="mt-7 grid gap-5 lg:grid-cols-3">
                <PlayoffRound
                  title="Quarterfinals"
                  matches={quarterfinals}
                />

                <PlayoffRound
                  title="Semifinals"
                  matches={semifinals}
                />

                <PlayoffRound
                  title="Final"
                  matches={finals}
                  finalRound
                />
              </div>
            </section>

            <section className="mt-10 rounded-[28px] bg-[#0b2638] px-6 py-7 text-white">
              <p className="text-[10px] font-black tracking-[0.2em] text-white/40">
                RESULT PROCESS
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                <ProcessStep
                  number="1"
                  title="Enter"
                  text="One team submits the result."
                />

                <ProcessStep
                  number="2"
                  title="Confirm"
                  text="The opponent confirms it."
                />

                <ProcessStep
                  number="3"
                  title="Official"
                  text="The result updates the standings."
                />
              </div>
            </section>
          </>
        )}

        <footer className="mt-10 flex items-center justify-between border-t border-[#071827]/10 pt-5">
          <Link
            href="/"
            className="text-xs font-black tracking-[0.12em] text-[#78909c]"
          >
            ← HOME
          </Link>

          <Link
            href="/playoffs"
            className="text-xs font-black tracking-[0.12em] text-[#071827]"
          >
            PLAYOFFS →
          </Link>
        </footer>
      </div>
    </main>
  );
}

function PlayoffRound({
  title,
  matches,
  finalRound = false,
}: {
  title: string;
  matches: Match[];
  finalRound?: boolean;
}) {
  return (
    <section
      className={`rounded-[26px] p-5 ${
        finalRound
          ? "bg-[#d8ff45]"
          : "bg-white shadow-[0_14px_35px_rgba(7,24,39,0.06)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p
            className={`text-[10px] font-black tracking-[0.18em] ${
              finalRound
                ? "text-[#071827]/45"
                : "text-[#78909c]"
            }`}
          >
            PLAYOFF ROUND
          </p>

          <h3 className="mt-1 text-xl font-black tracking-[-0.03em]">
            {title}
          </h3>
        </div>

        <div
          className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-black ${
            finalRound
              ? "bg-[#071827] text-white"
              : "bg-[#f4f2ea] text-[#78909c]"
          }`}
        >
          {matches.length}
        </div>
      </div>

      {matches.length === 0 ? (
        <div
          className={`mt-5 border-t pt-5 text-sm ${
            finalRound
              ? "border-[#071827]/15 text-[#071827]/50"
              : "border-[#071827]/8 text-[#78909c]"
          }`}
        >
          Not created yet
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              playoff
              compact
            />
          ))}
        </div>
      )}
    </section>
  );
}

function MatchCard({
  match,
  playoff = false,
  compact = false,
}: {
  match: Match;
  playoff?: boolean;
  compact?: boolean;
}) {
  const score = getScore(match);

  const scheduled =
    match.result_status === "scheduled";

  const pending =
    match.result_status === "pending";

  const disputed =
    match.result_status === "disputed";

  const confirmed =
    match.result_status === "confirmed";

  return (
    <div
      className={`rounded-[24px] bg-white ${
        compact
          ? "border border-[#071827]/8 p-4 shadow-none"
          : "p-5 shadow-[0_14px_35px_rgba(7,24,39,0.06)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-black tracking-[0.16em] text-[#78909c]">
          {playoff
            ? playoffLabel(match)
            : `WEEK ${match.week ?? "-"}`}
        </p>

        <StatusBadge match={match} />
      </div>

      <div className="mt-5">
        <TeamLine
          name={match.team1}
          winner={
            confirmed &&
            match.winner === match.team1
          }
        />

        <div className="my-4 border-t border-[#071827]/8" />

        <TeamLine
          name={match.team2}
          winner={
            confirmed &&
            match.winner === match.team2
          }
        />
      </div>

      {score && (
        <div className="mt-5 rounded-[16px] bg-[#f4f2ea] px-4 py-3">
          <p className="text-[9px] font-black tracking-[0.18em] text-[#78909c]">
            SCORE
          </p>

          <p className="mt-1 text-lg font-black tracking-[-0.02em]">
            {score}
          </p>
        </div>
      )}

      {scheduled && (
        <Link
          href={`/result?id=${match.id}`}
          className="mt-5 block rounded-[14px] bg-[#d8ff45] px-4 py-3 text-center text-sm font-black text-[#071827]"
        >
          ENTER RESULT
        </Link>
      )}

      {pending && (
        <>
          <p className="mt-5 text-center text-xs font-bold text-[#b26b00]">
            Awaiting opponent confirmation
          </p>

          <Link
            href={`/confirm-result?id=${match.id}`}
            className="mt-3 block rounded-[14px] bg-[#0b2638] px-4 py-3 text-center text-sm font-black text-white"
          >
            CONFIRM RESULT
          </Link>
        </>
      )}

      {disputed && (
        <p className="mt-5 rounded-[14px] bg-[#fff0ee] px-4 py-3 text-center text-xs font-bold text-[#b42318]">
          Result disputed — admin review required
        </p>
      )}

      {confirmed && (
        <p className="mt-5 text-center text-xs font-black tracking-[0.08em] text-[#247a4b]">
          RESULT CONFIRMED
        </p>
      )}
    </div>
  );
}

function TeamLine({
  name,
  winner,
}: {
  name: string;
  winner: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="min-w-0 truncate text-[15px] font-black tracking-[-0.02em]">
        {name}
      </span>

      {winner && (
        <span className="shrink-0 rounded-full bg-[#d8ff45] px-3 py-1 text-[10px] font-black tracking-[0.1em]">
          WINNER
        </span>
      )}
    </div>
  );
}

function StatusBadge({
  match,
}: {
  match: Match;
}) {
  let text = "Scheduled";
  let className =
    "bg-[#f4f2ea] text-[#78909c]";

  if (match.status === "not_played") {
    text = "Not Played";
    className =
      "bg-[#ecebe6] text-[#6b7280]";
  } else if (
    match.status === "walkover"
  ) {
    text = "Walkover";
    className =
      "bg-[#eee9ff] text-[#6842a5]";
  } else if (
    match.status === "retired"
  ) {
    text = "RET";
    className =
      "bg-[#fff0dc] text-[#a75c00]";
  } else if (
    match.result_status === "pending"
  ) {
    text = "Pending";
    className =
      "bg-[#fff4cc] text-[#956000]";
  } else if (
    match.result_status === "disputed"
  ) {
    text = "Disputed";
    className =
      "bg-[#fff0ee] text-[#b42318]";
  } else if (
    match.result_status === "confirmed"
  ) {
    text = "Confirmed";
    className =
      "bg-[#e8f5ec] text-[#247a4b]";
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-black tracking-[0.06em] ${className}`}
    >
      {text}
    </span>
  );
}

function playoffLabel(match: Match) {
  if (
    match.playoff_round === "quarterfinal"
  ) {
    return `QUARTERFINAL ${match.bracket_slot ?? ""}`;
  }

  if (
    match.playoff_round === "semifinal"
  ) {
    return `SEMIFINAL ${match.bracket_slot ?? ""}`;
  }

  if (match.playoff_round === "final") {
    return "CHAMPIONSHIP FINAL";
  }

  return "PLAYOFF";
}

function getScore(match: Match) {
  if (
    match.status === "walkover"
  ) {
    return "WO";
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

  if (match.status === "retired") {
    return sets.length
      ? `${sets.join(", ")} RET`
      : "RET";
  }

  return sets.length
    ? sets.join(", ")
    : null;
}

function EmptyCard({
  text,
}: {
  text: string;
}) {
  return (
    <div className="mt-6 rounded-[24px] border border-dashed border-[#071827]/15 bg-white/40 p-7 text-center text-sm font-bold text-[#78909c]">
      {text}
    </div>
  );
}

function ProcessStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d8ff45] text-xs font-black text-[#071827]">
        {number}
      </div>

      <div>
        <p className="font-black">
          {title}
        </p>

        <p className="mt-1 text-sm leading-5 text-white/45">
          {text}
        </p>
      </div>
    </div>
  );
}