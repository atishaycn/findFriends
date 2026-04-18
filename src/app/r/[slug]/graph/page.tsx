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
    <main className="paper-grid min-h-[100dvh]">
      <SiteHeader userEmail={user.email} />
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">
        <section className="ink-panel overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-y-0 right-0 w-[34%] bg-[radial-gradient(circle_at_top_right,rgba(255,153,92,0.18),transparent_62%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(240px,0.7fr)] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Final reveal
              </p>
              <h1 className="mt-3 max-w-4xl font-display text-5xl leading-[0.96] tracking-[-0.05em] text-ink sm:text-6xl lg:text-[5.4rem]">
                The loop is closed. Now the last tag is obvious.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-ink/72 sm:text-lg">
                The round closed on {formatTimestamp(graph.completedAt)}. This view now
                leads with the final handoff first, then leaves the full network visible
                underneath so people can read both the story and the structure.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.09)] backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/55">
                Reveal snapshot
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <p className="text-3xl font-semibold tracking-[-0.05em] text-ink">
                    {graph.nodes.length}
                  </p>
                  <p className="mt-1 text-sm text-ink/58">friends in the loop</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold tracking-[-0.05em] text-ink">
                    {graph.edges.length}
                  </p>
                  <p className="mt-1 text-sm text-ink/58">connections shown</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FriendGraphCanvas graph={graph} />
      </div>
    </main>
  );
}
