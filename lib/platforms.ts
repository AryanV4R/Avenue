import type { IconType } from "react-icons";
import {
  SiInstagram, SiYoutube, SiDiscord, SiX, SiTelegram, SiSnapchat,
  SiTiktok, SiSpotify, SiGithub, SiTwitch, SiReddit, SiFacebook,
  SiWhatsapp, SiSoundcloud, SiPaypal, SiSteam, SiPlaystation,
  SiPinterest, SiThreads, SiBluesky, SiTumblr, SiMedium, SiSubstack,
  SiBehance, SiDribbble, SiPatreon, SiKofi, SiBuymeacoffee, SiKick,
  SiVimeo, SiQuora, SiGitlab, SiStackoverflow,
  SiApplemusic, SiYoutubemusic, SiBandcamp, SiMastodon, SiNotion, SiFigma,
  SiCalendly, SiFiverr, SiUpwork, SiEpicgames, SiRoblox, SiItchdotio,
  SiSignal, SiRumble, SiGumroad, SiLine, SiDailymotion, SiDeezer,
  SiProducthunt,
} from "react-icons/si";
import { FaLinkedin, FaXbox, FaGamepad, FaFire, FaCrosshairs, FaParachuteBox, FaBolt, FaCodepen, FaWeixin } from "react-icons/fa";
import { FiGlobe, FiMail, FiMusic, FiVideo, FiShare2, FiPlay, FiPhone } from "react-icons/fi";
import { normalizeUrl } from "./utils";

export interface Platform {
  id: string;
  label: string;
  icon: IconType;
  placeholder: string;
  build: (value: string) => string;
}

const isUrl = (v: string) => /^https?:\/\//i.test(v.trim());
const clean = (v: string) => v.trim().replace(/^@/, "");
const byHandle = (base: string) => (v: string) =>
  isUrl(v) ? v.trim() : base + clean(v);

const P = "username or full URL";
const sub = (suffix: string) => (v: string) =>
  isUrl(v) ? v.trim() : `https://${clean(v)}.${suffix}`;
const urlOnly = (v: string) => normalizeUrl(v);
const GAME = "profile / team link";

export const PLATFORMS: Platform[] = [
  { id: "instagram", label: "Instagram", icon: SiInstagram, placeholder: P, build: byHandle("https://instagram.com/") },
  { id: "youtube", label: "YouTube", icon: SiYoutube, placeholder: "@channel or full URL", build: byHandle("https://youtube.com/@") },
  { id: "discord", label: "Discord", icon: SiDiscord, placeholder: "invite code or full URL", build: byHandle("https://discord.gg/") },
  { id: "x", label: "X", icon: SiX, placeholder: P, build: byHandle("https://x.com/") },
  { id: "telegram", label: "Telegram", icon: SiTelegram, placeholder: P, build: byHandle("https://t.me/") },
  { id: "snapchat", label: "Snapchat", icon: SiSnapchat, placeholder: P, build: byHandle("https://snapchat.com/add/") },
  { id: "tiktok", label: "TikTok", icon: SiTiktok, placeholder: P, build: byHandle("https://tiktok.com/@") },
  { id: "spotify", label: "Spotify", icon: SiSpotify, placeholder: "user id or full URL", build: byHandle("https://open.spotify.com/user/") },
  { id: "github", label: "GitHub", icon: SiGithub, placeholder: P, build: byHandle("https://github.com/") },
  { id: "twitch", label: "Twitch", icon: SiTwitch, placeholder: P, build: byHandle("https://twitch.tv/") },
  { id: "reddit", label: "Reddit", icon: SiReddit, placeholder: P, build: byHandle("https://reddit.com/user/") },
  { id: "facebook", label: "Facebook", icon: SiFacebook, placeholder: P, build: byHandle("https://facebook.com/") },
  {
    id: "whatsapp", label: "WhatsApp", icon: SiWhatsapp,
    placeholder: "phone with country code, or URL",
    build: (v) => (isUrl(v) ? v.trim() : "https://wa.me/" + v.replace(/\D/g, "")),
  },
  { id: "linkedin", label: "LinkedIn", icon: FaLinkedin, placeholder: P, build: byHandle("https://linkedin.com/in/") },
  { id: "soundcloud", label: "SoundCloud", icon: SiSoundcloud, placeholder: P, build: byHandle("https://soundcloud.com/") },
  { id: "paypal", label: "PayPal", icon: SiPaypal, placeholder: "paypal.me name or URL", build: byHandle("https://paypal.me/") },
  { id: "steam", label: "Steam", icon: SiSteam, placeholder: "custom id or full URL", build: byHandle("https://steamcommunity.com/id/") },
  { id: "xbox", label: "Xbox", icon: FaXbox, placeholder: "gamertag or full URL", build: byHandle("https://xbox.com/play/user/") },
  { id: "playstation", label: "PlayStation", icon: SiPlaystation, placeholder: "PSN id or full URL", build: byHandle("https://psnprofiles.com/") },
  { id: "pinterest", label: "Pinterest", icon: SiPinterest, placeholder: P, build: byHandle("https://pinterest.com/") },
  { id: "threads", label: "Threads", icon: SiThreads, placeholder: P, build: byHandle("https://threads.net/@") },
  { id: "bluesky", label: "Bluesky", icon: SiBluesky, placeholder: "name.bsky.social or full URL", build: byHandle("https://bsky.app/profile/") },
  {
    id: "tumblr", label: "Tumblr", icon: SiTumblr, placeholder: "blog name or full URL",
    build: (v) => (isUrl(v) ? v.trim() : `https://${clean(v)}.tumblr.com`),
  },
  { id: "medium", label: "Medium", icon: SiMedium, placeholder: P, build: byHandle("https://medium.com/@") },
  {
    id: "substack", label: "Substack", icon: SiSubstack, placeholder: "publication name or full URL",
    build: (v) => (isUrl(v) ? v.trim() : `https://${clean(v)}.substack.com`),
  },
  { id: "behance", label: "Behance", icon: SiBehance, placeholder: P, build: byHandle("https://behance.net/") },
  { id: "dribbble", label: "Dribbble", icon: SiDribbble, placeholder: P, build: byHandle("https://dribbble.com/") },
  { id: "patreon", label: "Patreon", icon: SiPatreon, placeholder: P, build: byHandle("https://patreon.com/") },
  { id: "kofi", label: "Ko-fi", icon: SiKofi, placeholder: P, build: byHandle("https://ko-fi.com/") },
  { id: "buymeacoffee", label: "Buy Me a Coffee", icon: SiBuymeacoffee, placeholder: P, build: byHandle("https://buymeacoffee.com/") },
  { id: "kick", label: "Kick", icon: SiKick, placeholder: P, build: byHandle("https://kick.com/") },
  { id: "vimeo", label: "Vimeo", icon: SiVimeo, placeholder: P, build: byHandle("https://vimeo.com/") },
  { id: "quora", label: "Quora", icon: SiQuora, placeholder: P, build: byHandle("https://quora.com/profile/") },
  { id: "gitlab", label: "GitLab", icon: SiGitlab, placeholder: P, build: byHandle("https://gitlab.com/") },
  { id: "stackoverflow", label: "Stack Overflow", icon: SiStackoverflow, placeholder: "profile URL", build: byHandle("https://stackoverflow.com/users/") },
  // Mobile gaming
  { id: "bgmi", label: "BGMI", icon: FaParachuteBox, placeholder: GAME, build: urlOnly },
  { id: "freefire", label: "Free Fire", icon: FaFire, placeholder: GAME, build: urlOnly },
  { id: "codm", label: "CODM", icon: FaCrosshairs, placeholder: GAME, build: urlOnly },
  { id: "deltaforce", label: "Delta Force", icon: FaBolt, placeholder: GAME, build: urlOnly },
  { id: "pubg", label: "PUBG", icon: FaGamepad, placeholder: GAME, build: urlOnly },
  { id: "roblox", label: "Roblox", icon: SiRoblox, placeholder: "user id or full URL", build: (v) => (isUrl(v) ? v.trim() : `https://roblox.com/users/${v.replace(/\D/g, "")}/profile`) },
  { id: "epicgames", label: "Epic Games", icon: SiEpicgames, placeholder: "full profile URL", build: urlOnly },
  { id: "itch", label: "Itch.io", icon: SiItchdotio, placeholder: "name or full URL", build: sub("itch.io") },
  { id: "loco", label: "Loco", icon: FiVideo, placeholder: P, build: byHandle("https://loco.gg/streamers/") },
  { id: "trovo", label: "Trovo", icon: FiVideo, placeholder: P, build: byHandle("https://trovo.live/s/") },
  { id: "rumble", label: "Rumble", icon: SiRumble, placeholder: P, build: byHandle("https://rumble.com/user/") },
  { id: "dailymotion", label: "Dailymotion", icon: SiDailymotion, placeholder: P, build: byHandle("https://dailymotion.com/") },
  // Music
  { id: "applemusic", label: "Apple Music", icon: SiApplemusic, placeholder: "profile URL", build: urlOnly },
  { id: "ytmusic", label: "YouTube Music", icon: SiYoutubemusic, placeholder: "channel id or full URL", build: byHandle("https://music.youtube.com/channel/") },
  { id: "bandcamp", label: "Bandcamp", icon: SiBandcamp, placeholder: "name or full URL", build: sub("bandcamp.com") },
  { id: "deezer", label: "Deezer", icon: SiDeezer, placeholder: "profile URL", build: urlOnly },
  { id: "jiosaavn", label: "JioSaavn", icon: FiMusic, placeholder: "profile URL", build: urlOnly },
  // Social / chat
  { id: "mastodon", label: "Mastodon", icon: SiMastodon, placeholder: "full profile URL", build: urlOnly },
  { id: "signal", label: "Signal", icon: SiSignal, placeholder: "signal.me link", build: urlOnly },
  { id: "line", label: "LINE", icon: SiLine, placeholder: "LINE id or full URL", build: byHandle("https://line.me/ti/p/~") },
  { id: "sharechat", label: "ShareChat", icon: FiShare2, placeholder: P, build: byHandle("https://sharechat.com/profile/") },
  { id: "moj", label: "Moj", icon: FiPlay, placeholder: P, build: byHandle("https://mojapp.in/@") },
  { id: "wechat", label: "WeChat", icon: FaWeixin, placeholder: "WeChat link / QR URL", build: urlOnly },
  // Work / creator
  { id: "notion", label: "Notion", icon: SiNotion, placeholder: "page URL", build: urlOnly },
  { id: "figma", label: "Figma", icon: SiFigma, placeholder: P, build: byHandle("https://figma.com/@") },
  { id: "calendly", label: "Calendly", icon: SiCalendly, placeholder: P, build: byHandle("https://calendly.com/") },
  { id: "fiverr", label: "Fiverr", icon: SiFiverr, placeholder: P, build: byHandle("https://fiverr.com/") },
  { id: "upwork", label: "Upwork", icon: SiUpwork, placeholder: "profile URL", build: urlOnly },
  { id: "gumroad", label: "Gumroad", icon: SiGumroad, placeholder: "name or full URL", build: sub("gumroad.com") },
  { id: "codepen", label: "CodePen", icon: FaCodepen, placeholder: P, build: byHandle("https://codepen.io/") },
  { id: "producthunt", label: "Product Hunt", icon: SiProducthunt, placeholder: P, build: byHandle("https://producthunt.com/@") },
  {
    id: "phone", label: "Phone", icon: FiPhone,
    placeholder: "+91 98765 43210",
    build: (v) => (v.trim().startsWith("tel:") ? v.trim() : "tel:" + v.replace(/[^\d+]/g, "")),
  },
  {
    id: "email", label: "Email", icon: FiMail, placeholder: "you@example.com",
    build: (v) => (v.trim().startsWith("mailto:") ? v.trim() : "mailto:" + v.trim()),
  },
  { id: "website", label: "Website", icon: FiGlobe, placeholder: "example.com", build: normalizeUrl },
];

export const PLATFORM_MAP: Record<string, Platform> = Object.fromEntries(
  PLATFORMS.map((p) => [p.id, p])
);

/** Input ke saamne fixed dikhne wala prefix (sirf handle wale platforms ke liye). */
export const PREFIXES: Record<string, string> = {
  instagram: "instagram.com/",
  youtube: "youtube.com/@",
  discord: "discord.gg/",
  x: "x.com/",
  telegram: "t.me/",
  snapchat: "snapchat.com/add/",
  tiktok: "tiktok.com/@",
  spotify: "open.spotify.com/user/",
  github: "github.com/",
  twitch: "twitch.tv/",
  reddit: "reddit.com/user/",
  facebook: "facebook.com/",
  linkedin: "linkedin.com/in/",
  soundcloud: "soundcloud.com/",
  paypal: "paypal.me/",
  steam: "steamcommunity.com/id/",
  xbox: "xbox.com/play/user/",
  playstation: "psnprofiles.com/",
  pinterest: "pinterest.com/",
  threads: "threads.net/@",
  bluesky: "bsky.app/profile/",
  medium: "medium.com/@",
  behance: "behance.net/",
  dribbble: "dribbble.com/",
  patreon: "patreon.com/",
  kofi: "ko-fi.com/",
  buymeacoffee: "buymeacoffee.com/",
  kick: "kick.com/",
  vimeo: "vimeo.com/",
  quora: "quora.com/profile/",
  gitlab: "gitlab.com/",
  loco: "loco.gg/streamers/",
  trovo: "trovo.live/s/",
  rumble: "rumble.com/user/",
  dailymotion: "dailymotion.com/",
  ytmusic: "music.youtube.com/channel/",
  sharechat: "sharechat.com/profile/",
  moj: "mojapp.in/@",
  figma: "figma.com/@",
  calendly: "calendly.com/",
  fiverr: "fiverr.com/",
  codepen: "codepen.io/",
  producthunt: "producthunt.com/@",
};

/** Pasted URL ya @name se sirf handle nikalta hai. Pehchaan na ho to value waisi hi rehti hai. */
export function extractHandle(id: string, raw: string): string {
  const prefix = PREFIXES[id];
  const v = raw.trim();
  if (!prefix) return v;
  const stripped = v.replace(/^https?:\/\/(www\.)?/i, "");
  if (stripped.toLowerCase().startsWith(prefix.toLowerCase())) {
    return stripped.slice(prefix.length).split(/[/?#]/)[0].replace(/^@/, "");
  }
  if (isUrl(v)) return v;
  return v.replace(/^@/, "");
}