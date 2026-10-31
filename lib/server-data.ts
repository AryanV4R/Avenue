import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Profile } from "./types";

type Row = {
  id: string;
  owner_id: string;
  handle: string | null;
  handle_changed_at: string | null;
  display_name: string;
  bio: string;
  avatar: string;
  theme: string;
  socials: Profile["socials"];
  links: Profile["links"];
  updated_at: number;
};

function fromRow(r: Row): Profile {
  return {
    id: r.id,
    ownerId: r.owner_id,
    handle: r.handle ?? "",
    handleChangedAt: r.handle_changed_at ? new Date(r.handle_changed_at).getTime() : 0,
    displayName: r.display_name,
    bio: r.bio,
    avatar: r.avatar,
    theme: r.theme as Profile["theme"],
    socials: r.socials ?? [],
    links: r.links ?? [],
    updatedAt: Number(r.updated_at),
  };
}

/** Server-side public lookup. cache() se generateMetadata aur Page ek hi request me ek hi query chalate hain. */
export const getProfileServer = cache(async (handle: string): Promise<Profile | null> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("handle", handle.toLowerCase())
    .maybeSingle();
  if (error) {
    console.error("getProfileServer:", error);
    return null;
  }
  return data ? fromRow(data as Row) : null;
});