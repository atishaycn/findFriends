import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { jsonAppError, jsonError } from "@/lib/http";
import { claimInviteForUser } from "@/lib/rounds";

export async function POST(
  request: Request,
  context: RouteContext<"/api/invites/[token]/claim">,
) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("You need to sign in first.", 401, "unauthorized");
  }

  try {
    const payload = await request.json();
    const { token } = await context.params;
    const claimResult = await claimInviteForUser(user, token, payload);

    return NextResponse.json(claimResult);
  } catch (error) {
    return jsonAppError(error, "Could not claim the invite.", 400, "claim_invite_failed");
  }
}
