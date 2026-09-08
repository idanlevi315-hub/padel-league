"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Team = {
  id: number;
  name: string;
  player1: string;
  player2: string;
  level: number;
  group_name: string | null;
  status: string | null;
};

type Settings = {
  capacity: number;
  registration_open: boolean;
  season_started: boolean;
};

type Filter =
  | "all"
  | "active"
  | "registered"
  | "waiting_list"
  | "waiting_partner";

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  const [filter, setFilter] = useState<Filter>("all");
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
      .select("*")
      .order("id", { ascending: true });

    if (teamsResponse.error) {
      setMessage("Error: " + teamsResponse.error.message);
      setLoading(false);
      return;
    }

    const settingsResponse = await supabase
      .from("league_settings")
      .select(
        "capacity, registration_open, season_started"
      )
      .limit(1)
      .maybeSingle();

    if (settingsResponse.error) {
      setMessage("Error: " + settingsResponse.error.message);
      setLoading(false);
      return;
    }

    setTeams((teamsResponse.data ?? []) as Team[]);
    setSettings(settingsResponse.data as Settings);
    setLoading(false);
  }

  const activeTeams = useMemo(
    () =>
      teams.filter(
        (team) => team.status === "active"
      ),
    [teams]
  );

  const activeCount = activeTeams.length;

  const groupACount = activeTeams.filter(
    (team) => team.group_name === "A"
  ).length;

  const groupBCount = activeTeams.filter(
    (team) => team.group_name === "B"
  ).length;

  const registeredCount = teams.filter(
    (team) => team.status === "registered"
  ).length;

  const waitingListCount = teams.filter(
    (team) => team.status === "waiting_list"
  ).length;

  const waitingPartnerCount = teams.filter(
    (team) => team.status === "waiting_partner"
  ).length;

  const filteredTeams = useMemo(() => {
    if (filter === "all") return teams;

    return teams.filter(
      (team) => team.status === filter
    );
  }, [teams, filter]);

  async function approveTeam(
    team: Team,
    group: "A" | "B"
  ) {
    if (!settings) return;

    const alreadyActive =
      team.status === "active";

    if (
      !alreadyActive &&
      activeCount >= settings.capacity
    ) {
      setMessage(
        `League capacity reached (${settings.capacity} teams). This team cannot be activated yet.`
      );
      return;
    }

    if (
      settings.season_started &&
      !alreadyActive
    ) {
      const confirmed = window.confirm(
        "The season has already started. Add this team as an admin exception?"
      );

      if (!confirmed) return;
    }

    const { error } = await supabase
      .from("teams")
      .update({
        group_name: group,
        status: "active",
      })
      .eq("id", team.id);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setMessage(
      `${team.name} is now active in Group ${group}.`
    );

    await loadData();
  }

  async function moveToWaitingList(team: Team) {
    const { error } = await supabase
      .from("teams")
      .update({
        group_name: null,
        status: "waiting_list",
      })
      .eq("id", team.id);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setMessage(
      `${team.name} moved to the waiting list.`
    );

    await loadData();
  }

  function getStatusLabel(
    status: string | null
  ) {
    switch (status) {
      case "active":
        return "ACTIVE";

      case "registered":
        return "REGISTERED";

      case "waiting_list":
        return "WAITING LIST";

      case "waiting_partner":
        return "PARTNER POOL";

      default:
        return "UNKNOWN";
    }
  }

  function getStatusClass(
    status: string | null
  ) {
    switch (status) {
      case "active":
        return "bg-lime-200";

      case "registered":
        return "bg-blue-100";

      case "waiting_list":
        return "bg-yellow-100";

      case "waiting_partner":
        return "bg-purple-100";

      default:
        return "bg-gray-100";
    }
  }

  const filters: {
    value: Filter;
    label: string;
    count: number;
  }[] = [
    {
      value: "all",
      label: "All",
      count: teams.length,
    },
    {
      value: "active",
      label: "Active",
      count: activeCount,
    },
    {
      value: "registered",
      label: "New",
      count: registeredCount,
    },
    {
      value: "waiting_list",
      label: "Waiting",
      count: waitingListCount,
    },
    {
      value: "waiting_partner",
      label: "Partner Pool",
      count: waitingPartnerCount,
    },
  ];

  return (
    <main className="min-h-screen bg-[#071827] px-5 py-8 text-white">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-bold text-lime-300">
          ADMIN
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Teams
        </h1>

        <p className="mt-2 text-white/60">
          Approve teams, assign groups and manage the waiting list.
        </p>

        {settings && (
          <section className="mt-6 rounded-3xl bg-white p-5 text-black">
            <p className="text-sm font-bold text-gray-400">
              LEAGUE CAPACITY
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-gray-100 p-3 text-center">
                <p className="text-2xl font-bold">
                  {activeCount}
                </p>
                <p className="text-xs text-gray-500">
                  Active
                </p>
              </div>

              <div className="rounded-2xl bg-gray-100 p-3 text-center">
                <p className="text-2xl font-bold">
                  {settings.capacity}
                </p>
                <p className="text-xs text-gray-500">
                  Capacity
                </p>
              </div>

              <div className="rounded-2xl bg-gray-100 p-3 text-center">
                <p className="text-2xl font-bold">
                  {Math.max(
                    settings.capacity -
                      activeCount,
                    0
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  Available
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-lime-100 p-3 text-center">
                <p className="font-bold">
                  Group A: {groupACount}
                </p>
              </div>

              <div className="rounded-2xl bg-lime-100 p-3 text-center">
                <p className="font-bold">
                  Group B: {groupBCount}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Season
              </span>

              <span className="font-bold">
                {settings.season_started
                  ? "In progress"
                  : "Pre-season"}
              </span>
            </div>
          </section>
        )}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setFilter(item.value)
              }
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${
                filter === item.value
                  ? "bg-lime-300 text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              {item.label} {item.count}
            </button>
          ))}
        </div>

        {message && (
          <div className="mt-4 rounded-2xl bg-white/10 p-4 text-center">
            {message}
          </div>
        )}

        {loading && (
          <p className="mt-6 text-white/60">
            Loading teams...
          </p>
        )}

        {!loading &&
          filteredTeams.length === 0 && (
            <div className="mt-6 rounded-3xl bg-white p-5 text-center text-black">
              No teams in this section.
            </div>
          )}

        <div className="mt-6 space-y-4">
          {filteredTeams.map((team) => (
            <section
              key={team.id}
              className="rounded-3xl bg-white p-5 text-black"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold">
                    {team.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {team.player1} &{" "}
                    {team.player2}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                    team.status
                  )}`}
                >
                  {getStatusLabel(
                    team.status
                  )}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-xl bg-gray-100 px-3 py-2">
                  Level {team.level}
                </span>

                {team.group_name && (
                  <span className="rounded-xl bg-lime-200 px-3 py-2 font-bold">
                    Group {team.group_name}
                  </span>
                )}
              </div>

              {team.status !==
                "waiting_partner" && (
                <>
                  <p className="mt-5 text-xs font-bold text-gray-400">
                    ASSIGN TO GROUP
                  </p>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        approveTeam(
                          team,
                          "A"
                        )
                      }
                      className="rounded-xl bg-lime-300 py-3 font-bold"
                    >
                      Group A
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        approveTeam(
                          team,
                          "B"
                        )
                      }
                      className="rounded-xl bg-lime-300 py-3 font-bold"
                    >
                      Group B
                    </button>
                  </div>
                </>
              )}

              {team.status ===
                "waiting_partner" && (
                <div className="mt-5 rounded-2xl bg-purple-50 p-4 text-sm text-purple-900">
                  This player is looking for a partner and cannot be assigned to a group yet.
                </div>
              )}

              {team.status !==
                "waiting_list" && (
                <button
                  type="button"
                  onClick={() =>
                    moveToWaitingList(team)
                  }
                  className="mt-3 w-full rounded-xl border border-gray-300 py-3 font-bold"
                >
                  Move to Waiting List
                </button>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}