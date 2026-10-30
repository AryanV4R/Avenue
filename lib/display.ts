import type { User } from "@supabase/supabase-js";
import type { Profile } from "./types";

export function getDisplay(user: User | null, profile: Profile | null) {
  const meta = (user?.user_metadata ?? {}) as Record<string, string | undefined>;
  const name =
    profile?.displayName?.trim() ||
    meta.full_name ||
    meta.name ||
    user?.email?.split("@")[0] ||
    "User";
  const avatar = profile?.avatar || meta.avatar_url || meta.picture || "";
  return { name, avatar, initial: name[0]?.toUpperCase() ?? "?" };
}