import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a free Techseum account to save your progress, XP and bookmarks.",
};

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/profile/you");
  return <RegisterForm />;
}
