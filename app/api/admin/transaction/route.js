import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const schema = z.object({ id: z.string().min(1), action: z.enum(["release", "refund"]) });

export async function POST(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  const p = schema.safeParse(await request.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });
  const { id, action } = p.data;

  try {
    await prisma.$transaction(async (tx) => {
      const t = await tx.transaction.findUnique({ where: { id }, include: { subscription: true } });
      if (!t || t.type !== "PAYMENT") throw new Error("Transaksi tidak valid.");

      if (action === "release") {
        if (t.status !== "HELD") throw new Error("Hanya transaksi HELD yang bisa dirilis.");
        await tx.transaction.update({ where: { id }, data: { status: "SUCCESS" } });
        if (t.subscription) {
          await tx.groupMember.updateMany({
            where: { groupId: t.subscription.groupId, userId: t.subscription.userId },
            data: { paymentStatus: "PAID" },
          });
        }
      } else {
        if (!["HELD", "SUCCESS"].includes(t.status)) throw new Error("Transaksi ini tidak bisa direfund.");
        // Idempotensi: tandai PAYMENT sumber agar tidak bisa direfund dua kali
        // (mencegah saldo digelembungkan oleh refund berulang).
        await tx.transaction.update({ where: { id }, data: { status: "REFUNDED" } });
        await tx.transaction.create({
          data: { userId: t.userId, subscriptionId: t.subscriptionId, amount: t.amount, type: "REFUND", status: "SUCCESS" },
        });
        await tx.wallet.updateMany({ where: { userId: t.userId }, data: { balance: { increment: t.amount } } });
        if (t.subscription) {
          const sub = t.subscription;
          await tx.groupMember.deleteMany({ where: { groupId: sub.groupId, userId: sub.userId } });
          await tx.subscription.update({ where: { id: sub.id }, data: { status: "EXPIRED" } });
          const g = await tx.group.findUnique({ where: { id: sub.groupId } });
          if (g) {
            await tx.group.update({
              where: { id: sub.groupId },
              data: {
                filledSlots: Math.max(0, g.filledSlots - 1),
                status: g.status === "FULL" ? "AVAILABLE" : g.status,
              },
            });
          }
        }
      }
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Gagal memproses." }, { status: 400 });
  }
}
