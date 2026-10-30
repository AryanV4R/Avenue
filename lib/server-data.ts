import type { Profile } from "./types";

/**
 * SERVER-SIDE lookup used by generateMetadata (SEO / Open Graph).
 * localStorage doesn't exist on the server, so this returns null for now.
 * When you add Supabase/Firebase, query it here and per-profile
 * OG tags start working automatically.
 */
export async function getProfileServer(_handle: string): Promise<Profile | null> {
  return null;
}
