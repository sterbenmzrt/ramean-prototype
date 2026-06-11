import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGroupForCheckout } from "@/lib/data";
import { ADMIN_FEE } from "@/lib/constants";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }) {
  const { groupId } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/checkout/${groupId}`);
  }

  const group = await getGroupForCheckout(groupId);
  if (!group) notFound();

  const [wallet, membership] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId: session.user.id } }),
    prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: session.user.id } },
    }),
  ]);

  return (
    <CheckoutClient
      group={{
        id: group.id,
        pricePerSlot: group.pricePerSlot,
        totalSlots: group.totalSlots,
        filledSlots: group.filledSlots,
        status: group.status,
        service: {
          id: group.service.id,
          name: group.service.name,
          logoUrl: group.service.logoUrl,
          originalPrice: group.service.originalPrice,
        },
      }}
      adminFee={ADMIN_FEE}
      walletBalance={wallet?.balance ?? 0}
      alreadyMember={Boolean(membership)}
    />
  );
}
