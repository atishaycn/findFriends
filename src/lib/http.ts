import { NextResponse } from "next/server";
import type { ApiErrorPayload } from "@/lib/types";
import { AppError } from "@/lib/errors";

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

export function jsonAppError(
  error: unknown,
  fallbackMessage: string,
  fallbackStatus = 400,
  fallbackCode = "bad_request",
) {
  if (error instanceof AppError) {
    return jsonError(error.message, error.status, error.code);
  }

  console.error(error);
  return jsonError(fallbackMessage, fallbackStatus, fallbackCode);
}
