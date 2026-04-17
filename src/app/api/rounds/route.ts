import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { createRoundForUser } from "@/lib/rounds";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("You need to sign in first.", 401, "unauthorized");
  }

  try {
    const payload = await request.json();
    const round = await createRoundForUser(user, payload);

    return NextResponse.json(round, { status: 201 });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not create the round.",
      400,
      "create_round_failed",
    );
  }
}
