import type { Profile } from "./types";
import { sanitizeHandle, validateHandleFormat } from "./handle";
import { supabase } from "./supabase";

const PENDING_HANDLE_KEY = "linkbio:pending-handle";

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

/** Logged-in user ka id. getSession() local hota hai, network nahi jaata. */
export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

/** The current user's own profile. */
export async function getProfile(): Promise<Profile | null> {
  const owner = await getCurrentUserId();
  if (!owner) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("owner_id", owner)
    .maybeSingle();
  if (error) {
    console.error("getProfile:", error);
    return null;
  }
  return data ? fromRow(data as Row) : null;
}

/** Public lookup by handle. */
export async function getProfileByHandle(handle: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("handle", handle.toLowerCase())
    .maybeSingle();
  if (error) {
    console.error("getProfileByHandle:", error);
    return null;
  }
  return data ? fromRow(data as Row) : null;
}

export async function isHandleAvailable(
  handle: string,
  exceptProfileId?: string
): Promise<boolean> {
  let q = supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("handle", handle.toLowerCase());
  if (exceptProfileId) q = q.neq("id", exceptProfileId);
  const { count, error } = await q;
  if (error) {
    console.error("isHandleAvailable:", error);
    return false;
  }
  return (count ?? 0) === 0;
}

/** Idempotent: returns the existing profile if the user already has one. */
export async function getOrCreateProfile(wantedHandle?: string): Promise<Profile> {
  const owner = await getCurrentUserId();
  if (!owner) throw new Error("NOT_SIGNED_IN");

  const existing = await getProfile();
  if (existing) return existing;

  let pending: string | null = null;
  try {
    pending = localStorage.getItem(PENDING_HANDLE_KEY);
  } catch {}

  let handle: string | null = sanitizeHandle(wantedHandle || pending || "");
  if (validateHandleFormat(handle) || !(await isHandleAvailable(handle))) {
    handle = null; // user khud choose karega
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({ owner_id: owner, handle })
    .select("*")
    .single();

  if (error) {
    // dev me effect 2 baar chalta hai, doosri call yahan aati hai (owner_id unique hai)
    const again = await getProfile();
    if (again) return again;
    throw new Error(error.message);
  }
  try {
    localStorage.removeItem(PENDING_HANDLE_KEY);
  } catch {}
  return fromRow(data as Row);
}

export async function saveProfile(profile: Profile): Promise<void> {
  // Click count sirf record_click() badalta hai, editor ise overwrite na kare.
  const { data: stored } = await supabase
    .from("profiles")
    .select("links")
    .eq("id", profile.id)
    .maybeSingle();
  const clicks = new Map<string, number>(
    ((stored?.links ?? []) as Profile["links"]).map((l) => [l.id, l.clicks] as [string, number])
  );

  const { error } = await supabase
    .from("profiles")
    .update({
      handle: profile.handle || null,
      display_name: profile.displayName ?? "",
      bio: profile.bio ?? "",
      avatar: profile.avatar ?? "",
      theme: profile.theme,
      socials: profile.socials,
      links: profile.links.map((l) => ({ ...l, clicks: clicks.get(l.id) ?? l.clicks })),
      updated_at: Date.now(),
    })
    .eq("id", profile.id);

  if (error) {
    if (error.code === "23505") throw new Error("Handle already taken");
    if (error.message.includes("HANDLE_COOLDOWN"))
      throw new Error("You can change your username once every 30 days");
    throw new Error(error.message);
  }
}

export async function recordClick(handle: string, linkId: string): Promise<void> {
  const { error } = await supabase.rpc("record_click", {
    p_handle: handle,
    p_link_id: linkId,
  });
  if (error) console.error("recordClick:", error);
}