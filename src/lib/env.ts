type PublicEnvKey =
  | "NEXT_PUBLIC_SITE_URL"
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";

type ServerEnvKey =
  | PublicEnvKey
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "DATABASE_URL"
  | "RESEND_API_KEY"
  | "RESEND_FROM_EMAIL";

const PUBLIC_ENV = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
} as const;

function readEnv(key: string) {
  const value =
    key in PUBLIC_ENV
      ? PUBLIC_ENV[key as keyof typeof PUBLIC_ENV]
      : process.env[key];

  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getPublicEnv() {
  const supabasePublicKey =
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  return {
    siteUrl: readEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
    supabaseUrl: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: supabasePublicKey,
  };
}

export function hasSupabaseClientEnv() {
  const env = getPublicEnv();
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function requireEnv(key: ServerEnvKey) {
  if (key === "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
    const publicKey =
      readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
      readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

    if (!publicKey) {
      throw new Error(
        "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      );
    }

    return publicKey;
  }

  const value = readEnv(key);

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function maybeEnv(key: ServerEnvKey) {
  if (key === "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
    return (
      readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
      readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
    );
  }

  return readEnv(key);
}

export function getBaseUrl(fallback?: string) {
  return fallback ?? getPublicEnv().siteUrl;
}
