import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const schema = z.object({ groupId: z.string().min(1), userId: z.string().min(1) });

// Keluarkan anggota TANPA refund. Ditolak bila anggota punya escrow aktif
// (HELD/SUCCESS) — kasus itu harus lewat Refund agar dana tidak nyangkut.
export async function POST(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  const p = schema.safeParse(await request.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });
  const { groupId, userId } = p.data;

  try {
    await prisma.$transaction(async (tx) => {
      const member = await tx.groupMember.findUnique({
        where: { groupId_userId: { groupId, userId } },
      });
      if (!member) throw new Error("Anggota tidak ditemukan di grup ini.");

      const activePayment = await tx.transaction.findFirst({
        where: {
          userId,
          type: "PAYMENT",
          status: { in: ["HELD", "SUCCESS"] },
          subscription: { groupId },
        },
      });
      if (activePayment) {
        throw new Error("Anggota punya escrow aktif. Gunakan Refund untuk mengeluarkannya.");
      }

      await tx.groupMember.delete({ where: { groupId_userId: { groupId, userId } } });
      await tx.subscription.updateMany({
        where: { groupId, userId, status: { not: "EXPIRED" } },
        data: { status: "EXPIRED" },
      });

      const g = await tx.group.findUnique({ where: { id: groupId } });
      if (g) {
        await tx.group.update({
          where: { id: groupId },
          data: {
            filledSlots: Math.max(0, g.filledSlots - 1),
            status: g.status === "FULL" ? "AVAILABLE" : g.status,
          },
        });
      }
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Gagal mengeluarkan anggota." }, { status: 400 });
  }
}
