import { requireUser } from "@/lib/auth";
import { UserSidebar } from "@/components/UserSidebar";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex min-h-screen">
      <UserSidebar user={user} />
      <main className="flex-1 overflow-x-auto">{children}</main>
    </div>
  );
}
