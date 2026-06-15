import { randomUUID } from "node:crypto";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "uploads", "banners");
const ALLOWED = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_BYTES = 2 * 1024 * 1024;

// Upload tulis ke filesystem lokal. Di Vercel filesystem read-only saat runtime,
// jadi upload dimatikan di produksi (banner tetap bisa dibuat tanpa gambar →
// fallback blank di carousel). Bisa dipaksa mati lewat BANNER_UPLOAD_DISABLED.
export function isUploadEnabled() {
  if (process.env.BANNER_UPLOAD_DISABLED === "true") return false;
  if (process.env.VERCEL) return false;
  return true;
}

// Kembalikan pesan error (string) bila tidak valid, atau null bila lolos.
export function validateImage(file) {
  if (!file || typeof file.arrayBuffer !== "function") return "Gambar wajib diunggah.";
  if (!ALLOWED[file.type]) return "Format gambar harus JPG, PNG, atau WEBP.";
  if (file.size > MAX_BYTES) return "Ukuran gambar maksimal 2 MB.";
  return null;
}

// Simpan file ke public/uploads/banners dan kembalikan path publik relatif.
// Nama dibuat dari UUID (bukan nama upload) untuk cegah path traversal.
export async function saveBannerImage(file) {
  const ext = ALLOWED[file.type];
  const name = `${randomUUID()}.${ext}`;
  try {
    await mkdir(DIR, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(DIR, name), buf);
    return `/uploads/banners/${name}`;
  } catch {
    // Filesystem read-only (mis. produksi) → simpan tanpa gambar (fallback blank).
    return "";
  }
}

// Hapus file fisik (best-effort). Hanya path di folder banner yang diproses.
export async function deleteBannerImage(imagePath) {
  if (!imagePath || !imagePath.startsWith("/uploads/banners/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", imagePath));
  } catch {
    // file sudah tidak ada → abaikan
  }
}
