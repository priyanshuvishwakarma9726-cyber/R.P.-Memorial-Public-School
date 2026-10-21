import { createClient, isSupabaseConfigured } from "./client";
import type { Profile } from "./types";

export interface AuthResponse {
  success: boolean;
  message?: string;
  profile?: Profile | null;
  error?: string | null;
}

/**
 * Sign in with email and password via Supabase Auth and verify active profile.
 */
export async function signInUser(
  email: string,
  password: string,
  expectedRole?: string
): Promise<AuthResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error:
        "Supabase is not configured yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.",
    };
  }

  const supabase = createClient();
  if (!supabase) {
    return {
      success: false,
      error: "Failed to initialize Supabase client.",
    };
  }

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message || "Invalid login credentials.",
    };
  }

  // Retrieve application profile
  const { data: rawProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  const profile = rawProfile as unknown as Profile | null;

  if (profileError || !profile) {
    return {
      success: true,
      message: "Authenticated, but no institutional profile was found. Please contact administration.",
      profile: null,
    };
  }

  // Verify account status: strictly require active status (rejects status === "inactive", "suspended", or "pending")
  if (profile.status !== "active") {
    await supabase.auth.signOut();
    return {
      success: false,
      error:
        "Your institutional account is not active. Please contact the school office.",
    };
  }

  // Check role match if requested
  if (expectedRole && profile.role !== expectedRole) {
    if (
      !(
        expectedRole === "admin" &&
        (profile.role === "admin" || profile.role === "principal")
      )
    ) {
      return {
        success: true,
        message: `Account verified with role "${profile.role}".`,
        profile,
      };
    }
  }

  return {
    success: true,
    message: "Login successful.",
    profile,
  };
}

/**
 * Sign out from Supabase Auth session.
 */
export async function signOutUser(): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = createClient();
  if (!supabase) {
    return { success: true };
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Request password recovery email.
 */
export async function requestPasswordReset(email: string): Promise<AuthResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase connection is not yet configured in .env.local.",
    };
  }

  const supabase = createClient();
  if (!supabase) {
    return { success: false, error: "Failed to initialize Supabase client." };
  }

  const redirectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/reset-password`
      : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "Password reset link has been dispatched to your email address.",
  };
}

/**
 * Update user password after recovery link click.
 */
export async function updatePassword(newPassword: string): Promise<AuthResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase connection is not yet configured in .env.local.",
    };
  }

  const supabase = createClient();
  if (!supabase) {
    return { success: false, error: "Failed to initialize Supabase client." };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "Password has been successfully updated. You may now sign in.",
  };
}
