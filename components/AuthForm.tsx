"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { ghostBtn, inputCls, primaryBtn } from "@/components/ui";
import { APP_NAME } from "@/lib/config";
import { supabase } from "@/lib/supabase";

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (isSignup && password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    setBusy(true);
    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setBusy(false);
      if (error) return setError(error.message);
      if (data.session) router.push("/dashboard");
      else setInfo("Check your email to confirm your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setError(error.message);
      router.push("/dashboard");
    }
  }

  async function google() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          {APP_NAME}
          <span className="text-accent">.</span>
        </Link>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>

        <button type="button" onClick={google} className={`${ghostBtn} mt-8 w-full py-3`}>
          <FcGoogle size={18} />
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-neutral-400">
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          or
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className={inputCls}
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            className={inputCls}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          {info && <p className="text-sm text-accent">{info}</p>}
          <button disabled={busy} className={`${primaryBtn} w-full py-3`}>
            {isSignup ? "Sign up" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          {isSignup ? "Already have an account? " : "New here? "}
          <Link
            href={isSignup ? "/signin" : "/signup"}
            className="font-medium text-accent hover:underline"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </main>
  );
}