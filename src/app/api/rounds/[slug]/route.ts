import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { getRoundWorkspace } from "@/lib/rounds";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/rounds/[slug]">,
) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("You need to sign in first.", 401, "unauthorized");
  }

  const { slug } = await context.params;
  const workspace = await getRoundWorkspace(slug, user.id);

  if (!workspace) {
    return jsonError("Round not found.", 404, "not_found");
  }

  return NextResponse.json(workspace);
}
