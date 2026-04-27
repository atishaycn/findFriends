import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { jsonAppError, jsonError } from "@/lib/http";
import { createRoundForUser, listUserRounds } from "@/lib/rounds";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("You need to sign in first.", 401, "unauthorized");
  }

  return NextResponse.json(await listUserRounds(user.id));
}

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
    return jsonAppError(error, "Could not create the round.", 400, "create_round_failed");
  }
}
