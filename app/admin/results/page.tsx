"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Match = {
  id: number;
  week: number;
  team1: string;
  team2: string;
  status: string;
  result_status: string;
  winner: string | null;
  set1_team1: number | null;
  set1_team2: number | null;
  set2_team1: number | null;
  set2_team2: number | null;
  set3_team1: number | null;
  set3_team2: number | null;
};

export default function AdminResultsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .in("result_status", ["pending", "disputed"])
      .order("id", { ascending: false });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMatches((data ?? []) as Match[]);
    }

    setLoading(false);
  }

  function formatScore(match: Match) {
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

    return sets.join(", ");
  }

  async function approveResult(match: Match) {
    const { error } = await supabase
      .from("matches")
      .update({
        result_status: "confirmed",
        status: "completed",
      })
      .eq("id", match.id);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setMessage("Result approved.");
    await loadResults();
  }

  async function returnToPending(match: Match) {
    const { error } = await supabase
      .from("matches")
      .update({
        result_status: "pending",
        status: "pending",
      })
      .eq("id", match.id);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setMessage("Result returned to pending.");
    await loadResults();
  }

  async function resetResult(match: Match) {
    const confirmed = window.confirm(
      "Reset this result and allow it to be entered again?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("matches")
      .update({
        result_status: "scheduled",
        status: "scheduled",
        winner: null,
        submitted_by: null,
        set1_team1: null,
        set1_team2: null,
        set2_team1: null,
        set2_team2: null,
        set3_team1: null,
        set3_team2: null,
      })
      .eq("id", match.id);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setMessage("Result reset.");
    await loadResults();
  }

  return (
    <main className="min-h-screen bg-[#24372f] px-5 py-8 text-white">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-bold text-lime-300">
          ADMIN
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Results & Disputes
        </h1>

        <p className="mt-2 text-white/60">
          Review pending and disputed match results.
        </p>

        {loading && (
          <p className="mt-6 text-white/60">
            Loading results...
          </p>
        )}

        {message && (
          <div className="mt-5 rounded-2xl bg-white/10 p-4 text-center">
            {message}
          </div>
        )}

        {!loading && matches.length === 0 && (
          <div className="mt-6 rounded-3xl bg-white p-5 text-black">
            No pending or disputed results.
          </div>
        )}

        <div className="mt-6 space-y-4">
          {matches.map((match) => (
            <section
              key={match.id}
              className="rounded-3xl bg-white p-5 text-black"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">
                  WEEK {match.week}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    match.result_status === "disputed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {match.result_status === "disputed"
                    ? "DISPUTED"
                    : "PENDING"}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-bold">
                {match.team1}
              </h2>

              <p className="my-1 text-sm text-gray-400">
                vs
              </p>

              <h2 className="text-xl font-bold">
                {match.team2}
              </h2>

              <div className="mt-4 rounded-2xl bg-gray-100 p-4">
                <p className="text-sm text-gray-500">
                  Submitted result
                </p>

                <p className="mt-1 text-lg font-bold">
                  {formatScore(match) || "No score"}
                </p>

                {match.winner && (
                  <p className="mt-2 text-sm font-semibold">
                    Winner: {match.winner}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => approveResult(match)}
                className="mt-5 w-full rounded-2xl bg-lime-300 py-3 font-bold"
              >
                Approve Result
              </button>

              {match.result_status === "disputed" && (
                <button
                  type="button"
                  onClick={() => returnToPending(match)}
                  className="mt-3 w-full rounded-2xl border border-gray-300 py-3 font-bold"
                >
                  Return to Pending
                </button>
              )}

              <button
                type="button"
                onClick={() => resetResult(match)}
                className="mt-3 w-full rounded-2xl border border-red-200 py-3 font-bold text-red-600"
              >
                Reset Result
              </button>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}