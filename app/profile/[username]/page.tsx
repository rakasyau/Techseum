import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata: Metadata = {
  title: "Your profile",
  description:
    "Your Techseum progress, badges, bookmarks, activity and preferences.",
};

// The profile is per-session, so it renders on demand rather than at build.
export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return <ProfileView />;
}
