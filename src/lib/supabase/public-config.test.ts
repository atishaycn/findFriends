import { describe, expect, it } from "vitest";
import { validateSupabasePublicConfig } from "@/lib/supabase/public-config";

describe("validateSupabasePublicConfig", () => {
  it("rejects missing public browser config", () => {
    expect(validateSupabasePublicConfig({})).toEqual({
      ok: false,
      message:
        "Set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY before using email sign-in.",
    });
  });

  it("rejects a public key from a different Supabase project", () => {
    expect(
      validateSupabasePublicConfig({
        supabaseUrl: "https://project-one.supabase.co",
        supabasePublicKey:
          "eyJhbGciOiJIUzI1NiJ9.eyJyZWYiOiJwcm9qZWN0LXR3byJ9.signature",
      }),
    ).toEqual({
      ok: false,
      message:
        "Supabase public config does not match. NEXT_PUBLIC_SUPABASE_URL and the public key must come from the same Supabase project.",
    });
  });

  it("accepts matching project refs", () => {
    expect(
      validateSupabasePublicConfig({
        supabaseUrl: "https://project-one.supabase.co",
        supabasePublicKey:
          "eyJhbGciOiJIUzI1NiJ9.eyJyZWYiOiJwcm9qZWN0LW9uZSJ9.signature",
      }),
    ).toEqual({ ok: true });
  });
});
