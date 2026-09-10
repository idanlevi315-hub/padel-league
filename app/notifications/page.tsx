/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../components/LanguageProvider";

type PermissionState = NotificationPermission | "unsupported";

export default function NotificationsPage() {
  const { language } = useLanguage();
  const [permission, setPermission] = useState<PermissionState>("default");
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  const copy = language === "es"
    ? {
        back: "INICIO",
        title: "Notificaciones",
        text: "Activa las notificaciones para recibir avisos de 18.",
        enable: "ACTIVAR NOTIFICACIONES",
        enabled: "NOTIFICACIONES ACTIVADAS",
        blocked: "LAS NOTIFICACIONES ESTÁN BLOQUEADAS",
        unsupported: "ESTE NAVEGADOR NO ADMITE NOTIFICACIONES",
        test: "ENVIAR NOTIFICACIÓN DE PRUEBA",
        success: "Notificación de prueba enviada.",
      }
    : {
        back: "HOME",
        title: "Notifications",
        text: "Enable notifications to receive 18 updates.",
        enable: "ENABLE NOTIFICATIONS",
        enabled: "NOTIFICATIONS ENABLED",
        blocked: "NOTIFICATIONS ARE BLOCKED",
        unsupported: "NOTIFICATIONS ARE NOT SUPPORTED",
        test: "SEND TEST NOTIFICATION",
        success: "Test notification sent.",
      };

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported");
      return;
    }

    setPermission(Notification.permission);
  }, []);

  async function enableNotifications() {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported");
      return;
    }
    setWorking(true);
    setMessage("");

    const result = await Notification.requestPermission();
    setPermission(result);
    setWorking(false);
  }

  async function sendTestNotification() {
    if (permission !== "granted" || !("serviceWorker" in navigator)) {
      return;
    }

    setWorking(true);
    setMessage("");

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("18", {
        body: "Notifications are working on this device.",
        icon: "/18-icon.svg",
        badge: "/18-icon.svg",
        data: { url: "/notifications" },
      });
      setMessage(copy.success);
    } catch (error) {
      console.error(error);
      setMessage("Could not send the test notification.");
    }

    setWorking(false);
  }

  const statusText =
    permission === "granted"
      ? copy.enabled
      : permission === "denied"
        ? copy.blocked
        : permission === "unsupported"
          ? copy.unsupported
          : copy.enable;

  return (
    <main className="min-h-screen bg-[#eee9df] px-5 py-8 text-[#24372f]">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-[9px] font-black tracking-[0.14em] text-[#7a847e]"
        >
          ← {copy.back}
        </Link>

        <div className="mt-7 rounded-[16px] bg-[#5f6b64] p-7 text-white">
          <p className="text-[10px] font-black tracking-[0.22em] text-[#d9ef54]">
            18
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.05em]">
            {copy.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-white/55">
            {copy.text}
          </p>

          <div className="mt-7 rounded-[20px] bg-white/8 p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-black tracking-[0.12em] text-white/40">
                STATUS
              </span>
              <span className="text-right text-[10px] font-black text-[#d9ef54]">
                {statusText}
              </span>
            </div>
          </div>

          {permission === "default" && (
            <button
              type="button"
              onClick={enableNotifications}
              disabled={working}
              className="mt-4 w-full rounded-[18px] bg-[#d9ef54] px-5 py-4 text-[10px] font-black text-[#24372f] disabled:opacity-40"
            >
              {working ? "..." : copy.enable}
            </button>
          )}

          {permission === "granted" && (
            <button
              type="button"
              onClick={sendTestNotification}
              disabled={working}
              className="mt-4 w-full rounded-[18px] bg-[#d9ef54] px-5 py-4 text-[10px] font-black text-[#24372f] disabled:opacity-40"
            >
              {working ? "..." : copy.test}
            </button>
          )}

          {message && (
            <p className="mt-4 text-center text-[11px] font-bold text-[#d9ef54]">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
