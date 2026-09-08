"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Team = {
  id: number;
  name: string;
  group_name: string;
  status: string;
};

type Match = {
  id: number;
  week: number;
  team1: string;
  team2: string;
  status: string;
  result_status: string;
};

type ScheduleMatch = {
  week: number;
  team1: string;
  team2: string;
};

export default function AdminMatchesPage() {
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
      .select("id, week, team1, team2, status, result_status")
      .order("week", { ascending: true })
      .order("id", { ascending: true });

    if (matchesResponse.error) {
      setMessage(
        "Error loading matches: " + matchesResponse.error.message
      );
      setLoading(false);
      return;
    }

    setTeams((teamsResponse.data ?? []) as Team[]);
    setMatches((matchesResponse.data ?? []) as Match[]);
    setLoading(false);
  }

  function createRoundRobin(teamNames: string[]) {
    const teams = [...teamNames];

    if (teams.length < 2) {
      return [];
    }

    if (teams.length % 2 !== 0) {
      teams.push("BYE");
    }

    const schedule: ScheduleMatch[] = [];

    const totalTeams = teams.length;
    const totalWeeks = totalTeams - 1;
    const matchesPerWeek = totalTeams / 2;

    let rotation = [...teams];

    for (let week = 1; week <= totalWeeks; week++) {
      for (let i = 0; i < matchesPerWeek; i++) {
        const team1 = rotation[i];
        const team2 = rotation[totalTeams - 1 - i];

        if (team1 !== "BYE" && team2 !== "BYE") {
          schedule.push({
            week,
            team1,
            team2,
          });
        }
      }

      const firstTeam = rotation[0];
      const rest = rotation.slice(1);

      const lastTeam = rest.pop();

      if (lastTeam) {
        rest.unshift(lastTeam);
      }

      rotation = [firstTeam, ...rest];
    }

    return schedule;
  }

  function buildScheduleRows() {
    const groupA = teams
      .filter((team) => team.group_name === "A")
      .map((team) => team.name);

    const groupB = teams
      .filter((team) => team.group_name === "B")
      .map((team) => team.name);

    const groupAMatches = createRoundRobin(groupA);
    const groupBMatches = createRoundRobin(groupB);

    return [...groupAMatches, ...groupBMatches].map((match) => ({
      week: match.week,
      team1: match.team1,
      team2: match.team2,

      status: "scheduled",
      result_status: "scheduled",

      winner: null,
      submitted_by: null,

      set1_team1: null,
      set1_team2: null,

      set2_team1: null,
      set2_team2: null,

      set3_team1: null,
      set3_team2: null,
    }));
  }

  async function generateSchedule() {
    setMessage("");

    if (matches.length > 0) {
      setMessage(
        "A schedule already exists. Use Rebuild Scheduled Matches if you need to update it."
      );
      return;
    }

    const rows = buildScheduleRows();

    if (rows.length === 0) {
      setMessage(
        "No matches could be generated. Each group needs at least 2 active teams."
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("matches")
      .insert(rows);

    if (error) {
      setMessage(
        "Error creating schedule: " + error.message
      );
      setLoading(false);
      return;
    }

    setMessage(
      `Schedule created successfully! ${rows.length} matches added.`
    );

    await loadData();
  }

  async function rebuildScheduledMatches() {
    const protectedMatches = matches.filter(
      (match) => match.result_status !== "scheduled"
    );

    if (protectedMatches.length > 0) {
      setMessage(
        "Schedule cannot be rebuilt because some matches already have results or are pending."
      );
      return;
    }

    const confirmed = window.confirm(
      "Delete all currently scheduled matches and build the schedule again?"
    );

    if (!confirmed) return;

    const rows = buildScheduleRows();

    if (rows.length === 0) {
      setMessage(
        "No matches could be generated. Each group needs at least 2 active teams."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    const { error: deleteError } = await supabase
      .from("matches")
      .delete()
      .eq("result_status", "scheduled");

    if (deleteError) {
      setMessage(
        "Error deleting scheduled matches: " +
          deleteError.message
      );
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("matches")
      .insert(rows);

    if (insertError) {
      setMessage(
        "Error rebuilding schedule: " +
          insertError.message
      );
      setLoading(false);
      return;
    }

    setMessage(
      `Schedule rebuilt successfully! ${rows.length} matches created.`
    );

    await loadData();
  }

  async function markNotPlayed(match: Match) {
    const confirmed = window.confirm(
      `Mark ${match.team1} vs ${match.team2} as NOT PLAYED?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("matches")
      .update({
        status: "not_played",
        result_status: "confirmed",
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

    setMessage("Match marked NOT PLAYED.");
    await loadData();
  }

  async function markWalkover(
    match: Match,
    winner: string
  ) {
    const confirmed = window.confirm(
      `Give a walkover win to ${winner}?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("matches")
      .update({
        status: "walkover",
        result_status: "confirmed",
        winner,
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

    setMessage(
      `Walkover awarded to ${winner}.`
    );

    await loadData();
  }

  async function markRetirement(
    match: Match,
    winner: string
  ) {
    const confirmed = window.confirm(
      `Mark this match as RET with ${winner} as winner?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("matches")
      .update({
        status: "retired",
        result_status: "confirmed",
        winner,
      })
      .eq("id", match.id);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setMessage(
      `RET recorded. Winner: ${winner}.`
    );

    await loadData();
  }

  const groupA = teams.filter(
    (team) => team.group_name === "A"
  );

  const groupB = teams.filter(
    (team) => team.group_name === "B"
  );

  const scheduledMatches = matches.filter(
    (match) => match.result_status === "scheduled"
  );

  const protectedMatches = matches.filter(
    (match) => match.result_status !== "scheduled"
  );

  return (
    <main className="min-h-screen bg-[#071827] px-5 py-8 text-white">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-bold text-lime-300">
          ADMIN
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Match Management
        </h1>

        <p className="mt-2 text-white/60">
          Build and manage the league schedule.
        </p>

        <section className="mt-6 rounded-3xl bg-white p-5 text-black">
          <h2 className="text-xl font-bold">
            League Status
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-gray-100 p-4 text-center">
              <p className="text-3xl font-bold">
                {groupA.length}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Group A teams
              </p>
            </div>

            <div className="rounded-2xl bg-gray-100 p-4 text-center">
              <p className="text-3xl font-bold">
                {groupB.length}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Group B teams
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-gray-100 p-4 text-center">
              <p className="text-3xl font-bold">
                {matches.length}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Total matches
              </p>
            </div>

            <div className="rounded-2xl bg-gray-100 p-4 text-center">
              <p className="text-3xl font-bold">
                {scheduledMatches.length}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Scheduled
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-3xl bg-white p-5 text-black">
          <h2 className="text-xl font-bold">
            Schedule
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Each team plays every other team in its own group once.
          </p>

          {matches.length === 0 ? (
            <button
              type="button"
              onClick={generateSchedule}
              disabled={loading}
              className="mt-5 w-full rounded-2xl bg-lime-300 py-4 font-bold disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Generate Schedule"}
            </button>
          ) : (
            <button
              type="button"
              onClick={rebuildScheduledMatches}
              disabled={
                loading ||
                protectedMatches.length > 0
              }
              className="mt-5 w-full rounded-2xl bg-lime-300 py-4 font-bold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Rebuild Scheduled Matches
            </button>
          )}

          {protectedMatches.length > 0 && (
            <p className="mt-3 text-xs text-red-600">
              Schedule rebuilding is locked because at least one match already has a submitted or confirmed result.
            </p>
          )}
        </section>

        {message && (
          <div className="mt-5 rounded-2xl bg-white/10 p-4 text-center">
            {message}
          </div>
        )}

        <h2 className="mt-8 text-2xl font-bold">
          Matches
        </h2>

        {loading && (
          <p className="mt-4 text-white/60">
            Loading...
          </p>
        )}

        <div className="mt-4 space-y-4">
          {matches.map((match) => (
            <section
              key={match.id}
              className="rounded-3xl bg-white p-5 text-black"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">
                  WEEK {match.week}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">
                  {match.status
                    .replaceAll("_", " ")
                    .toUpperCase()}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold">
                {match.team1}
              </h3>

              <p className="text-sm text-gray-400">
                vs
              </p>

              <h3 className="text-lg font-bold">
                {match.team2}
              </h3>

              {match.result_status === "scheduled" && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      markNotPlayed(match)
                    }
                    className="mt-5 w-full rounded-xl border py-3 font-bold"
                  >
                    NOT PLAYED
                  </button>

                  <p className="mt-5 text-xs font-bold text-gray-400">
                    WALKOVER WINNER
                  </p>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        markWalkover(
                          match,
                          match.team1
                        )
                      }
                      className="rounded-xl bg-gray-100 p-3 text-sm font-bold"
                    >
                      {match.team1}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        markWalkover(
                          match,
                          match.team2
                        )
                      }
                      className="rounded-xl bg-gray-100 p-3 text-sm font-bold"
                    >
                      {match.team2}
                    </button>
                  </div>

                  <p className="mt-5 text-xs font-bold text-gray-400">
                    RET — WINNER
                  </p>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        markRetirement(
                          match,
                          match.team1
                        )
                      }
                      className="rounded-xl bg-gray-100 p-3 text-sm font-bold"
                    >
                      {match.team1}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        markRetirement(
                          match,
                          match.team2
                        )
                      }
                      className="rounded-xl bg-gray-100 p-3 text-sm font-bold"
                    >
                      {match.team2}
                    </button>
                  </div>
                </>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}