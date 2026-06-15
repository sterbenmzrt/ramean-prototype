import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { validateImage, saveBannerImage, deleteBannerImage, isUploadEnabled } from "@/lib/upload";

const fieldsSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi.").max(120),
  subtitle: z.string().trim().max(200),
  ctaLabel: z.string().trim().max(40),
  ctaHref: z
    .string()
    .trim()
    .max(300)
    .refine(
      (v) => v === "" || (!v.startsWith("\\") && !v.startsWith("//")),
      "Link tujuan tidak valid."
    ),
  order: z.coerce.number().int().min(0),
  active: z.enum(["true", "false"]).transform((v) => v === "true"),
});

function readFields(form) {
  return fieldsSchema.safeParse({
    title: form.get("title") ?? "",
    subtitle: form.get("subtitle") ?? "",
    ctaLabel: form.get("ctaLabel") ?? "",
    ctaHref: form.get("ctaHref") ?? "",
    order: form.get("order") ?? "0",
    active: form.get("active") ?? "true",
  });
}

// Kosong → null agar tersimpan NULL (bukan string kosong) untuk field opsional.
function orNull(v) {
  return v === "" ? null : v;
}

export async function POST(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });

  const parsed = readFields(form);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Input tidak valid." }, { status: 400 });

  // Upload aktif (lokal): wajib gambar valid. Upload nonaktif (prod): lewati,
  // banner dibuat tanpa gambar → fallback blank di carousel.
  let imagePath = "";
  if (isUploadEnabled()) {
    const file = form.get("image");
    const imgErr = validateImage(file);
    if (imgErr) return NextResponse.json({ error: imgErr }, { status: 400 });
    imagePath = await saveBannerImage(file);
  }
  const d = parsed.data;
  const banner = await prisma.banner.create({
    data: {
      title: d.title,
      subtitle: orNull(d.subtitle),
      ctaLabel: orNull(d.ctaLabel),
      ctaHref: orNull(d.ctaHref),
      order: d.order,
      active: d.active,
      imagePath,
    },
  });
  return NextResponse.json({ ok: true, id: banner.id });
}

export async function PATCH(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });

  const id = form.get("id");
  if (!id) return NextResponse.json({ error: "ID wajib." }, { status: 400 });
  const existing = await prisma.banner.findUnique({ where: { id: String(id) } });
  if (!existing) return NextResponse.json({ error: "Banner tidak ditemukan." }, { status: 404 });

  const parsed = readFields(form);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Input tidak valid." }, { status: 400 });
  const d = parsed.data;

  // Gambar opsional saat edit: kalau upload aktif & ada file baru valid → ganti.
  let imagePath = existing.imagePath;
  if (isUploadEnabled()) {
    const file = form.get("image");
    if (file && typeof file.arrayBuffer === "function") {
      const imgErr = validateImage(file);
      if (imgErr) return NextResponse.json({ error: imgErr }, { status: 400 });
      imagePath = await saveBannerImage(file);
      await deleteBannerImage(existing.imagePath);
    }
  }

  await prisma.banner.update({
    where: { id: String(id) },
    data: {
      title: d.title,
      subtitle: orNull(d.subtitle),
      ctaLabel: orNull(d.ctaLabel),
      ctaHref: orNull(d.ctaHref),
      order: d.order,
      active: d.active,
      imagePath,
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });

  const banner = await prisma.banner.findUnique({ where: { id: body.id } });
  if (!banner) return NextResponse.json({ error: "Banner tidak ditemukan." }, { status: 404 });

  await prisma.banner.delete({ where: { id: body.id } });
  await deleteBannerImage(banner.imagePath);
  return NextResponse.json({ ok: true });
}
