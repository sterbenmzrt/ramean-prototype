import { describe, it, expect, vi } from "vitest";

// Mock session (untuk test API). Mengikuti pola test/checkout.test.js.
vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));

import { getServerSession } from "next-auth";
import { validateImage } from "@/lib/upload";
import { getActiveBanners } from "@/lib/data";
import { POST } from "@/app/api/admin/banner/route.js";
import { prisma } from "@/lib/prisma";

function fakeFile({ type = "image/png", size = 1000 } = {}) {
  return { type, size, arrayBuffer: async () => new ArrayBuffer(0) };
}

describe("validateImage", () => {
  it("menerima PNG/JPG/WEBP ≤2MB", () => {
    expect(validateImage(fakeFile({ type: "image/png" }))).toBeNull();
    expect(validateImage(fakeFile({ type: "image/jpeg" }))).toBeNull();
    expect(validateImage(fakeFile({ type: "image/webp" }))).toBeNull();
  });

  it("tolak tipe selain gambar yang diizinkan", () => {
    expect(validateImage(fakeFile({ type: "text/plain" }))).toMatch(/Format/);
  });

  it("tolak ukuran >2MB", () => {
    expect(validateImage(fakeFile({ size: 3 * 1024 * 1024 }))).toMatch(/2 MB/);
  });

  it("tolak file kosong/null", () => {
    expect(validateImage(null)).toMatch(/wajib/);
  });
});

describe("getActiveBanners", () => {
  it("hanya banner aktif, urut order asc", async () => {
    await prisma.banner.create({ data: { title: "B", order: 2, active: true } });
    await prisma.banner.create({ data: { title: "A", order: 1, active: true } });
    await prisma.banner.create({ data: { title: "OFF", order: 0, active: false } });

    const out = await getActiveBanners();
    expect(out.map((b) => b.title)).toEqual(["A", "B"]);
  });

  it("tidak ada banner aktif → array kosong (carousel tak dirender)", async () => {
    await prisma.banner.create({ data: { title: "OFF", active: false } });
    expect(await getActiveBanners()).toEqual([]);
  });
});

function bannerForm({ title = "Promo", file } = {}) {
  const fd = new FormData();
  fd.append("title", title);
  fd.append("subtitle", "");
  fd.append("ctaLabel", "");
  fd.append("ctaHref", "");
  fd.append("order", "0");
  fd.append("active", "true");
  if (file) fd.append("image", file);
  return new Request("http://test/api/admin/banner", { method: "POST", body: fd });
}

describe("API banner — guard & validasi", () => {
  it("non-admin → 403", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u1", role: "USER" } });
    const res = await POST(
      bannerForm({ file: new File([new Uint8Array([1])], "x.png", { type: "image/png" }) })
    );
    expect(res.status).toBe(403);
  });

  it("admin tapi gambar bertipe salah → 400", async () => {
    getServerSession.mockResolvedValue({ user: { id: "a1", role: "ADMIN" } });
    const res = await POST(bannerForm({ file: new File(["hi"], "x.txt", { type: "text/plain" }) }));
    expect(res.status).toBe(400);
  });

  it("admin tanpa gambar → 400", async () => {
    getServerSession.mockResolvedValue({ user: { id: "a1", role: "ADMIN" } });
    const res = await POST(bannerForm({}));
    expect(res.status).toBe(400);
  });
});
