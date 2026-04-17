export function homePath() {
  return "/";
}

export function studioPath() {
  return "/studio";
}

export function roundPath(slug: string) {
  return `/r/${slug}`;
}

export function roundGraphPath(slug: string) {
  return `/r/${slug}/graph`;
}

export function invitePath(token: string) {
  return `/invite/${token}`;
}

export function authCallbackPath(nextPath?: string) {
  if (!nextPath) {
    return "/auth/callback";
  }

  return `/auth/callback?next=${encodeURIComponent(nextPath)}`;
}
