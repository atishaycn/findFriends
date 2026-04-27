"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function createBrowserSupabaseClient(config: {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}) {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error(
      "Supabase public environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  if (!client) {
    client = createBrowserClient(config.supabaseUrl, config.supabaseAnonKey, {
      isSingleton: true,
    });
  }

  return client;
}
