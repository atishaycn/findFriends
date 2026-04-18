import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { hasSupabaseClientEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { homePath } from "@/lib/routes";

export async function getCurrentUser() {
  if (!hasSupabaseClientEnv()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requirePageUser(nextPath?: string): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    const path = nextPath
      ? `${homePath()}?next=${encodeURIComponent(nextPath)}`
      : homePath();

    redirect(path);
  }

  return user;
}
