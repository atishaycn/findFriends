type SupabaseJwtPayload = {
  ref?: string;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4)) % 4;

  return Buffer.from(normalized.padEnd(normalized.length + padding, "="), "base64")
    .toString("utf8");
}

function readProjectRef(supabaseUrl: string) {
  try {
    const { hostname } = new URL(supabaseUrl);
    const match = hostname.match(/^([a-z0-9-]+)\.supabase\.co$/i);
    return match?.[1]?.toLowerCase();
  } catch {
    return undefined;
  }
}

function readKeyRef(supabasePublicKey: string) {
  const parts = supabasePublicKey.split(".");

  if (parts.length < 2) {
    return undefined;
  }

  try {
    const payload = JSON.parse(
      decodeBase64Url(parts[1]),
    ) as SupabaseJwtPayload;
    return payload.ref?.toLowerCase();
  } catch {
    return undefined;
  }
}

export function validateSupabasePublicConfig(config: {
  supabaseUrl?: string;
  supabasePublicKey?: string;
}) {
  if (!config.supabaseUrl || !config.supabasePublicKey) {
    return {
      ok: false as const,
      message:
        "Set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY before using email sign-in.",
    };
  }

  const projectRef = readProjectRef(config.supabaseUrl);
  const keyRef = readKeyRef(config.supabasePublicKey);

  if (!projectRef || !keyRef) {
    return {
      ok: true as const,
    };
  }

  if (projectRef !== keyRef) {
    return {
      ok: false as const,
      message:
        "Supabase public config does not match. NEXT_PUBLIC_SUPABASE_URL and the public key must come from the same Supabase project.",
    };
  }

  return {
    ok: true as const,
  };
}
