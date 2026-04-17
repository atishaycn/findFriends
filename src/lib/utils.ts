import { randomBytes } from "node:crypto";

export function normalizeDisplayName(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function generatePublicSlug() {
  return randomBytes(4).toString("hex");
}

export function generateInviteToken() {
  return randomBytes(18).toString("base64url");
}

export function formatTimestamp(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function absoluteUrl(baseUrl: string, path: string) {
  return new URL(path, baseUrl).toString();
}

export function isPostgresError(
  error: unknown,
): error is { code?: string; constraint?: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

export function isUniqueViolation(error: unknown, constraint?: string) {
  if (!isPostgresError(error)) {
    return false;
  }

  if (error.code !== "23505") {
    return false;
  }

  if (!constraint) {
    return true;
  }

  return error.constraint === constraint;
}
