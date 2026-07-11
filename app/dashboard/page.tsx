import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <DashboardClient user={user} />;
}
