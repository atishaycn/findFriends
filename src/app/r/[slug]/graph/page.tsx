import { notFound, redirect } from "next/navigation";
import { FriendGraphCanvas } from "@/components/graph/friend-graph-canvas";
import { SiteHeader } from "@/components/layout/site-header";
import { requirePageUser } from "@/lib/auth";
import { getFinalGraph } from "@/lib/rounds";
import { roundPath, roundGraphPath } from "@/lib/routes";
import { formatTimestamp } from "@/lib/utils";

export default async function FinalGraphPage(props: PageProps<"/r/[slug]/graph">) {
  const { slug } = await props.params;
  const user = await requirePageUser(roundGraphPath(slug));
  const graph = await getFinalGraph(slug, user.id);

  if (!graph) {
    notFound();
  }

  if (graph === "pending") {
    redirect(roundPath(slug));
  }

  return (
    <main className="paper-grid min-h-screen">
      <SiteHeader userEmail={user.email} />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
        <section className="ink-panel p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Final reveal
          </p>
          <h1 className="mt-3 font-display text-6xl leading-none text-ink sm:text-7xl">
            Your round has a shape now.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-ink/70">
            The graph closed on {formatTimestamp(graph.completedAt)}. Every node below
            is a claimed friend, and the warm edge marks the connection that completed
            the round.
          </p>
        </section>

        <FriendGraphCanvas graph={graph} />
      </div>
    </main>
  );
}
