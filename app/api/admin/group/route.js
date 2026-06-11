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
