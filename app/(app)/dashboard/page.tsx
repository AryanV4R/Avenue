"use client";

import ChooseHandle from "@/components/dashboard/ChooseHandle";
import LinksAndSocials from "@/components/dashboard/LinksAndSocials";
import ThemePicker from "@/components/dashboard/ThemePicker";
import { Card } from "@/components/dashboard/ui";
import { useProfile } from "@/lib/profile-context";

export default function DashboardPage() {
  const { profile, update } = useProfile();
  if (!profile) return null;

  if (!profile.handle) {
    return <ChooseHandle profileId={profile.id} onSave={(h) => update({ handle: h })} />;
  }

  return (
    <div className="space-y-6">
      <section>
        <LinksAndSocials userId={profile.ownerId} links={profile.links} socials={profile.socials} onChange={update} />
      </section>

      <section className="space-y-3 min-[1200px]:hidden">
        <h2 className="font-display text-lg font-semibold tracking-tight">Appearance</h2>
        <Card>
          <ThemePicker value={profile.theme} onChange={(theme) => update({ theme })} />
        </Card>
      </section>
    </div>
  );
}
