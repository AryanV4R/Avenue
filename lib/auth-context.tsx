"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getProfile } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

const CACHE = "linkbio:auth-cache";

interface Ctx {
  ready: boolean;
  loggedIn: boolean | null;
  user: User | null;
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const AuthCtx = createContext<Ctx | null>(null);

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const uid = useRef<string | null>(null);

  useEffect(() => {
    let alive = true;

    // Pichli visit ka snapshot, taaki refresh pe turant sahi UI dikhe
    try {
      const c = JSON.parse(sessionStorage.getItem(CACHE) || "null");
      if (c) {
        setLoggedIn(c.loggedIn);
        setUser(c.user ?? null);
        setProfile(c.profile);
        setReady(true);
      }
    } catch {}

    async function apply(u: User | null) {
      uid.current = u?.id ?? null;
      setUser(u);
      setLoggedIn(!!u);
      const p = u ? await getProfile() : null;
      if (!alive) return;
      setProfile(p);
      setReady(true);
    }

    supabase.auth.getSession().then(({ data }) => apply(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") return;
      // Tab focus pe same user ka SIGNED_IN dobara aata hai, refetch ki zarurat nahi
      if (event === "SIGNED_IN" && session?.user.id === uid.current) return;
      setTimeout(() => apply(session?.user ?? null), 0); // callback ke andar seedha await mat karo
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Profile ya user badalte hi cache update, taaki refresh pe purana data flash na ho
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(CACHE, JSON.stringify({ loggedIn, user, profile }));
    } catch {}
  }, [ready, loggedIn, user, profile]);

  return (
    <AuthCtx.Provider value={{ ready, loggedIn, user, profile, setProfile }}>
      {children}
    </AuthCtx.Provider>
  );
}