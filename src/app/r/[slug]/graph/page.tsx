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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <SiteHeader userEmail={user.email} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6">
        <FriendGraphCanvas graph={graph} />
        <div className="mx-auto w-full max-w-2xl rounded-[1.75rem] border border-white/70 bg-white/78 p-5 text-sm shadow-[0_20px_60px_rgba(30,41,59,0.12)] backdrop-blur">
          <p className="font-semibold text-slate-950">
            Loop: {graph.prompt ?? graph.slug}
          </p>
          <p className="mt-2 text-slate-600">
            Started by: {graph.starterDisplayName} on {formatTimestamp(graph.startedAt)}
          </p>
          <p className="mt-1 text-slate-600">
            Closed by: {graph.closerDisplayName ?? "Unknown"} on {formatTimestamp(graph.completedAt)}
          </p>
          <p className="mt-1 text-slate-600">
            Total jumps: {graph.edges.length}
          </p>
        </div>
      </div>
    </main>
  );
}
