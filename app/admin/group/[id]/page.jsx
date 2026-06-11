import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GroupForm from "@/components/admin/GroupForm";

export const dynamic = "force-dynamic";

export default async function EditGroupPage({ params }) {
  const group = await prisma.group.findUnique({
    where: { id: params.id },
    include: { service: true },
  });
  if (!group) notFound();
  const initial = {
    id: group.id,
    serviceId: group.serviceId,
    totalSlots: group.totalSlots,
    pricePerSlot: group.pricePerSlot,
    status: group.status,
    renewalDate: group.renewalDate,
    hostName: group.hostName,
    rules: group.rules || "",
  };
  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-1">Edit Grup</h1>
      <p className="text-[13px] text-text-md font-body mb-6">
        {group.service.name} — Grup {group.id.slice(-4).toUpperCase()} · {group.filledSlots} slot terisi
      </p>
      <GroupForm mode="edit" initial={initial} />
    </div>
  );
}
