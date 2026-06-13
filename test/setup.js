import { beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";

// Isolasi antar test: kosongkan semua tabel dalam urutan aman-FK sebelum tiap test.
beforeEach(async () => {
  await prisma.transaction.deleteMany();
  await prisma.groupCredential.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.group.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
});
