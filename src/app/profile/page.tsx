import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfilePageClient from "./_components/ProfilePageClient";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) redirect("/");

  return <ProfilePageClient />;
}
