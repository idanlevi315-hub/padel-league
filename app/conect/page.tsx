"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnectPage() {
  const router = useRouter();
  const [token, setToken] = useState("");

  function connect() {
    const cleanToken = token.trim();

    if (!cleanToken) {
      return;
    }

    localStorage.setItem(
      "equipo_player_token",
      cleanToken
    );

    router.push("/community/chat");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea] px-5">
      <div className="w-full max-w-sm rounded-[26px] bg-white p-6 shadow-lg">
        <div className="text-center">
          <div className="text-xl font-black tracking-[0.2em] text-[#0b2638]">
            EQUIPO
          </div>

          <div className="mt-1 text-[8px] font-black tracking-[0.3em] text-[#0b2638]">
            PLAY TOGETHER
          </div>
        </div>

        <h1 className="mt-8 text-center text-2xl font-black text-[#071827]">
          Connect Player
        </h1>

        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste access token"
          className="mt-6 w-full rounded-[16px] bg-[#f4f2ea] px-4 py-4 text-sm outline-none"
        />

        <button
          type="button"
          onClick={connect}
          disabled={!token.trim()}
          className="mt-3 w-full rounded-[16px] bg-[#d8ff45] py-4 text-[11px] font-black text-[#071827] disabled:opacity-40"
        >
          CONNECT
        </button>
      </div>
    </main>
  );
}