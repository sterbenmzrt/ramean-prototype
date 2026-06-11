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
      <main className="flex-1 min-w-0 p-8 max-md:p-5">{children}</main>
    </div>
  );
}
