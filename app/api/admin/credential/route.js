import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { setGroupCredential } from "@/lib/credential";

const schema = z.object({
  groupId: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  note: z.string().optional().default(""),
});

export async function POST(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  const p = schema.safeParse(await request.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });
  const { groupId, email, password, note } = p.data;

  const group = await prisma.group.findUnique({ where: { id: groupId }, select: { id: true } });
  if (!group) return NextResponse.json({ error: "Grup tidak ditemukan." }, { status: 404 });

  await setGroupCredential(groupId, { email, password, note });
  return NextResponse.json({ ok: true });
}
