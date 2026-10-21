import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Checks whether the required public Supabase environment variables are provided.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(url && key && url.trim().length > 0 && key.trim().length > 0);
}

/**
 * Creates or retrieves a Supabase client for browser components using SSR cookies.
 * Gracefully returns null if environment variables are not yet configured.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createBrowserClient<Database>(url, key);
}
