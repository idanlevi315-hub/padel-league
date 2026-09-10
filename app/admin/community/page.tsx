"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type ChatMessage = {
  id: number;
  created_at: string;
  player_id: number | null;
  sender_name: string;
  message: string;
};

export default function AdminCommunityPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [clearing, setClearing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel("admin-community-chat")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
        },
        () => {
          loadMessages(false);
        }
      )
      .subscribe();

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        loadMessages(false);
      }
    }, 2000);

    return () => {
      supabase.removeChannel(channel);
      window.clearInterval(interval);
    };
  }, []);

  async function loadMessages(
    showLoading = true
  ) {
    if (showLoading) {
      setLoading(true);
    }

    const { data, error } =
      await supabase
        .from("chat_messages")
        .select(
          "id, created_at, player_id, sender_name, message"
        )
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      setError(
        "Could not load chat messages."
      );

      if (showLoading) {
        setLoading(false);
      }

      return;
    }

    setMessages(
      (data ?? []) as ChatMessage[]
    );

    setError("");

    if (showLoading) {
      setLoading(false);
    }
  }

  async function deleteMessage(
    messageId: number
  ) {
    const confirmed =
      window.confirm(
        "Delete this message?"
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(messageId);
    setError("");
    setSuccess("");

    const { data, error } =
      await supabase.rpc(
        "admin_delete_community_message",
        {
          p_message_id: messageId,
        }
      );

    if (
      error ||
      data !== true
    ) {
      console.error(error);

      setError(
        "Could not delete the message."
      );

      setDeletingId(null);
      return;
    }

    setMessages((current) =>
      current.filter(
        (item) =>
          item.id !== messageId
      )
    );

    setSuccess(
      "Message deleted."
    );

    setDeletingId(null);
  }

  async function clearChat() {
    const confirmed =
      window.confirm(
        "Delete ALL community chat messages? This cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    const confirmedAgain =
      window.confirm(
        "Are you sure you want to clear the entire chat?"
      );

    if (!confirmedAgain) {
      return;
    }

    setClearing(true);
    setError("");
    setSuccess("");

    const { data: allMessages, error: loadError } =
      await supabase
        .from("chat_messages")
        .select("id");

    if (loadError) {
      console.error(loadError);

      setError(
        "Could not load messages for deletion."
      );

      setClearing(false);
      return;
    }

    const ids =
      (allMessages ?? []).map(
        (item) => item.id
      );

    let deletedCount = 0;

    for (const id of ids) {
      const { data, error } =
        await supabase.rpc(
          "admin_delete_community_message",
          {
            p_message_id: id,
          }
        );

      if (error) {
        console.error(error);
        continue;
      }

      if (data === true) {
        deletedCount++;
      }
    }

    await loadMessages(false);

    setSuccess(
      `Chat cleared. ${deletedCount} messages deleted.`
    );

    setClearing(false);
  }

  return (
    <main className="min-h-screen bg-[#eee9df] px-5 py-8 text-[#24372f]">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="text-[10px] font-black tracking-[0.14em] text-[#7a847e]"
            >
              ← ADMIN
            </Link>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em]">
              Community Chat
            </h1>

            <p className="mt-1 text-sm text-[#7a847e]">
              Moderate community messages.
            </p>
          </div>

          <button
            type="button"
            onClick={clearChat}
            disabled={
              clearing ||
              messages.length === 0
            }
            className="rounded-2xl bg-red-600 px-5 py-3 text-[10px] font-black text-white disabled:opacity-30"
          >
            {clearing
              ? "CLEARING..."
              : "CLEAR CHAT"}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#5f6b64] px-5 py-4 text-white">
          <div>
            <p className="text-[9px] font-black tracking-[0.15em] text-white/40">
              MESSAGES
            </p>

            <p className="mt-1 text-2xl font-black">
              {messages.length}
            </p>
          </div>

          <Link
            href="/community/chat"
            className="rounded-xl bg-[#d9ef54] px-4 py-3 text-[9px] font-black text-[#24372f]"
          >
            OPEN CHAT →
          </Link>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-2xl bg-[#d9ef54] px-4 py-3 text-sm font-bold text-[#24372f]">
            {success}
          </div>
        )}

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-[#7a847e]">
              Loading...
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center">
              <p className="text-lg font-black">
                Chat is empty
              </p>

              <p className="mt-2 text-sm text-[#7a847e]">
                There are no community messages.
              </p>
            </div>
          ) : (
            messages.map((item) => (
              <MessageRow
                key={item.id}
                item={item}
                deleting={
                  deletingId === item.id
                }
                onDelete={() =>
                  deleteMessage(item.id)
                }
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function MessageRow({
  item,
  deleting,
  onDelete,
}: {
  item: ChatMessage;
  deleting: boolean;
  onDelete: () => void;
}) {
  const date =
    new Intl.DateTimeFormat(
      undefined,
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(
      new Date(item.created_at)
    );

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-black">
              {item.sender_name}
            </p>

            <p className="text-[10px] text-[#7a847e]">
              {date}
            </p>

            <p className="text-[9px] font-bold text-[#7a847e]">
              #{item.id}
            </p>
          </div>

          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#24372f]/75">
            {item.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="shrink-0 rounded-xl bg-red-50 px-4 py-2.5 text-[9px] font-black text-red-600 disabled:opacity-40"
        >
          {deleting
            ? "DELETING..."
            : "DELETE"}
        </button>
      </div>
    </div>
  );
}