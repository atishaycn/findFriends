import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { homePath, studioPath } from "@/lib/routes";

export function SiteHeader({
  userEmail,
}: {
  userEmail?: string | null;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[color:rgba(7,11,22,0.62)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href={homePath()}
          className="font-display text-3xl tracking-[0.08em] text-ink sm:text-4xl"
        >
          findFriends
        </Link>
        <div className="flex items-center gap-3 text-sm text-ink/72">
          {userEmail ? (
            <>
              <Link
                href={studioPath()}
                className="rounded-full border border-white/12 px-4 py-2 transition hover:border-white/25 hover:bg-white/10"
              >
                Studio
              </Link>
              <span className="hidden rounded-full border border-white/12 bg-white/6 px-4 py-2 md:inline-flex">
                {userEmail}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-full bg-white/92 px-4 py-2 text-[#10131d] transition hover:bg-white"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2">
              Email sign in
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
