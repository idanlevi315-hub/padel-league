/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Settings = {
  id: number;
  capacity: number;
  registration_open: boolean;
  season_started: boolean;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [capacity, setCapacity] = useState("16");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("league_settings")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      setMessage("Error: " + error.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setMessage("League settings not found.");
      setLoading(false);
      return;
    }

    const current = data as Settings;

    setSettings(current);
    setCapacity(String(current.capacity));
    setLoading(false);
  }

  async function saveCapacity() {
    if (!settings) return;

    const number = Number(capacity);

    if (!Number.isInteger(number) || number < 4) {
      setMessage("Capacity must be at least 4 teams.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("league_settings")
      .update({
        capacity: number,
      })
      .eq("id", settings.id);

    if (error) {
      setMessage("Error: " + error.message);
      setSaving(false);
      return;
    }

    setSettings({
      ...settings,
      capacity: number,
    });

    setMessage(`League capacity updated to ${number} teams.`);
    setSaving(false);
  }

  async function toggleRegistration() {
    if (!settings) return;

    const newValue = !settings.registration_open;

    const { error } = await supabase
      .from("league_settings")
      .update({
        registration_open: newValue,
      })
      .eq("id", settings.id);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setSettings({
      ...settings,
      registration_open: newValue,
    });

    setMessage(
      newValue ? "Registration opened." : "Registration closed."
    );
  }

  async function toggleSeason() {
    if (!settings) return;

    const newValue = !settings.season_started;

    const question = newValue
      ? "Start the season? After the season begins, adding teams should be restricted to admin."
      : "Return the season to pre-season mode?";

    if (!window.confirm(question)) return;

    const { error } = await supabase
      .from("league_settings")
      .update({
        season_started: newValue,
      })
      .eq("id", settings.id);

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setSettings({
      ...settings,
      season_started: newValue,
    });

    setMessage(
      newValue
        ? "Season started."
        : "Season returned to pre-season."
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#071827] p-8 text-white">
        Loading settings...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071827] px-5 py-8 text-white">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-bold text-lime-300">
          ADMIN
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          League Settings
        </h1>

        {settings && (
          <>
            <section className="mt-6 rounded-3xl bg-white p-6 text-black">
              <p className="text-sm font-bold text-gray-400">
                TEAM CAPACITY
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Maximum teams
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                You can increase the capacity before the season starts.
              </p>

              <div className="mt-5 grid grid-cols-4 gap-2">
                {[12, 16, 20, 24].map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setCapacity(String(number))}
                    className={`rounded-xl py-3 font-bold ${
                      capacity === String(number)
                        ? "bg-lime-300"
                        : "bg-gray-100"
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <input
                type="number"
                min="4"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-gray-200 p-4"
                placeholder="Custom capacity"
              />

              <button
                type="button"
                onClick={saveCapacity}
                disabled={saving || settings.season_started}
                className="mt-4 w-full rounded-2xl bg-lime-300 py-4 font-bold disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save Capacity"}
              </button>

              {settings.season_started && (
                <p className="mt-3 text-xs text-red-600">
                  Capacity is locked after the season starts.
                </p>
              )}
            </section>

            <section className="mt-5 rounded-3xl bg-white p-6 text-black">
              <p className="text-sm font-bold text-gray-400">
                REGISTRATION
              </p>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {settings.registration_open ? "Open" : "Closed"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Control public registration.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleRegistration}
                  className={`rounded-2xl px-5 py-3 font-bold ${
                    settings.registration_open
                      ? "bg-lime-300"
                      : "bg-gray-200"
                  }`}
                >
                  {settings.registration_open ? "Close" : "Open"}
                </button>
              </div>
            </section>

            <section className="mt-5 rounded-3xl bg-white p-6 text-black">
              <p className="text-sm font-bold text-gray-400">
                SEASON
              </p>

              <h2 className="mt-2 text-xl font-bold">
                {settings.season_started
                  ? "Season in progress"
                  : "Pre-season"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Once the season starts, the normal league structure is locked.
              </p>

              <button
                type="button"
                onClick={toggleSeason}
                className="mt-5 w-full rounded-2xl bg-[#071827] py-4 font-bold text-white"
              >
                {settings.season_started
                  ? "Return to Pre-season"
                  : "Start Season"}
              </button>
            </section>
          </>
        )}

        {message && (
          <div className="mt-5 rounded-2xl bg-white/10 p-4 text-center">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}