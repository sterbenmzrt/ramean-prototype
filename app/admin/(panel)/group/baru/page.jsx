import { getServicesList } from "@/lib/admin";
import GroupForm from "@/components/admin/GroupForm";

export const dynamic = "force-dynamic";

export default async function BuatGroupPage() {
  const services = await getServicesList();
  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-6">Buat Grup</h1>
      <GroupForm mode="create" services={services} />
    </div>
  );
}
