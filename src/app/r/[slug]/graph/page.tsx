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
    <main className="app-shell">
      <SiteHeader userEmail={user.email} />
      <div className="page-frame flex flex-col gap-8">
        <section className="glass-panel p-6 md:p-7">
          <p className="section-kicker">Final reveal</p>
          <h1 className="page-title mt-3 max-w-[10ch]">
            Your round has a shape now.
          </h1>
          <p className="body-copy mt-4">
            The graph closed on {formatTimestamp(graph.completedAt)}. Every node below
            is a claimed friend, and the highlighted edge marks the connection that completed
            the round.
          </p>
        </section>

        <FriendGraphCanvas graph={graph} />
      </div>
    </main>
  );
}
