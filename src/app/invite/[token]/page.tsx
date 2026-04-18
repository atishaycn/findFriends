import { notFound } from "next/navigation";
import { InviteClaimCard } from "@/components/round/invite-claim-card";
import { getCurrentUser } from "@/lib/auth";
import { getPublicEnv } from "@/lib/env";
import { getInvitePreview } from "@/lib/rounds";

function suggestDisplayName(email: string | undefined) {
  if (!email) {
    return "";
  }

  return email.split("@")[0].replace(/[._-]+/g, " ");
}

export default async function InvitePage(props: PageProps<"/invite/[token]">) {
  const { token } = await props.params;
  const user = await getCurrentUser();
  const preview = await getInvitePreview(token, user?.id);
  const publicEnv = getPublicEnv();

  if (!preview) {
    notFound();
  }

  return (
    <main className="invite-screen min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-10 sm:px-8">
        <InviteClaimCard
          preview={preview}
          isAuthenticated={Boolean(user)}
          userEmail={user?.email ?? null}
          suggestedDisplayName={suggestDisplayName(user?.email)}
          siteUrl={publicEnv.siteUrl}
          supabaseUrl={publicEnv.supabaseUrl}
          supabaseAnonKey={publicEnv.supabaseAnonKey}
        />
      </div>
    </main>
  );
}
