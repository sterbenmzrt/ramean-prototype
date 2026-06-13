import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock session login. authOptions di-stub agar tak menarik rantai provider next-auth.
vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));

import { getServerSession } from "next-auth";
import { POST } from "@/app/api/checkout/route.js";
import { prisma } from "@/lib/prisma";
import { ADMIN_FEE } from "@/lib/constants";
import { makeUser, makeService, makeGroup, addMember } from "./helpers.js";

function req(body) {
  return new Request("http://test/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function loginAs(userId) {
  getServerSession.mockResolvedValue({ user: { id: userId } });
}

const PRICE = 25000;

describe("checkout — alur uang & escrow", () => {
  beforeEach(() => getServerSession.mockReset());

  it("saldo cukup → 200, escrow HELD, saldo terpotong, slot bertambah", async () => {
    const svc = await makeService();
    const group = await makeGroup({ serviceId: svc.id, pricePerSlot: PRICE });
    const user = await makeUser({ balance: 100000 });
    loginAs(user.id);

    const res = await POST(req({ groupId: group.id, method: "saldo" }));
    expect(res.status).toBe(200);

    const total = PRICE + ADMIN_FEE;
    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    expect(wallet.balance).toBe(100000 - total);

    const txn = await prisma.transaction.findFirst({ where: { userId: user.id, type: "PAYMENT" } });
    expect(txn.status).toBe("HELD");
    expect(txn.amount).toBe(total);

    const after = await prisma.group.findUnique({ where: { id: group.id } });
    expect(after.filledSlots).toBe(1);
  });

  it("saldo kurang → 402, tidak ada perubahan", async () => {
    const svc = await makeService();
    const group = await makeGroup({ serviceId: svc.id, pricePerSlot: PRICE });
    const user = await makeUser({ balance: 1000 });
    loginAs(user.id);

    const res = await POST(req({ groupId: group.id, method: "saldo" }));
    expect(res.status).toBe(402);

    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    expect(wallet.balance).toBe(1000); // tidak terpotong
    const count = await prisma.transaction.count({ where: { userId: user.id } });
    expect(count).toBe(0);
  });

  it("grup penuh → 409", async () => {
    const svc = await makeService();
    const group = await makeGroup({
      serviceId: svc.id,
      totalSlots: 2,
      filledSlots: 2,
      status: "FULL",
    });
    const user = await makeUser({ balance: 100000 });
    loginAs(user.id);

    const res = await POST(req({ groupId: group.id, method: "saldo" }));
    expect(res.status).toBe(409);
  });

  it("sudah jadi anggota → 409", async () => {
    const svc = await makeService();
    const group = await makeGroup({ serviceId: svc.id, pricePerSlot: PRICE });
    const user = await makeUser({ balance: 100000 });
    await addMember(group.id, user.id, "PENDING");
    loginAs(user.id);

    const res = await POST(req({ groupId: group.id, method: "saldo" }));
    expect(res.status).toBe(409);
  });

  it("metode bayar tak dikenal → 400 (zod)", async () => {
    const svc = await makeService();
    const group = await makeGroup({ serviceId: svc.id, pricePerSlot: PRICE });
    const user = await makeUser({ balance: 100000 });
    loginAs(user.id);

    const res = await POST(req({ groupId: group.id, method: "bitcoin" }));
    expect(res.status).toBe(400);
  });

  it("belum login → 401", async () => {
    getServerSession.mockResolvedValue(null);
    const svc = await makeService();
    const group = await makeGroup({ serviceId: svc.id });
    const res = await POST(req({ groupId: group.id, method: "saldo" }));
    expect(res.status).toBe(401);
  });
});
