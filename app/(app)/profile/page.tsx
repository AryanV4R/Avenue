"use client";

import ProfileForm from "@/components/dashboard/ProfileForm";
import { Card } from "@/components/dashboard/ui";
import { useProfile } from "@/lib/profile-context";

export default function ProfilePage() {
  const { profile, update } = useProfile();
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <Card>
        <ProfileForm profile={profile} onChange={update} />
      </Card>
    </div>
  );
}