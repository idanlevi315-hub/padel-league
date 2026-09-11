import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#eee9df] px-6 text-[#5f6b64] sm:px-10">
      <div className="mx-auto flex min-h-screen max-w-[900px] flex-col items-center justify-center text-center">
        <div className="text-[72px] font-bold leading-none tracking-[-0.06em] sm:text-[96px]">18</div>
        <div className="mt-8 text-[12px] font-semibold uppercase tracking-[0.18em] opacity-55">
          404 · Page not found
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
          This court is not available.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 opacity-70">
          The page may have moved, or the link may no longer be valid.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-[#5f6b64] px-7 py-4 text-[12px] font-semibold text-[#f4efe5]"
        >
          Back to 18
        </Link>
      </div>
    </main>
  );
}
