import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const createSchema = z.object({
  serviceId: z.string().min(1),
  totalSlots: z.number().int().positive(),
  pricePerSlot: z.number().int().positive(),
  renewalDate: z.string().min(1),
  hostName: z.string().min(1),
  rules: z.string().optional().default(""),
});

const patchSchema = z.object({
  id: z.string().min(1),
  totalSlots: z.number().int().positive(),
  pricePerSlot: z.number().int().positive(),
  status: z.enum(["AVAILABLE", "FULL", "INACTIVE"]),
  renewalDate: z.string().min(1),
  rules: z.string().optional().default(""),
});

const deleteSchema = z.object({ id: z.string().min(1) });

export async function POST(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  const p = createSchema.safeParse(await request.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });
  const d = p.data;
  const group = await prisma.group.create({
    data: {
      serviceId: d.serviceId,
      hostName: d.hostName,
      totalSlots: d.totalSlots,
      filledSlots: 0,
      pricePerSlot: d.pricePerSlot,
      renewalDate: new Date(d.renewalDate),
      status: "AVAILABLE",
      rules: d.rules || null,
    },
  });
  return NextResponse.json({ ok: true, id: group.id });
}

export async function PATCH(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  const p = patchSchema.safeParse(await request.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });
  const d = p.data;
  const group = await prisma.group.findUnique({ where: { id: d.id } });
  if (!group) return NextResponse.json({ error: "Grup tidak ditemukan." }, { status: 404 });
  if (d.totalSlots < group.filledSlots) {
    return NextResponse.json(
      { error: `totalSlots tidak boleh < slot terisi (${group.filledSlots}).` },
      { status: 400 }
    );
  }
  await prisma.group.update({
    where: { id: d.id },
    data: {
      totalSlots: d.totalSlots,
      pricePerSlot: d.pricePerSlot,
      status: d.status,
      renewalDate: new Date(d.renewalDate),
      rules: d.rules || null,
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  const p = deleteSchema.safeParse(await request.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });

  const group = await prisma.group.findUnique({
    where: { id: p.data.id },
    include: { _count: { select: { members: true, subscriptions: true } } },
  });
  if (!group) return NextResponse.json({ error: "Grup tidak ditemukan." }, { status: 404 });

  // Lindungi audit trail: hanya grup tanpa jejak (anggota & subscription) boleh dihapus.
  if (group._count.members > 0 || group._count.subscriptions > 0) {
    return NextResponse.json(
      { error: "Grup punya anggota/riwayat. Keluarkan anggota dulu atau set INACTIVE." },
      { status: 400 }
    );
  }

  // Hapus kredensial (FK) lalu grup, atomik.
  await prisma.$transaction([
    prisma.groupCredential.deleteMany({ where: { groupId: p.data.id } }),
    prisma.group.delete({ where: { id: p.data.id } }),
  ]);
  return NextResponse.json({ ok: true });
}
