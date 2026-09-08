export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#071827] px-5 py-8 text-white">
      <div className="mx-auto max-w-md">

        <p className="mb-2 text-sm font-bold text-lime-300">
          PLAYER
        </p>

        <h1 className="text-3xl font-bold">
          Profile
        </h1>

        <section className="mt-6 rounded-3xl bg-white p-6 text-black">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-300 text-2xl font-bold">
              DL
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Daniel Cohen
              </h2>

              <p className="text-sm text-gray-500">
                Team Alpha
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-gray-50 p-4 text-center">
              <p className="text-xl font-bold">3.5</p>
              <p className="mt-1 text-xs text-gray-500">
                Level
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 text-center">
              <p className="text-xl font-bold">3</p>
              <p className="mt-1 text-xs text-gray-500">
                Wins
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 text-center">
              <p className="text-xl font-bold">1</p>
              <p className="mt-1 text-xs text-gray-500">
                Losses
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-3xl bg-white p-6 text-black">
          <h2 className="text-lg font-bold">
            Player information
          </h2>

          <div className="mt-4 space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <p className="text-xs font-bold uppercase text-gray-400">
                Email
              </p>
              <p className="mt-1 font-medium">
                daniel@example.com
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <p className="text-xs font-bold uppercase text-gray-400">
                Phone
              </p>
              <p className="mt-1 font-medium">
                +34 600 000 000
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-gray-400">
                Group
              </p>
              <p className="mt-1 font-medium">
                Group A
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-5">
          <p className="text-sm font-bold text-lime-300">
            Partner
          </p>

          <p className="mt-2 text-lg font-bold">
            David Levy
          </p>

          <p className="mt-1 text-sm text-white/60">
            Team Alpha
          </p>
        </section>

      </div>
    </main>
  );
}