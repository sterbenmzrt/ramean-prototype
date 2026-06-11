import Link from "next/link";
import { getAdminGroups } from "@/lib/admin";
import SvcIcon from "@/components/ui/SvcIcon";
import Tag from "@/components/ui/Tag";
import Btn from "@/components/ui/Btn";
import { fmt } from "@/lib/tokens";

export const dynamic = "force-dynamic";

const STATUS_VARIANT = { AVAILABLE: "green", FULL: "primary", INACTIVE: "warn" };

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

      <div className="bg-white border border-border rounded-xl divide-y divide-border-lt">
        {groups.length === 0 ? (
          <div className="p-8 text-center text-text-md font-body text-sm">Belum ada grup.</div>
        ) : (
          groups.map((g) => (
            <div key={g.id} className="flex items-center gap-4 px-5 py-3.5 max-md:flex-wrap">
              <SvcIcon name={g.service.name} logoUrl={g.service.logoUrl} size={36} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-text font-body">
                  {g.service.name} — Grup {g.id.slice(-4).toUpperCase()}
                </div>
                <div className="text-xs text-text-md font-body mt-0.5">
                  {fmt(g.pricePerSlot)}/slot · {g.filledSlots}/{g.totalSlots} · {formatDate(g.renewalDate)}
                </div>
              </div>
              <Tag variant={STATUS_VARIANT[g.status] || "primary"}>{g.status}</Tag>
              <Link href={`/admin/group/${g.id}`}>
                <Btn variant="outline" size="sm">Edit</Btn>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
