import { auth0 } from "@/lib/auth0";
import { requireHumanAdmin } from "@/lib/admin-access";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login?returnTo=/dashboard");
  }

  try {
    await requireHumanAdmin();
  } catch {
    return <main className="min-h-screen bg-[#08090b] px-6 py-20 text-white"><h1 className="text-2xl font-semibold">Administrator access required</h1><p className="mt-3 text-zinc-400">Sign in with the configured administrator account and verify its email address.</p><a className="mt-6 inline-block text-blue-400" href="/auth/logout">Sign out</a></main>;
  }
  return children;
}