"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Match = {
  id: number;
  week: number;
  team1: string;
  team2: string;
  winner: string | null;
  set1_team1: number | null;
  set1_team2: number | null;
  set2_team1: number | null;
  set2_team2: number | null;
  set3_team1: number | null;
  set3_team2: number | null;
};

export default function ConfirmResultPage() {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMatch() {
      const params = new URLSearchParams(
        window.location.search
      );

      const matchId = params.get("id");

      if (!matchId) {
        setMessage("Match ID is missing.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("id", Number(matchId))
        .maybeSingle();

      if (error) {
        setMessage("Error: " + error.message);
      } else if (!data) {
        setMessage("Match not found.");
      } else {
        setMatch(data as Match);
      }

      setLoading(false);
    }

    loadMatch();
  }, []);

  async function confirmResult() {
    if (!match) return;

    const { error } = await supabase
      .from("matches")
      .update({
        result_status: "confirmed",
        status: "completed",
      })
      .eq("id", match.id);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Result confirmed successfully!");
    }
  }

  async function disputeResult() {
    if (!match) return;

    const { error } = await supabase
      .from("matches")
      .update({
        result_status: "disputed",
        status: "disputed",
      })
      .eq("id", match.id);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Result sent to admin for review.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#eee9df] p-8 text-[#24372f]">
        Loading result...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eee9df] px-5 py-8 text-[#24372f]">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-bold text-[#5f6b64]">
          RESULT CONFIRMATION
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Confirm Result
        </h1>

        {match && (
          <>
            <section className="mt-6 rounded-[16px] border border-[#5f6b64]/15 bg-white/45 p-6 text-[#24372f]">
              <p className="text-sm font-bold text-gray-400">
                WEEK {match.week}
              </p>

              <h2 className="mt-3 text-xl font-bold">
                {match.team1} vs {match.team2}
              </h2>

              <div className="mt-6 space-y-3 text-lg">
                <div className="flex justify-between">
                  <span>Set 1</span>
                  <strong>
                    {match.set1_team1} - {match.set1_team2}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span>Set 2</span>
                  <strong>
                    {match.set2_team1} - {match.set2_team2}
                  </strong>
                </div>

                {match.set3_team1 !== null &&
                  match.set3_team2 !== null && (
                    <div className="flex justify-between">
                      <span>Set 3</span>
                      <strong>
                        {match.set3_team1} - {match.set3_team2}
                      </strong>
                    </div>
                  )}
              </div>

              {match.winner && (
                <p className="mt-5 font-bold">
                  Winner: {match.winner}
                </p>
              )}
            </section>

            <button
              type="button"
              onClick={confirmResult}
              className="mt-6 w-full rounded-2xl bg-[#5f6b64] py-4 text-lg font-bold text-black"
            >
              Confirm Result
            </button>

            <button
              type="button"
              onClick={disputeResult}
              className="mt-3 w-full rounded-2xl border border-white/20 py-4 font-bold"
            >
              Dispute Result
            </button>
          </>
        )}

        {message && (
          <div className="mt-5 rounded-2xl bg-white/10 p-4 text-center">
            {message}
          </div>
        )}

        <Link
          href="/matches"
          className="mt-6 block text-center text-[#7a847e]"
        >
          ← Back to matches
        </Link>
      </div>
    </main>
  );
}