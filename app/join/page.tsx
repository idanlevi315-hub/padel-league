/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type LeagueSettings = {
  capacity: number;
  registration_open: boolean;
  season_started: boolean;
};

type RegistrationResult = {
  team_id: number;
  player_id: number;
  access_token: string;
};

const levels = [
  "1.0",
  "1.5",
  "2.0",
  "2.5",
  "3.0",
  "3.5",
  "4.0",
  "4.5",
  "5.0",
  "5.5",
  "6.0",
];

export default function JoinPage() {
  const [settings, setSettings] =
    useState<LeagueSettings | null>(null);

  const [activeTeams, setActiveTeams] =
    useState(0);

  const [player1, setPlayer1] =
    useState("");
  const [email, setEmail] =
    useState("");
  const [phone, setPhone] =
    useState("");

  const [hasPartner, setHasPartner] =
    useState(true);
  const [player2, setPlayer2] =
    useState("");

  const [level, setLevel] =
    useState("3.0");

  const [rulesAccepted, setRulesAccepted] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    loadLeague();
  }, []);

  async function loadLeague() {
    setLoading(true);

    const settingsResponse =
      await supabase
        .from("league_settings")
        .select(
          "capacity, registration_open, season_started"
        )
        .limit(1)
        .maybeSingle();

    if (settingsResponse.error) {
      setMessage(
        "Unable to load registration settings."
      );
      setLoading(false);
      return;
    }

    const teamsResponse =
      await supabase
        .from("teams")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("status", "active");

    if (teamsResponse.error) {
      setMessage(
        "Unable to load team capacity."
      );
      setLoading(false);
      return;
    }

    setSettings(
      settingsResponse.data as LeagueSettings
    );

    setActiveTeams(
      teamsResponse.count ?? 0
    );

    setLoading(false);
  }

  async function submitRegistration(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!settings) {
      setMessage(
        "League settings are unavailable."
      );
      return;
    }

    if (
      !settings.registration_open ||
      settings.season_started
    ) {
      setMessage(
        "Registration is currently closed."
      );
      return;
    }

    if (!player1.trim()) {
      setMessage(
        "Please enter your full name."
      );
      return;
    }

    if (!email.trim()) {
      setMessage(
        "Please enter your email."
      );
      return;
    }

    if (!phone.trim()) {
      setMessage(
        "Please enter your phone number."
      );
      return;
    }

    if (
      hasPartner &&
      !player2.trim()
    ) {
      setMessage(
        "Please enter your partner's name."
      );
      return;
    }

    if (!rulesAccepted) {
      setMessage(
        "You must accept the league rules."
      );
      return;
    }

    let status = "registered";

    if (!hasPartner) {
      status = "waiting_partner";
    } else if (
      activeTeams >= settings.capacity
    ) {
      status = "waiting_list";
    }

    const partnerName =
      hasPartner
        ? player2.trim()
        : "Looking for partner";

    setSubmitting(true);

    const { data, error } =
      await supabase.rpc(
        "register_equipo_team",
        {
          p_player1: player1.trim(),
          p_email: email.trim(),
          p_phone: phone.trim(),
          p_level: Number(level),
          p_player2: partnerName,
          p_status: status,
        }
      );

    setSubmitting(false);

    if (error) {
      console.error(error);

      setMessage(
        "Registration failed: " +
          error.message
      );

      return;
    }

    const result =
      Array.isArray(data)
        ? (data[0] as RegistrationResult)
        : (data as RegistrationResult);

    if (
      !result ||
      !result.access_token
    ) {
      setMessage(
        "Registration completed, but player identification could not be created."
      );
      return;
    }

    /*
      IMPORTANT:
      The player never sees this token.
      It stays in this browser and is used
      by EQUIPO to identify the player.
    */
    window.localStorage.setItem(
      "equipo_player_token",
      result.access_token
    );

    setSuccess(true);

    if (
      status === "waiting_partner"
    ) {
      setMessage(
        "Registration received. You are currently looking for a partner."
      );
    } else if (
      status === "waiting_list"
    ) {
      setMessage(
        "Registration received. The league is currently full, so your team has been added to the waiting list."
      );
    } else {
      setMessage(
        "Registration received successfully."
      );
    }

    setPlayer1("");
    setEmail("");
    setPhone("");
    setPlayer2("");
    setHasPartner(true);
    setLevel("3.0");
    setRulesAccepted(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#071827] p-8 text-white">
        Loading registration...
      </main>
    );
  }

  const closed =
    !settings?.registration_open ||
    settings?.season_started;

  return (
    <main className="min-h-screen bg-[#071827] px-5 py-8 text-white">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-bold text-lime-300">
          EQUIPO
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Join the League
        </h1>

        <p className="mt-2 text-white/60">
          Register your team for the next season.
        </p>

        <div className="mt-5 flex gap-3">
          <div className="flex-1 rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-white/40">
              Capacity
            </p>

            <p className="mt-1 text-xl font-bold">
              {settings?.capacity ?? "-"} teams
            </p>
          </div>

          <div className="flex-1 rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-white/40">
              Registration
            </p>

            <p
              className={`mt-1 font-bold ${
                closed
                  ? "text-red-300"
                  : "text-lime-300"
              }`}
            >
              {closed
                ? "Closed"
                : "Open"}
            </p>
          </div>
        </div>

        {closed ? (
          <div className="mt-6 rounded-3xl bg-white p-6 text-black">
            <h2 className="text-xl font-bold">
              Registration closed
            </h2>

            <p className="mt-2 text-gray-500">
              Registration is not currently available.
            </p>
          </div>
        ) : (
          <form
            onSubmit={submitRegistration}
            className="mt-6 space-y-5 rounded-3xl bg-white p-6 text-black"
          >
            <div>
              <label className="text-sm font-bold">
                Your full name
              </label>

              <input
                value={player1}
                onChange={(e) =>
                  setPlayer1(
                    e.target.value
                  )
                }
                placeholder="Daniel Cohen"
                className="mt-2 w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-sm font-bold">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="daniel@email.com"
                className="mt-2 w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-sm font-bold">
                Phone
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                placeholder="+34 600 000 000"
                className="mt-2 w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <p className="text-sm font-bold">
                Do you already have a partner?
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setHasPartner(true)
                  }
                  className={`rounded-xl p-3 font-bold ${
                    hasPartner
                      ? "bg-lime-300"
                      : "bg-gray-100"
                  }`}
                >
                  Yes
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setHasPartner(false)
                  }
                  className={`rounded-xl p-3 font-bold ${
                    !hasPartner
                      ? "bg-lime-300"
                      : "bg-gray-100"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {hasPartner && (
              <div>
                <label className="text-sm font-bold">
                  Partner&apos;s full name
                </label>

                <input
                  value={player2}
                  onChange={(e) =>
                    setPlayer2(
                      e.target.value
                    )
                  }
                  placeholder="David Levy"
                  className="mt-2 w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
                />
              </div>
            )}

            {!hasPartner && (
              <div className="rounded-xl bg-gray-100 p-4">
                <p className="font-bold">
                  Looking for a partner
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  You can register without a partner. The organizer can help connect players separately.
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-bold">
                Playing level
              </label>

              <p className="mt-1 text-xs text-gray-500">
                Use your Playtomic level if you have one.
              </p>

              <select
                value={level}
                onChange={(e) =>
                  setLevel(
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-3"
              >
                {levels.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                      {item === "6.0"
                        ? "+"
                        : ""}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="rounded-2xl bg-gray-100 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={
                    rulesAccepted
                  }
                  onChange={(e) =>
                    setRulesAccepted(
                      e.target.checked
                    )
                  }
                  className="mt-1 h-4 w-4"
                />

                <span className="text-sm">
                  I have read and accept the{" "}
                  <Link
                    href="/join/rules"
                    className="font-bold underline"
                  >
                    league rules
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-lime-300 px-5 py-4 font-black disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Register"}
            </button>
          </form>
        )}

        {message && (
          <div
            className={`mt-5 rounded-2xl p-4 ${
              success
                ? "bg-lime-300 text-black"
                : "bg-white/10 text-white"
            }`}
          >
            <p className="font-bold">
              {message}
            </p>

            {success && (
              <Link
                href="/community/chat"
                className="mt-4 inline-flex rounded-xl bg-[#0b2638] px-5 py-3 text-xs font-black text-white"
              >
                OPEN COMMUNITY CHAT →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}