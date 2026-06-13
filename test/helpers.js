import { prisma } from "@/lib/prisma";

let seq = 0;

export async function makeUser({ balance = 0, role = "USER" } = {}) {
  seq += 1;
  return prisma.user.create({
    data: {
      name: `User ${seq}`,
      email: `u${seq}-${Date.now()}@test.id`,
      passwordHash: "x",
      role,
      wallet: { create: { balance } },
    },
  });
}

export async function makeService() {
  return prisma.service.create({
    data: {
      name: "Netflix",
      category: "STREAMING",
      logoUrl: "",
      originalPrice: 186000,
      description: "Layanan uji",
    },
  });
}

export async function makeGroup({
  serviceId,
  totalSlots = 4,
  filledSlots = 0,
  pricePerSlot = 25000,
  status = "AVAILABLE",
}) {
  return prisma.group.create({
    data: {
      serviceId,
      hostName: "Host Demo",
      totalSlots,
      filledSlots,
      pricePerSlot,
      renewalDate: new Date("2026-12-01"),
      status,
    },
  });
}

export async function addMember(groupId, userId, paymentStatus = "PENDING") {
  return prisma.groupMember.create({
    data: { groupId, userId, paymentStatus, role: "MEMBER" },
  });
}

// Buat PAYMENT escrow HELD lengkap (subscription + member) untuk skenario refund/release.
export async function seedHeldPayment({ balance = 0, amount = 28000 } = {}) {
  const svc = await makeService();
  const group = await makeGroup({ serviceId: svc.id, filledSlots: 1 });
  const user = await makeUser({ balance });
  await addMember(group.id, user.id, "PENDING");
  const sub = await prisma.subscription.create({
    data: { userId: user.id, groupId: group.id, status: "ACTIVE", nextBillingDate: new Date() },
  });
  const txn = await prisma.transaction.create({
    data: { userId: user.id, subscriptionId: sub.id, amount, type: "PAYMENT", status: "HELD" },
  });
  return { svc, group, user, sub, txn };
}
