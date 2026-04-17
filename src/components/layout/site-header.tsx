import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { homePath, studioPath } from "@/lib/routes";

export function SiteHeader({
  userEmail,
}: {
  userEmail?: string | null;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-[color:rgba(250,246,239,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href={homePath()}
          className="font-display text-3xl tracking-[0.08em] text-ink"
        >
          Friend Graph
        </Link>
        <div className="flex items-center gap-3 text-sm text-ink/72">
          {userEmail ? (
            <>
              <Link
                href={studioPath()}
                className="rounded-full border border-black/10 px-4 py-2 transition hover:border-black/25 hover:bg-white/70"
              >
                Studio
              </Link>
              <span className="hidden rounded-full border border-black/10 px-4 py-2 md:inline-flex">
                {userEmail}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-full bg-ink px-4 py-2 text-paper transition hover:bg-ink/90"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <span className="rounded-full border border-black/10 px-4 py-2">
              Email sign in
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
