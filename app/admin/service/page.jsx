import { getAdminServices } from "@/lib/admin";
import SvcIcon from "@/components/ui/SvcIcon";
import { fmt } from "@/lib/tokens";
import DataTable, { Td } from "@/components/admin/DataTable";

export const dynamic = "force-dynamic";

const COLUMNS = [
  { key: "name", label: "Service" },
  { key: "category", label: "Kategori" },
  { key: "price", label: "Harga normal", align: "right" },
  { key: "groups", label: "Jumlah grup", align: "right" },
];

export default async function AdminServicePage() {
  const services = await getAdminServices();
  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-6">Service</h1>
      <DataTable
        columns={COLUMNS}
        rows={services}
        empty="Belum ada service."
        renderRow={(s) => (
          <tr key={s.id}>
            <Td>
              <div className="flex items-center gap-3">
                <SvcIcon name={s.name} logoUrl={s.logoUrl} size={32} />
                <span className="font-semibold whitespace-nowrap">{s.name}</span>
              </div>
            </Td>
            <Td className="text-text-md text-[13px]">{s.category}</Td>
            <Td align="right" className="text-text-md text-[13px] whitespace-nowrap">{fmt(s.originalPrice)}</Td>
            <Td align="right" className="text-text-md text-[13px] whitespace-nowrap">{s._count.groups} grup</Td>
          </tr>
        )}
      />
    </div>
  );
}
