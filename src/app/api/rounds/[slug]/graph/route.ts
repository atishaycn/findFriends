import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { getFinalGraph } from "@/lib/rounds";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/rounds/[slug]/graph">,
) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("You need to sign in first.", 401, "unauthorized");
  }

  const { slug } = await context.params;
  const graph = await getFinalGraph(slug, user.id);

  if (!graph) {
    return jsonError("Round not found.", 404, "not_found");
  }

  if (graph === "pending") {
    return jsonError("Round is still active.", 409, "round_active");
  }

  return NextResponse.json(graph);
}
