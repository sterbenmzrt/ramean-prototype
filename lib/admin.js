import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Kembalikan session.user bila admin, else null.
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session.user;
}

export async function getAdminGroups() {
  return prisma.group.findMany({
    include: { service: true },
    orderBy: [{ status: "asc" }, { renewalDate: "asc" }],
  });
}

// Include bersama untuk daftar transaksi (dipakai list, dashboard needs-action & recent).
const TXN_INCLUDE = {
  user: { select: { name: true, email: true } },
  subscription: { include: { group: { include: { service: true } } } },
};

export async function getAdminTransactions(status) {
  const where = status && status !== "ALL" ? { status } : {};
  return prisma.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: TXN_INCLUDE,
  });
}

export async function getRecentTransactions(limit = 8) {
  return prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: TXN_INCLUDE,
  });
}

// Ringkasan KPI untuk dashboard admin.
export async function getAdminStats() {
  const [totalUsers, activeGroups, gmvAgg, escrowAgg] = await Promise.all([
    prisma.user.count(),
    prisma.group.count({ where: { status: { not: "INACTIVE" } } }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "PAYMENT", status: "SUCCESS" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { status: "HELD" },
    }),
  ]);
  return {
    totalUsers,
    activeGroups,
    gmv: gmvAgg._sum.amount ?? 0,
    escrowHeld: escrowAgg._sum.amount ?? 0,
  };
}

// Detail satu grup untuk cockpit operasional: info grup, roster anggota, transaksi
// terkait grup, dan peta transaksi PAYMENT terbaru per user (untuk aksi per-anggota).
export async function getGroupDetail(id) {
  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      service: true,
      members: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { role: "asc" },
      },
      _count: { select: { members: true, subscriptions: true } },
    },
  });
  if (!group) return null;

  const transactions = await prisma.transaction.findMany({
    where: { subscription: { groupId: id } },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  // transactions terurut desc → kemunculan pertama per user = PAYMENT terbaru.
  const paymentByUser = {};
  for (const t of transactions) {
    if (t.type === "PAYMENT" && !paymentByUser[t.userId]) paymentByUser[t.userId] = t;
  }

  // Grup boleh dihapus hanya bila tak punya jejak (anggota & subscription = 0).
  const deletable = group._count.members === 0 && group._count.subscriptions === 0;

  // Status kredensial (tanpa plaintext) untuk panel admin.
  const cred = await prisma.groupCredential.findUnique({
    where: { groupId: id },
    select: { updatedAt: true },
  });
  const credentialMeta = { exists: Boolean(cred), updatedAt: cred?.updatedAt ?? null };

  return { group, transactions, paymentByUser, deletable, credentialMeta };
}

export async function getAdminServices() {
  return prisma.service.findMany({
    include: { _count: { select: { groups: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getAdminUsers() {
  return prisma.user.findMany({
    include: { _count: { select: { subscriptions: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getServicesList() {
  return prisma.service.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
}

export async function getAdminBanners() {
  return prisma.banner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}
