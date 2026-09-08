"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type LeagueSettings = {
  capacity: number;
  registration_open: boolean;
  season_started: boolean;
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

  const [activeTeams, setActiveTeams] = useState(0);

  const [player1, setPlayer1] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [hasPartner, setHasPartner] = useState(true);
  const [player2, setPlayer2] = useState("");

  const [level, setLevel] = useState("3.0");
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadLeague();
  }, []);

  async function loadLeague() {
    setLoading(true);

    const settingsResponse = await supabase
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

    const teamsResponse = await supabase
      .from("teams")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "active");

    if (teamsResponse.error) {
      setMessage("Unable to load team capacity.");
      setLoading(false);
      return;
    }

    setSettings(
      settingsResponse.data as LeagueSettings
    );

    setActiveTeams(teamsResponse.count ?? 0);

    setLoading(false);
  }

  async function submitRegistration(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!settings) {
      setMessage("League settings are unavailable.");
      return;
    }

    if (
      !settings.registration_open ||
      settings.season_started
    ) {
      setMessage("Registration is currently closed.");
      return;
    }

    if (!player1.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    if (!phone.trim()) {
      setMessage("Please enter your phone number.");
      return;
    }

    if (hasPartner && !player2.trim()) {
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

    const partnerName = hasPartner
      ? player2.trim()
      : "Looking for partner";

    const teamName = hasPartner
      ? `${player1.trim()} / ${partnerName}`
      : player1.trim();

    setSubmitting(true);

    const { error } = await supabase
      .from("teams")
      .insert({
        name: teamName,
        player1: player1.trim(),
        player2: partnerName,
        email: email.trim(),
        phone: phone.trim(),
        level: Number(level),
        group_name: null,
        status,
        rules_accepted_at:
          new Date().toISOString(),
        rules_version: "1.0",
      });

    setSubmitting(false);

    if (error) {
      setMessage(
        "Registration failed: " + error.message
      );
      return;
    }

    setSuccess(true);

    if (status === "waiting_partner") {
      setMessage(
        "Registration received. You are currently looking for a partner."
      );
    } else if (status === "waiting_list") {
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
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea] text-[#071827]">
        <p className="text-xs font-black tracking-[0.18em] text-[#78909c]">
          LOADING REGISTRATION...
        </p>
      </main>
    );
  }

  const closed =
    !settings?.registration_open ||
    settings?.season_started;

  const remaining = Math.max(
    (settings?.capacity ?? 0) - activeTeams,
    0
  );

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
            href="/join/rules"
            className="rounded-full bg-white px-4 py-2 text-[10px] font-black tracking-[0.12em] shadow-[0_8px_24px_rgba(7,24,39,0.05)]"
          >
            RULES
          </Link>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

          <section className="lg:pt-6">
            <p className="text-[10px] font-black tracking-[0.24em] text-[#78909c]">
              REGISTRATION
            </p>

            <h1 className="mt-3 max-w-md text-5xl font-black leading-[0.94] tracking-[-0.055em] md:text-6xl">
              JOIN THE
              <br />
              LEAGUE
            </h1>

            <p className="mt-5 max-w-sm text-base leading-7 text-[#78909c]">
              Register yourself or your team for the upcoming season.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <InfoBox
                value={`${settings?.capacity ?? "-"}`}
                label="CAPACITY"
              />

              <InfoBox
                value={`${activeTeams}`}
                label="ACTIVE"
              />

              <InfoBox
                value={`${remaining}`}
                label="PLACES"
                highlight={!closed && remaining > 0}
              />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  closed
                    ? "bg-[#c84b40]"
                    : "bg-[#7dbb62]"
                }`}
              />

              <p className="text-xs font-black tracking-[0.12em]">
                REGISTRATION {closed ? "CLOSED" : "OPEN"}
              </p>
            </div>

            <div className="mt-10 hidden border-t border-[#071827]/10 pt-6 lg:block">
              <p className="text-[10px] font-black tracking-[0.18em] text-[#78909c]">
                PLAYING LEVEL
              </p>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#78909c]">
                Select your current playing level. Use your Playtomic level if you have one.
              </p>
            </div>
          </section>

          <section>
            {closed ? (
              <div className="rounded-[30px] bg-[#0b2638] p-7 text-white md:p-9">
                <p className="text-[10px] font-black tracking-[0.2em] text-[#d8ff45]">
                  REGISTRATION
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  Registration closed
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
                  Registration is not currently available.
                </p>

                <Link
                  href="/"
                  className="mt-8 inline-flex rounded-[14px] bg-[#d8ff45] px-5 py-3 text-xs font-black tracking-[0.12em] text-[#071827]"
                >
                  BACK TO HOME
                </Link>
              </div>
            ) : (
              <form
                onSubmit={submitRegistration}
                className="rounded-[30px] bg-white p-6 shadow-[0_18px_50px_rgba(7,24,39,0.07)] md:p-8"
              >
                <div className="border-b border-[#071827]/10 pb-6">
                  <p className="text-[10px] font-black tracking-[0.2em] text-[#78909c]">
                    TEAM DETAILS
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-[-0.035em]">
                    Registration
                  </h2>
                </div>

                <div className="mt-7 space-y-6">
                  <Field
                    label="YOUR FULL NAME"
                    value={player1}
                    onChange={setPlayer1}
                    placeholder="Daniel Cohen"
                  />

                  <Field
                    label="EMAIL"
                    value={email}
                    onChange={setEmail}
                    placeholder="daniel@email.com"
                    type="email"
                  />

                  <Field
                    label="PHONE"
                    value={phone}
                    onChange={setPhone}
                    placeholder="+34 600 000 000"
                    type="tel"
                  />

                  <div>
                    <p className="text-[10px] font-black tracking-[0.16em] text-[#78909c]">
                      DO YOU ALREADY HAVE A PARTNER?
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setHasPartner(true)
                        }
                        className={`rounded-[14px] px-4 py-3 text-sm font-black transition ${
                          hasPartner
                            ? "bg-[#0b2638] text-white"
                            : "bg-[#f4f2ea] text-[#78909c]"
                        }`}
                      >
                        YES
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setHasPartner(false)
                        }
                        className={`rounded-[14px] px-4 py-3 text-sm font-black transition ${
                          !hasPartner
                            ? "bg-[#0b2638] text-white"
                            : "bg-[#f4f2ea] text-[#78909c]"
                        }`}
                      >
                        NO
                      </button>
                    </div>
                  </div>

                  {hasPartner && (
                    <Field
                      label="PARTNER'S FULL NAME"
                      value={player2}
                      onChange={setPlayer2}
                      placeholder="David Levy"
                    />
                  )}

                  {!hasPartner && (
                    <div className="rounded-[18px] bg-[#f4f2ea] p-5">
                      <p className="text-sm font-black">
                        Looking for a partner
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#78909c]">
                        You can register without a partner. The organizer can help connect players separately.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-black tracking-[0.16em] text-[#78909c]">
                      PLAYING LEVEL
                    </label>

                    <p className="mt-2 text-xs text-[#78909c]">
                      Use your Playtomic level if you have one.
                    </p>

                    <select
                      value={level}
                      onChange={(e) =>
                        setLevel(e.target.value)
                      }
                      className="mt-3 w-full rounded-[14px] border border-[#071827]/10 bg-[#f4f2ea] px-4 py-4 text-sm font-black outline-none transition focus:border-[#0b2638]"
                    >
                      {levels.map((item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                          {item === "6.0" ? "+" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-[18px] border border-[#071827]/10 p-5">
                    <label className="flex cursor-pointer items-start gap-4">
                      <input
                        type="checkbox"
                        checked={rulesAccepted}
                        onChange={(e) =>
                          setRulesAccepted(
                            e.target.checked
                          )
                        }
                        className="mt-0.5 h-5 w-5 accent-[#0b2638]"
                      />

                      <span className="text-sm leading-6 text-[#78909c]">
                        I have read and accept the{" "}
                        <Link
                          href="/join/rules"
                          className="font-black text-[#071827] underline underline-offset-4"
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
                    className="flex w-full items-center justify-between rounded-[16px] bg-[#d8ff45] px-5 py-4 text-sm font-black text-[#071827] transition hover:brightness-95 disabled:opacity-50"
                  >
                    <span>
                      {submitting
                        ? "SUBMITTING..."
                        : "REGISTER TEAM"}
                    </span>

                    <span>→</span>
                  </button>
                </div>
              </form>
            )}

            {message && (
              <div
                className={`mt-5 rounded-[20px] p-5 ${
                  success
                    ? "bg-[#d8ff45] text-[#071827]"
                    : "bg-[#0b2638] text-white"
                }`}
              >
                <p className="text-sm font-black">
                  {message}
                </p>
              </div>
            )}
          </section>
        </div>

        <footer className="mt-12 flex items-center justify-between border-t border-[#071827]/10 pt-5">
          <Link
            href="/"
            className="text-xs font-black tracking-[0.12em] text-[#78909c]"
          >
            ← HOME
          </Link>

          <Link
            href="/join/rules"
            className="text-xs font-black tracking-[0.12em]"
          >
            LEAGUE RULES →
          </Link>
        </footer>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-black tracking-[0.16em] text-[#78909c]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-[14px] border border-[#071827]/10 bg-[#f4f2ea] px-4 py-4 text-sm font-bold outline-none transition placeholder:font-normal placeholder:text-[#78909c]/55 focus:border-[#0b2638] focus:bg-white"
      />
    </div>
  );
}

function InfoBox({
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
      className={`rounded-[20px] px-4 py-4 ${
        highlight
          ? "bg-[#d8ff45]"
          : "bg-white"
      }`}
    >
      <p className="text-2xl font-black tracking-[-0.04em]">
        {value}
      </p>

      <p
        className={`mt-1 text-[8px] font-black tracking-[0.14em] ${
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