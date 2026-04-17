import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { createInviteForUser } from "@/lib/rounds";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("You need to sign in first.", 401, "unauthorized");
  }

  try {
    const payload = await request.json();
    const origin = new URL(request.url).origin;
    const invite = await createInviteForUser(user.id, payload, origin);

    return NextResponse.json(invite, { status: 201 });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not create the invite.",
      400,
      "create_invite_failed",
    );
  }
}
