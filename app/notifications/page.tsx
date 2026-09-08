const notifications = [
  {
    title: "Match reminder",
    text: "Your match against Team Bravo must be played before Sunday.",
    time: "2 hours ago",
    type: "match",
  },
  {
    title: "Result waiting for confirmation",
    text: "Team Charlie submitted a result. Please review and confirm it.",
    time: "Yesterday",
    type: "result",
  },
  {
    title: "League update",
    text: "Week 4 fixtures are now available.",
    time: "2 days ago",
    type: "league",
  },
  {
    title: "Playoff qualification",
    text: "You are currently in a playoff position.",
    time: "3 days ago",
    type: "playoff",
  },
];

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-[#071827] px-5 py-8 text-white">
      <div className="mx-auto max-w-md">
        <p className="mb-2 text-sm font-bold text-lime-300">
          UPDATES
        </p>

        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        <p className="mt-2 text-white/60">
          Match reminders, results and league updates.
        </p>

        <section className="mt-6 space-y-3">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white p-5 text-black"
            >
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lime-300 text-xl">
                  {notification.type === "match" && "📅"}
                  {notification.type === "result" && "✓"}
                  {notification.type === "league" && "🎾"}
                  {notification.type === "playoff" && "🏆"}
                </div>

                <div className="flex-1">
                  <h2 className="font-bold">
                    {notification.title}
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    {notification.text}
                  </p>

                  <p className="mt-3 text-xs font-medium text-gray-400">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}