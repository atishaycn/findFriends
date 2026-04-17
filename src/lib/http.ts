import { NextResponse } from "next/server";
import type { ApiErrorPayload } from "@/lib/types";

export function jsonError(
  error: string,
  status = 400,
  code?: string,
) {
  return NextResponse.json<ApiErrorPayload>(
    {
      error,
      code,
    },
    { status },
  );
}
