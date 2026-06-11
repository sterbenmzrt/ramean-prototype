import Link from "next/link";
import SvcIcon from "@/components/ui/SvcIcon";
import Tag from "@/components/ui/Tag";
import Btn from "@/components/ui/Btn";
import { fmt } from "@/lib/tokens";

function statusInfo(g) {
  if (g.groupStatus === "FULL") return { label: "Penuh", variant: "primary" };
  if (g.groupStatus === "AVAILABLE" && g.filledSlots < g.totalSlots)
    return { label: "Mengumpulkan", variant: "yellow" };
  return { label: "Aktif", variant: "green" };
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MyGroupCard({ g, index = 0 }) {
  const st = statusInfo(g);
  return (
    <div className="stagger-item" style={{ "--i": index }}>
      <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-4 max-md:flex-col max-md:items-start">
        <SvcIcon name={g.serviceName} logoUrl={g.logoUrl} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading font-bold text-sm text-text">
              {g.serviceName} — Grup {g.groupCode}
            </span>
            <Tag variant={st.variant}>{st.label}</Tag>
          </div>
          <div className="text-[13px] text-text-md font-body mt-1">
            {fmt(g.pricePerSlot)}/bln · slot {g.filledSlots}/{g.totalSlots} · tagihan{" "}
            {formatDate(g.nextBillingDate)}
          </div>
        </div>
        <Link href={`/lobby/${g.groupId}`}>
          <Btn variant="primary" size="md">
            Masuk Lobby
          </Btn>
        </Link>
      </div>
    </div>
  );
}
