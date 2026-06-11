import { getAdminUsers } from "@/lib/admin";
import Tag from "@/components/ui/Tag";

export const dynamic = "force-dynamic";

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminUserPage() {
  const users = await getAdminUsers();
  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-6">User</h1>
      <div className="bg-white border border-border rounded-xl divide-y divide-border-lt">
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-4 px-5 py-3.5">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-text font-body flex items-center gap-2">
                {u.name}
                {u.role === "ADMIN" && <Tag variant="primary">ADMIN</Tag>}
              </div>
              <div className="text-xs text-text-md font-body mt-0.5">{u.email}</div>
            </div>
            <div className="text-[13px] text-text-sm font-body">{u._count.subscriptions} langganan</div>
            <div className="text-[13px] text-text-sm font-body w-28 text-right">{formatDate(u.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
