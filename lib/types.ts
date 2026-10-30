export type ThemeId = "light" | "dark" | "gray" | "gradient";

export interface SocialItem {
  id: string;
  platform: string; // key from lib/platforms.ts
  value: string; // username or full URL
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string; // data URL or remote URL
  enabled: boolean;
  clicks: number;
}

export interface Profile {
  id: string;
  ownerId: string; // AUTH PLACEHOLDER: becomes the real user id later
  handle: string;
  displayName: string;
  bio: string;
  avatar: string; // data URL or remote URL, "" = none
  theme: ThemeId;
  socials: SocialItem[];
  links: LinkItem[];
  updatedAt: number;
  handleChangedAt?: number;
}
