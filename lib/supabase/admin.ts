import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Creates an administrative Supabase client using the server-only secret key.
 * 
 * CRITICAL SECURITY INVARIANT:
 * - This function MUST ONLY be called in server environments (Route Handlers, Server Actions).
 * - NEVER import or execute this in Client Components.
 * - NEVER expose SUPABASE_SECRET_KEY to NEXT_PUBLIC_ variables.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY ERROR: createAdminClient() cannot be called from the browser."
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secretKey) {
    return null;
  }

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
