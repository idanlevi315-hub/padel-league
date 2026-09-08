"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/admin");
        return;
      }

      setChecking(false);
    }

    checkSession();
  }, [router]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (loginError) {
      setError("Email or password is incorrect.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020b12] text-white">
        <p className="text-sm font-bold tracking-[0.18em] text-white/40">
          PADEL LEAGUE
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020b12] text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-10 border-b border-white/10 pb-6">
          <p className="text-xs font-black tracking-[0.25em] text-[#c7ff37]">
            PADEL LEAGUE
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em]">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-white/40">
            League administration
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-black tracking-[0.16em] text-white/45"
            >
              EMAIL
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-white/15 bg-[#071827] px-4 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-[#c7ff37]"
              placeholder="admin@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-black tracking-[0.16em] text-white/45"
            >
              PASSWORD
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-white/15 bg-[#071827] px-4 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-[#c7ff37]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-between bg-[#c7ff37] px-5 py-4 font-black text-[#020b12] transition hover:bg-[#d4ff61] disabled:opacity-50"
          >
            <span>{loading ? "SIGNING IN..." : "SIGN IN"}</span>
            <span>→</span>
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-8 text-left text-xs font-bold text-white/30 transition hover:text-white"
        >
          ← BACK TO LEAGUE
        </button>
      </div>
    </main>
  );
}