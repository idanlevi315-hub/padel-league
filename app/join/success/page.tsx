import Link from "next/link";

export default function RegistrationSuccessPage() {
  return (
    <main className="min-h-screen bg-[#24372f] px-5 py-8 text-white">
      <div className="mx-auto max-w-md">
        <div className="flex min-h-[75vh] flex-col justify-center">

          <div className="text-center">

            <div className="relative mx-auto h-28 w-28">
              <div className="absolute inset-0 rounded-full bg-lime-300/30 blur-2xl" />

              <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-lime-300 shadow-none">
                <div className="absolute -left-5 top-1 h-24 w-16 rotate-12 rounded-full border-r-[5px] border-white/90" />

                <div className="absolute -right-5 bottom-1 h-24 w-16 rotate-12 rounded-full border-l-[5px] border-white/90" />

                <span className="relative z-10 text-5xl font-black text-[#24372f]">
                  ✓
                </span>
              </div>

              <div className="absolute -left-5 top-3 h-2 w-2 rounded-full bg-lime-300" />
              <div className="absolute -right-6 top-6 h-3 w-3 rounded-full bg-lime-300" />
              <div className="absolute -left-7 bottom-5 h-3 w-3 rounded-full bg-lime-300" />
              <div className="absolute -right-4 bottom-2 h-2 w-2 rounded-full bg-lime-300" />
            </div>

            <p className="mt-8 text-sm font-bold tracking-widest text-lime-300">
              REGISTRATION COMPLETE
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              You&apos;re In!
            </h1>

            <p className="mx-auto mt-3 max-w-sm leading-6 text-white/60">
              Your registration has been submitted successfully.
            </p>
          </div>

          <section className="mt-8 rounded-3xl bg-white p-6 text-black">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="text-gray-500">
                Registration
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                ✓ Submitted
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 py-4">
              <span className="text-gray-500">
                Payment
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                ✓ Completed
              </span>
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="text-gray-500">
                League status
              </span>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                Pending approval
              </span>
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-lime-300/30 bg-lime-300/10 p-5">
            <p className="font-bold text-lime-300">
              What happens next?
            </p>

            <p className="mt-2 text-sm leading-6 text-white/70">
              The league administrator will review your registration.
              You&apos;ll receive a notification when your team is approved
              and your group is assigned.
            </p>
          </section>

          <Link
            href="/"
            className="mt-6 block w-full rounded-2xl bg-lime-300 py-4 text-center text-lg font-bold text-black transition hover:bg-lime-200"
          >
            Go to Home
          </Link>

        </div>
      </div>
    </main>
  );
}