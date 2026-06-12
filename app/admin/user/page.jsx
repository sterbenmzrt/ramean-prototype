import { getAdminUsers } from "@/lib/admin";
import Tag from "@/components/ui/Tag";
import DataTable, { Td } from "@/components/admin/DataTable";

export const dynamic = "force-dynamic";

const COLUMNS = [
  { key: "name", label: "Nama" },
  { key: "email", label: "Email" },
  { key: "subs", label: "Langganan", align: "right" },
  { key: "joined", label: "Bergabung", align: "right" },
];

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminUserPage() {
  const users = await getAdminUsers();
  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-6">User</h1>
      <DataTable
        columns={COLUMNS}
        rows={users}
        empty="Belum ada user."
        renderRow={(u) => (
          <tr key={u.id}>
            <Td>
              <span className="font-semibold inline-flex items-center gap-2">
                {u.name}
                {u.role === "ADMIN" && <Tag variant="primary">ADMIN</Tag>}
              </span>
            </Td>
            <Td className="text-text-md text-[13px]">{u.email}</Td>
            <Td align="right" className="text-text-md text-[13px] whitespace-nowrap">{u._count.subscriptions} langganan</Td>
            <Td align="right" className="text-text-md text-[13px] whitespace-nowrap">{formatDate(u.createdAt)}</Td>
          </tr>
        )}
      />
    </div>
  );
}
