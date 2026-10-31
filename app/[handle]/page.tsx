import type { Metadata } from "next";
import PublicProfile from "@/components/PublicProfile";
import { APP_NAME } from "@/lib/config";
import { getProfileServer } from "@/lib/server-data";

export const dynamic = "force-dynamic"; // clicks aur edits hamesha fresh dikhein

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const handle = decodeURIComponent((await params).handle).toLowerCase();
  const profile = await getProfileServer(handle); // null until a real DB exists

  const title = profile ? `${profile.displayName || profile.handle} (@${profile.handle})` : `@${handle}`;
  const description = profile?.bio || `Check out @${handle} on ${APP_NAME}`;
  const images =
    profile?.avatar && !profile.avatar.startsWith("data:") ? [profile.avatar] : undefined;

  return {
    title,
    description,
    openGraph: { title, description, type: "profile", images },
    twitter: { card: "summary", title, description, images },
  };
}

export default async function Page({ params }: Props) {
  const handle = decodeURIComponent((await params).handle).toLowerCase();
  const profile = await getProfileServer(handle);
  return <PublicProfile handle={handle} initial={profile} />;
}
