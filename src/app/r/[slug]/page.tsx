import { notFound } from "next/navigation";
import { RoundWorkspace } from "@/components/round/round-workspace";
import { SiteHeader } from "@/components/layout/site-header";
import { requirePageUser } from "@/lib/auth";
import { getRoundWorkspace } from "@/lib/rounds";
import { roundPath } from "@/lib/routes";

export default async function RoundPage(props: PageProps<"/r/[slug]">) {
  const { slug } = await props.params;
  const user = await requirePageUser(roundPath(slug));
  const workspace = await getRoundWorkspace(slug, user.id);

  if (!workspace) {
    notFound();
  }

  return (
    <main className="app-shell">
      <SiteHeader userEmail={user.email} />
      <div className="page-frame flex flex-col gap-8">
        <RoundWorkspace initialData={workspace} />
      </div>
    </main>
  );
}
