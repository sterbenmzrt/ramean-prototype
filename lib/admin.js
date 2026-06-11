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

export async function getAdminTransactions(status) {
  const where = status && status !== "ALL" ? { status } : {};
  return prisma.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      subscription: { include: { group: { include: { service: true } } } },
    },
  });
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
