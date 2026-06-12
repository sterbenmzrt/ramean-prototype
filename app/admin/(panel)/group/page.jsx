import Link from "next/link";
import { getAdminGroups } from "@/lib/admin";
import SvcIcon from "@/components/ui/SvcIcon";
import Tag from "@/components/ui/Tag";
import Btn from "@/components/ui/Btn";
import { fmt } from "@/lib/tokens";
import DataTable, { Td } from "@/components/admin/DataTable";

export const dynamic = "force-dynamic";

const STATUS_VARIANT = { AVAILABLE: "green", FULL: "primary", INACTIVE: "warn" };

const COLUMNS = [
  { key: "grup", label: "Grup" },
  { key: "price", label: "Harga/slot" },
  { key: "slot", label: "Slot" },
  { key: "renewal", label: "Renewal" },
  { key: "status", label: "Status" },
  { key: "action", label: "", align: "right" },
];

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminGroupPage() {
  const groups = await getAdminGroups();
  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-heading font-bold text-2xl text-text">Kelola Group</h1>
        <Link href="/admin/group/baru">
          <Btn variant="primary" size="md">+ Buat Grup</Btn>
        </Link>
      </div>

      <DataTable
        columns={COLUMNS}
        rows={groups}
        empty="Belum ada grup."
        renderRow={(g) => (
          <tr key={g.id}>
            <Td>
              <div className="flex items-center gap-3">
                <SvcIcon name={g.service.name} logoUrl={g.service.logoUrl} size={32} />
                <span className="font-semibold whitespace-nowrap">
                  {g.service.name} — Grup {g.id.slice(-4).toUpperCase()}
                </span>
              </div>
            </Td>
            <Td className="whitespace-nowrap text-text-md text-[13px]">{fmt(g.pricePerSlot)}/slot</Td>
            <Td className="whitespace-nowrap text-text-md text-[13px]">{g.filledSlots}/{g.totalSlots}</Td>
            <Td className="whitespace-nowrap text-text-md text-[13px]">{formatDate(g.renewalDate)}</Td>
            <Td>
              <Tag variant={STATUS_VARIANT[g.status] || "primary"}>{g.status}</Tag>
            </Td>
            <Td align="right">
              <Link href={`/admin/group/${g.id}`}>
                <Btn variant="outline" size="sm">Kelola</Btn>
              </Link>
            </Td>
          </tr>
        )}
      />
    </div>
  );
}
