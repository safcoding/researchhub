import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#036846] to-[#5edaa7] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/login"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Login here bij</h3>
          </Link>
      </div>
    </main>
  );
}
