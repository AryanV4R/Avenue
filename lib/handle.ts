const RESERVED = [
  "dashboard", "login", "signup", "api", "admin", "settings",
  "about", "help", "terms", "privacy", "www", "app", "_next", "profile", "contact", "avenue", "avenueh",
];

export function sanitizeHandle(v: string): string {
  return v.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 30);
}

/** Returns an error message, or null if the format is valid. */
export function validateHandleFormat(h: string): string | null {
  if (h.length < 3) return "At least 3 characters";
  if (h.length > 30) return "Max 30 characters";
  if (!/^[a-z0-9_]+$/.test(h)) return "Only lowercase letters, numbers and _";
  if (RESERVED.includes(h)) return "That handle is reserved";
  return null;
}
