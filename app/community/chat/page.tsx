"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "../../../lib/supabase";
import { useLanguage } from "../../../components/LanguageProvider";

type Player = {
  id: number;
  full_name: string;
  team_id: number | null;
  role: string | null;
};

type ChatMessage = {
  id: number;
  created_at: string;
  player_id: number | null;
  sender_name: string;
  message: string;
};

export default function CommunityChatPage() {
  const { language } = useLanguage();

  const [player, setPlayer] = useState<Player | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [menuMessageId, setMenuMessageId] =
    useState<number | null>(null);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const copy =
    language === "es"
      ? {
          back: "COMUNIDAD",
          title: "Chat",
          subtitle: "Comunidad EQUIPO",
          empty: "Todavía no hay mensajes.",
          message: "Escribe un mensaje...",
          send: "ENVIAR",
          sendError: "No se pudo enviar el mensaje.",
          delete: "ELIMINAR",
          deleting: "ELIMINANDO...",
          deleteError: "No se pudo eliminar el mensaje.",
          you: "TÚ",
          registrationRequired: "Registro necesario",
          registrationText:
            "Regístrate para participar en el chat de la comunidad.",
          register: "REGISTRARME",
        }
      : {
          back: "COMMUNITY",
          title: "Chat",
          subtitle: "EQUIPO Community",
          empty: "No messages yet.",
          message: "Write a message...",
          send: "SEND",
          sendError: "Could not send message.",
          delete: "DELETE",
          deleting: "DELETING...",
          deleteError: "Could not delete message.",
          you: "YOU",
          registrationRequired: "Registration required",
          registrationText:
            "Register to participate in the community chat.",
          register: "REGISTER",
        };

  useEffect(() => {
    start();

    const channel = supabase
      .channel("community-chat-live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMessage =
            payload.new as ChatMessage;

          setMessages((current) => {
            const exists = current.some(
              (item) =>
                item.id === newMessage.id
            );

            if (exists) {
              return current;
            }

            return [
              ...current,
              newMessage,
            ];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const deleted =
            payload.old as Partial<ChatMessage>;

          if (!deleted.id) {
            return;
          }

          setMessages((current) =>
            current.filter(
              (item) =>
                item.id !== deleted.id
            )
          );
        }
      )
      .subscribe();

    const syncInterval =
      window.setInterval(() => {
        if (!document.hidden) {
          syncMessages();
        }
      }, 1500);

    function handleVisibilityChange() {
      if (!document.hidden) {
        syncMessages();
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      supabase.removeChannel(channel);

      window.clearInterval(
        syncInterval
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function start() {
    await Promise.all([
      identifyPlayer(),
      loadMessages(),
    ]);

    setLoading(false);
  }

  async function identifyPlayer() {
    const token =
      window.localStorage.getItem(
        "equipo_player_token"
      );

    if (!token) {
      return;
    }

    const { data, error } =
      await supabase.rpc(
        "get_player_identity",
        {
          p_token: token,
        }
      );

    if (
      !error &&
      Array.isArray(data) &&
      data.length > 0
    ) {
      setPlayer(
        data[0] as Player
      );
    }
  }

  async function loadMessages() {
    const { data } =
      await supabase
        .from("chat_messages")
        .select(
          "id, created_at, player_id, sender_name, message"
        )
        .order("created_at", {
          ascending: true,
        })
        .limit(100);

    if (data) {
      setMessages(
        data as ChatMessage[]
      );
    }
  }

  async function syncMessages() {
    const { data, error } =
      await supabase
        .from("chat_messages")
        .select(
          "id, created_at, player_id, sender_name, message"
        )
        .order("created_at", {
          ascending: true,
        })
        .limit(100);

    if (
      error ||
      !data
    ) {
      return;
    }

    const fresh =
      data as ChatMessage[];

    setMessages((current) => {
      if (
        current.length === fresh.length &&
        current.every(
          (item, index) =>
            item.id ===
            fresh[index]?.id
        )
      ) {
        return current;
      }

      return fresh;
    });
  }

  async function sendMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanMessage =
      message.trim();

    if (
      !cleanMessage ||
      !player ||
      sending
    ) {
      return;
    }

    const token =
      window.localStorage.getItem(
        "equipo_player_token"
      );

    if (!token) {
      return;
    }

    setSending(true);
    setError("");

    const { data, error } =
      await supabase.rpc(
        "send_community_message",
        {
          p_token: token,
          p_message: cleanMessage,
        }
      );

    if (error) {
      console.error(error);

      setError(
        copy.sendError
      );

      setSending(false);
      return;
    }

    const inserted =
      Array.isArray(data)
        ? data[0]
        : data;

    if (inserted) {
      setMessages((current) => {
        const exists =
          current.some(
            (item) =>
              item.id === inserted.id
          );

        if (exists) {
          return current;
        }

        return [
          ...current,
          inserted as ChatMessage,
        ];
      });
    }

    setMessage("");
    setSending(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }

  async function deleteMessage(
    messageId: number
  ) {
    const token =
      window.localStorage.getItem(
        "equipo_player_token"
      );

    if (
      !token ||
      deletingId !== null
    ) {
      return;
    }

    setDeletingId(
      messageId
    );

    setError("");

    const { data, error } =
      await supabase.rpc(
        "delete_community_message",
        {
          p_token: token,
          p_message_id: messageId,
        }
      );

    if (
      error ||
      data !== true
    ) {
      console.error(error);

      setError(
        copy.deleteError
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

    setMenuMessageId(null);
    setDeletingId(null);
  }

  return (
    <main className="min-h-screen bg-[#f4f2ea] pb-40 text-[#071827]">
      <header className="sticky top-0 z-30 bg-[#0b2638] text-white">
        <div className="mx-auto grid max-w-3xl grid-cols-3 items-center px-5 py-4">
          <Link
            href="/community"
            className="text-[9px] font-black tracking-[0.12em] text-white/50"
          >
            ← {copy.back}
          </Link>

          <div className="text-center">
            <div className="text-[15px] font-black tracking-[0.18em]">
              EQUIPO
            </div>

            <div className="mt-0.5 whitespace-nowrap text-[7px] font-black tracking-[0.28em] text-[#d8ff45]">
              PLAY TOGETHER
            </div>
          </div>

          <div className="truncate text-right text-[9px] font-black text-white/50">
            {player?.full_name ?? ""}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-5">
        <h1 className="text-3xl font-black tracking-[-0.05em]">
          {copy.title}
        </h1>

        <p className="mt-1 text-[12px] text-[#78909c]">
          {copy.subtitle}
        </p>

        <div className="mt-3 h-1 w-9 rounded-full bg-[#d8ff45]" />

        {!loading && !player && (
          <div className="mt-6 rounded-[24px] bg-[#0b2638] p-6 text-center text-white">
            <p className="text-lg font-black">
              {
                copy.registrationRequired
              }
            </p>

            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-5 text-white/55">
              {
                copy.registrationText
              }
            </p>

            <Link
              href="/join"
              className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-[16px] bg-[#d8ff45] px-6 text-[10px] font-black text-[#071827]"
            >
              {copy.register}
            </Link>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="py-10 text-center text-[#78909c]">
              ...
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-[20px] bg-white px-5 py-10 text-center text-[13px] text-[#78909c]">
              {copy.empty}
            </div>
          ) : (
            messages.map(
              (item) => {
                const own =
                  player?.id ===
                  item.player_id;

                return (
                  <MessageBubble
                    key={item.id}
                    item={item}
                    own={own}
                    youLabel={
                      copy.you
                    }
                    menuOpen={
                      menuMessageId ===
                      item.id
                    }
                    deleting={
                      deletingId ===
                      item.id
                    }
                    deleteLabel={
                      copy.delete
                    }
                    deletingLabel={
                      copy.deleting
                    }
                    onMenu={() =>
                      setMenuMessageId(
                        (current) =>
                          current ===
                          item.id
                            ? null
                            : item.id
                      )
                    }
                    onDelete={() =>
                      deleteMessage(
                        item.id
                      )
                    }
                  />
                );
              }
            )
          )}

          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="mt-4 text-center text-[11px] font-bold text-red-600">
            {error}
          </p>
        )}
      </section>

      {player && (
        <div className="fixed bottom-[92px] left-0 right-0 z-40 px-3">
          <form
            onSubmit={sendMessage}
            className="mx-auto max-w-3xl rounded-[22px] border border-[#071827]/10 bg-white p-2 shadow-[0_15px_45px_rgba(7,24,39,0.15)]"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                placeholder={
                  copy.message
                }
                maxLength={500}
                className="min-w-0 flex-1 rounded-[16px] bg-[#f4f2ea] px-4 py-3.5 text-[14px] outline-none"
              />

              <button
                type="submit"
                disabled={
                  sending ||
                  !message.trim()
                }
                className="h-[46px] rounded-[16px] bg-[#d8ff45] px-5 text-[10px] font-black text-[#071827] disabled:opacity-35"
              >
                {sending
                  ? "..."
                  : copy.send}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function MessageBubble({
  item,
  own,
  youLabel,
  menuOpen,
  deleting,
  deleteLabel,
  deletingLabel,
  onMenu,
  onDelete,
}: {
  item: ChatMessage;
  own: boolean;
  youLabel: string;
  menuOpen: boolean;
  deleting: boolean;
  deleteLabel: string;
  deletingLabel: string;
  onMenu: () => void;
  onDelete: () => void;
}) {
  const time =
    new Intl.DateTimeFormat(
      undefined,
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(
      new Date(
        item.created_at
      )
    );

  return (
    <div
      className={`flex ${
        own
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div className="relative max-w-[82%]">
        <div
          className={`rounded-[20px] px-4 py-3 ${
            own
              ? "rounded-br-[6px] bg-[#0b2638] text-white"
              : "rounded-bl-[6px] bg-white shadow-sm"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black ${
                own
                  ? "text-[#d8ff45]"
                  : "text-[#0b2638]"
              }`}
            >
              {own
                ? youLabel
                : item.sender_name}
            </span>

            <span
              className={`text-[9px] ${
                own
                  ? "text-white/30"
                  : "text-[#78909c]"
              }`}
            >
              {time}
            </span>

            {own && (
              <button
                type="button"
                onClick={onMenu}
                className="ml-auto px-1 text-lg leading-none text-white/40"
              >
                ⋯
              </button>
            )}
          </div>

          <p
            className={`mt-1 whitespace-pre-wrap break-words text-[13px] leading-5 ${
              own
                ? "text-white/90"
                : "text-[#071827]/80"
            }`}
          >
            {item.message}
          </p>
        </div>

        {own && menuOpen && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="absolute right-0 top-full z-20 mt-1 rounded-[12px] bg-white px-4 py-2.5 text-[9px] font-black text-red-600 shadow-lg disabled:opacity-50"
          >
            {deleting
              ? deletingLabel
              : deleteLabel}
          </button>
        )}
      </div>
    </div>
  );
}