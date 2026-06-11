import { getAdminServices } from "@/lib/admin";
import SvcIcon from "@/components/ui/SvcIcon";
import { fmt } from "@/lib/tokens";

export const dynamic = "force-dynamic";

export default async function AdminServicePage() {
  const services = await getAdminServices();
  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-6">Service</h1>
      <div className="bg-white border border-border rounded-xl divide-y divide-border-lt">
        {services.map((s) => (
          <div key={s.id} className="flex items-center gap-4 px-5 py-3.5">
            <SvcIcon name={s.name} logoUrl={s.logoUrl} size={36} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-text font-body">{s.name}</div>
              <div className="text-xs text-text-md font-body mt-0.5">{s.category}</div>
            </div>
            <div className="text-[13px] text-text-md font-body">{fmt(s.originalPrice)}</div>
            <div className="text-[13px] text-text-sm font-body w-20 text-right">{s._count.groups} grup</div>
          </div>
        ))}
      </div>
    </div>
  );
}
