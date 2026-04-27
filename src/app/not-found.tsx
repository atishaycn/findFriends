import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <main className="page-shell">
      <div className="content-wrap flex min-h-[100dvh] items-center justify-center py-12">
        <section className="paper-panel max-w-2xl p-8 sm:p-10">
          <p className="eyebrow">Could not find that round</p>
          <h1 className="section-title mt-3 max-w-xl text-balance font-semibold text-ink">
            This link is missing, expired, or belongs to a round you cannot open.
          </h1>
          <p className="body-copy mt-4">
            If someone sent you this from chat, ask them for a fresh link. If you
            were already part of the round, head back to the studio and reopen it
            from there.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="primary-button">
              <ArrowLeft size={18} weight="bold" />
              Back home
            </Link>
            <Link href="/studio" className="secondary-button">
              Open studio
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
