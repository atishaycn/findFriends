import { notFound, redirect } from "next/navigation";
import { Circle, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { GraphStage } from "@/components/graph/graph-stage";
import { SiteHeader } from "@/components/layout/site-header";
import { requirePageUser } from "@/lib/auth";
import { getFinalGraph } from "@/lib/rounds";
import { roundGraphPath, roundPath } from "@/lib/routes";
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
    <main className="page-shell">
      <SiteHeader userEmail={user.email} />
      <div className="content-wrap py-8 sm:py-10">
        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div className="space-y-4">
            <p className="eyebrow">Finished graph</p>
            <h1 className="section-title max-w-3xl font-semibold text-balance text-ink">
              The round closed, and now every path is visible.
            </h1>
            <p className="body-copy text-sm">
              This round finished on {formatTimestamp(graph.completedAt)}. The warm
              line marks the link that closed the loop. The first circle is the
              person who started the round.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="paper-panel p-5">
              <div className="flex items-start gap-3">
                <Sparkle size={20} weight="fill" className="mt-0.5 text-accent" />
                <div>
                  <p className="text-sm font-semibold text-ink">Starter</p>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    The first person in the round appears with the warm highlight.
                  </p>
                </div>
              </div>
            </div>
            <div className="paper-panel p-5">
              <div className="flex items-start gap-3">
                <Circle size={20} weight="bold" className="mt-0.5 text-accent" />
                <div>
                  <p className="text-sm font-semibold text-ink">Closing link</p>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    The curved warm line shows the moment the round finished.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <GraphStage graph={graph} />
        </section>
      </div>
    </main>
  );
}
