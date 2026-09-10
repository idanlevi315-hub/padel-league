"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Match = {
  id: number;
  week: number;
  team1: string;
  team2: string;
  result_status: string;
};

type SetScore = {
  team1: string;
  team2: string;
};

export default function ResultPage() {
  const [match, setMatch] = useState<Match | null>(null);

  const [set1, setSet1] = useState<SetScore>({
    team1: "",
    team2: "",
  });

  const [set2, setSet2] = useState<SetScore>({
    team1: "",
    team2: "",
  });

  const [set3, setSet3] = useState<SetScore>({
    team1: "",
    team2: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMatch() {
      const params = new URLSearchParams(
        window.location.search
      );

      const id = Number(params.get("id"));

      if (!id) {
        setMessage("Match ID is missing.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("matches")
        .select(
          "id, week, team1, team2, result_status"
        )
        .eq("id", id)
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

  function setWinner(score: SetScore) {
    if (
      score.team1 === "" ||
      score.team2 === ""
    ) {
      return null;
    }

    const a = Number(score.team1);
    const b = Number(score.team2);

    if (a > b) return 1;
    if (b > a) return 2;

    return null;
  }

  function isValidSet(score: SetScore) {
    if (
      score.team1 === "" ||
      score.team2 === ""
    ) {
      return false;
    }

    const a = Number(score.team1);
    const b = Number(score.team2);

    if (
      !Number.isInteger(a) ||
      !Number.isInteger(b) ||
      a < 0 ||
      b < 0
    ) {
      return false;
    }

    if (a === 6 && b <= 4) return true;
    if (b === 6 && a <= 4) return true;

    if (a === 7 && b === 5) return true;
    if (b === 7 && a === 5) return true;

    if (a === 7 && b === 6) return true;
    if (b === 7 && a === 6) return true;

    return false;
  }

  const winnerSet1 = setWinner(set1);
  const winnerSet2 = setWinner(set2);

  const firstTwoCompleted =
    set1.team1 !== "" &&
    set1.team2 !== "" &&
    set2.team1 !== "" &&
    set2.team2 !== "";

  const thirdSetNeeded =
    firstTwoCompleted &&
    winnerSet1 !== null &&
    winnerSet2 !== null &&
    winnerSet1 !== winnerSet2;

  const matchFinishedInTwo =
    firstTwoCompleted &&
    winnerSet1 !== null &&
    winnerSet1 === winnerSet2;

  async function submitResult() {
    if (!match) return;

    setMessage("");

    if (!isValidSet(set1)) {
      setMessage(
        "Set 1 is not a valid padel set."
      );
      return;
    }

    if (!isValidSet(set2)) {
      setMessage(
        "Set 2 is not a valid padel set."
      );
      return;
    }

    const winner1 = setWinner(set1);
    const winner2 = setWinner(set2);

    if (!winner1 || !winner2) {
      setMessage(
        "The sets must have a winner."
      );
      return;
    }

    let finalWinner: string;
    let thirdTeam1: number | null = null;
    let thirdTeam2: number | null = null;

    if (winner1 === winner2) {
      finalWinner =
        winner1 === 1
          ? match.team1
          : match.team2;
    } else {
      if (!isValidSet(set3)) {
        setMessage(
          "The match is 1-1. Please enter a valid third set."
        );
        return;
      }

      const winner3 = setWinner(set3);

      if (!winner3) {
        setMessage(
          "The third set must have a winner."
        );
        return;
      }

      finalWinner =
        winner3 === 1
          ? match.team1
          : match.team2;

      thirdTeam1 = Number(set3.team1);
      thirdTeam2 = Number(set3.team2);
    }

    setSaving(true);

    const { error } = await supabase
      .from("matches")
      .update({
        set1_team1: Number(set1.team1),
        set1_team2: Number(set1.team2),

        set2_team1: Number(set2.team1),
        set2_team2: Number(set2.team2),

        set3_team1: thirdTeam1,
        set3_team2: thirdTeam2,

        submitted_by: match.team1,
        winner: finalWinner,

        result_status: "pending",
        status: "pending",
      })
      .eq("id", match.id);

    if (error) {
      setMessage(
        "Error: " + error.message
      );
      setSaving(false);
      return;
    }

    setMessage(
      "Result submitted successfully. Waiting for opponent confirmation."
    );

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#eee9df] p-8 text-[#24372f]">
        Loading match...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eee9df] px-5 py-8 text-[#24372f]">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-bold text-[#5f6b64]">
          MATCH RESULT
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Enter Result
        </h1>

        {match && (
          <>
            <section className="mt-6 rounded-3xl bg-white p-5 text-black">
              <p className="text-xs font-bold text-gray-400">
                WEEK {match.week}
              </p>

              <h2 className="mt-3 text-xl font-bold">
                {match.team1}
              </h2>

              <p className="my-1 text-gray-400">
                vs
              </p>

              <h2 className="text-xl font-bold">
                {match.team2}
              </h2>

              <div className="mt-7 space-y-6">
                <ScoreRow
                  label="Set 1"
                  team1={match.team1}
                  team2={match.team2}
                  score={set1}
                  setScore={setSet1}
                />

                <ScoreRow
                  label="Set 2"
                  team1={match.team1}
                  team2={match.team2}
                  score={set2}
                  setScore={setSet2}
                />

                {thirdSetNeeded && (
                  <ScoreRow
                    label="Set 3"
                    team1={match.team1}
                    team2={match.team2}
                    score={set3}
                    setScore={setSet3}
                  />
                )}

                {matchFinishedInTwo && (
                  <div className="rounded-2xl bg-lime-100 p-4 text-sm font-bold">
                    Match completed in two sets.
                  </div>
                )}
              </div>
            </section>

            <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-[#7a847e]">
              Valid set scores include 6-0 to
              6-4, 7-5 and 7-6.
            </div>

            <button
              type="button"
              onClick={submitResult}
              disabled={saving}
              className="mt-5 w-full rounded-2xl bg-[#5f6b64] py-4 text-lg font-bold text-black disabled:opacity-50"
            >
              {saving
                ? "Submitting..."
                : "Submit Result"}
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

function ScoreRow({
  label,
  team1,
  team2,
  score,
  setScore,
}: {
  label: string;
  team1: string;
  team2: string;
  score: SetScore;
  setScore: React.Dispatch<
    React.SetStateAction<SetScore>
  >;
}) {
  return (
    <div>
      <p className="mb-3 font-bold">
        {label}
      </p>

      <div className="grid grid-cols-[1fr_70px] items-center gap-3">
        <span className="truncate text-sm">
          {team1}
        </span>

        <input
          type="number"
          min="0"
          max="7"
          value={score.team1}
          onChange={(e) =>
            setScore((current) => ({
              ...current,
              team1: e.target.value,
            }))
          }
          className="rounded-xl border p-3 text-center text-lg font-bold"
        />

        <span className="truncate text-sm">
          {team2}
        </span>

        <input
          type="number"
          min="0"
          max="7"
          value={score.team2}
          onChange={(e) =>
            setScore((current) => ({
              ...current,
              team2: e.target.value,
            }))
          }
          className="rounded-xl border p-3 text-center text-lg font-bold"
        />
      </div>
    </div>
  );
} 