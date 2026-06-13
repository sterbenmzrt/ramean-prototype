import { describe, it, expect, vi } from "vitest";

// Gate admin di-stub: fokus test = logika refund/release, bukan otorisasi.
vi.mock("@/lib/admin", () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: "admin", role: "ADMIN" }),
}));

import { POST } from "@/app/api/admin/transaction/route.js";
import { prisma } from "@/lib/prisma";
import { seedHeldPayment } from "./helpers.js";

function req(body) {
  return new Request("http://test/api/admin/transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("admin/transaction — refund & release", () => {
  it("refund ganda tidak menggelembungkan saldo (idempoten)", async () => {
    const { user, txn } = await seedHeldPayment({ balance: 0, amount: 28000 });

    const r1 = await POST(req({ id: txn.id, action: "refund" }));
    expect(r1.status).toBe(200);

    // Percobaan refund kedua harus ditolak: PAYMENT sumber sudah REFUNDED.
    const r2 = await POST(req({ id: txn.id, action: "refund" }));
    expect(r2.status).toBe(400);

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    expect(wallet.balance).toBe(28000); // hanya satu kali dikembalikan

    const refunds = await prisma.transaction.count({
      where: { userId: user.id, type: "REFUND" },
    });
    expect(refunds).toBe(1);
  });

  it("refund mengeluarkan anggota & mengurangi slot terisi", async () => {
    const { user, group, txn } = await seedHeldPayment({ amount: 28000 });

    await POST(req({ id: txn.id, action: "refund" }));

    const member = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId: group.id, userId: user.id } },
    });
    expect(member).toBeNull();

    const after = await prisma.group.findUnique({ where: { id: group.id } });
    expect(after.filledSlots).toBe(0); // dari 1 → 0
  });

  it("release menandai anggota PAID; hanya HELD yang bisa dirilis", async () => {
    const { user, group, txn } = await seedHeldPayment({ amount: 28000 });

    const r1 = await POST(req({ id: txn.id, action: "release" }));
    expect(r1.status).toBe(200);

    const member = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId: group.id, userId: user.id } },
    });
    expect(member.paymentStatus).toBe("PAID");

    // Sudah SUCCESS → tidak bisa dirilis lagi.
    const r2 = await POST(req({ id: txn.id, action: "release" }));
    expect(r2.status).toBe(400);
  });

  it("action tak dikenal ditolak 400 (zod)", async () => {
    const { txn } = await seedHeldPayment();
    const res = await POST(req({ id: txn.id, action: "hapus-semua" }));
    expect(res.status).toBe(400);
  });
});
