import Link from "next/link";
import { ArrowSquareOut, SignOut, SquaresFour } from "@phosphor-icons/react/dist/ssr";
import { signOutAction } from "@/app/actions";
import { homePath, studioPath } from "@/lib/routes";

export function SiteHeader({
  userEmail,
}: {
  userEmail?: string | null;
}) {
  return (
    <header className="sticky top-0 z-20 px-4 py-4 md:px-8">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 rounded-[1.6rem] border border-white/70 bg-[rgba(255,255,255,0.62)] px-4 py-3 shadow-[0_18px_44px_-28px_rgba(31,36,31,0.28)] backdrop-blur-xl md:px-5">
        <div className="flex items-center gap-4">
          <Link
            href={homePath()}
            className="text-2xl font-semibold tracking-[-0.08em] text-[var(--ink)] md:text-3xl"
          >
            Loop
          </Link>
          <div className="hidden items-center gap-2 rounded-full border border-[var(--line)] bg-white/60 px-3 py-2 text-xs uppercase tracking-[0.18em] text-[rgba(18,23,20,0.46)] md:inline-flex">
            <span className="status-dot" />
            Invite graph
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-[rgba(18,23,20,0.68)] md:gap-3">
          {userEmail ? (
            <>
              <Link
                href={studioPath()}
                className="secondary-button px-4 py-2 text-sm"
              >
                <SquaresFour size={16} weight="duotone" />
                Studio
              </Link>
              <span className="hidden rounded-full border border-[var(--line)] bg-white/60 px-4 py-2 md:inline-flex">
                {userEmail}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="secondary-button px-4 py-2 text-sm"
                >
                  <SignOut size={16} weight="duotone" />
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link href={`${homePath()}#sign-in`} className="secondary-button px-4 py-2 text-sm">
              <ArrowSquareOut size={16} weight="duotone" />
              Email sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
