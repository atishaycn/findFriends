import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { homePath, studioPath } from "@/lib/routes";

export function SiteHeader({
  userEmail,
}: {
  userEmail?: string | null;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href={homePath()}
          className="font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
        >
          Loop
        </Link>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          {userEmail ? (
            <>
              <Link
                href={studioPath()}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Your Loops
              </Link>
              <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 md:inline-flex">
                {userEmail}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-full bg-slate-950 px-4 py-2 text-white transition hover:bg-slate-800"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              Magic link sign in
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
