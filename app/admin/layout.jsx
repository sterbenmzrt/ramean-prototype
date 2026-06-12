import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Ramean.id" };

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-[100dvh] flex bg-bg max-md:flex-col">
      <aside className="w-[230px] bg-primary p-4 flex flex-col shrink-0 max-md:w-full">
        <AdminSidebar />
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 shrink-0 border-b border-border bg-white flex items-center justify-between px-8 max-md:px-5">
          <span className="font-heading font-bold text-sm text-text">Panel Admin</span>
          <span className="text-xs text-text-md font-body truncate max-w-[55%]">
            {session.user.email}
          </span>
        </header>
        <main className="flex-1 min-w-0 p-8 max-md:p-5">{children}</main>
      </div>
    </div>
  );
}
