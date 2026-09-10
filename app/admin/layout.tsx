"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;

    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");
      if (error || data !== true) {
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }
      if (alive) setChecking(false);
    }

    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020b12] text-white">
        <p className="text-xs font-black tracking-[0.22em] text-white/40">EQUIPO</p>
      </main>
    );
  }

  return (
    <>
      <div className="fixed right-4 top-4 z-[100]">
        <button
          type="button"
          onClick={logout}
          className="border border-white/15 bg-[#071827]/95 px-4 py-2 text-xs font-black tracking-[0.12em] text-white/60 backdrop-blur transition hover:border-[#d8ff45] hover:text-[#d8ff45]"
        >
          LOG OUT
        </button>
      </div>
      {children}
    </>
  );
}
