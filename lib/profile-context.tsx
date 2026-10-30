"use client";

import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
} from "react";
import { useAuth } from "@/lib/auth-context";
import { getOrCreateProfile, saveProfile } from "@/lib/storage";
import type { Profile } from "@/lib/types";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface Ctx {
  profile: Profile | null;
  update: (patch: Partial<Profile>) => void;
  /** Profile ko DB se (ya naya bana ke) load karo. `wanted` = claim flow ka handle. */
  load: (wanted?: string) => Promise<void>;
  status: SaveStatus;
  error: string | null;
}

const ProfileCtx = createContext<Ctx | null>(null);

export function useProfile(): Ctx {
  const ctx = useContext(ProfileCtx);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>");
  return ctx;
}

/**
 * Profile ka single source of truth AuthProvider hai (useAuth().profile).
 * Ye provider sirf edits (update) aur debounced autosave sambhalta hai.
 * Root layout me rehta hai, isliye route badalne pe remount/refetch nahi hota.
 */
export function ProfileProvider({ children }: { children: React.ReactNode }) {
const { profile, setProfile } = useAuth();
const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const dirtyId = useRef<string | null>(null); // kis profile me unsaved edit hai

  const load = useCallback(
    async (wanted?: string) => {
      try {
        setProfile(await getOrCreateProfile(wanted));
      } catch (err) {
        if (err instanceof Error && err.message === "NOT_SIGNED_IN") return;
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      }
    },
    [setProfile]
  );

  const update = useCallback(
    (patch: Partial<Profile>) =>
      setProfile((p) => {
        if (!p) return p;
        dirtyId.current = p.id;
        return { ...p, ...patch };
      }),
    [setProfile]
  );

  // Debounced autosave. Sirf tab jab user ne edit kiya ho (load pe save nahi hota).
  useEffect(() => {
    if (!profile || dirtyId.current !== profile.id) return;

    setStatus("saving");
    const t = setTimeout(async () => {
      dirtyId.current = null;
      try {
        await saveProfile(profile);
        setError(null);
        setStatus("saved");
      } catch (err) {
        console.error("saveProfile failed:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      }
    }, 350);
    return () => clearTimeout(t);
  }, [profile]);

  return (
    <ProfileCtx.Provider value={{ profile, update, load, status, error }}>
      {children}
    </ProfileCtx.Provider>
  );
}