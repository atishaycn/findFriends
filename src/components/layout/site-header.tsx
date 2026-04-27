import Link from "next/link";
import {
  House,
  SignOut,
  Pulse,
  SquaresFour,
} from "@phosphor-icons/react/dist/ssr";
import { signOutAction } from "@/app/actions";
import { homePath, studioPath } from "@/lib/routes";

export function SiteHeader({
  userEmail,
}: {
  userEmail?: string | null;
}) {
  return (
    <header className="glass-bar sticky top-0 z-20">
      <div className="content-wrap py-3">
        <div className="nav-shell flex items-center justify-between gap-4 rounded-full px-3 py-2 sm:px-4">
        <Link
          href={homePath()}
          className="inline-flex items-center gap-3 rounded-full px-2 py-2 text-sm font-semibold tracking-[-0.02em] text-ink"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/80 text-accent shadow-[0_14px_28px_-22px_rgba(72,56,36,0.44)]">
            <Pulse size={16} weight="fill" />
          </span>
          <span className="hidden sm:inline">findFriends</span>
        </Link>
        <div className="flex items-center gap-1 text-sm text-muted sm:gap-2">
          <Link
            href={homePath()}
            className="dock-link text-sm font-medium"
          >
            <House size={16} weight="bold" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          {userEmail ? (
            <>
              <Link
                href={studioPath()}
                className="dock-link text-sm font-medium"
              >
                <SquaresFour size={16} weight="bold" />
                <span className="hidden sm:inline">Studio</span>
              </Link>
              <span className="hidden rounded-full border border-line bg-white/60 px-4 py-2 md:inline-flex">
                {userEmail}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="secondary-button px-4 py-2 text-sm"
                >
                  <SignOut size={16} weight="bold" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </>
          ) : (
            <span className="hidden rounded-full border border-line bg-white/60 px-4 py-2 md:inline-flex">
              Email sign-in
            </span>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
