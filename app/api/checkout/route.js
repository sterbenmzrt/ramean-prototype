import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADMIN_FEE } from "@/lib/constants";

const checkoutSchema = z.object({
  groupId: z.string().min(1, "Grup tidak ditentukan."),
  // Hanya metode yang dikenal UI. Selain "saldo" bersifat simulasi (mock payment).
  method: z.enum(["saldo", "qris", "bca", "gopay"]).default("saldo"),
});

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Kamu harus masuk dulu." }, { status: 401 });
  }
  const userId = session.user.id;

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || "Input tidak valid.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  const { groupId, method } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const group = await tx.group.findUnique({ where: { id: groupId } });
      if (!group) {
        return { error: "Grup tidak ditemukan.", status: 404 };
      }

      // Edge case: grup penuh.
      if (group.status !== "AVAILABLE" || group.filledSlots >= group.totalSlots) {
        return { error: "Grup ini sudah penuh. Silakan pilih grup lain.", status: 409 };
      }

      // Edge case: sudah jadi anggota.
      const existing = await tx.groupMember.findUnique({
        where: { groupId_userId: { groupId, userId } },
      });
      if (existing) {
        return { error: "Kamu sudah tergabung di grup ini.", status: 409 };
      }

      const total = group.pricePerSlot + ADMIN_FEE;

      // Edge case: bayar pakai Saldo Ramean tapi saldo kurang.
      if (method === "saldo") {
        const wallet = await tx.wallet.findUnique({ where: { userId } });
        const balance = wallet?.balance ?? 0;
        if (balance < total) {
          return {
            error: `Saldo Ramean kamu tidak cukup. Butuh ${total}, saldo ${balance}.`,
            status: 402,
            code: "INSUFFICIENT_BALANCE",
          };
        }
        await tx.wallet.update({
          where: { userId },
          data: { balance: { decrement: total } },
        });
      }

      const nextBilling = new Date();
      nextBilling.setMonth(nextBilling.getMonth() + 1);

      const subscription = await tx.subscription.create({
        data: {
          userId,
          groupId,
          status: "ACTIVE",
          autoRenewal: true,
          nextBillingDate: nextBilling,
        },
      });

      await tx.groupMember.create({
        data: { groupId, userId, paymentStatus: "PENDING", role: "MEMBER" },
      });

      await tx.transaction.create({
        data: {
          userId,
          subscriptionId: subscription.id,
          amount: total,
          type: "PAYMENT",
          status: "HELD", // escrow: dana ditahan sampai admin rilis
        },
      });

      const filled = group.filledSlots + 1;
      await tx.group.update({
        where: { id: groupId },
        data: {
          filledSlots: filled,
          status: filled >= group.totalSlots ? "FULL" : "AVAILABLE",
        },
      });

      return { ok: true, groupId, subscriptionId: subscription.id };
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error, code: result.code },
        { status: result.status }
      );
    }
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error("checkout error", e);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
